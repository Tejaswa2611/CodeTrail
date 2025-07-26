# Database Schema Flowchart Generation Prompt

Please create a professional database schema flowchart for **CodeTrail**, an AI-powered competitive programming tracker. The flowchart should show all tables, their relationships, and key fields in a clean, hierarchical layout.

## Core Database Structure

### **1. User Authentication & Management**
- **users** table (Primary entity)
  - Fields: id (PK), email (unique), password, firstName, lastName, createdAt, updatedAt
  - Central hub connecting to all other entities

- **refresh_tokens** table 
  - Fields: id (PK), token (unique), userId (FK), expiresAt, createdAt
  - Relationship: Many-to-One with users (CASCADE delete)

### **2. Platform Integration Layer**
- **platform_profiles** table (Critical for multi-platform support)
  - Fields: id (PK), userId (FK), platform (ENUM), handle, currentRating, maxRating, rank, syncedAt
  - Relationship: Many-to-One with users
  - Unique constraint: (userId, platform) - Max 2 profiles per user
  - Platform ENUM: leetcode, codeforces

### **3. Problem & Submission Tracking**
- **problems** table (Problem metadata across platforms)
  - Fields: id (PK), platform (ENUM), externalId, name, difficulty, rating, tags[], url
  - Unique constraint: (platform, externalId)
  - Independent table - no direct user relationship

- **submissions** table (User activity tracking)
  - Fields: id (PK), userId (FK), platform (ENUM), handle, problemId (FK), verdict, language, timestamp
  - Relationships: 
    - Many-to-One with users (CASCADE delete)
    - Many-to-One with problems (CASCADE delete)

### **4. Contest System**
- **contests** table (Contest metadata)
  - Fields: id (PK), platform (ENUM), contestId, name, startTime, duration
  - Unique constraint: (platform, contestId)
  - Independent table - no direct user relationship

- **contest_participation** table (User contest history)
  - Fields: id (PK), userId (FK), platform (ENUM), handle, contestId, rank, oldRating, newRating, timestamp
  - Relationship: Many-to-One with users (CASCADE delete)
  - Unique constraint: (userId, platform, contestId)

### **5. Performance Optimization**
- **calendar_cache** table (Caching layer for performance)
  - Fields: id (PK), userId (FK), platform (ENUM), handle, date (YYYY-MM-DD), count
  - Relationship: Many-to-One with users (CASCADE delete)
  - Unique constraint: (userId, platform, date)

## CRITICAL: Database Connections & Relationships

### **Direct Foreign Key Relationships (Solid Arrows):**

1. **users (1) → refresh_tokens (M)**
   - Connection: users.id ↔ refresh_tokens.userId
   - Type: One-to-Many (CASCADE DELETE)

2. **users (1) → platform_profiles (M)**
   - Connection: users.id ↔ platform_profiles.userId
   - Type: One-to-Many (CASCADE DELETE)
   - Constraint: Max 2 profiles per user (leetcode + codeforces)

3. **users (1) → submissions (M)**
   - Connection: users.id ↔ submissions.userId
   - Type: One-to-Many (CASCADE DELETE)

4. **users (1) → contest_participation (M)**
   - Connection: users.id ↔ contest_participation.userId
   - Type: One-to-Many (CASCADE DELETE)

5. **users (1) → calendar_cache (M)**
   - Connection: users.id ↔ calendar_cache.userId
   - Type: One-to-Many (CASCADE DELETE)

6. **problems (1) → submissions (M)**
   - Connection: problems.id ↔ submissions.problemId
   - Type: One-to-Many (CASCADE DELETE)

### **Logical Connections (Dashed Lines):**

7. **platform_profiles ↔ submissions**
   - Logical Link: Both reference same platform + handle
   - Purpose: Submissions belong to user's platform profile

8. **platform_profiles ↔ contest_participation**
   - Logical Link: Both reference same platform + handle
   - Purpose: Contest participation tied to platform profile

9. **platform_profiles ↔ calendar_cache**
   - Logical Link: Both reference same platform + handle
   - Purpose: Calendar cache specific to platform profile

10. **contests ↔ contest_participation**
    - Logical Link: contest_participation.contestId references contests.contestId
    - Purpose: Contest participation links to contest metadata
    - Note: No direct FK due to cross-platform contest IDs

### **Platform ENUM Connections:**
- **Shared Platform Field**: All tables with platform field use same ENUM
- **Connected Tables**: platform_profiles, problems, submissions, contests, contest_participation, calendar_cache
- **Values**: leetcode, codeforces

## Flowchart Requirements

### **Visual Layout:**
1. **Center**: Place "users" table as the central node
2. **Top Level**: refresh_tokens (auth layer)
3. **Left Side**: platform_profiles → problems → submissions (data flow)
4. **Right Side**: contests → contest_participation (contest flow)
5. **Bottom**: calendar_cache (performance layer)

### **Connection Visualization:**
- **Thick solid arrows**: Direct FK relationships with CASCADE DELETE
- **Thin solid arrows**: Direct FK relationships without CASCADE
- **Dashed lines**: Logical connections via platform/handle
- **Dotted lines**: ENUM field connections
- **Double arrows**: Bidirectional logical relationships

### **Relationship Labels:**
- **1:M** - One to Many
- **M:1** - Many to One
- **CASCADE** - Cascade delete enabled
- **(U)** - Unique constraint
- **(ENUM)** - Shared enumeration

### **Color Coding:**
- **Blue**: Core user management (users, refresh_tokens)
- **Green**: Platform integration (platform_profiles, problems)
- **Orange**: Activity tracking (submissions, contest_participation)
- **Purple**: Metadata (contests)
- **Gray**: Performance optimization (calendar_cache)

### **Key Annotations:**
- Mark **CASCADE DELETE** relationships with red notation
- Show **ENUM values** for platform field: {leetcode, codeforces}
- Indicate **unique constraints** with (U) notation
- Highlight **primary keys** with (PK) and **foreign keys** with (FK)
- Show **composite unique constraints** like (userId, platform)

### **Data Flow Arrows:**
Show the complete data flow with numbered steps:
1. User registers → **users** table
2. User connects platforms → **platform_profiles** (via users.id)
3. System fetches problems → **problems** table (independent)
4. User submissions tracked → **submissions** (via users.id + problems.id)
5. Contest data synced → **contests** (independent)
6. User participates → **contest_participation** (via users.id)
7. Activity cached → **calendar_cache** (via users.id)

### **Connection Summary Box:**
Include a summary showing:
- **Total Tables**: 7
- **Direct FK Relationships**: 6
- **Logical Connections**: 4
- **Cascade Deletes**: 5
- **Unique Constraints**: 5
- **Platform Integration Points**: 6 tables

## Technical Context

This schema supports:
- **Multi-platform integration** (LeetCode, Codeforces)
- **Real-time activity tracking** with intelligent caching
- **Contest rating progression** analysis
- **Performance analytics** across platforms
- **Scalable architecture** for 100K+ submissions
- **Data integrity** through proper foreign key relationships
- **Performance optimization** via strategic caching

## Output Format

Please create a **professional database diagram** that would be suitable for:
- Technical documentation
- System architecture presentations
- Developer onboarding materials
- Database design reviews

The flowchart should clearly demonstrate the **normalized database design**, **referential integrity**, **cascade delete strategies**, and **performance optimization strategies** implemented in this competitive programming analytics platform.

**IMPORTANT**: Ensure ALL connections listed above are visually represented in the diagram with appropriate arrow styles and relationship labels. 