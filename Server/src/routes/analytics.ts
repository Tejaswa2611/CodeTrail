import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

console.log('🔧 Analytics routes module loaded');

// Health check endpoint (public for monitoring)
router.get('/health', AnalyticsController.healthCheck);

// Get comprehensive analytics data (protected)
router.get('/data', authenticateToken, AnalyticsController.getAnalyticsData);

// Cache management endpoints (protected)
router.get('/cache/stats', authenticateToken, AnalyticsController.getCacheStats);
router.delete('/cache', authenticateToken, AnalyticsController.invalidateCache);

// Test endpoint for debugging (protected)
router.get('/test', authenticateToken, (req, res) => {
    console.log('🎯 Analytics test endpoint - req.user:', (req as any).user);
    res.json({ 
        success: true, 
        message: 'Analytics route is working', 
        user: (req as any).user,
        timestamp: new Date().toISOString()
    });
});

export default router; 