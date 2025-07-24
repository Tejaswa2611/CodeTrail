"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const cacheService_1 = require("../services/cacheService");
const router = (0, express_1.Router)();
console.log('🔧 Dashboard routes module loaded');
// Test endpoint for debugging
router.get('/test', auth_1.authenticateToken, (req, res) => {
    console.log('🎯 Dashboard test endpoint - req.user:', req.user);
    res.json({ success: true, message: 'Dashboard route is working', user: req.user });
});
// Public test endpoint to test dashboard stats calculation (for debugging)
router.get('/test-public/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`🧪 Public test: Getting dashboard stats for user ${userId}`);
        const { dashboardService } = await Promise.resolve().then(() => __importStar(require('../services/dashboardService')));
        const stats = await dashboardService.getDashboardStats(userId);
        res.json({
            success: true,
            message: 'Dashboard stats retrieved successfully',
            stats
        });
    }
    catch (error) {
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
        const healthStatus = await cacheService_1.CacheService.healthCheck();
        const cacheStats = await cacheService_1.CacheService.getCacheStats();
        res.json({
            success: true,
            message: 'Cache health check completed',
            health: healthStatus,
            stats: cacheStats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
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
router.get('/cache/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const cacheStats = await cacheService_1.CacheService.getCacheStats();
        res.json({
            success: true,
            message: 'Cache statistics retrieved',
            stats: cacheStats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
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
router.get('/stats', auth_1.authenticateToken, dashboardController_1.getDashboardStats);
// Get user platform profiles for sidebar
router.get('/user-profiles', auth_1.authenticateToken, dashboardController_1.getUserPlatformProfiles);
// Get daily submissions for chart
router.get('/daily-submissions', auth_1.authenticateToken, dashboardController_1.getDailySubmissions);
// Update platform handle (e.g., LeetCode username, Codeforces handle)
router.put('/platform-handle', auth_1.authenticateToken, dashboardController_1.updatePlatformHandle);
// Get AI Coach topic analysis
router.get('/ai-coach-analysis', auth_1.authenticateToken, dashboardController_1.getAICoachTopicAnalysis);
exports.default = router;
