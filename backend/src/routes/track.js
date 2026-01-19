import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { track } from '../controllers/trackController.js';

const router = express.Router();

router.post('/', authenticateToken, track);

export default router;


