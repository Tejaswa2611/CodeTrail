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
exports.dashboardService = exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const cacheService_1 = require("./cacheService");
const prisma = new client_1.PrismaClient();
class DashboardService {
    async getDashboardStats(userId) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getDashboardStats(userId);
        if (cached) {
            return cached;
        }
        // Get user profile data
        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
        });
        if (!userProfile) {
            throw new Error('User not found');
        }
        // Get user's platform profiles
        const platformProfiles = await prisma.platformProfile.findMany({
            where: { userId },
        });
        // Get all user submissions
        const submissions = await prisma.submission.findMany({
            where: { userId },
            include: {
                problem: true,
            },
            orderBy: { timestamp: 'desc' },
        });
        // Get contest participations
        const contestParticipations = await prisma.contestParticipation.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });
        // Calculate total questions solved
        const totalQuestions = this.calculateTotalQuestions(submissions);
        // Calculate active days
        const totalActiveDays = this.calculateActiveDays(submissions);
        // Generate heatmap data with real calendar data if available
        const heatmapData = await this.generateHeatmapDataWithCalendar(submissions, platformProfiles, userId);
        // Calculate contest stats
        const totalContests = this.calculateContestStats(contestParticipations);
        // Calculate contest rankings
        const contestRankings = this.calculateContestRankings(contestParticipations);
        // Analyze DSA topics using both submission data and LeetCode skills API
        const dsaTopicAnalysis = await this.analyzeDSATopics(submissions, platformProfiles);
        // Get contest history for rating graph
        const contestHistory = await this.getContestHistory(userId, platformProfiles);
        // Get user info
        const userInfo = this.getUserInfo(userProfile, platformProfiles);
        const result = {
            totalQuestions,
            totalActiveDays,
            heatmapData,
            totalContests,
            contestRankings,
            dsaTopicAnalysis,
            userInfo,
            contestHistory,
        };
        // Cache the result
        await cacheService_1.CacheService.setDashboardStats(userId, result);
        return result;
    }
    calculateTotalQuestions(submissions) {
        const solvedProblems = new Set();
        const leetcodeSolved = new Set();
        const codeforcesSolved = new Set();
        const difficultyCount = {
            easy: 0,
            medium: 0,
            hard: 0,
        };
        const platformBreakdown = {
            leetcode: { easy: 0, medium: 0, hard: 0 },
            codeforces: { easy: 0, medium: 0, hard: 0 },
        };
        submissions
            .filter(sub => {
            // Handle different verdict formats for different platforms
            if (sub.platform === 'leetcode') {
                return sub.verdict === 'AC' || sub.verdict === 'Accepted';
            }
            else if (sub.platform === 'codeforces') {
                return sub.verdict === 'OK';
            }
            return sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
        })
            // Exclude daily activity problems (they're only for tracking active days, not actual solved problems)
            .filter(sub => !sub.problem.tags?.includes('daily-activity'))
            .forEach(submission => {
            const problemKey = `${submission.platform}-${submission.problem.externalId}`;
            if (!solvedProblems.has(problemKey)) {
                solvedProblems.add(problemKey);
                if (submission.platform === 'leetcode') {
                    leetcodeSolved.add(problemKey);
                }
                else {
                    codeforcesSolved.add(problemKey);
                }
                const difficulty = submission.problem.difficulty?.toLowerCase() || 'medium';
                if (['easy', 'medium', 'hard'].includes(difficulty)) {
                    difficultyCount[difficulty]++;
                    platformBreakdown[submission.platform][difficulty]++;
                }
            }
        });
        return {
            total: solvedProblems.size,
            leetcode: leetcodeSolved.size,
            codeforces: codeforcesSolved.size,
            byDifficulty: difficultyCount,
            platformBreakdown,
        };
    }
    calculateActiveDays(submissions) {
        const leetcodeDays = new Set();
        const codeforcesDays = new Set();
        const allDays = new Set();
        submissions.forEach(submission => {
            const dateKey = submission.timestamp.toISOString().split('T')[0];
            allDays.add(dateKey);
            if (submission.platform === 'leetcode') {
                leetcodeDays.add(dateKey);
            }
            else {
                codeforcesDays.add(dateKey);
            }
        });
        return {
            total: allDays.size,
            leetcode: leetcodeDays.size,
            codeforces: codeforcesDays.size,
        };
    }
    async generateHeatmapDataWithCalendar(submissions, platformProfiles, userId) {
        // Initialize empty heatmap - we'll populate it ONLY with fresh API data
        const heatmapData = {
            leetcode: {},
            codeforces: {},
            combined: {}
        };
        // Get LeetCode calendar data FRESH from API (ignore database completely)
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        if (leetcodeProfile?.handle) {
            try {
                const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                const leetcodeService = new LeetCodeService();
                const profile = await leetcodeService.getUserProfile(leetcodeProfile.handle);
                if (profile?.matchedUser?.submissionCalendar) {
                    const submissionCalendar = JSON.parse(profile.matchedUser.submissionCalendar);
                    // Convert calendar timestamps to date strings and populate LeetCode heatmap
                    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
                        const date = new Date(parseInt(timestamp) * 1000);
                        // Subtract 1 day to fix the date shifting issue
                        date.setDate(date.getDate() - 1);
                        // Use local timezone to format the date
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const dateKey = `${year}-${month}-${day}`; // YYYY-MM-DD format in local timezone
                        heatmapData.leetcode[dateKey] = count;
                    });
                    // Cache this fresh data for future requests
                    try {
                        // Clear old cache for this user/platform
                        await prisma.calendarCache.deleteMany({
                            where: {
                                userId: userId,
                                platform: 'leetcode'
                            }
                        });
                        // Prepare cache entries
                        const cacheEntries = Object.entries(heatmapData.leetcode).map(([date, count]) => ({
                            userId: userId,
                            platform: 'leetcode',
                            handle: leetcodeProfile.handle,
                            date: date,
                            count: count
                        }));
                        // Insert fresh cache data
                        await prisma.calendarCache.createMany({
                            data: cacheEntries
                        });
                    }
                    catch (cacheError) {
                        console.error('❌ Failed to cache calendar data:', cacheError);
                    }
                }
            }
            catch (error) {
                console.error('❌ Error fetching LeetCode calendar:', error);
            }
        }
        // For Codeforces, use database submissions and also create calendar cache
        const codeforcesSubmissions = submissions.filter(sub => sub.platform === 'codeforces' &&
            sub.verdict === 'OK' && // Fixed to use 'OK' instead of 'AC'
            !sub.problem.tags?.includes('daily-activity') // Exclude synthetic data
        );
        // Create Codeforces heatmap data from submissions
        const codeforcesHeatmapData = {};
        codeforcesSubmissions.forEach(submission => {
            const dateKey = submission.timestamp.toISOString().split('T')[0];
            codeforcesHeatmapData[dateKey] = (codeforcesHeatmapData[dateKey] || 0) + 1;
            heatmapData.codeforces[dateKey] = codeforcesHeatmapData[dateKey];
        });
        // Cache Codeforces calendar data if we have submissions
        if (Object.keys(codeforcesHeatmapData).length > 0) {
            try {
                // Delete existing Codeforces cache for this user
                await prisma.calendarCache.deleteMany({
                    where: {
                        userId: userId,
                        platform: 'codeforces'
                    }
                });
                // Prepare Codeforces cache entries
                const codeforcesCacheEntries = Object.entries(codeforcesHeatmapData).map(([date, count]) => ({
                    userId: userId,
                    platform: 'codeforces',
                    handle: platformProfiles.find(p => p.platform === 'codeforces')?.handle || 'unknown',
                    date: date,
                    count: count
                }));
                // Insert fresh Codeforces cache data
                await prisma.calendarCache.createMany({
                    data: codeforcesCacheEntries
                });
            }
            catch (cacheError) {
                console.error('❌ Failed to cache Codeforces calendar data:', cacheError);
            }
        }
        // Combine LeetCode (from calendar) + Codeforces (from database)
        const allDates = new Set([
            ...Object.keys(heatmapData.leetcode),
            ...Object.keys(heatmapData.codeforces)
        ]);
        allDates.forEach(date => {
            const leetcodeCount = heatmapData.leetcode[date] || 0;
            const codeforcesCount = heatmapData.codeforces[date] || 0;
            heatmapData.combined[date] = leetcodeCount + codeforcesCount;
        });
        return heatmapData;
    }
    generateHeatmapData(submissions) {
        const leetcodeHeatmap = {};
        const codeforcesHeatmap = {};
        const combinedHeatmap = {};
        // Separate real submissions from daily-activity synthetic ones
        const realSubmissions = submissions.filter(sub => !sub.problem.tags?.includes('daily-activity'));
        const dailyActivitySubmissions = submissions.filter(sub => sub.problem.tags?.includes('daily-activity'));
        // Process real submissions first (exclude daily activity)
        realSubmissions.forEach(submission => {
            const dateKey = submission.timestamp.toISOString().split('T')[0];
            // Combined heatmap
            combinedHeatmap[dateKey] = (combinedHeatmap[dateKey] || 0) + 1;
            // Platform-specific heatmaps
            if (submission.platform === 'leetcode') {
                leetcodeHeatmap[dateKey] = (leetcodeHeatmap[dateKey] || 0) + 1;
            }
            else {
                codeforcesHeatmap[dateKey] = (codeforcesHeatmap[dateKey] || 0) + 1;
            }
        });
        // For LeetCode, prioritize calendar data if available
        // This will override the counts from summary problems with real calendar data
        // Log some sample data to verify counts
        return {
            leetcode: leetcodeHeatmap,
            codeforces: codeforcesHeatmap,
            combined: combinedHeatmap,
        };
    }
    calculateContestStats(contestParticipations) {
        // Filter to only include contests where user actually participated (has a valid rank)
        const validParticipations = contestParticipations.filter(p => p.rank && p.rank > 0);
        const leetcodeContests = validParticipations.filter(p => p.platform === 'leetcode');
        const codeforcesContests = validParticipations.filter(p => p.platform === 'codeforces');
        return {
            total: validParticipations.length,
            leetcode: leetcodeContests.length,
            codeforces: codeforcesContests.length,
        };
    }
    calculateContestRankings(contestParticipations) {
        // Filter to only include contests where user actually participated (has a valid rank)
        const validParticipations = contestParticipations.filter(p => p.rank && p.rank > 0);
        const leetcodeParticipations = validParticipations.filter(p => p.platform === 'leetcode');
        const codeforcesParticipations = validParticipations.filter(p => p.platform === 'codeforces');
        // Latest rankings
        const latestLeetcode = leetcodeParticipations[0];
        const latestCodeforces = codeforcesParticipations[0];
        // Best rankings (lowest rank number is best)
        const bestLeetcode = leetcodeParticipations.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity))[0];
        const bestCodeforces = codeforcesParticipations.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity))[0];
        return {
            latest: {
                leetcode: latestLeetcode ? {
                    contestId: latestLeetcode.contestId,
                    rank: latestLeetcode.rank,
                    timestamp: latestLeetcode.timestamp,
                } : undefined,
                codeforces: latestCodeforces ? {
                    contestId: latestCodeforces.contestId,
                    rank: latestCodeforces.rank,
                    oldRating: latestCodeforces.oldRating,
                    newRating: latestCodeforces.newRating,
                    timestamp: latestCodeforces.timestamp,
                } : undefined,
            },
            best: {
                leetcode: bestLeetcode ? {
                    contestId: bestLeetcode.contestId,
                    rank: bestLeetcode.rank,
                    timestamp: bestLeetcode.timestamp,
                } : undefined,
                codeforces: bestCodeforces ? {
                    contestId: bestCodeforces.contestId,
                    rank: bestCodeforces.rank,
                    oldRating: bestCodeforces.oldRating,
                    newRating: bestCodeforces.newRating,
                    timestamp: bestCodeforces.timestamp,
                } : undefined,
            },
            ratingHistory: {
                leetcode: leetcodeParticipations.map(p => ({
                    contestId: p.contestId,
                    rank: p.rank,
                    timestamp: p.timestamp,
                })),
                codeforces: codeforcesParticipations.map(p => ({
                    contestId: p.contestId,
                    rank: p.rank,
                    oldRating: p.oldRating,
                    newRating: p.newRating,
                    timestamp: p.timestamp,
                })),
            },
        };
    }
    async analyzeDSATopics(submissions, platformProfiles) {
        const topicAnalysis = {};
        // First, analyze from submission data (for Codeforces and any other platforms)
        const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'AC' || sub.verdict === 'OK');
        acceptedSubmissions.forEach(submission => {
            if (submission.problem?.tags && Array.isArray(submission.problem.tags)) {
                submission.problem.tags.forEach((tag) => {
                    if (!topicAnalysis[tag]) {
                        topicAnalysis[tag] = {
                            total: 0,
                            leetcode: 0,
                            codeforces: 0,
                            problems: [],
                        };
                    }
                    const problemKey = `${submission.platform}-${submission.problem.name}`;
                    if (!topicAnalysis[tag].problems.includes(problemKey)) {
                        topicAnalysis[tag].problems.push(problemKey);
                        topicAnalysis[tag].total++;
                        if (submission.platform === 'leetcode') {
                            topicAnalysis[tag].leetcode++;
                        }
                        else {
                            topicAnalysis[tag].codeforces++;
                        }
                    }
                });
            }
            else {
            }
        });
        // Enhanced analysis: Use LeetCode Skills API for comprehensive LeetCode data
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        if (leetcodeProfile?.handle) {
            try {
                const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                const leetcodeService = new LeetCodeService();
                const skillsData = await leetcodeService.getUserSkillStats(leetcodeProfile.handle);
                if (skillsData?.matchedUser?.tagProblemCounts) {
                    const tagProblemCounts = skillsData.matchedUser.tagProblemCounts;
                    // Process all skill categories
                    ['fundamental', 'intermediate', 'advanced'].forEach(category => {
                        if (tagProblemCounts[category]) {
                            tagProblemCounts[category].forEach((skillTag) => {
                                const tagName = skillTag.tagName;
                                const problemsSolved = skillTag.problemsSolved;
                                if (!topicAnalysis[tagName]) {
                                    topicAnalysis[tagName] = {
                                        total: 0,
                                        leetcode: 0,
                                        codeforces: 0,
                                        problems: [],
                                        category: category
                                    };
                                }
                                // Update LeetCode count from skills API (more accurate)
                                topicAnalysis[tagName].leetcode = problemsSolved;
                                topicAnalysis[tagName].total = topicAnalysis[tagName].codeforces + problemsSolved;
                                topicAnalysis[tagName].category = category;
                                // Add placeholder problems for this tag (since we have the count)
                                const existingLeetcodeProblems = topicAnalysis[tagName].problems.filter(p => p.startsWith('leetcode-'));
                                const neededProblems = problemsSolved - existingLeetcodeProblems.length;
                                for (let i = 1; i <= neededProblems; i++) {
                                    const problemKey = `leetcode-${skillTag.tagSlug}-${i}`;
                                    if (!topicAnalysis[tagName].problems.includes(problemKey)) {
                                        topicAnalysis[tagName].problems.push(problemKey);
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    console.log('⚠️ No LeetCode skills data available, using submission-based analysis');
                }
            }
            catch (error) {
                console.warn('⚠️ Error fetching LeetCode skills data:', error);
            }
        }
        // Enhanced analysis: Fetch fresh Codeforces data from API
        const codeforcesProfile = platformProfiles.find(p => p.platform === 'codeforces');
        if (codeforcesProfile?.handle) {
            try {
                const { codeforcesService } = await Promise.resolve().then(() => __importStar(require('./codeforcesService')));
                const statusResponse = await codeforcesService.getUserStatus(codeforcesProfile.handle);
                if (statusResponse?.result) {
                    const acceptedSubmissions = statusResponse.result
                        .filter((sub) => sub.verdict === 'OK'); // Codeforces uses 'OK' for accepted
                    // Track unique problems to avoid double counting
                    const uniqueProblems = new Set();
                    acceptedSubmissions.forEach((submission) => {
                        const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
                        // Skip if we've already processed this problem
                        if (uniqueProblems.has(problemKey)) {
                            return;
                        }
                        uniqueProblems.add(problemKey);
                        if (submission.problem?.tags && Array.isArray(submission.problem.tags)) {
                            submission.problem.tags.forEach((tag) => {
                                if (!topicAnalysis[tag]) {
                                    topicAnalysis[tag] = {
                                        total: 0,
                                        leetcode: 0,
                                        codeforces: 0,
                                        problems: [],
                                        category: 'intermediate' // Default category for Codeforces tags
                                    };
                                }
                                const fullProblemKey = `codeforces-${submission.problem.name}`;
                                if (!topicAnalysis[tag].problems.includes(fullProblemKey)) {
                                    topicAnalysis[tag].problems.push(fullProblemKey);
                                    topicAnalysis[tag].total++;
                                    topicAnalysis[tag].codeforces++;
                                }
                            });
                        }
                    });
                }
                else {
                    console.log('⚠️ No Codeforces submission results found from API');
                }
            }
            catch (error) {
                console.error('❌ Error fetching Codeforces data for topic analysis:', error);
            }
        }
        else {
            console.log('ℹ️ No Codeforces profile found for topic analysis');
        }
        // Filter out daily-activity topics before returning
        const filteredTopicAnalysis = {};
        Object.entries(topicAnalysis).forEach(([topic, data]) => {
            if (!topic.includes('daily-activity')) {
                filteredTopicAnalysis[topic] = data;
            }
        });
        // Final debugging log
        const topicCount = Object.keys(filteredTopicAnalysis).length;
        const codeforcesTopics = Object.entries(filteredTopicAnalysis).filter(([_, data]) => data.codeforces > 0);
        return filteredTopicAnalysis;
    }
    getUserInfo(userProfile, platformProfiles) {
        const connectedPlatforms = {};
        platformProfiles.forEach(profile => {
            if (profile.platform === 'leetcode') {
                connectedPlatforms.leetcode = {
                    handle: profile.handle,
                    syncedAt: profile.syncedAt,
                };
            }
            else if (profile.platform === 'codeforces') {
                connectedPlatforms.codeforces = {
                    handle: profile.handle,
                    currentRating: profile.currentRating,
                    maxRating: profile.maxRating,
                    rank: profile.rank,
                    syncedAt: profile.syncedAt,
                };
            }
        });
        return {
            profile: userProfile,
            connectedPlatforms
        };
    }
    async updatePlatformHandle(userId, platform, handle) {
        // Validate platform
        if (!['leetcode', 'codeforces'].includes(platform)) {
            throw new Error('Invalid platform. Only leetcode and codeforces are supported.');
        }
        let platformData = {};
        try {
            if (platform === 'leetcode') {
                // Import and use LeetCode service to validate handle and fetch data
                const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                const leetcodeService = new LeetCodeService();
                // Try to fetch user profile to validate handle
                const profile = await leetcodeService.getUserProfile(handle);
                if (!profile?.matchedUser) {
                    throw new Error(`LeetCode user '${handle}' not found. Please check the username.`);
                }
                // Fetch additional data for comprehensive sync
                const [calendar, contest] = await Promise.all([
                    leetcodeService.getUserCalendar(handle, new Date().getFullYear()).catch(() => null),
                    leetcodeService.getUserContestRanking(handle).catch(() => null)
                ]);
                platformData = {
                    profile,
                    calendar,
                    contest
                };
            }
            else if (platform === 'codeforces') {
                // Import and use Codeforces service to validate handle and fetch data
                const { codeforcesService } = await Promise.resolve().then(() => __importStar(require('./codeforcesService')));
                // Try to fetch user info to validate handle
                const userInfo = await codeforcesService.getUserInfo(handle);
                if (!userInfo?.result || userInfo.result.length === 0) {
                    throw new Error(`Codeforces user '${handle}' not found. Please check the username.`);
                }
                platformData = { userInfo: userInfo.result[0] };
            }
        }
        catch (error) {
            throw new Error(`Failed to validate ${platform} handle '${handle}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        // Update or create platform profile with additional metadata
        const updatedProfile = await prisma.platformProfile.upsert({
            where: {
                userId_platform: {
                    userId: userId,
                    platform: platform,
                }
            },
            update: {
                handle: handle,
                syncedAt: new Date(),
                // Store current rating for Codeforces
                currentRating: platform === 'codeforces' ? platformData.userInfo?.rating || null : null,
                maxRating: platform === 'codeforces' ? platformData.userInfo?.maxRating || null : null,
                rank: platform === 'codeforces' ? platformData.userInfo?.rank || null : null,
            },
            create: {
                userId: userId,
                platform: platform,
                handle: handle,
                syncedAt: new Date(),
                // Store current rating for Codeforces
                currentRating: platform === 'codeforces' ? platformData.userInfo?.rating || null : null,
                maxRating: platform === 'codeforces' ? platformData.userInfo?.maxRating || null : null,
                rank: platform === 'codeforces' ? platformData.userInfo?.rank || null : null,
            }
        });
        // Now sync the actual submission and contest data
        await this.syncPlatformData(userId, platform, handle, platformData);
        // Invalidate relevant caches after successful sync
        await Promise.all([
            cacheService_1.CacheService.invalidateUserCache(userId),
            cacheService_1.CacheService.invalidatePlatformCache(platform, handle),
            // Also invalidate analytics cache since platform data changed
            this.invalidateAnalyticsCache(userId),
        ]);
        // Return updated profile with sync info
        return {
            ...updatedProfile,
            syncSummary: {
                platform,
                handle,
                syncedAt: new Date(),
                message: `Successfully validated and synchronized ${platform} data for ${handle}`
            }
        };
    }
    async getDailySubmissions(userId) {
        try {
            // Get calendar cache data for the user
            const calendarData = await prisma.calendarCache.findMany({
                where: { userId },
                orderBy: { date: 'asc' }
            });
            // If no calendar cache data, try to generate it
            if (calendarData.length === 0) {
                console.log('⚠️ No calendar cache found, attempting to generate...');
                // Get user's platform profiles
                const platformProfiles = await prisma.platformProfile.findMany({
                    where: { userId }
                });
                if (platformProfiles.length > 0) {
                    // Get user submissions
                    const submissions = await prisma.submission.findMany({
                        where: { userId },
                        include: { problem: true }
                    });
                    // Generate heatmap data which will also create calendar cache
                    await this.generateHeatmapDataWithCalendar(submissions, platformProfiles, userId);
                    // Fetch calendar data again after generation
                    const newCalendarData = await prisma.calendarCache.findMany({
                        where: { userId },
                        orderBy: { date: 'asc' }
                    });
                    return this.processCalendarData(newCalendarData);
                }
                else {
                    return this.getEmptyDailySubmissionsResponse();
                }
            }
            return this.processCalendarData(calendarData);
        }
        catch (error) {
            console.error('❌ Error fetching daily submissions:', error);
            throw new Error('Failed to fetch daily submissions');
        }
    }
    processCalendarData(calendarData) {
        // Transform data for chart format
        const chartData = calendarData.map(entry => ({
            date: entry.date,
            submissions: entry.count,
            platform: entry.platform
        }));
        // Group by date and combine platforms
        const dailySubmissions = {};
        chartData.forEach(entry => {
            if (!dailySubmissions[entry.date]) {
                dailySubmissions[entry.date] = {
                    date: entry.date,
                    leetcode: 0,
                    codeforces: 0,
                    total: 0
                };
            }
            if (entry.platform === 'leetcode') {
                dailySubmissions[entry.date].leetcode = entry.submissions;
            }
            else if (entry.platform === 'codeforces') {
                dailySubmissions[entry.date].codeforces = entry.submissions;
            }
            dailySubmissions[entry.date].total =
                dailySubmissions[entry.date].leetcode + dailySubmissions[entry.date].codeforces;
        });
        // Convert to array and sort by date
        const sortedData = Object.values(dailySubmissions).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Get only last 30 days for better visualization
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentData = sortedData.filter(entry => new Date(entry.date) >= thirtyDaysAgo);
        return {
            dailySubmissions: recentData,
            totalDays: recentData.length,
            dateRange: {
                start: recentData[0]?.date || null,
                end: recentData[recentData.length - 1]?.date || null
            }
        };
    }
    getEmptyDailySubmissionsResponse() {
        return {
            dailySubmissions: [],
            totalDays: 0,
            dateRange: {
                start: null,
                end: null
            }
        };
    }
    // Method to sync platform data to database
    async syncPlatformData(userId, platform, handle, platformData) {
        try {
            if (platform === 'leetcode') {
                await this.syncLeetCodeData(userId, handle, platformData);
            }
            else if (platform === 'codeforces') {
                await this.syncCodeforcesData(userId, handle, platformData);
            }
        }
        catch (error) {
            console.error(`❌ Error syncing ${platform} data:`, error);
            throw error; // Re-throw to let caller handle the error
        }
    }
    // NOTE: Commented out sample data method - was adding dummy data to database
    /*
    private async addSampleData(userId: string, platform: string, handle: string) {

        try {
            // Create sample problems and submissions
            const sampleProblems = [
                { name: 'Two Sum', difficulty: 'easy', tags: ['Array', 'Hash Table'] },
                { name: 'Add Two Numbers', difficulty: 'medium', tags: ['Linked List', 'Math'] },
                { name: 'Longest Substring Without Repeating Characters', difficulty: 'medium', tags: ['Hash Table', 'String'] },
                { name: 'Median of Two Sorted Arrays', difficulty: 'hard', tags: ['Array', 'Binary Search'] },
                { name: 'Longest Palindromic Substring', difficulty: 'medium', tags: ['String', 'Dynamic Programming'] }
            ];

            for (let i = 0; i < sampleProblems.length; i++) {
                const sample = sampleProblems[i];
                const externalId = `${platform}-sample-${i + 1}`;

                // Create or update problem
                const problem = await prisma.problem.upsert({
                    where: {
                        platform_externalId: {
                            platform: platform as any,
                            externalId: externalId
                        }
                    },
                    update: {},
                    create: {
                        platform: platform as any,
                        externalId: externalId,
                        name: sample.name,
                        difficulty: sample.difficulty,
                        tags: sample.tags,
                        url: `https://${platform}.com/problems/${externalId}/`,
                        rating: platform === 'codeforces' ? 1200 + (i * 200) : null
                    }
                });

                // Create submissions for last few days
                for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
                    const submissionDate = new Date();
                    submissionDate.setDate(submissionDate.getDate() - dayOffset);
                    submissionDate.setHours(10 + (i * 2), 0, 0, 0); // Spread throughout day

                    const existingSubmission = await prisma.submission.findFirst({
                        where: {
                            userId: userId,
                            platform: platform as any,
                            problemId: problem.id,
                            timestamp: submissionDate
                        }
                    });

                    if (!existingSubmission) {
                        await prisma.submission.create({
                            data: {
                                userId: userId,
                                platform: platform as any,
                                handle: handle,
                                problemId: problem.id,
                                verdict: 'AC',
                                timestamp: submissionDate,
                                language: platform === 'leetcode' ? 'python' : 'cpp'
                            }
                        });
                    }
                }
            }

            // Create sample contest participations
            for (let i = 0; i < 3; i++) {
                const contestDate = new Date();
                contestDate.setDate(contestDate.getDate() - (i * 7)); // Weekly contests

                const contestId = `${platform}-contest-${Date.now()}-${i}`;

                try {
                    await prisma.contestParticipation.upsert({
                        where: {
                            userId_platform_contestId: {
                                userId: userId,
                                platform: platform as any,
                                contestId: contestId
                            }
                        },
                        update: {},
                        create: {
                            userId: userId,
                            platform: platform as any,
                            handle: handle,
                            contestId: contestId,
                            rank: 100 + (i * 50),
                            oldRating: platform === 'codeforces' ? 1200 + (i * 100) : null,
                            newRating: platform === 'codeforces' ? 1250 + (i * 100) : null,
                            timestamp: contestDate
                        }
                    });
                } catch (error) {
                    console.warn(`⚠️ Error adding sample contest ${contestId}:`, error);
                }
            }

        } catch (error) {
            console.error(`❌ Error adding sample data for ${platform}:`, error);
        }
    }
    */
    async syncLeetCodeData(userId, handle, data) {
        if (data.profile) {
            if (data.profile.matchedUser) {
            }
        }
        if (data.calendar) {
        }
        try {
            // Process submissions from calendar data if available
            if (data.profile?.matchedUser?.submissionCalendar) {
                // Calendar contains daily submission counts - create synthetic submissions for active days
                const submissionCalendar = JSON.parse(data.profile.matchedUser.submissionCalendar);
                let totalSubmissions = 0;
                let activeDays = 0;
                for (const [timestamp, count] of Object.entries(submissionCalendar)) {
                    const dailyCount = parseInt(count);
                    if (dailyCount > 0) {
                        totalSubmissions += dailyCount;
                        activeDays++;
                        // Create multiple synthetic submissions to match the actual submission count
                        const activityDate = new Date(parseInt(timestamp) * 1000);
                        try {
                            // Check if we already have submissions for this day
                            const existingSubmissions = await prisma.submission.findMany({
                                where: {
                                    userId: userId,
                                    platform: 'leetcode',
                                    timestamp: {
                                        gte: new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate()),
                                        lt: new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate() + 1)
                                    },
                                    problem: {
                                        tags: {
                                            has: 'daily-activity'
                                        }
                                    }
                                }
                            });
                            const existingCount = existingSubmissions.length;
                            const neededSubmissions = dailyCount - existingCount;
                            if (neededSubmissions > 0) {
                                // Create multiple problems and submissions for this day to match the count
                                for (let submissionIndex = 0; submissionIndex < neededSubmissions; submissionIndex++) {
                                    const problemExternalId = `daily-activity-${timestamp}-${submissionIndex + existingCount + 1}`;
                                    // Create a synthetic problem for this submission
                                    const dailyProblem = await prisma.problem.upsert({
                                        where: {
                                            platform_externalId: {
                                                platform: 'leetcode',
                                                externalId: problemExternalId
                                            }
                                        },
                                        update: {},
                                        create: {
                                            platform: 'leetcode',
                                            externalId: problemExternalId,
                                            name: `Daily Activity ${activityDate.toDateString()} #${submissionIndex + existingCount + 1}`,
                                            difficulty: 'medium',
                                            tags: ['daily-activity'],
                                            url: `https://leetcode.com/`
                                        }
                                    });
                                    // Create submission with slight time offset to spread throughout the day
                                    const submissionTime = new Date(activityDate);
                                    submissionTime.setHours(9 + (submissionIndex * 2) % 14); // Spread between 9 AM to 11 PM
                                    submissionTime.setMinutes(Math.floor(Math.random() * 60));
                                    await prisma.submission.create({
                                        data: {
                                            userId: userId,
                                            platform: 'leetcode',
                                            handle: handle,
                                            problemId: dailyProblem.id,
                                            verdict: 'AC',
                                            timestamp: submissionTime,
                                            language: 'unknown'
                                        }
                                    });
                                }
                            }
                            else {
                            }
                        }
                        catch (error) {
                            console.warn(`⚠️ Error creating daily activity for ${activityDate.toDateString()}:`, error);
                        }
                    }
                }
            }
            else {
                console.log('⚠️ No calendar submission data available');
            }
            // NOTE: Skipping recent submissions processing to avoid double counting
            // The summary problems (created from submitStats) already provide the accurate count
            // Processing recent submissions would add extra problems beyond the actual solved count
            /*
            // Process actual recent submissions from profile if available
            if (data.profile?.recentSubmissionList) {
                const recentSubmissions = data.profile.recentSubmissionList;


                for (const submission of recentSubmissions) {
                    try {
                        // First, ensure the problem exists
                        const problem = await prisma.problem.upsert({
                            where: {
                                platform_externalId: {
                                    platform: 'leetcode',
                                    externalId: submission.titleSlug
                                }
                            },
                            update: {},
                            create: {
                                platform: 'leetcode',
                                externalId: submission.titleSlug,
                                name: submission.title,
                                difficulty: 'medium', // Default, we'd need another API call to get exact difficulty
                                tags: [],
                                url: `https://leetcode.com/problems/${submission.titleSlug}/`
                            }
                        });

                        // Then create the submission (avoid duplicates)
                        const submissionTimestamp = new Date(parseInt(submission.timestamp) * 1000);

                        const existingSubmission = await prisma.submission.findFirst({
                            where: {
                                userId: userId,
                                platform: 'leetcode',
                                problemId: problem.id,
                                timestamp: submissionTimestamp
                            }
                        });

                        if (!existingSubmission) {
                            await prisma.submission.create({
                                data: {
                                    userId: userId,
                                    platform: 'leetcode',
                                    handle: handle,
                                    problemId: problem.id,
                                    verdict: submission.statusDisplay === 'Accepted' ? 'AC' : 'WA',
                                    timestamp: submissionTimestamp,
                                    language: submission.lang || 'unknown'
                                }
                            });

                        }
                    } catch (error) {
                        console.warn(`⚠️ Error syncing LeetCode submission ${submission.title}:`, error);
                    }
                }
            } else {
                console.log('⚠️ No recent submission data available from profile');
            }
            */
            console.log('✅ Skipped recent submissions processing to maintain accurate count (252 problems from stats)');
            // Create summary records based on submission statistics instead of trying to fetch all individual problems
            const totalSolved = data.profile?.matchedUser?.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count || 0;
            // Instead of trying to fetch all individual problems (which is complex), 
            // let's create summary problems for now and focus on recent submissions
            if (totalSolved > 0) {
                await this.createSummaryProblemsFromStats(userId, handle, data.profile.matchedUser.submitStats);
            }
            // Process contest data
            if (data.contest?.userContestRankingHistory) {
                // Process ALL contests instead of just the last 10
                const allContests = data.contest.userContestRankingHistory;
                for (const contest of allContests) {
                    try {
                        const contestTimestamp = new Date(contest.contest.startTime * 1000);
                        await prisma.contestParticipation.upsert({
                            where: {
                                userId_platform_contestId: {
                                    userId: userId,
                                    platform: 'leetcode',
                                    contestId: contest.contest.title
                                }
                            },
                            update: {},
                            create: {
                                userId: userId,
                                platform: 'leetcode',
                                handle: handle,
                                contestId: contest.contest.title,
                                rank: contest.ranking,
                                timestamp: contestTimestamp
                            }
                        });
                    }
                    catch (error) {
                        console.warn(`⚠️ Error syncing LeetCode contest ${contest.contest.title}:`, error);
                    }
                }
            }
            else {
                console.log('⚠️ No contest data available');
            }
        }
        catch (error) {
            console.error('❌ Error in LeetCode data sync:', error);
        }
    }
    // Create summary problems based on user statistics - a more practical approach
    async createSummaryProblemsFromStats(userId, handle, submitStats) {
        try {
            if (!submitStats?.acSubmissionNum) {
                console.log('⚠️ No submission statistics available');
                return;
            }
            // Get the breakdown by difficulty
            const difficulties = ['Easy', 'Medium', 'Hard'];
            for (const difficulty of difficulties) {
                const difficultyStats = submitStats.acSubmissionNum.find((s) => s.difficulty === difficulty);
                if (difficultyStats && difficultyStats.count > 0) {
                    const count = difficultyStats.count;
                    // Create summary problems for this difficulty level
                    for (let i = 1; i <= count; i++) {
                        const problemExternalId = `leetcode-${difficulty.toLowerCase()}-${i}`;
                        const problemName = `${difficulty} Problem ${i}`;
                        // Create or update the problem
                        const problem = await prisma.problem.upsert({
                            where: {
                                platform_externalId: {
                                    platform: 'leetcode',
                                    externalId: problemExternalId
                                }
                            },
                            update: {},
                            create: {
                                platform: 'leetcode',
                                externalId: problemExternalId,
                                name: problemName,
                                difficulty: difficulty.toLowerCase(),
                                tags: [],
                                url: `https://leetcode.com/problems/${problemExternalId}/`
                            }
                        });
                        // Create a submission entry for this solved problem
                        const existingSubmission = await prisma.submission.findFirst({
                            where: {
                                userId: userId,
                                platform: 'leetcode',
                                problemId: problem.id,
                                verdict: 'AC'
                            }
                        });
                        if (!existingSubmission) {
                            await prisma.submission.create({
                                data: {
                                    userId: userId,
                                    platform: 'leetcode',
                                    handle: handle,
                                    problemId: problem.id,
                                    verdict: 'AC',
                                    timestamp: new Date(),
                                    language: 'unknown'
                                }
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('❌ Error creating summary problems:', error);
        }
    }
    // Method to fetch ALL solved problems from LeetCode
    async syncAllLeetCodeSolvedProblems(userId, handle) {
        try {
            const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
            const leetcodeService = new LeetCodeService();
            // Get the user's complete profile including solved problems
            const userProfile = await leetcodeService.getUserProfile(handle);
            if (!userProfile?.matchedUser) {
                console.log('❌ Could not fetch user profile for solved problems');
                return;
            }
            // Get submission statistics which includes all solved problems count
            const submitStats = userProfile.matchedUser.submitStats;
            if (submitStats?.acSubmissionNum) {
            }
            // Try to get solved problems using a different approach - fetch user's question progress
            try {
                const questionProgress = await leetcodeService.getUserQuestionProgress(handle);
                if (questionProgress?.userProfileUserQuestionProgressV2?.userQuestionStatus) {
                    const solvedQuestions = questionProgress.userProfileUserQuestionProgressV2.userQuestionStatus.filter((q) => q.status === 'ACCEPTED' || q.status === 'AC');
                    // Process each solved question
                    for (const solvedQ of solvedQuestions) {
                        await this.createProblemAndSubmission(userId, handle, solvedQ);
                    }
                    return;
                }
            }
            catch (progressError) {
                console.log('⚠️ Could not fetch question progress:', progressError);
            }
            // Fallback: Use brute force approach - check all problems against user profile
            await this.bruteForceCheckSolvedProblems(userId, handle);
        }
        catch (error) {
            console.error('❌ Error syncing all LeetCode solved problems:', error);
        }
    }
    // Helper method to create problem and submission
    async createProblemAndSubmission(userId, handle, problemData) {
        try {
            // Extract problem info (structure may vary based on API response)
            const titleSlug = problemData.titleSlug || problemData.questionSlug;
            const title = problemData.title || problemData.questionTitle;
            const difficulty = problemData.difficulty || 'medium';
            if (!titleSlug || !title) {
                console.warn('⚠️ Skipping problem with missing title or slug');
                return;
            }
            // Create or update the problem
            const dbProblem = await prisma.problem.upsert({
                where: {
                    platform_externalId: {
                        platform: 'leetcode',
                        externalId: titleSlug
                    }
                },
                update: {
                    name: title,
                    difficulty: difficulty.toLowerCase(),
                },
                create: {
                    platform: 'leetcode',
                    externalId: titleSlug,
                    name: title,
                    difficulty: difficulty.toLowerCase(),
                    tags: [], // We'll fetch tags separately if needed
                    url: `https://leetcode.com/problems/${titleSlug}/`
                }
            });
            // Create submission if it doesn't exist
            const existingSubmission = await prisma.submission.findFirst({
                where: {
                    userId: userId,
                    platform: 'leetcode',
                    problemId: dbProblem.id,
                    verdict: 'AC'
                }
            });
            if (!existingSubmission) {
                await prisma.submission.create({
                    data: {
                        userId: userId,
                        platform: 'leetcode',
                        handle: handle,
                        problemId: dbProblem.id,
                        verdict: 'AC',
                        timestamp: new Date(),
                        language: 'unknown'
                    }
                });
            }
        }
        catch (error) {
            console.warn(`⚠️ Error creating problem/submission:`, error);
        }
    }
    // Brute force method: fetch problems in batches and check status individually  
    async bruteForceCheckSolvedProblems(userId, handle) {
        try {
            const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
            const leetcodeService = new LeetCodeService();
            let skip = 0;
            const limit = 50; // Smaller batches to avoid overwhelming
            let totalProcessed = 0;
            let solvedFound = 0;
            while (skip < 1000) { // Limit to first 1000 problems to avoid infinite loop
                try {
                    // Fetch problems without any filter first
                    const problemsData = await leetcodeService.getProblems('', limit, skip, {});
                    if (!problemsData?.problemsetQuestionList?.questions || problemsData.problemsetQuestionList.questions.length === 0) {
                        break;
                    }
                    const problems = problemsData.problemsetQuestionList.questions;
                    // Check each problem individually for solved status
                    for (const problem of problems) {
                        totalProcessed++;
                        // Check if this specific problem is solved by the user
                        // The status field should indicate if user solved it
                        if (problem.status && (problem.status.toLowerCase() === 'ac' ||
                            problem.status.toLowerCase() === 'accepted' ||
                            problem.status.toLowerCase().includes('accept'))) {
                            solvedFound++;
                            await this.createProblemAndSubmission(userId, handle, {
                                titleSlug: problem.titleSlug,
                                title: problem.title,
                                difficulty: problem.difficulty || 'Medium'
                            });
                        }
                    }
                    skip += limit;
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                catch (batchError) {
                    console.warn(`⚠️ Error in batch at skip ${skip}:`, batchError);
                    break;
                }
            }
        }
        catch (error) {
            console.error('❌ Error in brute force check:', error);
        }
    }
    async syncCodeforcesData(userId, handle, data) {
        try {
            const { codeforcesService } = await Promise.resolve().then(() => __importStar(require('./codeforcesService')));
            // Get user submissions
            const submissions = await codeforcesService.getUserStatus(handle).catch(() => null);
            if (submissions?.result) {
                // Get recent accepted submissions (last 50 to avoid overwhelming)
                const recentAccepted = submissions.result
                    .filter((sub) => sub.verdict === 'OK')
                    .slice(0, 50);
                for (const submission of recentAccepted) {
                    try {
                        // Create problem first
                        const problemExternalId = `${submission.problem.contestId}-${submission.problem.index}`;
                        const problem = await prisma.problem.upsert({
                            where: {
                                platform_externalId: {
                                    platform: 'codeforces',
                                    externalId: problemExternalId
                                }
                            },
                            update: {},
                            create: {
                                platform: 'codeforces',
                                externalId: problemExternalId,
                                name: submission.problem.name,
                                difficulty: submission.problem.rating ?
                                    (submission.problem.rating <= 1200 ? 'easy' :
                                        submission.problem.rating <= 1800 ? 'medium' : 'hard') : 'medium',
                                rating: submission.problem.rating,
                                tags: submission.problem.tags || [],
                                url: `https://codeforces.com/contest/${submission.problem.contestId}/problem/${submission.problem.index}`
                            }
                        });
                        // Create submission (avoid duplicates)
                        const submissionTimestamp = new Date(submission.creationTimeSeconds * 1000);
                        const existingSubmission = await prisma.submission.findFirst({
                            where: {
                                userId: userId,
                                platform: 'codeforces',
                                problemId: problem.id,
                                timestamp: submissionTimestamp
                            }
                        });
                        if (!existingSubmission) {
                            await prisma.submission.create({
                                data: {
                                    userId: userId,
                                    platform: 'codeforces',
                                    handle: handle,
                                    problemId: problem.id,
                                    verdict: submission.verdict,
                                    timestamp: submissionTimestamp,
                                    language: submission.programmingLanguage
                                }
                            });
                        }
                    }
                    catch (error) {
                        console.warn(`⚠️ Error syncing Codeforces submission ${submission.problem.name}:`, error);
                    }
                }
            }
            // Get contest rating history
            const ratingData = await codeforcesService.getUserRating(handle).catch(() => null);
            if (ratingData?.result) {
                for (const contest of ratingData.result) {
                    try {
                        const contestTimestamp = new Date(contest.ratingUpdateTimeSeconds * 1000);
                        await prisma.contestParticipation.upsert({
                            where: {
                                userId_platform_contestId: {
                                    userId: userId,
                                    platform: 'codeforces',
                                    contestId: contest.contestId.toString()
                                }
                            },
                            update: {},
                            create: {
                                userId: userId,
                                platform: 'codeforces',
                                handle: handle,
                                contestId: contest.contestId.toString(),
                                rank: contest.rank,
                                oldRating: contest.oldRating,
                                newRating: contest.newRating,
                                timestamp: contestTimestamp
                            }
                        });
                    }
                    catch (error) {
                        console.warn(`⚠️ Error syncing Codeforces contest ${contest.contestId}:`, error);
                    }
                }
            }
        }
        catch (error) {
            console.error('❌ Error in Codeforces data sync:', error);
        }
    }
    async getContestHistory(userId, platformProfiles) {
        try {
            // Get contest participations from database
            const contestParticipations = await prisma.contestParticipation.findMany({
                where: { userId },
                orderBy: { timestamp: 'asc' }, // Order by time for graph
            });
            // Also try to get fresh contest data from LeetCode API
            const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
            let freshLeetCodeContests = [];
            if (leetcodeProfile?.handle) {
                try {
                    const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                    const leetcodeService = new LeetCodeService();
                    const contestData = await leetcodeService.getUserContestRanking(leetcodeProfile.handle);
                    if (contestData?.userContestRankingHistory) {
                        freshLeetCodeContests = contestData.userContestRankingHistory
                            .filter((contest) => contest.attended) // Only attended contests
                            .map((contest) => ({
                            platform: 'leetcode',
                            contestId: contest.contest.title,
                            rating: contest.rating,
                            rank: contest.ranking,
                            timestamp: new Date(contest.contest.startTime * 1000),
                            problemsSolved: contest.problemsSolved,
                            totalProblems: contest.totalProblems
                        }));
                    }
                }
                catch (error) {
                    console.warn('Could not fetch fresh LeetCode contest data:', error);
                }
            }
            // Process database contest participations
            const processedContests = contestParticipations.map(contest => ({
                platform: contest.platform,
                contestId: contest.contestId,
                rating: contest.newRating,
                oldRating: contest.oldRating,
                rank: contest.rank,
                timestamp: contest.timestamp,
            }));
            // Combine and deduplicate (prefer fresh data)
            const contestMap = new Map();
            // Add database contests first
            processedContests.forEach(contest => {
                const key = `${contest.platform}-${contest.contestId}`;
                contestMap.set(key, contest);
            });
            // Override with fresh LeetCode data if available
            freshLeetCodeContests.forEach((contest) => {
                const key = `${contest.platform}-${contest.contestId}`;
                contestMap.set(key, contest);
            });
            const allContests = Array.from(contestMap.values());
            // Separate by platform and sort by time
            const leetcodeContests = allContests
                .filter(c => c.platform === 'leetcode')
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            const codeforcesContests = allContests
                .filter(c => c.platform === 'codeforces')
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return {
                leetcode: leetcodeContests,
                codeforces: codeforcesContests,
                combined: allContests.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            };
        }
        catch (error) {
            console.error('Error fetching contest history:', error);
            return {
                leetcode: [],
                codeforces: [],
                combined: []
            };
        }
    }
    /**
     * Invalidate analytics cache for a user
     */
    async invalidateAnalyticsCache(userId) {
        try {
            // Import AnalyticsService dynamically to avoid circular dependencies
            const { AnalyticsService } = await Promise.resolve().then(() => __importStar(require('./analyticsService')));
            await AnalyticsService.invalidateAnalyticsCache(userId);
        }
        catch (error) {
            console.error('❌ Error invalidating analytics cache:', error);
            // Don't throw error to avoid breaking the main flow
        }
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
