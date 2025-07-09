import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

// API routes
router.use('/auth', authRoutes);

// Health check for the entire API
router.get('/health', (req: any, res: any) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
