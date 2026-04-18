import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import process from 'process';

/**
 * Protect routes by verifying JWT directly from header
 * Extracted according to `backend-security-coder` principles.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized Request. Token is missing.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // We append the user id to the request for the controller to use downstream
    req.admin = { id: decodedToken.id, username: decodedToken.username };
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired Access Token');
  }
});
