import { z } from 'zod';
import ApplicationModel from '../models/application.model.js';
import JobModel from '../models/job.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const applicationSchema = z.object({
  job_id: z.number().int('Job ID must be an integer').positive(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  experience: z.string().default('Not specified'),
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

  // Check if job exists
  const job = await JobModel.findById(parsedData.data.job_id);
  if (!job) {
    throw new ApiError(404, 'Job not found. Cannot apply.');
  }

  await ApplicationModel.create(parsedData.data);

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
