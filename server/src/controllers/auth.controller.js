import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import AdminModel from '../models/admin.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import process from 'process';

// Input Validation Schema using Zod (`backend-security-coder`)
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

/**
 * @desc    Login Admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  // 1. Validate Input
  const parsedData = loginSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, 'Invalid credentials format', parsedData.error.errors);
  }

  const { username, password } = parsedData.data;

  // 2. Fetch User Model
  const admin = await AdminModel.findByUsername(username);
  
  if (!admin) {
    // We send a generic message to prevent username enumeration attacks
    throw new ApiError(401, 'Invalid credentials');
  }

  // 3. Verify Password securely
  const isMatch = await bcrypt.compare(password, admin.password);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 4. Generate JWT
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 5. Build Standard Response
  res.status(200).json(new ApiResponse(200, {
    token,
    admin: {
      id: admin.id,
      username: admin.username
    }
  }, 'Login successful'));
});

/**
 * @desc    Get Current Logged in Admin Config
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.admin, 'Profile fetched successfully'));
});

export { login, getMe };
