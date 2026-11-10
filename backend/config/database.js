import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Configure DNS resolver to use Google Public DNS servers (8.8.8.8, 8.8.4.4).
 * This acts as a fallback to resolve MongoDB Atlas SRV records when the local DNS/router configuration
 * fails or blocks SRV queries.
 */
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('🌐 DNS Resolution Configured: Using Google DNS (8.8.8.8, 8.8.4.4)');
} catch (dnsErr) {
  console.warn('⚠️ Custom DNS servers could not be set, relying on system default:', dnsErr.message);
}

/**
 * Connects to MongoDB Atlas using the configured connection URI.
 * Implements Mongoose options: { useNewUrlParser: true, useUnifiedTopology: true }
 * Logs the connection host on success. Exits the process on hard failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Terminate process with failure code
    process.exit(1);
  }
};

export default connectDB;