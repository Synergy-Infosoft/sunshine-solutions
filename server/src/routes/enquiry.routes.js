import { Router } from 'express';
import { submitEnquiry, getEnquiries } from '../controllers/enquiry.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public route to submit an enquiry
router.post('/', submitEnquiry);

// Secured admin route to view all enquiries
router.get('/', verifyJWT, getEnquiries);

export default router;
