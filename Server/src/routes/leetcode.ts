import { Router } from 'express';
import { leetCodeController } from '../controllers/leetcodeController';
import { leetCodeService } from '../services/leetcodeService';
import rateLimit from 'express-rate-limit';
// import { shortCache, mediumCache, longCache } from '../middleware/cache';

const router = Router();

// Rate limiting for LeetCode API calls
const leetcodeRateLimit = rateLimit({
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
        await leetCodeService.getDailyProblem();
        return res.status(200).json({
            success: true,
            message: 'LeetCode API integration is working',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'LeetCode API integration is not working',
            error: (error as Error).message,
            timestamp: new Date().toISOString(),
        });
    }
});

// User profile endpoints (temporarily without cache)
router.get('/user/:username/profile', leetCodeController.getUserProfile);
router.get('/user/:username/skills', leetCodeController.getUserSkillStats);
router.get('/user/:username/contest', leetCodeController.getUserContestRanking);
router.get('/user/:username/calendar', leetCodeController.getUserCalendar);
router.get('/user/:userSlug/progress', leetCodeController.getUserQuestionProgress);

// Problem endpoints
router.get('/problem/:titleSlug', leetCodeController.getProblem);
router.get('/daily-problem', leetCodeController.getDailyProblem);
router.get('/problems', leetCodeController.getProblems);
router.post('/problems', leetCodeController.getProblems); // POST for complex filters

// Discussion endpoints
router.get('/discussion/:topicId', leetCodeController.getDiscussion);
router.get('/discussion/:topicId/comments', leetCodeController.getDiscussionComments);

export default router;
