import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import mongoose from 'mongoose';

// Import configurations and routes
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

// ── 1. ENVIRONMENT VALIDATION ON STARTUP ─────────────────────────────────────

/**
 * Validates that essential configuration environment variables are present.
 * Throws errors and exits the process if any required keys are missing.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ CRITICAL ERROR: Missing required environment variables:');
    missing.forEach((varName) => console.error(`   - ${varName}`));
    console.error('💡 Please verify your .env configuration file before booting.');
    process.exit(1);
  }
  console.log('✅ Startup verification: All required environment variables are present.');
};

// Perform environmental checks
checkRequiredEnvVars();

// Establish connection to MongoDB Atlas database
connectDB();

const app = express();
app.set('trust proxy', 1);

// ── 2. CORS CONFIGURATION ────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
].filter(Boolean); // Sanity filter out empty/undefined references

const isDev = process.env.NODE_ENV !== 'production';

// Setup CORS checking against whitelisted frontend endpoints
// CORS must be registered before rate limiters so preflight OPTIONS requests
// always receive proper CORS headers and error responses are not silently blocked.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // In development, allow any localhost origin regardless of port
      if (isDev && origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
        return callback(null, true);
      }

      // In production, strictly check against the whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ── 3. REQUEST PARSING & LOGGING ─────────────────────────────────────────────

// Body parser, parsing incoming requests as JSON payloads. Limit size to mitigate DOS payload bloating.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply detailed request logs in production, and clean colorized logs in development
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// ── 4. RATE LIMITING MIDDLEWARE ──────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === 'production';

/**
 * General rate limiter to prevent abuse on general API routes.
 * Production: 100 req / 15 min | Development: 500 req / 15 min
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 500,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter to protect sensitive authentication endpoints.
 * Production: 10 req / 15 min | Development: 100 req / 15 min
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 10 : 100,
  message: {
    success: false,
    message: 'Too many auth attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits to paths
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// ── 5. SECURITY MIDDLEWARES ──────────────────────────────────────────────────

// Helmet securing Express apps by setting various HTTP headers (XSS, Clickjacking, CSP, etc.)
app.use(helmet());

/**
 * Custom MongoDB Injection Protection middleware (Express 5 compatible).
 * express-mongo-sanitize is incompatible with Express 5 because req.query
 * is a read-only getter. This custom middleware recursively strips keys
 * starting with '$' or containing '.' from req.body and req.params.
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const cleaned = {};
  for (const key of Object.keys(obj)) {
    // Strip keys that start with '$' or contain '.'
    if (key.startsWith('$') || key.includes('.')) continue;
    cleaned[key] = sanitizeObject(obj[key]);
  }
  return cleaned;
};

app.use((req, _res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.params) {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].replace(/[$]/g, '');
      }
    }
  }
  next();
});

// ── 6. ROUTE REGISTRATIONS ───────────────────────────────────────────────────

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Handle unmatched routes (404 Not Found)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Register global centralized error handler last
app.use(errorHandler);

// ── 7. SERVER ACTIVATION & GRACEFUL SHUTDOWN ─────────────────────────────────

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${MODE} mode`);
});

/**
 * Handles OS termination signals (SIGINT, SIGTERM) to stop server processes gracefully.
 * Shuts down Express listeners first, then terminates database connections cleanly.
 *
 * @param {string} signal - The signal name (SIGINT/SIGTERM) triggering the event.
 */
const gracefulShutdown = (signal) => {
  console.log(`\n📶 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('🛑 Express HTTP server closed.');

    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed cleanly.');
      console.log('👋 Server shutting down gracefully. Exit code 0.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during database connection closure:', err.message);
      process.exit(1);
    }
  });

  // Force shutdown if connections are not closed within 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forcefully shutting down. Graceful window elapsed.');
    process.exit(1);
  }, 10000);
};

// Hook listeners for system events
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
