import { Response } from 'express';
import { ChatbotService, ChatMessage } from '../services/chatbotService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class ChatbotController {
    /**
     * Send a message to the AI mentor chatbot with streaming response
     */
    static async sendMessageStream(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Authentication required'));
                return;
            }

            const { message, chatHistory } = req.body;

            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                res.status(400).json(ResponseUtils.validationError(['Message is required and cannot be empty']));
                return;
            }

            if (message.length > 1000) {
                res.status(400).json(ResponseUtils.validationError(['Message is too long. Maximum 1000 characters allowed.']));
                return;
            }

            // Validate chat history if provided
            let validatedChatHistory: ChatMessage[] = [];
            if (chatHistory && Array.isArray(chatHistory)) {
                validatedChatHistory = chatHistory
                    .filter((msg: any) => 
                        msg && 
                        typeof msg.content === 'string' && 
                        ['user', 'assistant'].includes(msg.role)
                    )
                    .map((msg: any) => ({
                        role: msg.role,
                        content: msg.content,
                        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
                    }))
                    .slice(-10); // Keep only last 10 messages for context
            }

            console.log(`🤖 AI Mentor streaming request from user ${req.user.userId}: "${message.substring(0, 50)}..."`);

            // Get streaming response from chatbot service
            const streamResponse = await ChatbotService.sendMessageStream(
                req.user.userId, 
                message.trim(), 
                validatedChatHistory
            );

            // Set headers for streaming
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            // Pipe the stream response to the client
            if (streamResponse.body) {
                const reader = streamResponse.body.getReader();
                
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        
                        res.write(value);
                    }
                } finally {
                    reader.releaseLock();
                }
            }

            res.end();

        } catch (error) {
            console.error('Chatbot streaming controller error:', error);
            
            // Send error response if headers haven't been sent yet
            if (!res.headersSent) {
                if (error instanceof Error) {
                    res.status(500).json(ResponseUtils.error(error.message));
                } else {
                    res.status(500).json(ResponseUtils.error('Internal server error'));
                }
            } else {
                // If streaming has started, just end the response
                res.end();
            }
        }
    }

    /**
     * Get suggested conversation starters
     */
    static async getSuggestedQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Authentication required'));
                return;
            }

            console.log(`🤖 Getting suggested questions for user ${req.user.userId}`);

            const suggestions = await ChatbotService.getSuggestedQuestions(req.user.userId);

            res.status(200).json(ResponseUtils.success('Suggested questions retrieved successfully', {
                suggestions
            }));

        } catch (error) {
            console.error('Get suggestions error:', error);
            if (error instanceof Error) {
                res.status(500).json(ResponseUtils.error(error.message));
            } else {
                res.status(500).json(ResponseUtils.error('Internal server error'));
            }
        }
    }

    /**
     * Health check for chatbot service
     */
    static async healthCheck(req: AuthenticatedRequest, res: Response): Promise<void> {
        res.status(200).json(ResponseUtils.success('AI Mentor chatbot service is healthy'));
    }
}
