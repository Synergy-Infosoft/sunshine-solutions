import { z } from 'zod';
import EnquiryModel from '../models/enquiry.model.js';
import { ApiError, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const enquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['HIRING', 'JOB_SEEKER', 'GENERAL']).default('GENERAL'),
});

/**
 * @desc    Submit a contact enquiry
 * @route   POST /api/enquiries
 * @access  Public
 */
const submitEnquiry = asyncHandler(async (req, res) => {
  const parsedData = enquirySchema.safeParse(req.body);
  
  if (!parsedData.success) {
    throw new ApiError(400, 'Validation failed', parsedData.error.errors);
  }

  await EnquiryModel.create(parsedData.data);

  res.status(201).json(new ApiResponse(201, null, 'Enquiry submitted successfully! We will contact you soon.'));
});

/**
 * @desc    Get all enquiries
 * @route   GET /api/enquiries
 * @access  Private
 */
const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await EnquiryModel.findAll();
  res.status(200).json(new ApiResponse(200, enquiries, 'Enquiries fetched successfully'));
});

export { submitEnquiry, getEnquiries };
