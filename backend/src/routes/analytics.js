import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAnalyticsData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', authenticateToken, getAnalyticsData);

export default router;


