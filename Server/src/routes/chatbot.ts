import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController';
import { authenticateToken } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for chatbot endpoints (more restrictive)
const chatbotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many chatbot requests. Please wait before sending more messages.',
        error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply authentication middleware to all chatbot routes
router.use(authenticateToken);

// Apply rate limiting to message sending
router.post('/message', chatbotLimiter, ChatbotController.sendMessageStream);
router.post('/message-stream', chatbotLimiter, ChatbotController.sendMessageStream);

// Get suggested conversation starters
router.get('/suggestions', ChatbotController.getSuggestedQuestions);

// Health check
router.get('/health', ChatbotController.healthCheck);

export default router;
