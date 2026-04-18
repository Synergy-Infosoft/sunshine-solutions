import { Router } from 'express';
import { submitApplication, getApplications } from '../controllers/application.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public route to submit an application
router.post('/', submitApplication);

// Secured admin route to view all applications
router.get('/', verifyJWT, getApplications);

export default router;
