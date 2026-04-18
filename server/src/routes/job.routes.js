import { Router } from 'express';
import { getJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/job.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Secured admin routes
router.post('/', verifyJWT, createJob);
router.patch('/:id', verifyJWT, updateJob);
router.delete('/:id', verifyJWT, deleteJob);

export default router;
