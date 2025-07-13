"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiCoachService = exports.AICoachService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AICoachService {
    async getOverviewData(userId) {
        try {
            console.log(`🧠 Generating AI Coach overview for user: ${userId}`);
            // Get minimal user data needed for recent progress
            const [submissions, contests, platformProfiles] = await Promise.all([
                this.getUserSubmissions(userId),
                this.getUserContests(userId),
                this.getUserPlatformProfiles(userId)
            ]);
            console.log(`📊 Data loaded - Submissions: ${submissions.length}, Contests: ${contests.length}, Profiles: ${platformProfiles.length}`);
            // Calculate overall progress with full scoring
            const overallProgress = await this.calculateOverallProgress(submissions, contests, platformProfiles);
            // Calculate quick stats
            const quickStats = this.calculateQuickStats(submissions, contests, platformProfiles);
            // Generate simple insights
            const insights = this.generateSimpleInsights();
            const result = {
                overallProgress,
                quickStats,
                insights
            };
            console.log(`✅ AI Coach overview generated successfully`);
            return result;
        }
        catch (error) {
            console.error('❌ Error generating AI Coach overview:', error);
            throw new Error('Failed to generate AI Coach overview');
        }
    }
    async getUserSubmissions(userId) {
        return await prisma.submission.findMany({
            where: { userId },
            include: { problem: true },
            orderBy: { timestamp: 'desc' }
        });
    }
    async getUserContests(userId) {
        return await prisma.contestParticipation.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' }
        });
    }
    async getUserPlatformProfiles(userId) {
        return await prisma.platformProfile.findMany({
            where: { userId }
        });
    }
    async calculateOverallProgress(submissions, contests, platformProfiles) {
        // Calculate score components
        const problemsSolvedScore = this.calculateProblemsSolvedScore(submissions);
        const difficultyScore = this.calculateDifficultyScore(submissions);
        const contestScore = this.calculateContestScore(contests);
        const consistencyScore = this.calculateConsistencyScore(submissions);
        const topicCoverageScore = this.calculateTopicCoverageScore(submissions);
        // Weighted overall score
        const overallScore = Math.round(problemsSolvedScore * 0.25 + // 25% - Problems solved
            difficultyScore * 0.20 + // 20% - Difficulty progression
            contestScore * 0.20 + // 20% - Contest performance
            consistencyScore * 0.15 + // 15% - Consistency
            topicCoverageScore * 0.20 // 20% - Topic coverage
        );
        // Determine level
        const level = this.getLevel(overallScore);
        // Calculate strong/weak areas
        const { strongAreas, weakAreas } = this.analyzeTopicStrengths(submissions);
        // Calculate recent progress
        const recentProgress = await this.calculateRecentProgress(submissions, contests, platformProfiles);
        // Calculate improvement trend - also use filtering like dashboard
        const validSubmissionsForTrend = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        const improvementTrend = this.calculateImprovementTrend(validSubmissionsForTrend);
        return {
            score: overallScore,
            level,
            strongAreas,
            weakAreas,
            improvementTrend,
            recentProgress
        };
    }
    calculateProblemsSolvedScore(submissions) {
        // Filter like dashboard does - exclude daily-activity problems
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        const solvedProblems = new Set();
        validSubmissions.forEach(s => solvedProblems.add(s.problemId));
        const totalSolved = solvedProblems.size;
        const maxExpected = 500; // Benchmark for expert level
        return Math.min((totalSolved / maxExpected) * 100, 100);
    }
    calculateDifficultyScore(submissions) {
        // Filter like dashboard does - exclude daily-activity problems
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        if (validSubmissions.length === 0)
            return 0;
        const difficultyCount = {
            easy: 0,
            medium: 0,
            hard: 0
        };
        validSubmissions.forEach(s => {
            const difficulty = s.problem?.difficulty?.toLowerCase() || 'medium';
            if (difficulty === 'easy')
                difficultyCount.easy++;
            else if (difficulty === 'medium')
                difficultyCount.medium++;
            else if (difficulty === 'hard')
                difficultyCount.hard++;
            else
                difficultyCount.medium++; // Default to medium
        });
        const total = difficultyCount.easy + difficultyCount.medium + difficultyCount.hard;
        if (total === 0)
            return 0;
        // Score based on progression to harder problems
        const hardWeight = (difficultyCount.hard / total) * 100;
        const mediumWeight = (difficultyCount.medium / total) * 60;
        const easyWeight = (difficultyCount.easy / total) * 20;
        return Math.min(hardWeight + mediumWeight + easyWeight, 100);
    }
    calculateContestScore(contests) {
        if (contests.length === 0)
            return 0;
        const validContests = contests.filter(c => c.rank && c.rank > 0);
        if (validContests.length === 0)
            return 20; // Participation bonus
        // Score based on rating improvement and participation
        const codeforcesContests = validContests.filter(c => c.platform === 'codeforces');
        if (codeforcesContests.length >= 2) {
            const latest = codeforcesContests[0];
            const earliest = codeforcesContests[codeforcesContests.length - 1];
            const ratingImprovement = latest.newRating - earliest.oldRating;
            const improvementScore = Math.max(0, Math.min((ratingImprovement / 300) * 60, 60));
            const participationScore = Math.min(validContests.length * 5, 40);
            return improvementScore + participationScore;
        }
        return Math.min(validContests.length * 10, 50); // Participation-based score
    }
    calculateConsistencyScore(submissions) {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const activeDays = new Set();
        submissions
            .filter(s => new Date(s.timestamp) >= last30Days)
            .forEach(s => {
            const dateKey = s.timestamp.toISOString().split('T')[0];
            activeDays.add(dateKey);
        });
        return Math.round((activeDays.size / 30) * 100);
    }
    calculateTopicCoverageScore(submissions) {
        // Filter like dashboard does - exclude daily-activity problems
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        const topics = new Set();
        validSubmissions.forEach(s => {
            if (s.problem?.tags) {
                s.problem.tags.forEach((tag) => topics.add(tag));
            }
        });
        const expectedTopics = 15; // Standard DSA topics
        return Math.min((topics.size / expectedTopics) * 100, 100);
    }
    getLevel(score) {
        if (score >= 90)
            return "Expert";
        if (score >= 75)
            return "Advanced";
        if (score >= 50)
            return "Intermediate";
        if (score >= 25)
            return "Beginner";
        return "Novice";
    }
    analyzeTopicStrengths(submissions) {
        const topicStats = {};
        // Count unique problems by topic
        submissions.forEach(s => {
            if (s.problem?.tags) {
                s.problem.tags.forEach((tag) => {
                    if (!topicStats[tag]) {
                        topicStats[tag] = { solved: new Set(), total: new Set() };
                    }
                    topicStats[tag].total.add(s.problemId);
                    if (s.verdict === 'AC' || s.verdict === 'OK' || s.verdict === 'Accepted') {
                        topicStats[tag].solved.add(s.problemId);
                    }
                });
            }
        });
        // Calculate proficiency and categorize
        const topics = Object.entries(topicStats)
            .filter(([_, stats]) => stats.total.size >= 2) // At least 2 unique problems attempted
            .map(([topic, stats]) => ({
            topic,
            proficiency: (stats.solved.size / stats.total.size) * 100,
            totalProblems: stats.total.size,
            solvedProblems: stats.solved.size
        }))
            .sort((a, b) => b.proficiency - a.proficiency);
        // Strong areas: proficiency >= 80% and at least 3 problems attempted
        const strongAreas = topics
            .filter(t => t.proficiency >= 80 && t.totalProblems >= 3)
            .slice(0, 3)
            .map(t => t.topic);
        // Weak areas: proficiency < 60% and at least 2 problems attempted
        const weakAreas = topics
            .filter(t => t.proficiency < 60 && t.totalProblems >= 2)
            .slice(0, 3)
            .map(t => t.topic);
        return { strongAreas, weakAreas };
    }
    async calculateRecentProgress(submissions, contests, platformProfiles) {
        const now = new Date();
        // Use calendar data for accurate submission counts (like dashboard heatmap)
        let thisWeekSubmissions = 0;
        let thisMonthSubmissions = 0;
        // Get LeetCode calendar data for accurate submission counts
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        if (leetcodeProfile?.handle) {
            try {
                const response = await fetch(`http://localhost:3001/api/leetcode/user/${leetcodeProfile.handle}/profile`);
                if (response.ok) {
                    const profileData = await response.json();
                    const submissionCalendar = JSON.parse(profileData.data.matchedUser.submissionCalendar);
                    // Calculate week and month boundaries
                    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    console.log(`🔍 DEBUG: Using LeetCode calendar for submission counts`);
                    console.log(`🔍 DEBUG: Week start: ${thisWeekStart.toISOString()}, Month start: ${thisMonthStart.toISOString()}`);
                    // Count submissions from calendar data
                    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
                        const date = new Date(parseInt(timestamp) * 1000);
                        // Subtract 1 day to fix the date shifting issue (same as dashboard)
                        date.setDate(date.getDate() - 1);
                        if (date >= thisWeekStart) {
                            thisWeekSubmissions += count;
                        }
                        if (date >= thisMonthStart) {
                            thisMonthSubmissions += count;
                        }
                    });
                    console.log(`🔍 DEBUG: Calendar-based counts - This week: ${thisWeekSubmissions}, This month: ${thisMonthSubmissions}`);
                }
                else {
                    console.log(`⚠️ WARNING: Could not fetch LeetCode calendar, falling back to database`);
                    // Fallback to database counting if API fails
                    thisWeekSubmissions = this.countDatabaseSubmissions(submissions, 7);
                    thisMonthSubmissions = this.countDatabaseSubmissions(submissions, 30);
                }
            }
            catch (error) {
                console.log(`⚠️ WARNING: LeetCode API error, falling back to database:`, error);
                // Fallback to database counting if API fails
                thisWeekSubmissions = this.countDatabaseSubmissions(submissions, 7);
                thisMonthSubmissions = this.countDatabaseSubmissions(submissions, 30);
            }
        }
        else {
            console.log(`⚠️ WARNING: No LeetCode handle found, using database submissions`);
            // Fallback if no LeetCode profile
            thisWeekSubmissions = this.countDatabaseSubmissions(submissions, 7);
            thisMonthSubmissions = this.countDatabaseSubmissions(submissions, 30);
        }
        // Filter submissions for other calculations (keeping original logic for consistency)
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        // Consistency score
        const consistencyScore = this.calculateConsistencyScore(validSubmissions);
        // Average weekly solved (last 4 weeks) - unique problems
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
        const last4WeeksProblems = new Set();
        validSubmissions.forEach(s => {
            const submissionDate = new Date(s.timestamp);
            if (submissionDate >= fourWeeksAgo) {
                last4WeeksProblems.add(s.problemId);
            }
        });
        const averageWeeklySolved = Math.round(last4WeeksProblems.size / 4);
        // Difficulty progression
        const difficultyProgression = this.calculateDifficultyProgression(validSubmissions);
        // Rating trends
        const ratingTrend = this.calculateRatingTrends(contests, platformProfiles);
        return {
            lastWeekSolved: thisWeekSubmissions, // Frontend expects last week, we provide this week's submissions
            lastMonthSolved: thisMonthSubmissions, // Frontend expects last month, we provide this month's submissions
            consistencyScore,
            averageWeeklySolved,
            difficultyProgression,
            ratingTrend
        };
    }
    calculateDifficultyProgression(submissions) {
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        const recentSolved = submissions.filter(s => new Date(s.timestamp) >= lastMonth);
        if (recentSolved.length === 0)
            return "stable";
        const difficultyCount = {
            easy: 0,
            medium: 0,
            hard: 0
        };
        recentSolved.forEach(s => {
            const difficulty = s.problem?.difficulty?.toLowerCase() || 'medium';
            if (difficulty === 'easy')
                difficultyCount.easy++;
            else if (difficulty === 'medium')
                difficultyCount.medium++;
            else if (difficulty === 'hard')
                difficultyCount.hard++;
        });
        const total = difficultyCount.easy + difficultyCount.medium + difficultyCount.hard;
        const mediumHardPercent = ((difficultyCount.medium + difficultyCount.hard) / total) * 100;
        if (mediumHardPercent >= 70)
            return "advancing";
        if (mediumHardPercent >= 50)
            return "improving";
        return "stable";
    }
    calculateRatingTrends(contests, platformProfiles) {
        const trends = {};
        // Codeforces trend
        const codeforcesContests = contests
            .filter(c => c.platform === 'codeforces')
            .slice(0, 5); // Last 5 contests
        if (codeforcesContests.length >= 2) {
            const latest = codeforcesContests[0];
            const previous = codeforcesContests[1];
            const change = latest.newRating - previous.newRating;
            trends.codeforces = {
                current: latest.newRating,
                change,
                trend: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable'
            };
        }
        else {
            const profile = platformProfiles.find(p => p.platform === 'codeforces');
            trends.codeforces = {
                current: profile?.currentRating || null,
                change: 0,
                trend: 'stable'
            };
        }
        // LeetCode trend (placeholder since LC doesn't have simple rating)
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        trends.leetcode = {
            current: null, // LeetCode doesn't have simple rating
            change: 0,
            trend: 'stable'
        };
        return trends;
    }
    calculateImprovementTrend(submissions) {
        const now = new Date();
        const thisMonth = submissions.filter(s => {
            const date = new Date(s.timestamp);
            return date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        }).length;
        const lastMonth = submissions.filter(s => {
            const date = new Date(s.timestamp);
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
            return date.getMonth() === lastMonthDate.getMonth() &&
                date.getFullYear() === lastMonthDate.getFullYear();
        }).length;
        if (lastMonth === 0)
            return "+100% this month";
        const improvement = ((thisMonth - lastMonth) / lastMonth) * 100;
        return `${improvement > 0 ? '+' : ''}${Math.round(improvement)}% this month`;
    }
    calculateQuickStats(submissions, contests, platformProfiles) {
        // Filter like dashboard does - exclude daily-activity problems
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            return isAccepted && isNotDailyActivity;
        });
        // Total solved
        const solvedProblems = new Set();
        validSubmissions.forEach(s => solvedProblems.add(s.problemId));
        // Contest rating (prefer Codeforces)
        let contestRating = 'Unrated';
        const codeforcesProfile = platformProfiles.find(p => p.platform === 'codeforces');
        if (codeforcesProfile?.currentRating) {
            contestRating = codeforcesProfile.currentRating;
        }
        // Topics covered
        const topics = new Set();
        validSubmissions.forEach(s => {
            if (s.problem?.tags) {
                s.problem.tags.forEach((tag) => topics.add(tag));
            }
        });
        // Consistency
        const consistency = this.calculateConsistencyScore(submissions);
        return {
            totalSolved: solvedProblems.size,
            contestRating,
            topicsCovered: topics.size,
            consistency
        };
    }
    generateSimpleInsights() {
        // Generate basic insights without complex analysis
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const dayOfWeek = currentTime.getDay();
        const progressInsights = [
            "📈 Keep practicing consistently to maintain your progress",
            "🎯 Focus on solving problems step by step"
        ];
        const recommendations = [
            "💪 Challenge yourself with slightly harder problems",
            "🔍 Review your recent solutions to identify patterns"
        ];
        // Add time-based insights
        if (currentHour >= 9 && currentHour <= 17) {
            progressInsights.push("☀️ Great time for focused problem solving");
        }
        else if (currentHour >= 18 && currentHour <= 22) {
            progressInsights.push("🌆 Evening practice sessions can be very productive");
        }
        // Add day-based insights
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            recommendations.push("📚 Weekday consistency builds strong coding habits");
        }
        else {
            recommendations.push("🎉 Weekend sessions are perfect for deeper exploration");
        }
        return {
            progressInsights: progressInsights.slice(0, 3),
            recommendations: recommendations.slice(0, 3)
        };
    }
    countDatabaseSubmissions(submissions, days) {
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        // Filter and count database submissions
        const validSubmissions = submissions.filter(sub => {
            // Handle different verdict formats for different platforms
            let isAccepted = false;
            if (sub.platform === 'leetcode') {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                isAccepted = sub.verdict === 'OK';
            }
            else {
                isAccepted = sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
            }
            // Exclude daily activity problems
            const isNotDailyActivity = !sub.problem.tags?.includes('daily-activity');
            const isInTimeRange = new Date(sub.timestamp) >= startDate;
            return isAccepted && isNotDailyActivity && isInTimeRange;
        });
        return validSubmissions.length;
    }
}
exports.AICoachService = AICoachService;
exports.aiCoachService = new AICoachService();
