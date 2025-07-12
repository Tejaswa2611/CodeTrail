# CodeTrail Database Structure

## Overview
This document describes the database structure for CodeTrail, designed to track coding progress across LeetCode and Codeforces platforms.

## Database Schema

### 1. Users
Basic application users with authentication.
- **Primary Key**: `id` (CUID)
- **Fields**: email, firstName, lastName, password, isEmailVerified, timestamps
- **Relations**: One-to-many with refresh_tokens, platform_profiles, submissions, contest_participation

### 2. Refresh Tokens
JWT token management for authentication.
- **Primary Key**: `id` (CUID)
- **Foreign Key**: `userId` → users.id
- **Fields**: token, expiresAt, timestamps

### 3. Platform Profiles
User profiles for each coding platform (max 2 per user).
- **Primary Key**: `id` (CUID)
- **Unique Constraint**: `(userId, platform)`
- **Fields**: handle, currentRating, maxRating, rank, syncedAt, timestamps
- **Platforms**: 'leetcode', 'codeforces'

### 4. Problems
Problem metadata from both platforms.
- **Primary Key**: `id` (CUID)
- **Unique Constraint**: `(platform, externalId)`
- **Fields**: name, difficulty, rating, tags, url, timestamps

### 5. Submissions
User submission records.
- **Primary Key**: `id` (CUID)
- **Foreign Keys**: userId, problemId
- **Fields**: platform, handle, verdict, language, timestamp

### 6. Contests
Contest metadata across platforms.
- **Primary Key**: `id` (CUID)
- **Unique Constraint**: `(platform, contestId)`
- **Fields**: name, startTime, duration, timestamps

### 7. Contest Participation
User contest history for rating tracking.
- **Primary Key**: `id` (CUID)
- **Unique Constraint**: `(userId, platform, contestId)`
- **Fields**: handle, rank, oldRating, newRating, timestamp

## Database Operations

### Setup and Migration
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Reset database and reseed
npm run db:reset

# Setup database (migrate + seed)
npm run db:setup

# Open Prisma Studio
npm run db:studio
```

### Environment Variables
Ensure your `.env` file contains:
```
DATABASE_URL="postgresql://username:password@localhost:5432/codetrail"
```

## Usage Examples

### Creating a Platform Profile
```typescript
const profile = await prisma.platformProfile.create({
  data: {
    userId: user.id,
    platform: 'leetcode',
    handle: 'user_handle',
    syncedAt: new Date(),
  },
});
```

### Recording a Submission
```typescript
const submission = await prisma.submission.create({
  data: {
    userId: user.id,
    platform: 'codeforces',
    handle: 'cf_handle',
    problemId: problem.id,
    verdict: 'AC',
    language: 'Python',
    timestamp: new Date(),
  },
});
```

### Querying User Statistics
```typescript
const userStats = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    platformProfiles: true,
    submissions: {
      include: { problem: true },
    },
    contestParticipation: true,
  },
});
```

### Getting Platform-Specific Data
```typescript
// Get all LeetCode submissions for a user
const leetcodeSubmissions = await prisma.submission.findMany({
  where: {
    userId: userId,
    platform: 'leetcode',
  },
  include: {
    problem: true,
  },
  orderBy: {
    timestamp: 'desc',
  },
});

// Get Codeforces rating history
const ratingHistory = await prisma.contestParticipation.findMany({
  where: {
    userId: userId,
    platform: 'codeforces',
  },
  orderBy: {
    timestamp: 'asc',
  },
});
```

## Seeded Data

The seed script creates:
- 2 test users (john.doe@example.com, jane.smith@example.com)
- 3 platform profiles (John: LeetCode + Codeforces, Jane: LeetCode)
- 4 sample problems (2 LeetCode, 2 Codeforces)
- 3 submissions across both platforms
- 2 contests (1 LeetCode, 1 Codeforces)
- 2 contest participation records

### Test User Credentials
- **Email**: john.doe@example.com / jane.smith@example.com
- **Password**: password123

## Data Integrity

- Foreign key constraints ensure referential integrity
- Cascade deletes prevent orphaned records
- Unique constraints prevent duplicate data
- Enum types ensure valid platform values
- Array fields support multiple tags per problem

## Performance Considerations

The schema includes several indexes for optimal performance:
- Unique indexes on email, platform combinations
- Foreign key indexes for relationships
- Composite indexes for common query patterns

Consider adding additional indexes based on your query patterns:
```sql
-- Index for submissions by timestamp
CREATE INDEX idx_submissions_timestamp ON submissions(timestamp DESC);

-- Index for problems by difficulty and platform
CREATE INDEX idx_problems_platform_difficulty ON problems(platform, difficulty);
```
