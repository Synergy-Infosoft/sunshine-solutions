import { z } from 'zod';
import ApplicationModel from '../models/application.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { syncApplicationToSheet } from '../utils/syncToSheet.js';
import pool from '../config/db.js';
import sanitizeHtml from 'sanitize-html';

const applicationSchema = z.object({
  role_id:    z.number().int('Role ID must be an integer').positive(),
  name:       z.string().min(1, 'Name is required'),
  phone:      z.string().min(10, 'Valid phone number is required'),
  location:   z.string().default('Not specified'),
  experience: z.string().default('Not specified'),
  status:     z.enum(['New', 'Called', 'Selected', 'Rejected']).default('New')
});

/**
 * @desc    Submit a job application
 * @route   POST /api/applications
 * @access  Public
 */
const submitApplication = asyncHandler(async (req, res) => {
  const parsedData = applicationSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    throw new ApiError(400, 'Validation failed', parsedData.error.errors);
  }

  const sanitizedData = {
    ...parsedData.data,
    name: sanitizeHtml(parsedData.data.name, { allowedTags: [], allowedAttributes: {} }),
    location: sanitizeHtml(parsedData.data.location, { allowedTags: [], allowedAttributes: {} }),
    experience: sanitizeHtml(parsedData.data.experience, { allowedTags: [], allowedAttributes: {} }),
  };

  // 1. Check if the role exists and fetch enriched data for the sheet sync
  const [roleResult] = await pool.execute(`
    SELECT jr.title as role_title, j.company, j.location as job_location
    FROM job_roles jr
    JOIN jobs j ON jr.job_id = j.id
    WHERE jr.id = ?
  `, [parsedData.data.role_id]);

  if (roleResult.length === 0) {
    throw new ApiError(404, 'Job role not found. Cannot apply.');
  }

  // 2. Save to MySQL (primary data store)
  await ApplicationModel.create(sanitizedData);

  // 3. Fire-and-forget sync to Google Sheets (non-blocking)
  // This runs in the background - even if Google is down, the response is still 201
  syncApplicationToSheet({
    company:     roleResult[0].company,
    jobLocation: roleResult[0].job_location,
    roleTitle:   roleResult[0].role_title,
    name:        sanitizedData.name,
    phone:       sanitizedData.phone,
    city:        sanitizedData.location,
    experience:  sanitizedData.experience,
    status:      sanitizedData.status,
  });

  res.status(201).json(new ApiResponse(201, null, 'Application submitted successfully!'));
});

/**
 * @desc    Get all applications
 * @route   GET /api/applications
 * @access  Private
 */
const getApplications = asyncHandler(async (req, res) => {
  const applications = await ApplicationModel.findAll();
  res.status(200).json(new ApiResponse(200, applications, 'Applications fetched successfully'));
});

export { submitApplication, getApplications };
