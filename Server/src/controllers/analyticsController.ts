import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { ResponseUtils } from '../utils/response';

export class AnalyticsController {
    
    /**
     * Get comprehensive analytics data for the authenticated user
     */
    static async getAnalyticsData(req: Request, res: Response) {
        try {
            console.log('📊 Analytics controller - req.user:', (req as any).user);
            const userId = (req as any).user?.userId;
            console.log('📊 Analytics controller - extracted userId:', userId);
            
            if (!userId) {
                console.log('❌ Analytics controller - No userId found, returning 401');
                return res.status(401).json(ResponseUtils.error('Unauthorized'));
            }

            console.log('📊 Analytics controller - About to call AnalyticsService');
            const analyticsData = await AnalyticsService.getAnalyticsData(userId);
            console.log('📊 Analytics controller - Service call completed successfully');
            
            return res.status(200).json(ResponseUtils.success(
                'Analytics data retrieved successfully', 
                analyticsData
            ));
        } catch (error) {
            console.error('❌ Analytics controller - Error fetching analytics data:', error);
            return res.status(500).json(ResponseUtils.error(
                'Internal server error',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    /**
     * Get analytics cache statistics (for debugging/monitoring)
     */
    static async getCacheStats(req: Request, res: Response) {
        try {
            console.log('📊 Analytics cache stats controller called');
            const userId = (req as any).user?.userId;
            
            if (!userId) {
                return res.status(401).json(ResponseUtils.error('Unauthorized'));
            }

            const cacheStats = await AnalyticsService.getCacheStats();
            
            return res.status(200).json(ResponseUtils.success(
                'Analytics cache statistics retrieved successfully',
                cacheStats
            ));
        } catch (error) {
            console.error('❌ Analytics cache stats controller - Error:', error);
            return res.status(500).json(ResponseUtils.error(
                'Failed to retrieve cache statistics',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    /**
     * Invalidate analytics cache for the authenticated user (for debugging)
     */
    static async invalidateCache(req: Request, res: Response) {
        try {
            console.log('📊 Analytics cache invalidation controller called');
            const userId = (req as any).user?.userId;
            
            if (!userId) {
                return res.status(401).json(ResponseUtils.error('Unauthorized'));
            }

            await AnalyticsService.invalidateAnalyticsCache(userId);
            
            return res.status(200).json(ResponseUtils.success(
                'Analytics cache invalidated successfully',
                { userId, timestamp: new Date().toISOString() }
            ));
        } catch (error) {
            console.error('❌ Analytics cache invalidation controller - Error:', error);
            return res.status(500).json(ResponseUtils.error(
                'Failed to invalidate analytics cache',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    /**
     * Health check for analytics service
     */
    static async healthCheck(req: Request, res: Response) {
        try {
            const cacheStats = await AnalyticsService.getCacheStats();
            
            return res.status(200).json(ResponseUtils.success(
                'Analytics service is healthy',
                {
                    service: 'analytics',
                    status: 'healthy',
                    caching: cacheStats.redis ? 'enabled' : 'disabled',
                    timestamp: new Date().toISOString()
                }
            ));
        } catch (error) {
            console.error('❌ Analytics health check - Error:', error);
            return res.status(500).json(ResponseUtils.error(
                'Analytics service health check failed',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }
} 