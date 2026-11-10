/**
 * Helper to return a standardized success response.
 *
 * @param {Object} res - The Express response object.
 * @param {any} data - The data payload to send back.
 * @param {string} message - A contextual success message.
 * @param {number} [statusCode=200] - The HTTP status code to return.
 * @returns {Object} The JSON response object.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper to return a standardized error response.
 *
 * @param {Object} res - The Express response object.
 * @param {string} message - A contextual error message.
 * @param {number} [statusCode=500] - The HTTP status code to return.
 * @param {any} [errors=null] - Additional validation or contextual error details.
 * @returns {Object} The JSON response object.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Helper to return a standardized paginated response.
 * Calculates pages automatically based on the total elements and limit.
 *
 * @param {Object} res - The Express response object.
 * @param {Array} data - The page array of results.
 * @param {number} total - Total records matching query constraints.
 * @param {number} page - Current requested page.
 * @param {number} limit - Number of items requested per page.
 * @returns {Object} The JSON response object with pagination metadata.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};
