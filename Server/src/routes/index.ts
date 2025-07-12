import { Router } from 'express';
import authRoutes from './auth';
import leetcodeRoutes from './leetcode';
import codeforcesRoutes from './codeforces';
import dashboardRoutes from './dashboard';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/leetcode', leetcodeRoutes);
router.use('/codeforces', codeforcesRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check for the entire API
router.get('/health', (req: any, res: any) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
