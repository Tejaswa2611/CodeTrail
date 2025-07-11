"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leetcodeController_1 = require("../controllers/leetcodeController");
const leetcodeService_1 = require("../services/leetcodeService");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import { shortCache, mediumCache, longCache } from '../middleware/cache';
const router = (0, express_1.Router)();
// Rate limiting for LeetCode API calls
const leetcodeRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many LeetCode API requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply rate limiting to all LeetCode routes
router.use(leetcodeRateLimit);
// Health check for LeetCode API
router.get('/health', async (req, res) => {
    try {
        // Test with a simple API call without interfering with response
        await leetcodeService_1.leetCodeService.getDailyProblem();
        return res.status(200).json({
            success: true,
            message: 'LeetCode API integration is working',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'LeetCode API integration is not working',
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});
// User profile endpoints (temporarily without cache)
router.get('/user/:username/profile', leetcodeController_1.leetCodeController.getUserProfile);
router.get('/user/:username/skills', leetcodeController_1.leetCodeController.getUserSkillStats);
router.get('/user/:username/contest', leetcodeController_1.leetCodeController.getUserContestRanking);
router.get('/user/:username/calendar', leetcodeController_1.leetCodeController.getUserCalendar);
router.get('/user/:userSlug/progress', leetcodeController_1.leetCodeController.getUserQuestionProgress);
// Problem endpoints
router.get('/problem/:titleSlug', leetcodeController_1.leetCodeController.getProblem);
router.get('/daily-problem', leetcodeController_1.leetCodeController.getDailyProblem);
router.get('/problems', leetcodeController_1.leetCodeController.getProblems);
router.post('/problems', leetcodeController_1.leetCodeController.getProblems); // POST for complex filters
// Discussion endpoints
router.get('/discussion/:topicId', leetcodeController_1.leetCodeController.getDiscussion);
router.get('/discussion/:topicId/comments', leetcodeController_1.leetCodeController.getDiscussionComments);
exports.default = router;
