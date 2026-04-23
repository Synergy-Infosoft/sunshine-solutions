import { z } from 'zod';
import JobModel from '../models/job.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Validation Schema for Child Roles
const jobRoleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Helper', 'ITI', 'Skilled']).default('Helper'),
  salary_min: z.number().int().positive().default(10000),
  salary_max: z.number().int().positive().default(15000),
  openings: z.number().int().positive().default(5),
  shift: z.enum(['Day', 'Night', 'Rotational']).default('Day'),
  description: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  urgent_hiring: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).default('active')
});

// Validation Schema for Parent Job Site
const jobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  contact_number: z.string().optional(),
  whatsapp_number: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  roles: z.array(jobRoleSchema).min(1, 'At least one role is required')
});

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobModel.findAll();
  res.status(200).json(new ApiResponse(200, jobs, 'Jobs fetched successfully'));
});

/**
 * @desc    Get single job
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJob = asyncHandler(async (req, res) => {
  const job = await JobModel.findById(req.params.id);
  
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.status(200).json(new ApiResponse(200, job, 'Job fetched successfully'));
});

/**
 * @desc    Create new job
 * @route   POST /api/jobs
 * @access  Private (Admin only)
 */
const createJob = asyncHandler(async (req, res) => {
  const parsedData = jobSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    throw new ApiError(400, 'Validation failed', parsedData.error.errors);
  }

  const insertId = await JobModel.create(parsedData.data);
  const newJob = await JobModel.findById(insertId);
  
  res.status(201).json(new ApiResponse(201, newJob, 'Job created successfully'));
});

/**
 * @desc    Update a job
 * @route   PATCH /api/jobs/:id
 * @access  Private
 */
const updateJob = asyncHandler(async (req, res) => {
  const job = await JobModel.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');

  const parsedData = jobSchema.partial().safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, 'Validation failed', parsedData.error.errors);
  }

  // Merge existing data with new data
  const mergedData = { ...job, ...parsedData.data };
  
  await JobModel.update(req.params.id, mergedData);
  const updatedJob = await JobModel.findById(req.params.id);

  res.status(200).json(new ApiResponse(200, updatedJob, 'Job updated successfully'));
});

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Private
 */
const deleteJob = asyncHandler(async (req, res) => {
  const success = await JobModel.delete(req.params.id);
  if (!success) throw new ApiError(404, 'Job not found');
  res.status(200).json(new ApiResponse(200, null, 'Job deleted successfully'));
});

export { getJobs, getJob, createJob, updateJob, deleteJob };
