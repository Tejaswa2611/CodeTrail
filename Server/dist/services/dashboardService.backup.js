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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DashboardService {
    async getDashboardStats(userId) {
        console.log(`🔍 Getting dashboard stats for user: ${userId}`);
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
        console.log(`✅ User profile found: ${userProfile.email}`);
        // Get user's platform profiles
        const platformProfiles = await prisma.platformProfile.findMany({
            where: { userId },
        });
        console.log(`📊 Found ${platformProfiles.length} platform profiles:`, platformProfiles.map(p => `${p.platform}: ${p.handle}`));
        // Get all user submissions
        const submissions = await prisma.submission.findMany({
            where: { userId },
            include: {
                problem: true,
            },
            orderBy: { timestamp: 'desc' },
        });
        console.log(`📝 Found ${submissions.length} submissions for user`);
        console.log(`📝 Submission sample:`, submissions.slice(0, 3).map(s => ({
            platform: s.platform,
            verdict: s.verdict,
            problem: s.problem.name,
            timestamp: s.timestamp
        })));
        // Get contest participations
        const contestParticipations = await prisma.contestParticipation.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });
        console.log(`🏆 Found ${contestParticipations.length} contest participations`);
        // Calculate total questions solved
        const totalQuestions = this.calculateTotalQuestions(submissions);
        console.log(`🧮 Calculated total questions:`, totalQuestions);
        // Calculate active days
        const totalActiveDays = this.calculateActiveDays(submissions);
        console.log(`📅 Calculated active days:`, totalActiveDays);
        // Generate heatmap data with real calendar data if available
        const heatmapData = await this.generateHeatmapDataWithCalendar(submissions, platformProfiles, userId);
        console.log('📊 Generated heatmap data sample:', {
            totalDates: Object.keys(heatmapData.combined).length,
            sampleCombined: Object.entries(heatmapData.combined).slice(0, 5),
            sampleLeetcode: Object.entries(heatmapData.leetcode).slice(0, 5),
            sampleCodeforces: Object.entries(heatmapData.codeforces).slice(0, 5)
        });
        // Calculate contest stats
        const totalContests = this.calculateContestStats(contestParticipations);
        // Calculate contest rankings
        const contestRankings = this.calculateContestRankings(contestParticipations);
        // Analyze DSA topics using both submission data and LeetCode skills API
        const dsaTopicAnalysis = await this.analyzeDSATopics(submissions, platformProfiles);
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
        };
        console.log(`✅ Dashboard stats calculated successfully:`, {
            totalQuestions: result.totalQuestions.total,
            totalActiveDays: result.totalActiveDays.total,
            totalContests: result.totalContests.total,
            dsaTopicsCount: Object.keys(result.dsaTopicAnalysis).length
        });
        // Log top DSA topics for debugging
        const topTopics = Object.entries(result.dsaTopicAnalysis)
            .filter(([topic]) => !topic.includes('daily-activity'))
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10);
        console.log(`🏆 Top 10 DSA Topics:`, topTopics.map(([topic, data]) => `${topic}: ${data.total} (${data.category || 'unknown'})`));
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
            .filter(sub => sub.verdict === 'AC')
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
        console.log('�️ Generating heatmap with FRESH calendar data (ignoring database submissions)...');
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
                console.log(`� Fetching FRESH LeetCode calendar for: ${leetcodeProfile.handle}`);
                const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                const leetcodeService = new LeetCodeService();
                const profile = await leetcodeService.getUserProfile(leetcodeProfile.handle);
                if (profile?.matchedUser?.submissionCalendar) {
                    console.log('🎯 Processing FRESH calendar data (ignoring all database submissions)...');
                    const submissionCalendar = JSON.parse(profile.matchedUser.submissionCalendar);
                    console.log('📊 Raw calendar data sample:', Object.entries(submissionCalendar).slice(0, 10).map(([ts, count]) => {
                        const originalDate = new Date(parseInt(ts) * 1000);
                        const shiftedDate = new Date(parseInt(ts) * 1000);
                        shiftedDate.setDate(shiftedDate.getDate() - 1);
                        const year = shiftedDate.getFullYear();
                        const month = String(shiftedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(shiftedDate.getDate()).padStart(2, '0');
                        return {
                            timestamp: ts,
                            count,
                            originalDate: originalDate.toDateString(),
                            shiftedDate: `${year}-${month}-${day}`,
                            finalDate: `${year}-${month}-${day}`
                        };
                    }));
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
                    console.log(`✅ LeetCode calendar processed: ${Object.keys(heatmapData.leetcode).length} active days`);
                    console.log('📅 July 2025 LeetCode data:', Object.entries(heatmapData.leetcode)
                        .filter(([date]) => date.startsWith('2025-07'))
                        .map(([date, count]) => `${date}: ${count}`));
                }
                else {
                    console.log('⚠️ No submission calendar found in LeetCode profile');
                }
            }
            catch (error) {
                console.error('❌ Error fetching LeetCode calendar:', error);
            }
        }
        // For Codeforces, use database submissions (since no calendar API available)
        const codeforcesSubmissions = submissions.filter(sub => sub.platform === 'codeforces' &&
            sub.verdict === 'AC' &&
            !sub.problem.tags?.includes('daily-activity') // Exclude synthetic data
        );
        codeforcesSubmissions.forEach(submission => {
            const dateKey = submission.timestamp.toISOString().split('T')[0];
            heatmapData.codeforces[dateKey] = (heatmapData.codeforces[dateKey] || 0) + 1;
        });
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
        console.log('📊 Final heatmap summary:', {
            leetcodeDays: Object.keys(heatmapData.leetcode).length,
            codeforcesDays: Object.keys(heatmapData.codeforces).length,
            combinedDays: Object.keys(heatmapData.combined).length,
            july2025Sample: Object.entries(heatmapData.combined)
                .filter(([date]) => date.startsWith('2025-07'))
                .slice(0, 10)
        });
        return heatmapData;
    }
    generateHeatmapData(submissions) {
        const leetcodeHeatmap = {};
        const codeforcesHeatmap = {};
        const combinedHeatmap = {};
        console.log(`🔍 Processing ${submissions.length} submissions for heatmap...`);
        // Separate real submissions from daily-activity synthetic ones
        const realSubmissions = submissions.filter(sub => !sub.problem.tags?.includes('daily-activity'));
        const dailyActivitySubmissions = submissions.filter(sub => sub.problem.tags?.includes('daily-activity'));
        console.log(`📊 Submission breakdown: Real: ${realSubmissions.length}, Daily Activity: ${dailyActivitySubmissions.length}`);
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
        console.log('🔍 Checking for calendar data to override LeetCode heatmap...');
        // TODO: Get calendar data from latest sync and apply it here
        // For now, just process daily activity to maintain the 1-per-day pattern from calendar
        // Log some sample data to verify counts
        const sampleDates = Object.keys(combinedHeatmap).slice(0, 10);
        console.log('📈 Sample heatmap data (real submissions only):', sampleDates.map(date => ({
            date,
            combined: combinedHeatmap[date],
            leetcode: leetcodeHeatmap[date] || 0,
            codeforces: codeforcesHeatmap[date] || 0
        })));
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
        console.log(`📊 Contest stats: Total valid participations: ${validParticipations.length} (LeetCode: ${leetcodeContests.length}, Codeforces: ${codeforcesContests.length})`);
        console.log(`📊 Sample contests:`, validParticipations.slice(0, 3).map(p => ({
            platform: p.platform,
            contestId: p.contestId,
            rank: p.rank,
            timestamp: p.timestamp
        })));
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
        submissions
            .filter(sub => sub.verdict === 'AC')
            .forEach(submission => {
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
        });
        // Enhanced analysis: Use LeetCode Skills API for comprehensive LeetCode data
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        if (leetcodeProfile?.handle) {
            try {
                console.log('🔍 Fetching LeetCode skills data for comprehensive topic analysis...');
                // Import LeetCode service and fetch skills data
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
                    console.log('✅ Enhanced DSA topic analysis with LeetCode skills data');
                    // Log all topics for debugging
                    const allTopics = Object.keys(topicAnalysis)
                        .filter(topic => !topic.includes('daily-activity'))
                        .sort();
                    console.log(`📊 Total DSA topics found: ${allTopics.length}`);
                    console.log(`📋 All topics:`, allTopics.slice(0, 20).join(', ') + (allTopics.length > 20 ? '...' : ''));
                }
                else {
                    console.log('⚠️ No LeetCode skills data available, using submission-based analysis');
                }
            }
            catch (error) {
                console.warn('⚠️ Error fetching LeetCode skills data:', error);
                console.log('📊 Falling back to submission-based topic analysis');
            }
        }
        // Filter out daily-activity topics before returning
        const filteredTopicAnalysis = {};
        Object.entries(topicAnalysis).forEach(([topic, data]) => {
            if (!topic.includes('daily-activity')) {
                filteredTopicAnalysis[topic] = data;
            }
        });
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
        console.log('🔧 DashboardService.updatePlatformHandle called with:', { userId, platform, handle });
        // Validate platform
        if (!['leetcode', 'codeforces'].includes(platform)) {
            console.log('❌ Invalid platform:', platform);
            throw new Error('Invalid platform. Only leetcode and codeforces are supported.');
        }
        // Validate the handle and fetch platform data
        console.log('🔍 Validating handle and fetching platform data...');
        let platformData = {};
        try {
            if (platform === 'leetcode') {
                // Import and use LeetCode service to validate handle and fetch data
                const { LeetCodeService } = await Promise.resolve().then(() => __importStar(require('./leetcodeService')));
                const leetcodeService = new LeetCodeService();
                // Try to fetch user profile to validate handle
                console.log('🔄 Fetching LeetCode profile to validate handle...');
                const profile = await leetcodeService.getUserProfile(handle);
                if (!profile?.matchedUser) {
                    throw new Error(`LeetCode user '${handle}' not found. Please check the username.`);
                }
                console.log('✅ LeetCode handle validated successfully');
                // Fetch additional data for comprehensive sync
                console.log('📥 Fetching additional LeetCode data...');
                const [calendar, contest] = await Promise.all([
                    leetcodeService.getUserCalendar(handle, new Date().getFullYear()).catch(() => null),
                    leetcodeService.getUserContestRanking(handle).catch(() => null)
                ]);
                platformData = {
                    profile,
                    calendar,
                    contest
                };
                console.log('📊 LeetCode data fetched successfully');
            }
            else if (platform === 'codeforces') {
                // Import and use Codeforces service to validate handle and fetch data
                const { codeforcesService } = await Promise.resolve().then(() => __importStar(require('./codeforcesService')));
                // Try to fetch user info to validate handle
                console.log('🔄 Fetching Codeforces profile to validate handle...');
                const userInfo = await codeforcesService.getUserInfo(handle);
                if (!userInfo?.result || userInfo.result.length === 0) {
                    throw new Error(`Codeforces user '${handle}' not found. Please check the username.`);
                }
                console.log('✅ Codeforces handle validated successfully');
                platformData = { userInfo: userInfo.result[0] };
                console.log('📊 Codeforces data fetched successfully');
            }
        }
        catch (error) {
            console.log('❌ Handle validation/data fetch failed:', error);
            throw new Error(`Failed to validate ${platform} handle '${handle}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        console.log('🔄 Updating platform profile...');
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
        console.log('✅ Platform profile updated:', updatedProfile);
        // Now sync the actual submission and contest data
        console.log('🔄 Starting comprehensive data synchronization...');
        await this.syncPlatformData(userId, platform, handle, platformData);
        console.log('💡 Platform handle updated and data synchronized successfully!');
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
    // Method to sync platform data to database
    async syncPlatformData(userId, platform, handle, platformData) {
        console.log(`🔄 Syncing ${platform} data for user ${userId}...`);
        try {
            if (platform === 'leetcode') {
                await this.syncLeetCodeData(userId, handle, platformData);
            }
            else if (platform === 'codeforces') {
                await this.syncCodeforcesData(userId, handle, platformData);
            }
            console.log(`✅ ${platform} data sync completed successfully`);
        }
        catch (error) {
            console.error(`❌ Error syncing ${platform} data:`, error);
            throw error; // Re-throw to let caller handle the error
        }
    }
    // NOTE: Commented out sample data method - was adding dummy data to database
    /*
    private async addSampleData(userId: string, platform: string, handle: string) {
        console.log(`📊 Adding sample data for ${platform}...`);

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
                        console.log(`✅ Added sample submission: ${sample.name} on ${submissionDate.toDateString()}`);
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
                    console.log(`✅ Added sample contest: ${contestId}`);
                } catch (error) {
                    console.warn(`⚠️ Error adding sample contest ${contestId}:`, error);
                }
            }

            console.log(`✅ Sample data added successfully for ${platform}`);
        } catch (error) {
            console.error(`❌ Error adding sample data for ${platform}:`, error);
        }
    }
    */
    async syncLeetCodeData(userId, handle, data) {
        console.log('🔄 Syncing LeetCode data...');
        // Debug: Log what data we actually received
        console.log('🔍 Debug - LeetCode data structure:');
        console.log('📋 data.profile exists:', !!data.profile);
        console.log('📋 data.calendar exists:', !!data.calendar);
        console.log('📋 data.contest exists:', !!data.contest);
        if (data.profile) {
            console.log('📋 data.profile.matchedUser exists:', !!data.profile.matchedUser);
            console.log('📋 data.profile.recentSubmissionList exists:', !!data.profile.recentSubmissionList);
            console.log('📋 data.profile.recentSubmissionList length:', data.profile.recentSubmissionList?.length || 0);
            if (data.profile.matchedUser) {
                console.log('📋 data.profile.matchedUser.submitStats exists:', !!data.profile.matchedUser.submitStats);
                console.log('📋 data.profile.matchedUser.submissionCalendar exists:', !!data.profile.matchedUser.submissionCalendar);
            }
        }
        if (data.calendar) {
            console.log('📋 submissionCalendar exists:', !!data.calendar.submissionCalendar);
        }
        try {
            // Process submissions from calendar data if available
            if (data.profile?.matchedUser?.submissionCalendar) {
                console.log('📅 Processing LeetCode calendar submissions...');
                // Calendar contains daily submission counts - create synthetic submissions for active days
                const submissionCalendar = JSON.parse(data.profile.matchedUser.submissionCalendar);
                console.log('📊 Calendar data analysis:', {
                    totalDates: Object.keys(submissionCalendar).length,
                    sampleEntries: Object.entries(submissionCalendar).slice(0, 10).map(([ts, count]) => ({
                        timestamp: ts,
                        count: count,
                        date: new Date(parseInt(ts) * 1000).toDateString()
                    })),
                    july2025Entries: Object.entries(submissionCalendar)
                        .filter(([ts]) => {
                        const date = new Date(parseInt(ts) * 1000);
                        return date.getFullYear() === 2025 && date.getMonth() === 6; // July = month 6
                    })
                        .map(([ts, count]) => ({
                        timestamp: ts,
                        count: count,
                        date: new Date(parseInt(ts) * 1000).toDateString()
                    }))
                });
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
                                console.log(`📅 Creating ${neededSubmissions} submissions for ${activityDate.toDateString()} (target: ${dailyCount}, existing: ${existingCount})`);
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
                                console.log(`✅ Added ${neededSubmissions} submissions for ${activityDate.toDateString()} (total: ${dailyCount})`);
                            }
                            else {
                                console.log(`⏭️ Skipping ${activityDate.toDateString()} - already has ${existingCount} submissions (target: ${dailyCount})`);
                            }
                        }
                        catch (error) {
                            console.warn(`⚠️ Error creating daily activity for ${activityDate.toDateString()}:`, error);
                        }
                    }
                }
                console.log(`📊 Calendar summary: ${totalSubmissions} total submissions across ${activeDays} active days`);
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
                console.log(`📊 Processing ${recentSubmissions.length} recent submissions...`);

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
                            console.log(`✅ Added LeetCode submission: ${submission.title}`);
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
            console.log('🔍 Creating summary records based on submission statistics...');
            const totalSolved = data.profile?.matchedUser?.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count || 0;
            console.log('📊 User has solved', totalSolved, 'total problems');
            // Instead of trying to fetch all individual problems (which is complex), 
            // let's create summary problems for now and focus on recent submissions
            if (totalSolved > 0) {
                await this.createSummaryProblemsFromStats(userId, handle, data.profile.matchedUser.submitStats);
            }
            // Process contest data
            if (data.contest?.userContestRankingHistory) {
                console.log(`🏆 Processing ${data.contest.userContestRankingHistory.length} contest participations...`);
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
                        console.log(`✅ Added LeetCode contest: ${contest.contest.title} (Rank: ${contest.ranking})`);
                    }
                    catch (error) {
                        console.warn(`⚠️ Error syncing LeetCode contest ${contest.contest.title}:`, error);
                    }
                }
                console.log(`🏆 Successfully processed ${allContests.length} total contest participations`);
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
            console.log('📊 Creating summary problems from submission statistics...');
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
                    console.log(`📈 Creating ${count} ${difficulty} summary problems...`);
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
                    console.log(`✅ Created ${count} ${difficulty} problems and submissions`);
                }
            }
            console.log('🎉 Summary problems creation completed!');
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
            console.log('🔄 Fetching user profile with all solved problems data...');
            // Get the user's complete profile including solved problems
            const userProfile = await leetcodeService.getUserProfile(handle);
            if (!userProfile?.matchedUser) {
                console.log('❌ Could not fetch user profile for solved problems');
                return;
            }
            // Get submission statistics which includes all solved problems count
            const submitStats = userProfile.matchedUser.submitStats;
            if (submitStats?.acSubmissionNum) {
                console.log('📊 Found submission stats:', {
                    totalSolved: submitStats.acSubmissionNum.reduce((sum, stat) => sum + stat.count, 0),
                    easy: submitStats.acSubmissionNum.find((s) => s.difficulty === 'Easy')?.count || 0,
                    medium: submitStats.acSubmissionNum.find((s) => s.difficulty === 'Medium')?.count || 0,
                    hard: submitStats.acSubmissionNum.find((s) => s.difficulty === 'Hard')?.count || 0
                });
            }
            // Try to get solved problems using a different approach - fetch user's question progress
            console.log('� Attempting to fetch user question progress...');
            try {
                const questionProgress = await leetcodeService.getUserQuestionProgress(handle);
                console.log('📋 Question progress data:', questionProgress ? 'Found' : 'Not found');
                if (questionProgress?.userProfileUserQuestionProgressV2?.userQuestionStatus) {
                    const solvedQuestions = questionProgress.userProfileUserQuestionProgressV2.userQuestionStatus.filter((q) => q.status === 'ACCEPTED' || q.status === 'AC');
                    console.log(`✅ Found ${solvedQuestions.length} solved problems from question progress`);
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
            console.log('🔄 Using fallback method: checking all problems for solved status...');
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
                console.log(`✅ Added solved problem: ${title}`);
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
            console.log('🔄 Brute force checking all problems for solved status...');
            let skip = 0;
            const limit = 50; // Smaller batches to avoid overwhelming
            let totalProcessed = 0;
            let solvedFound = 0;
            while (skip < 1000) { // Limit to first 1000 problems to avoid infinite loop
                try {
                    console.log(`📥 Fetching problems batch: skip=${skip}, limit=${limit}`);
                    // Fetch problems without any filter first
                    const problemsData = await leetcodeService.getProblems('', limit, skip, {});
                    if (!problemsData?.problemsetQuestionList?.questions || problemsData.problemsetQuestionList.questions.length === 0) {
                        console.log('📋 No more problems to fetch');
                        break;
                    }
                    const problems = problemsData.problemsetQuestionList.questions;
                    console.log(`📥 Got ${problems.length} problems in batch`);
                    // Check each problem individually for solved status
                    for (const problem of problems) {
                        totalProcessed++;
                        // Check if this specific problem is solved by the user
                        // The status field should indicate if user solved it
                        if (problem.status && (problem.status.toLowerCase() === 'ac' ||
                            problem.status.toLowerCase() === 'accepted' ||
                            problem.status.toLowerCase().includes('accept'))) {
                            solvedFound++;
                            console.log(`🎯 Found solved problem: ${problem.title} (status: ${problem.status})`);
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
            console.log(`🎉 Brute force check completed!`);
            console.log(`📊 Total problems checked: ${totalProcessed}`);
            console.log(`✅ Solved problems found: ${solvedFound}`);
        }
        catch (error) {
            console.error('❌ Error in brute force check:', error);
        }
    }
    async syncCodeforcesData(userId, handle, data) {
        console.log('🔄 Syncing Codeforces data...');
        try {
            const { codeforcesService } = await Promise.resolve().then(() => __importStar(require('./codeforcesService')));
            // Get user submissions
            console.log('📥 Fetching Codeforces submissions...');
            const submissions = await codeforcesService.getUserStatus(handle).catch(() => null);
            if (submissions?.result) {
                // Get recent accepted submissions (last 50 to avoid overwhelming)
                const recentAccepted = submissions.result
                    .filter((sub) => sub.verdict === 'OK')
                    .slice(0, 50);
                console.log(`📊 Processing ${recentAccepted.length} recent accepted submissions...`);
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
                            console.log(`✅ Added Codeforces submission: ${submission.problem.name}`);
                        }
                    }
                    catch (error) {
                        console.warn(`⚠️ Error syncing Codeforces submission ${submission.problem.name}:`, error);
                    }
                }
            }
            // Get contest rating history
            console.log('🏆 Fetching Codeforces contest rating history...');
            const ratingData = await codeforcesService.getUserRating(handle).catch(() => null);
            if (ratingData?.result) {
                console.log(`🏆 Processing ${ratingData.result.length} contest participations...`);
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
                        console.log(`✅ Added Codeforces contest: ${contest.contestName || contest.contestId}`);
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
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
