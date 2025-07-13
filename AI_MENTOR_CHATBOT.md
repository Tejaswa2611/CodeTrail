# AI Mentor Chatbot Implementation

This document describes the implementation of the AI Mentor chatbot feature in CodeTrail.

## Overview

The AI Mentor chatbot provides personalized coding guidance and interactive mentoring sessions using the DeepSeek AI model through OpenRouter API.

## Backend Implementation

### 1. ChatbotService (`/Server/src/services/chatbotService.ts`)

**Key Features:**
- **Personalized Context**: Automatically gathers user's coding progress, platform profiles, recent submissions, and contest history
- **Smart System Prompts**: Generates dynamic system prompts based on user context
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Suggested Questions**: Provides personalized conversation starters

**Main Methods:**
- `sendMessage()`: Sends user message to AI and returns response
- `getSuggestedQuestions()`: Returns personalized question suggestions
- `getUserContext()`: Gathers user data for personalized responses

### 2. ChatbotController (`/Server/src/controllers/chatbotController.ts`)

**Endpoints:**
- `POST /api/chatbot/message`: Send message to AI mentor
- `GET /api/chatbot/suggestions`: Get suggested questions
- `GET /api/chatbot/health`: Health check

**Features:**
- Input validation (max 1000 characters)
- Chat history support (last 10 messages for context)
- Rate limiting protection
- Authentication required

### 3. Security & Rate Limiting

**Rate Limits:**
- 20 requests per 15 minutes for chatbot endpoints
- Authentication required for all endpoints
- Request validation and sanitization

## Frontend Implementation

### 1. AIChatbot Component (`/Client/src/components/AIChatbot.tsx`)

**Features:**
- **Real-time Chat Interface**: Modern chat UI with message bubbles
- **Suggested Questions**: Click-to-send conversation starters
- **Auto-scroll**: Automatic scrolling to new messages
- **Message Formatting**: Multi-line message support with proper formatting
- **Loading States**: Visual feedback during AI response generation
- **Character Limits**: 1000 character limit with counter
- **Clear Chat**: Option to reset conversation

**UI Elements:**
- User and assistant avatars
- Timestamp display
- Loading animations
- Error handling with toast notifications

### 2. Integration with AI Coach Page

The chatbot is integrated into the existing "AI Mentor" tab in the AI Coach page (`/Client/src/pages/AICoach.tsx`), replacing the "Coming Soon" placeholder.

## API Configuration

### OpenRouter API Setup

**Provider**: OpenRouter (https://openrouter.ai)
**Model**: `deepseek/deepseek-r1-0528`
**API Key**: Configured in ChatbotService

**Request Configuration:**
```javascript
{
  model: "deepseek/deepseek-r1-0528",
  messages: [...],
  max_tokens: 500,
  temperature: 0.7,
  top_p: 0.9
}
```

## User Experience

### 1. Personalization
- AI has access to user's coding progress across LeetCode and Codeforces
- Responses are tailored to user's skill level and areas of improvement
- Suggestions are based on recent activity and weak areas

### 2. Conversation Features
- **Welcome Message**: Introduces AI mentor capabilities
- **Suggested Questions**: Platform-specific and skill-level appropriate questions
- **Context Awareness**: AI remembers conversation history (last 10 messages)
- **Error Recovery**: Graceful error handling with retry options

### 3. Sample Interactions
- "How can I improve my LeetCode performance?"
- "What topics should I focus on next?"
- "Can you analyze my recent progress?"
- "What's the best strategy to increase my Codeforces rating?"

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Rate Limiting**: Prevents API abuse and controls costs
3. **Input Validation**: Message length and format validation
4. **Error Handling**: No sensitive information exposed in error messages
5. **API Key Security**: OpenRouter API key is server-side only

## Error Handling

### Backend Errors
- API timeout (30 seconds)
- Authentication failures (401)
- Rate limiting (429)
- Invalid responses from AI service

### Frontend Errors
- Network failures with retry options
- Toast notifications for user feedback
- Graceful degradation with fallback messages
- Console logging for debugging

## Future Enhancements

1. **Message Persistence**: Save chat history to database
2. **Advanced Personalization**: More detailed user analytics
3. **File Uploads**: Code review capabilities
4. **Voice Input**: Speech-to-text integration
5. **Export Conversations**: Save important advice
6. **Customizable AI Personality**: Different mentor styles

## Testing

### Manual Testing Steps
1. Navigate to AI Coach page → AI Mentor tab
2. Verify suggested questions load
3. Send a message and verify AI response
4. Test error scenarios (empty messages, long messages)
5. Verify rate limiting works
6. Test conversation history preservation

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/api/chatbot/health

# Test with authentication (requires valid session)
curl -X POST http://localhost:3001/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}' \
  --cookie "accessToken=your_token"
```

## Deployment Notes

1. Ensure OpenRouter API key is properly configured
2. Set up rate limiting in production
3. Monitor API usage and costs
4. Configure error tracking and logging
5. Set up SSL certificates for production deployment

## Cost Considerations

- OpenRouter charges per token used
- Typical conversation costs ~$0.01-0.05 per interaction
- Rate limiting helps control costs
- Monitor usage through OpenRouter dashboard
