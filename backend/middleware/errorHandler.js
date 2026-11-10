import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express centralized error handling middleware.
 * Handles specific error types (Mongoose, MongoDB, JWT) and formats them consistently.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    // Build a clean field-by-field error mapping
    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
  }

  // 2. Mongoose CastError (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. MongoDB Duplicate Key (e.g. duplicate email index registration)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
    // If it's another unique index, we can optionally extract the field
    const duplicateField = Object.keys(err.keyValue || {})[0];
    if (duplicateField && duplicateField !== 'email') {
      message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
    }
  }

  // 4. JSON Web Token authentication errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Log error stack to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Error Stack:', err.stack);
  } else {
    console.error(`💥 Error: ${message} (${statusCode})`);
  }

  // Format standard response
  const responsePayload = {
    success: false,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  // Attach stack trace only in development mode
  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
