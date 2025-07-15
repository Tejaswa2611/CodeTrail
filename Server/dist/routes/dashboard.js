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
// Debug endpoint to list all users (for testing)
router.get('/debug/users', async (req, res) => {
    try {
        const { PrismaClient } = await Promise.resolve().then(() => __importStar(require('@prisma/client')));
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Get comprehensive dashboard statistics
router.get('/stats', auth_1.authenticateToken, dashboardController_1.getDashboardStats);
// Get user platform profiles for sidebar
router.get('/user-profiles', auth_1.authenticateToken, dashboardController_1.getUserPlatformProfiles);
// Get daily submissions for chart
router.get('/daily-submissions', auth_1.authenticateToken, dashboardController_1.getDailySubmissions);
// Update platform handle
router.put('/platform-handle', auth_1.authenticateToken, dashboardController_1.updatePlatformHandle);
console.log('🔧 Dashboard PUT /platform-handle route registered');
// Test endpoint to manually sync data (for debugging)
router.post('/test-sync/:platform/:handle', auth_1.authenticateToken, async (req, res) => {
    try {
        const { platform, handle } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        console.log(`🧪 Test sync triggered for ${platform}:${handle} by user ${userId}`);
        const { dashboardService } = await Promise.resolve().then(() => __importStar(require('../services/dashboardService')));
        const result = await dashboardService.updatePlatformHandle(userId, platform, handle);
        res.json({
            success: true,
            message: `Test sync completed for ${platform}:${handle}`,
            result
        });
    }
    catch (error) {
        console.error('❌ Test sync failed:', error);
        res.status(500).json({
            success: false,
            message: 'Test sync failed',
            error: error.message
        });
    }
});
// AI Coach Topic Analysis
router.get('/ai-coach-topic-analysis', auth_1.authenticateToken, dashboardController_1.getAICoachTopicAnalysis);
exports.default = router;
