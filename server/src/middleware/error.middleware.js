import { ApiError } from '../utils/apiResponse.js';

/**
 * Central Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Enhance generic errors
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Prevent leaking stack trace in production
  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
