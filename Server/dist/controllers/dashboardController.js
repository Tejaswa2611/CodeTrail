"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailySubmissions = exports.updatePlatformHandle = exports.getUserPlatformProfiles = exports.getDashboardStats = void 0;
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
const getDashboardStats = async (req, res) => {
    try {
        console.log('🎯 Dashboard controller - req.user:', req.user);
        const userId = req.user?.userId;
        console.log('🎯 Dashboard controller - extracted userId:', userId);
        if (!userId) {
            console.log('❌ Dashboard controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        console.log('🎯 Dashboard controller - About to call dashboardService');
        const dashboardStats = await dashboardService_1.dashboardService.getDashboardStats(userId);
        console.log('🎯 Dashboard controller - Service call completed successfully');
        return res.status(200).json(response_1.ResponseUtils.success('Dashboard stats retrieved successfully', dashboardStats));
    }
    catch (error) {
        console.error('❌ Dashboard controller - Error fetching dashboard stats:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getDashboardStats = getDashboardStats;
const getUserPlatformProfiles = async (req, res) => {
    try {
        console.log('🎯 Platform profiles controller - req.user:', req.user);
        const userId = req.user?.userId;
        console.log('🎯 Platform profiles controller - extracted userId:', userId);
        if (!userId) {
            console.log('❌ Platform profiles controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        // This endpoint specifically for sidebar user info
        const stats = await dashboardService_1.dashboardService.getDashboardStats(userId);
        return res.status(200).json(response_1.ResponseUtils.success('User platform profiles retrieved successfully', {
            connectedPlatforms: stats.userInfo.connectedPlatforms,
        }));
    }
    catch (error) {
        console.error('Error fetching user platform profiles:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getUserPlatformProfiles = getUserPlatformProfiles;
const updatePlatformHandle = async (req, res) => {
    try {
        console.log('🎯 updatePlatformHandle called - req.user:', req.user);
        console.log('🎯 updatePlatformHandle body:', req.body);
        const userId = req.user?.userId;
        const { platform, handle } = req.body;
        console.log('🎯 Extracted values - userId:', userId, 'platform:', platform, 'handle:', handle);
        if (!userId) {
            console.log('❌ No userId found');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        if (!platform || !handle) {
            console.log('❌ Missing platform or handle');
            return res.status(400).json(response_1.ResponseUtils.error('Platform and handle are required'));
        }
        // Update or create platform profile
        console.log('🔄 Calling dashboardService.updatePlatformHandle...');
        const updatedProfile = await dashboardService_1.dashboardService.updatePlatformHandle(userId, platform, handle);
        console.log('✅ updatePlatformHandle success:', updatedProfile);
        return res.status(200).json(response_1.ResponseUtils.success('Platform handle updated successfully', updatedProfile));
    }
    catch (error) {
        console.error('❌ Error updating platform handle:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.updatePlatformHandle = updatePlatformHandle;
const getDailySubmissions = async (req, res) => {
    try {
        console.log('🎯 Daily submissions controller - req.user:', req.user);
        const userId = req.user?.userId;
        if (!userId) {
            console.log('❌ Daily submissions controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        console.log('🎯 Daily submissions controller - About to call dashboardService');
        const dailyData = await dashboardService_1.dashboardService.getDailySubmissions(userId);
        console.log('🎯 Daily submissions controller - Service call completed successfully');
        return res.status(200).json(response_1.ResponseUtils.success('Daily submissions retrieved successfully', dailyData));
    }
    catch (error) {
        console.error('❌ Daily submissions controller - Error fetching daily submissions:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getDailySubmissions = getDailySubmissions;
