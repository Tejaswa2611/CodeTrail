import { Router } from 'express';
import { getDashboardStats, getUserPlatformProfiles, updatePlatformHandle, getDailySubmissions, getAICoachTopicAnalysis } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { CacheService } from '../services/cacheService';

const router = Router();

console.log('🔧 Dashboard routes module loaded');

// Test endpoint for debugging
router.get('/test', authenticateToken, (req, res) => {
  console.log('🎯 Dashboard test endpoint - req.user:', (req as any).user);
  res.json({ success: true, message: 'Dashboard route is working', user: (req as any).user });
});

// Public test endpoint to test dashboard stats calculation (for debugging)
router.get('/test-public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🧪 Public test: Getting dashboard stats for user ${userId}`);
    
    const { dashboardService } = await import('../services/dashboardService');
    const stats = await dashboardService.getDashboardStats(userId);
    
    res.json({ 
      success: true, 
      message: 'Dashboard stats retrieved successfully',
      stats 
    });
  } catch (error: any) {
    console.error('❌ Public test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get dashboard stats', 
      error: error.message 
    });
  }
});

// Cache health check endpoint
router.get('/cache/health', async (req, res) => {
  try {
    const healthStatus = await CacheService.healthCheck();
    const cacheStats = await CacheService.getCacheStats();
    
    res.json({
      success: true,
      message: 'Cache health check completed',
      health: healthStatus,
      stats: cacheStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Cache health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Cache health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Cache statistics endpoint (protected)
router.get('/cache/stats', authenticateToken, async (req, res) => {
  try {
    const cacheStats = await CacheService.getCacheStats();
    
    res.json({
      success: true,
      message: 'Cache statistics retrieved',
      stats: cacheStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Failed to get cache stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cache statistics',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Get comprehensive dashboard statistics
router.get('/stats', authenticateToken, getDashboardStats);

// Get user platform profiles for sidebar
router.get('/user-profiles', authenticateToken, getUserPlatformProfiles);

// Get daily submissions for chart
router.get('/daily-submissions', authenticateToken, getDailySubmissions);

// Update platform handle (e.g., LeetCode username, Codeforces handle)
router.put('/platform-handle', authenticateToken, updatePlatformHandle);

// Get AI Coach topic analysis
router.get('/ai-coach-analysis', authenticateToken, getAICoachTopicAnalysis);

export default router;
