# LeetCode API Integration

This document describes the LeetCode API endpoints integrated into the CodeTrail server.

## Base URL
All LeetCode endpoints are prefixed with `/api/leetcode`

## Authentication
Most endpoints are public and don't require authentication. Rate limiting is applied to prevent abuse.

## Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Response**: 429 Too Many Requests when limit exceeded

## Caching
Different endpoints have different cache durations:
- **User profiles**: 5 minutes
- **Problems**: 15 minutes  
- **Daily problem**: 1 hour

## Endpoints

### User Profile Endpoints

#### Get User Profile
```
GET /api/leetcode/user/:username/profile
```
Get comprehensive user profile data including submission stats, ranking, and reputation.

**Parameters:**
- `username` (string, required): LeetCode username

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "allQuestionsCount": [...],
    "matchedUser": {...},
    "recentSubmissionList": [...]
  }
}
```

#### Get User Skill Stats
```
GET /api/leetcode/user/:username/skills
```
Get user's skill statistics by topic tags.

#### Get User Contest Ranking
```
GET /api/leetcode/user/:username/contest
```
Get user's contest ranking and history.

#### Get User Calendar
```
GET /api/leetcode/user/:username/calendar?year=2024
```
Get user's submission calendar for a specific year.

**Query Parameters:**
- `year` (number, optional): Year for calendar data (defaults to current year)

#### Get User Question Progress
```
GET /api/leetcode/user/:userSlug/progress
```
Get detailed question progress statistics.

### Problem Endpoints

#### Get Single Problem
```
GET /api/leetcode/problem/:titleSlug
```
Get detailed information about a specific problem.

**Parameters:**
- `titleSlug` (string, required): Problem title slug (e.g., "two-sum")

#### Get Daily Problem
```
GET /api/leetcode/daily-problem
```
Get today's daily coding challenge problem.

#### Get Problems List
```
GET /api/leetcode/problems?categorySlug=algorithms&limit=50&skip=0
POST /api/leetcode/problems
```
Get a list of problems with optional filtering.

**Query Parameters (GET):**
- `categorySlug` (string, optional): Category filter
- `limit` (number, optional): Number of problems to return (default: 50)
- `skip` (number, optional): Number of problems to skip (default: 0)

**Body Parameters (POST):**
```json
{
  "categorySlug": "algorithms",
  "limit": 50,
  "skip": 0,
  "filters": {
    "difficulty": "EASY",
    "tags": ["array", "string"]
  }
}
```

### Discussion Endpoints

#### Get Discussion Topic
```
GET /api/leetcode/discussion/:topicId
```
Get a specific discussion topic.

#### Get Discussion Comments
```
GET /api/leetcode/discussion/:topicId/comments?orderBy=newest_to_oldest&pageNo=1&numPerPage=10
```
Get comments for a discussion topic.

**Query Parameters:**
- `orderBy` (string, optional): Sort order (default: "newest_to_oldest")
- `pageNo` (number, optional): Page number (default: 1)
- `numPerPage` (number, optional): Comments per page (default: 10)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required parameters)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Examples

### Get User Profile
```bash
curl "http://localhost:3000/api/leetcode/user/johndoe/profile"
```

### Get Daily Problem
```bash
curl "http://localhost:3000/api/leetcode/daily-problem"
```

### Get Problems with Filters
```bash
curl -X POST "http://localhost:3000/api/leetcode/problems" \
  -H "Content-Type: application/json" \
  -d '{
    "categorySlug": "algorithms",
    "limit": 20,
    "filters": {
      "difficulty": "MEDIUM"
    }
  }'
```

## Integration with Frontend

These endpoints can be used in the CodeTrail frontend to:

1. **User Dashboard**: Display LeetCode stats and progress
2. **Problem Browser**: Show problems with filtering
3. **Daily Challenge**: Highlight today's problem
4. **User Profiles**: Show LeetCode achievements and stats
5. **Progress Tracking**: Visualize solving progress over time

## Performance Considerations

- **Caching**: Responses are cached to reduce API calls to LeetCode
- **Rate Limiting**: Prevents abuse and ensures service availability
- **Error Handling**: Graceful degradation when LeetCode API is unavailable
