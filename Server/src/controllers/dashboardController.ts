import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';
import { ResponseUtils } from '../utils/response';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    console.log('🎯 Dashboard controller - req.user:', (req as any).user);
    const userId = (req as any).user?.userId;
    console.log('🎯 Dashboard controller - extracted userId:', userId);
    
    if (!userId) {
      console.log('❌ Dashboard controller - No userId found, returning 401');
      return res.status(401).json(ResponseUtils.error('Unauthorized'));
    }

    console.log('🎯 Dashboard controller - About to call dashboardService');
    const dashboardStats = await dashboardService.getDashboardStats(userId);
    console.log('🎯 Dashboard controller - Service call completed successfully');
    
    return res.status(200).json(ResponseUtils.success('Dashboard stats retrieved successfully', dashboardStats));
  } catch (error) {
    console.error('❌ Dashboard controller - Error fetching dashboard stats:', error);
    return res.status(500).json(ResponseUtils.error('Internal server error'));
  }
};

export const getUserPlatformProfiles = async (req: Request, res: Response) => {
  try {
    console.log('🎯 Platform profiles controller - req.user:', (req as any).user);
    const userId = (req as any).user?.userId;
    console.log('🎯 Platform profiles controller - extracted userId:', userId);
    
    if (!userId) {
      console.log('❌ Platform profiles controller - No userId found, returning 401');
      return res.status(401).json(ResponseUtils.error('Unauthorized'));
    }

    // This endpoint specifically for sidebar user info
    const stats = await dashboardService.getDashboardStats(userId);
    
    return res.status(200).json(ResponseUtils.success('User platform profiles retrieved successfully', {
      connectedPlatforms: stats.userInfo.connectedPlatforms,
    }));
  } catch (error) {
    console.error('Error fetching user platform profiles:', error);
    return res.status(500).json(ResponseUtils.error('Internal server error'));
  }
};

export const updatePlatformHandle = async (req: Request, res: Response) => {
  try {
    console.log('🎯 updatePlatformHandle called - req.user:', (req as any).user);
    console.log('🎯 updatePlatformHandle body:', req.body);
    
    const userId = (req as any).user?.userId;
    const { platform, handle } = req.body;
    
    console.log('🎯 Extracted values - userId:', userId, 'platform:', platform, 'handle:', handle);
    
    if (!userId) {
      console.log('❌ No userId found');
      return res.status(401).json(ResponseUtils.error('Unauthorized'));
    }

    if (!platform || !handle) {
      console.log('❌ Missing platform or handle');
      return res.status(400).json(ResponseUtils.error('Platform and handle are required'));
    }

    // Update or create platform profile
    console.log('🔄 Calling dashboardService.updatePlatformHandle...');
    const updatedProfile = await dashboardService.updatePlatformHandle(userId, platform, handle);
    console.log('✅ updatePlatformHandle success:', updatedProfile);
    
    return res.status(200).json(ResponseUtils.success('Platform handle updated successfully', updatedProfile));
  } catch (error) {
    console.error('❌ Error updating platform handle:', error);
    return res.status(500).json(ResponseUtils.error('Internal server error'));
  }
};

export const getDailySubmissions = async (req: Request, res: Response) => {
  try {
    console.log('🎯 Daily submissions controller - req.user:', (req as any).user);
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      console.log('❌ Daily submissions controller - No userId found, returning 401');
      return res.status(401).json(ResponseUtils.error('Unauthorized'));
    }

    console.log('🎯 Daily submissions controller - About to call dashboardService');
    const dailyData = await dashboardService.getDailySubmissions(userId);
    console.log('🎯 Daily submissions controller - Service call completed successfully');
    
    return res.status(200).json(ResponseUtils.success('Daily submissions retrieved successfully', dailyData));
  } catch (error) {
    console.error('❌ Daily submissions controller - Error fetching daily submissions:', error);
    return res.status(500).json(ResponseUtils.error('Internal server error'));
  }
};
