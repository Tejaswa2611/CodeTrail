import { Router } from 'express';
import authRoutes from './auth';
import leetcodeRoutes from './leetcode';
import codeforcesRoutes from './codeforces';
import dashboardRoutes from './dashboard';
import chatbotRoutes from './chatbot';
import analyticsRoutes from './analytics';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/leetcode', leetcodeRoutes);
router.use('/codeforces', codeforcesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/analytics', analyticsRoutes);

// Health check for the entire API
router.get('/health', (req: any, res: any) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
