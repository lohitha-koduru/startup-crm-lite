import { validationResult } from 'express-validator';

/**
 * Higher-order middleware to run express-validator validation chains.
 * If validation fails, returns a 400 response with structured errors.
 * Otherwise, proceeds to the next middleware.
 *
 * @param {Array<Function>} validations - An array of express-validator validation chains.
 * @returns {Function} Express middleware function.
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation chains in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    // If no validation errors, proceed
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to conform to { field, message } shape
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

export default validate;
