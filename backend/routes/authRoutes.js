import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// ── VALIDATION RULES ──────────────────────────────────────────────────────────

/**
 * Validation rules for user registration.
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for user login.
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for profile updates.
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('currentPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password is required to change to a new password'),
];

// ── ROUTES DEFINITIONS ────────────────────────────────────────────────────────

// 1. POST /api/auth/register — Public registration endpoint
router.post('/register', validate(registerValidation), register);

// 2. POST /api/auth/login — Public authentication endpoint
router.post('/login', validate(loginValidation), login);

// 3. GET /api/auth/profile — Private endpoint retrieving active profile details
router.get('/profile', protect, getProfile);

// 4. PUT /api/auth/profile — Private endpoint permitting updating active profile
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

// 5. GET /api/auth/me — Private alias of profile retrieval
router.get('/me', protect, getProfile);

export default router;
