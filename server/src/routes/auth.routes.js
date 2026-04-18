import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);

// Secured Route
router.get('/me', verifyJWT, getMe);

export default router;
