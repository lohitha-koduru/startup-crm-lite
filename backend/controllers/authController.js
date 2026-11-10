import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * PRODUCTION SECURITY NOTE:
 * In a production environment, you should apply a rate limiter (using express-rate-limit)
 * to sensitive authentication endpoints (such as POST /api/auth/login and POST /api/auth/register)
 * to mitigate brute-force and credential-stuffing attacks.
 * Example registration: app.use('/api/auth/login', rateLimiter);
 */

/**
 * Generate a JWT token for the given user ID.
 * Helper function exported as requested.
 * @param {string} userId - The database ID of the user.
 * @returns {string} The signed JWT token string.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 400);
    }

    // 2. Create the user document (pre-save middleware handles hashing)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. Generate access token
    const token = generateToken(user._id);

    // 4. Return standard success response (toJSON overrides automatically deletes password)
    return successResponse(
      res,
      {
        user,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user credentials and return a token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Retrieve user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Verify plain text password against stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 3. Verify user account is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 4. Generate authentication token
    const token = generateToken(user._id);

    // Remove password explicitly before returning
    const userObj = user.toJSON();

    return successResponse(
      res,
      {
        user: userObj,
        token,
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the current authenticated user profile
 * @route   GET /api/auth/profile (and GET /api/auth/me)
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and sanitized by protect middleware
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile (name and optionally password)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    // Retrieve user and select password for validation if necessary
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // 1. Process name update (email changes omitted for verification flow)
    if (name) {
      user.name = name;
    }

    // 2. Process password update if requested
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Current password is required to change password', 400);
      }

      // Verify the old password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid current password', 401);
      }

      // Assign new password (pre-save middleware will automatically run validation and hash it)
      user.password = newPassword;
    }

    // 3. Persist modifications (triggers pre-save validations & hooks)
    await user.save();

    // 4. Return updated profile (password is removed automatically by toJSON)
    const updatedUser = user.toJSON();

    return successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
