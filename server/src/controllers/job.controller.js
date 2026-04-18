import { z } from 'zod';
import JobModel from '../models/job.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Validation Schema (`backend-security-coder`)
const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().min(1, 'Salary is required'),
  type: z.string().min(1, 'Type is required'),
  posted_time: z.string().min(1, 'Posted time is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'filled']).default('active')
});

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobModel.findAll();
  
  // Parse JSON strings back to arrays
  const parsedJobs = jobs.map(job => ({
    ...job,
    featured: Boolean(job.featured),
    requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
    benefits: typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits
  }));

  res.status(200).json(new ApiResponse(200, parsedJobs, 'Jobs fetched successfully'));
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

  job.featured = Boolean(job.featured);
  job.requirements = typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements;
  job.benefits = typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits;

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
  
  newJob.featured = Boolean(newJob.featured);
  newJob.requirements = typeof newJob.requirements === 'string' ? JSON.parse(newJob.requirements) : newJob.requirements;
  newJob.benefits = typeof newJob.benefits === 'string' ? JSON.parse(newJob.benefits) : newJob.benefits;

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
  
  // Format for model (ensure featured is 0/1)
  mergedData.featured = mergedData.featured ? 1 : 0;
  
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
