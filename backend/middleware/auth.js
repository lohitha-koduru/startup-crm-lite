import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect middleware to authenticate requests via JWT Bearer Token.
 * Attaches the authenticated user to `req.user` (excluding the password).
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found in the headers
    if (!token) {
      return errorResponse(res, 'No token provided, access denied', 401);
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired, please login again', 401);
      }
      return errorResponse(res, 'Token is invalid', 401);
    }

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // 4. Attach authenticated user payload to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
