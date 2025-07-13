import { Router } from 'express';
import { getDashboardStats, getUserPlatformProfiles, updatePlatformHandle, getDailySubmissions, getAICoachTopicAnalysis } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

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

// Debug endpoint to list all users (for testing)
router.get('/debug/users', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });
    
    res.json({ 
      success: true, 
      users 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get comprehensive dashboard statistics
router.get('/stats', authenticateToken, getDashboardStats);

// Get user platform profiles for sidebar
router.get('/user-profiles', authenticateToken, getUserPlatformProfiles);

// Get daily submissions for chart
router.get('/daily-submissions', authenticateToken, getDailySubmissions);

// Update platform handle
router.put('/platform-handle', authenticateToken, updatePlatformHandle);
console.log('🔧 Dashboard PUT /platform-handle route registered');

// Test endpoint to manually sync data (for debugging)
router.post('/test-sync/:platform/:handle', authenticateToken, async (req, res) => {
    try {
        const { platform, handle } = req.params;
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        console.log(`🧪 Test sync triggered for ${platform}:${handle} by user ${userId}`);
        
        const { dashboardService } = await import('../services/dashboardService');
        const result = await dashboardService.updatePlatformHandle(userId, platform, handle);
        
        res.json({ 
            success: true, 
            message: `Test sync completed for ${platform}:${handle}`,
            result 
        });
    } catch (error: any) {
        console.error('❌ Test sync failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Test sync failed', 
            error: error.message 
        });
    }
});

// AI Coach Topic Analysis
router.get('/ai-coach-analysis', authenticateToken, getAICoachTopicAnalysis);

export default router;
