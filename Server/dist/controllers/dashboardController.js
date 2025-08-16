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
exports.getDailySubmissions = exports.updatePlatformHandle = exports.getAICoachTopicAnalysis = exports.getUserPlatformProfiles = exports.getDashboardStats = void 0;
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
const getDashboardStats = async (req, res) => {
    try {
        console.log('🎯 Dashboard controller - req.user:', req.user);
        const userId = req.user?.userId;
        console.log('🎯 Dashboard controller - extracted userId:', userId);
        if (!userId) {
            console.log('❌ Dashboard controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        console.log('🎯 Dashboard controller - About to call dashboardService');
        const dashboardStats = await dashboardService_1.dashboardService.getDashboardStats(userId);
        console.log('🎯 Dashboard controller - Service call completed successfully');
        return res.status(200).json(response_1.ResponseUtils.success('Dashboard stats retrieved successfully', dashboardStats));
    }
    catch (error) {
        console.error('❌ Dashboard controller - Error fetching dashboard stats:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getDashboardStats = getDashboardStats;
const getUserPlatformProfiles = async (req, res) => {
    try {
        console.log('🎯 Platform profiles controller - req.user:', req.user);
        const userId = req.user?.userId;
        console.log('🎯 Platform profiles controller - extracted userId:', userId);
        if (!userId) {
            console.log('❌ Platform profiles controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        // This endpoint specifically for sidebar user info
        const stats = await dashboardService_1.dashboardService.getDashboardStats(userId);
        return res.status(200).json(response_1.ResponseUtils.success('User platform profiles retrieved successfully', {
            connectedPlatforms: stats.userInfo.connectedPlatforms,
        }));
    }
    catch (error) {
        console.error('Error fetching user platform profiles:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getUserPlatformProfiles = getUserPlatformProfiles;
const getAICoachTopicAnalysis = async (req, res) => {
    try {
        console.log('🤖 AI Coach endpoint called - starting analysis...');
        const userId = req.user?.userId;
        if (!userId) {
            console.log('❌ AI Coach - No userId found');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        console.log(`🤖 AI Coach - Processing for user: ${userId}`);
        // Get the dashboard stats which includes DSA topic analysis
        console.log('🤖 AI Coach - Getting dashboard stats...');
        const dashboardStats = await dashboardService_1.dashboardService.getDashboardStats(userId);
        console.log(`🤖 AI Coach - Dashboard stats retrieved, topics: ${Object.keys(dashboardStats.dsaTopicAnalysis || {}).length}`);
        // Check if we have any topics to analyze
        if (!dashboardStats.dsaTopicAnalysis || Object.keys(dashboardStats.dsaTopicAnalysis).length === 0) {
            console.log('⚠️ AI Coach - No DSA topics found, returning empty analysis');
            return res.status(200).json(response_1.ResponseUtils.success('AI Coach analysis retrieved (no topics found)', {
                overallProgress: {
                    score: 0,
                    level: 'Beginner',
                    strongAreas: [],
                    weakAreas: [],
                    improvementTrend: 'Getting started',
                    recentProgress: {
                        lastWeekSolved: 0,
                        lastMonthSolved: 0,
                        averageWeeklySolved: 0,
                        consistencyScore: 0,
                        difficultyProgression: 'beginner',
                        ratingTrend: { codeforces: null, leetcode: null }
                    }
                },
                topicAnalysis: [],
                suggestedQuestions: [],
                totalTopics: 0,
                lastUpdated: new Date().toISOString(),
                debugInfo: {
                    isAIAvailable: false,
                    topicsProcessed: 0,
                    environment: process.env.NODE_ENV || 'development',
                    message: 'No DSA topics found - user may need to connect platforms or solve problems'
                }
            }));
        }
        // Try to import chatbot service, but don't fail if it's not available
        let ChatbotService = null;
        let isAIAvailable = false;
        try {
            const chatbotModule = await Promise.resolve().then(() => __importStar(require('../services/chatbotService')));
            ChatbotService = chatbotModule.ChatbotService;
            isAIAvailable = true;
            console.log('🤖 AI Coach - ChatbotService imported successfully');
        }
        catch (importError) {
            console.warn('⚠️ AI Coach - ChatbotService not available:', importError?.message || 'Unknown error');
            isAIAvailable = false;
        }
        console.log(`🤖 Starting AI Coach analysis for ${Object.keys(dashboardStats.dsaTopicAnalysis || {}).length} topics... (AI Available: ${isAIAvailable})`);
        // Transform the raw DSA topic analysis into AI Coach format with real AI recommendations
        const topicAnalysisWithAI = await Promise.all(Object.entries(dashboardStats.dsaTopicAnalysis || {})
            .slice(0, 15) // Limit to top 15 topics for performance
            .map(async ([topicName, stats], index) => {
            console.log(`🔍 Processing topic ${index + 1}/15: ${topicName} (${stats.total} problems)`);
            const problemsSolved = stats.total || 0;
            const estimatedTotalProblems = Math.max(problemsSolved * 2, 50);
            const proficiency = Math.min((problemsSolved / estimatedTotalProblems) * 100, 95);
            // Determine trend based on proficiency
            let trend = 'needs_work';
            if (proficiency >= 80)
                trend = 'excellent';
            else if (proficiency >= 60)
                trend = 'good';
            else if (proficiency >= 40)
                trend = 'improving';
            // Determine importance based on category and problem count
            let importance = 'medium';
            if (stats.category === 'fundamental' || problemsSolved > 20)
                importance = 'high';
            else if (problemsSolved < 5)
                importance = 'high'; // High priority for weak areas
            else if (stats.category === 'advanced')
                importance = 'low';
            // Generate AI-powered recommendations and next steps
            const aiPrompt = `You are a senior software engineer and coding mentor. Analyze this DSA topic and provide brief, actionable guidance.

📊 TOPIC: ${topicName}
📈 PROBLEMS SOLVED: ${problemsSolved}
📊 PROFICIENCY: ${Math.round(proficiency)}%

Provide guidance in EXACTLY this format:

FREQUENCY: [number 20-95]
RECOMMENDATION: [1-2 sentences briefly describing the topic's importance and current proficiency assessment]
NEXTSTEPS: [3 brief action points separated by | - specific actions the user should take to improve]
PROBLEMS: [Problem1Name]|https://leetcode.com/problems/[slug1]/|[Problem2Name]|https://leetcode.com/problems/[slug2]/|[Problem3Name]|https://leetcode.com/problems/[slug3]/

Example:
FREQUENCY: 75
RECOMMENDATION: Arrays are fundamental to programming interviews, appearing in 75% of technical screenings. Your current proficiency suggests room for improvement in advanced patterns.
NEXTSTEPS: Master sliding window technique|Practice two-pointer problems|Learn prefix sum patterns
PROBLEMS: Two Sum|https://leetcode.com/problems/two-sum/|Best Time to Buy and Sell Stock|https://leetcode.com/problems/best-time-to-buy-and-sell-stock/|Contains Duplicate|https://leetcode.com/problems/contains-duplicate/`;
            try {
                let aiResponse = null;
                // Only try AI if service is available
                if (isAIAvailable && ChatbotService) {
                    console.log(`🧠 Generating AI recommendation for ${topicName}...`);
                    aiResponse = await ChatbotService.sendMessage(userId, aiPrompt, []);
                    console.log(`${aiResponse.isError ? '❌' : '✅'} AI response for ${topicName}: ${aiResponse.isError ? 'Error' : 'Success'}`);
                }
                else {
                    console.log(`⚠️ Skipping AI generation for ${topicName} - service not available`);
                }
                let recommendation = `Focus on strengthening ${topicName} fundamentals with consistent practice.`;
                let companyFrequency = 70;
                let nextSteps = [];
                // Provide topic-specific hardcoded examples with real LeetCode links for testing
                if (topicName.toLowerCase().includes('array')) {
                    recommendation = `Arrays are fundamental to programming interviews, appearing in 80%+ of coding assessments. Your current proficiency suggests room for improvement in advanced patterns.`;
                    nextSteps = [
                        { text: 'Master sliding window technique', url: null, type: 'text' },
                        { text: 'Practice two-pointer problems', url: null, type: 'text' },
                        { text: 'Learn prefix sum patterns', url: null, type: 'text' }
                    ];
                }
                else if (topicName.toLowerCase().includes('string')) {
                    recommendation = `String manipulation appears in 70% of technical interviews and is crucial for algorithmic thinking. Focus on mastering key patterns and character frequency techniques.`;
                    nextSteps = [
                        { text: 'Master sliding window for substrings', url: null, type: 'text' },
                        { text: 'Practice character frequency problems', url: null, type: 'text' },
                        { text: 'Learn pattern matching algorithms', url: null, type: 'text' }
                    ];
                }
                else if (topicName.toLowerCase().includes('tree') || topicName.toLowerCase().includes('binary tree')) {
                    recommendation = `Tree problems test recursion understanding and are excellent indicators of problem-solving maturity. Focus on mastering traversal patterns and recursive thinking.`;
                    nextSteps = [
                        { text: 'Master tree traversal techniques', url: null, type: 'text' },
                        { text: 'Practice recursive problem solving', url: null, type: 'text' },
                        { text: 'Learn DFS vs BFS applications', url: null, type: 'text' }
                    ];
                }
                else if (topicName.toLowerCase().includes('linked list')) {
                    recommendation = `Linked Lists test pointer manipulation skills fundamental to systems programming. Master two-pointer techniques for better problem-solving intuition.`;
                    nextSteps = [
                        { text: 'Master pointer manipulation techniques', url: null, type: 'text' },
                        { text: 'Practice two-pointer problems', url: null, type: 'text' },
                        { text: 'Learn cycle detection algorithms', url: null, type: 'text' }
                    ];
                }
                else {
                    recommendation = `${topicName} is an important building block in your algorithmic toolkit. Focus on understanding core patterns rather than memorizing solutions.`;
                    nextSteps = [
                        { text: `Practice basic ${topicName.toLowerCase()} problems daily`, url: null, type: 'text' },
                        { text: 'Study fundamental patterns and approaches', url: null, type: 'text' },
                        { text: 'Focus on time/space complexity analysis', url: null, type: 'text' }
                    ];
                }
                if (aiResponse && !aiResponse.isError && aiResponse.message) {
                    const response = aiResponse.message;
                    console.log(`🔍 AI Response for ${topicName}:`, response.substring(0, 200) + '...');
                    // Parse frequency
                    const frequencyMatch = response.match(/FREQUENCY:\s*(\d+)/i);
                    if (frequencyMatch) {
                        companyFrequency = Math.min(Math.max(parseInt(frequencyMatch[1]), 20), 95);
                        console.log(`✅ Parsed frequency: ${companyFrequency}`);
                    }
                    // Parse recommendation and clean up any markdown links
                    const recommendationMatch = response.match(/RECOMMENDATION:\s*(.+?)(?=\nNEXTSTEPS:|NEXTSTEPS:|PROBLEMS:|$)/s);
                    if (recommendationMatch) {
                        let rawRecommendation = recommendationMatch[1].trim();
                        // Clean up markdown links in recommendation - convert [Text](URL) to just Text
                        const cleanedRecommendation = rawRecommendation.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                        recommendation = cleanedRecommendation;
                        console.log(`✅ Parsed recommendation: ${recommendation.substring(0, 50)}...`);
                    }
                    // Parse next steps and clean up any markdown links
                    const nextStepsMatch = response.match(/NEXTSTEPS:\s*(.+?)(?=\nPROBLEMS:|PROBLEMS:|$)/s);
                    if (nextStepsMatch) {
                        const nextStepsString = nextStepsMatch[1].trim();
                        console.log(`🔍 Next steps string: ${nextStepsString}`);
                        // Split by pipe and create action items, cleaning up markdown links
                        const stepsParts = nextStepsString.split('|');
                        const aiNextStepsActions = stepsParts
                            .map(step => {
                            // Clean up markdown links - convert [Text](URL) to just Text
                            return step.trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                        })
                            .filter(step => step.length > 0)
                            .slice(0, 3) // Take first 3
                            .map(step => ({
                            text: step,
                            url: null,
                            type: 'text'
                        }));
                        if (aiNextStepsActions.length >= 3) {
                            nextSteps = aiNextStepsActions;
                            console.log(`✅ Using ${nextSteps.length} AI-generated next steps`);
                        }
                        else {
                            console.log(`⚠️ AI only generated ${aiNextStepsActions.length} next steps, keeping hardcoded`);
                        }
                    }
                    // Parse problems and add them to next steps if available
                    const problemsMatch = response.match(/PROBLEMS:\s*(.+?)$/s);
                    if (problemsMatch) {
                        const problemsString = problemsMatch[1].trim();
                        console.log(`🔍 Problems string: ${problemsString}`);
                        const aiProblems = [];
                        // Check if problems are in markdown format [Text](URL)
                        const markdownLinks = problemsString.match(/\[([^\]]+)\]\(([^)]+)\)/g);
                        if (markdownLinks && markdownLinks.length > 0) {
                            console.log(`🔍 Found ${markdownLinks.length} markdown-style links`);
                            markdownLinks.forEach(link => {
                                const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
                                if (match) {
                                    const problemName = match[1].trim();
                                    const problemUrl = match[2].trim();
                                    if (problemName && problemUrl && problemUrl.includes('leetcode.com')) {
                                        aiProblems.push({
                                            text: problemName,
                                            url: problemUrl,
                                            type: 'link'
                                        });
                                        console.log(`✅ Added markdown problem: ${problemName} -> ${problemUrl}`);
                                    }
                                }
                            });
                        }
                        else {
                            // Try pipe-separated format
                            const problemParts = problemsString.split('|');
                            for (let i = 0; i < problemParts.length - 1; i += 2) {
                                const problemName = problemParts[i]?.trim();
                                const problemUrl = problemParts[i + 1]?.trim();
                                if (problemName && problemUrl && problemUrl.includes('leetcode.com')) {
                                    aiProblems.push({
                                        text: problemName,
                                        url: problemUrl,
                                        type: 'link'
                                    });
                                    console.log(`✅ Added pipe-separated problem: ${problemName} -> ${problemUrl}`);
                                }
                            }
                        }
                        // If we have AI-generated next steps, add the problems to them
                        // If not, replace nextSteps with problems
                        if (nextSteps.length >= 3 && nextSteps[0].type === 'text') {
                            // Keep the action steps and add problems if we have them
                            if (aiProblems.length > 0) {
                                nextSteps = [...nextSteps.slice(0, 3), ...aiProblems.slice(0, 3)];
                                console.log(`🤖 Using AI next steps + ${aiProblems.length} AI problems`);
                            }
                        }
                        else if (aiProblems.length >= 2) {
                            // No good next steps, use problems as next steps
                            nextSteps = aiProblems.slice(0, 3);
                            console.log(`🤖 Using ${nextSteps.length} AI-generated problems as next steps`);
                        }
                    }
                    else {
                        console.log(`⚠️ No problems found in AI response`);
                    }
                }
                return {
                    topic: topicName,
                    proficiency: Math.round(proficiency),
                    problemsSolved,
                    totalProblems: estimatedTotalProblems,
                    trend,
                    importance,
                    companyFrequency: Math.min(Math.max(companyFrequency, 20), 95),
                    recommendation,
                    nextSteps,
                    category: stats.category || 'intermediate',
                    platformBreakdown: {
                        leetcode: stats.leetcode || 0,
                        codeforces: stats.codeforces || 0
                    }
                };
            }
            catch (aiError) {
                console.warn(`Failed to get AI recommendation for ${topicName}:`, aiError);
                // Generate intelligent, dynamic recommendations based on user performance and topic data
                let recommendation = '';
                let nextSteps = [];
                // Dynamic recommendation generation based on proficiency and problem count
                const categoryBonus = stats.category === 'fundamental' ? 15 : stats.category === 'advanced' ? -10 : 0;
                const adjustedFrequency = Math.min(Math.max(proficiency + categoryBonus + Math.floor(problemsSolved / 10), 25), 95);
                if (proficiency >= 80) {
                    recommendation = `Outstanding mastery of ${topicName}! With ${problemsSolved} problems solved, you're demonstrating expertise that puts you in the top tier. This topic appears in ${adjustedFrequency}% of technical interviews, making your deep understanding a significant competitive advantage. At this level, focus on helping others and refining your ability to explain complex concepts clearly - a skill that's invaluable in senior engineering roles.`;
                    nextSteps = [
                        { text: `Master advanced ${topicName.toLowerCase()} optimization techniques and time complexity analysis.`, url: null, type: 'text' },
                        { text: 'Contribute to open-source projects featuring this topic to demonstrate expertise.', url: null, type: 'text' },
                        { text: 'Mentor others and practice explaining complex patterns in interview settings.', url: null, type: 'text' }
                    ];
                }
                else if (proficiency >= 60) {
                    recommendation = `Strong foundation in ${topicName} with ${problemsSolved} problems completed! You're in a solid position since this topic appears in ${adjustedFrequency}% of interviews. The key now is consistency and pushing into advanced patterns. You're past the hardest part - building initial understanding - so focus on pattern recognition and optimizing your solutions for both clarity and efficiency.`;
                    nextSteps = [
                        { text: `Solve 3-5 medium-difficulty ${topicName.toLowerCase()} problems weekly to maintain momentum.`, url: null, type: 'text' },
                        { text: 'Study optimal solutions and learn from discussion forums after solving.', url: null, type: 'text' },
                        { text: 'Practice explaining your approach out loud to improve interview communication.', url: null, type: 'text' }
                    ];
                }
                else if (proficiency >= 40) {
                    recommendation = `${topicName} is developing well with ${problemsSolved} problems solved - you're making real progress! Since this appears in ${adjustedFrequency}% of technical interviews, targeted practice here will significantly boost your interview readiness. You're at the stage where concepts are clicking, so push through to build confidence. This is where many developers see breakthrough moments.`;
                    nextSteps = [
                        { text: `Start with easy-to-medium ${topicName.toLowerCase()} problems and gradually increase difficulty.`, url: null, type: 'text' },
                        { text: 'Join study groups or find online communities focused on this topic.', url: null, type: 'text' },
                        { text: 'Create a structured 2-week study plan to improve understanding systematically.', url: null, type: 'text' }
                    ];
                }
                else {
                    recommendation = `${topicName} needs immediate attention, but don't be discouraged! With ${problemsSolved} problems solved, you're just getting started on a topic that appears in ${adjustedFrequency}% of interviews. This represents a high-impact opportunity for growth. Many successful engineers struggled with this topic initially - the key is consistent daily practice and not giving up when problems feel challenging.`;
                    nextSteps = [
                        { text: `Begin with fundamental ${topicName.toLowerCase()} concepts through tutorials and documentation.`, url: null, type: 'text' },
                        { text: 'Solve at least 1-2 basic problems daily until comfortable with core patterns.', url: null, type: 'text' },
                        { text: 'Consider finding a mentor or taking a structured course on this topic.', url: null, type: 'text' }
                    ];
                }
                // Add topic-specific strategic advice based on category
                if (stats.category === 'fundamental') {
                    nextSteps.push({ text: 'Master this fundamental topic as it forms the foundation for advanced concepts.', url: null, type: 'text' });
                }
                else if (stats.category === 'advanced') {
                    nextSteps.push({ text: 'This advanced topic can differentiate you in senior-level technical interviews.', url: null, type: 'text' });
                }
                // Limit to 3 most relevant steps
                nextSteps = nextSteps.slice(0, 3);
                return {
                    topic: topicName,
                    proficiency: Math.round(proficiency),
                    problemsSolved,
                    totalProblems: estimatedTotalProblems,
                    trend,
                    importance,
                    companyFrequency: Math.round(adjustedFrequency),
                    recommendation,
                    nextSteps,
                    category: stats.category || 'intermediate',
                    platformBreakdown: {
                        leetcode: stats.leetcode || 0,
                        codeforces: stats.codeforces || 0
                    }
                };
            }
        }));
        // Sort by problems solved
        const sortedTopicAnalysis = topicAnalysisWithAI.sort((a, b) => b.problemsSolved - a.problemsSolved);
        // Generate AI-powered suggested questions from the weak areas
        console.log('🎯 Generating AI-powered suggested questions...');
        const suggestedQuestions = [];
        // Get the 3 weakest topics for generating suggested questions
        const weakestTopics = sortedTopicAnalysis
            .filter(t => t.proficiency < 60) // Topics with less than 60% proficiency
            .slice(0, 3); // Take top 3 weakest
        // If we don't have enough weak topics, add some from medium-proficiency ones
        if (weakestTopics.length < 3) {
            const mediumTopics = sortedTopicAnalysis
                .filter(t => t.proficiency >= 60 && t.proficiency < 80)
                .slice(0, 3 - weakestTopics.length);
            weakestTopics.push(...mediumTopics);
        }
        for (const topic of weakestTopics) {
            // Extract problems from nextSteps that have URLs
            const problems = topic.nextSteps
                .filter(step => step.type === 'link' && step.url)
                .slice(0, 2); // Take first 2 problems from each topic
            for (const problem of problems) {
                // Create a suggested question from the problem
                const difficulty = topic.proficiency < 30 ? 'Easy' :
                    topic.proficiency < 60 ? 'Medium' : 'Hard';
                const priority = topic.proficiency < 30 ? 'critical' :
                    topic.proficiency < 50 ? 'high' : 'medium';
                suggestedQuestions.push({
                    id: suggestedQuestions.length + 1,
                    title: problem.text,
                    difficulty,
                    topic: topic.topic,
                    platform: 'LeetCode',
                    url: problem.url,
                    reason: `Strengthen your ${topic.topic.toLowerCase()} skills (${topic.proficiency}% proficiency)`,
                    estimatedTime: difficulty === 'Easy' ? '15-20 min' :
                        difficulty === 'Medium' ? '25-35 min' : '45-60 min',
                    companies: ['Google', 'Amazon', 'Microsoft'], // Generic companies for now
                    priority
                });
            }
        }
        // If we still don't have enough questions, add some from strong areas for practice
        if (suggestedQuestions.length < 4) {
            const strongTopics = sortedTopicAnalysis
                .filter(t => t.proficiency >= 80)
                .slice(0, 2);
            for (const topic of strongTopics) {
                const problems = topic.nextSteps
                    .filter(step => step.type === 'link' && step.url)
                    .slice(0, 1);
                for (const problem of problems) {
                    suggestedQuestions.push({
                        id: suggestedQuestions.length + 1,
                        title: problem.text,
                        difficulty: 'Medium',
                        topic: topic.topic,
                        platform: 'LeetCode',
                        url: problem.url,
                        reason: `Maintain your strong ${topic.topic.toLowerCase()} skills`,
                        estimatedTime: '20-30 min',
                        companies: ['Apple', 'Meta', 'Netflix'],
                        priority: 'low'
                    });
                }
            }
        }
        console.log(`✅ Generated ${suggestedQuestions.length} AI-powered suggested questions`);
        // Calculate overall progress metrics
        const totalProblemsSolved = dashboardStats.totalQuestions?.total || 0;
        const strongAreas = sortedTopicAnalysis.filter(t => t.proficiency >= 70).map(t => t.topic).slice(0, 3);
        const weakAreas = sortedTopicAnalysis.filter(t => t.proficiency < 50).map(t => t.topic).slice(0, 3);
        // Determine overall level based on total problems and strong areas
        let level = 'Beginner';
        if (totalProblemsSolved > 500 || strongAreas.length > 5)
            level = 'Advanced';
        else if (totalProblemsSolved > 150 || strongAreas.length > 2)
            level = 'Intermediate';
        const overallProgress = {
            score: Math.min(Math.round((totalProblemsSolved / 10) + (strongAreas.length * 5)), 100),
            level,
            strongAreas,
            weakAreas,
            improvementTrend: strongAreas.length > weakAreas.length ? '+12% this month' : 'Steady progress',
            recentProgress: {
                lastWeekSolved: Math.min(totalProblemsSolved, 8), // Estimate
                lastMonthSolved: Math.min(totalProblemsSolved, 25), // Estimate
                averageWeeklySolved: Math.min(Math.round(totalProblemsSolved / 10), 6),
                consistencyScore: Math.min(85, totalProblemsSolved * 2), // Estimate based on activity
                difficultyProgression: level === 'Advanced' ? 'advanced' : level === 'Intermediate' ? 'improving' : 'beginner',
                ratingTrend: {
                    codeforces: dashboardStats.userInfo?.connectedPlatforms?.codeforces || { current: null, change: 0, trend: 'stable' },
                    leetcode: dashboardStats.userInfo?.connectedPlatforms?.leetcode || { current: null, change: 0, trend: 'stable' }
                }
            }
        };
        return res.status(200).json(response_1.ResponseUtils.success('AI Coach topic analysis with AI recommendations retrieved successfully', {
            overallProgress,
            topicAnalysis: sortedTopicAnalysis,
            suggestedQuestions: suggestedQuestions,
            totalTopics: Object.keys(dashboardStats.dsaTopicAnalysis || {}).length,
            lastUpdated: new Date().toISOString(),
            debugInfo: {
                isAIAvailable,
                topicsProcessed: sortedTopicAnalysis.length,
                environment: process.env.NODE_ENV || 'development'
            }
        }));
    }
    catch (error) {
        console.error('❌ AI Coach - Critical error in getAICoachTopicAnalysis:', error);
        console.error('❌ AI Coach - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('❌ AI Coach - Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            userId: req.user?.userId,
            environment: process.env.NODE_ENV || 'development'
        });
        return res.status(500).json(response_1.ResponseUtils.error(`Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
};
exports.getAICoachTopicAnalysis = getAICoachTopicAnalysis;
const updatePlatformHandle = async (req, res) => {
    try {
        console.log('🎯 updatePlatformHandle called - req.user:', req.user);
        console.log('🎯 updatePlatformHandle body:', req.body);
        const userId = req.user?.userId;
        const { platform, handle } = req.body;
        console.log('🎯 Extracted values - userId:', userId, 'platform:', platform, 'handle:', handle);
        if (!userId) {
            console.log('❌ No userId found');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        if (!platform || !handle) {
            console.log('❌ Missing platform or handle');
            return res.status(400).json(response_1.ResponseUtils.error('Platform and handle are required'));
        }
        // Update or create platform profile
        console.log('🔄 Calling dashboardService.updatePlatformHandle...');
        const updatedProfile = await dashboardService_1.dashboardService.updatePlatformHandle(userId, platform, handle);
        console.log('✅ updatePlatformHandle success:', updatedProfile);
        return res.status(200).json(response_1.ResponseUtils.success('Platform handle updated successfully', updatedProfile));
    }
    catch (error) {
        console.error('❌ Error updating platform handle:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.updatePlatformHandle = updatePlatformHandle;
const getDailySubmissions = async (req, res) => {
    try {
        console.log('🎯 Daily submissions controller - req.user:', req.user);
        const userId = req.user?.userId;
        if (!userId) {
            console.log('❌ Daily submissions controller - No userId found, returning 401');
            return res.status(401).json(response_1.ResponseUtils.error('Unauthorized'));
        }
        console.log('🎯 Daily submissions controller - About to call dashboardService');
        const dailyData = await dashboardService_1.dashboardService.getDailySubmissions(userId);
        console.log('🎯 Daily submissions controller - Service call completed successfully');
        return res.status(200).json(response_1.ResponseUtils.success('Daily submissions retrieved successfully', dailyData));
    }
    catch (error) {
        console.error('❌ Daily submissions controller - Error fetching daily submissions:', error);
        return res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
    }
};
exports.getDailySubmissions = getDailySubmissions;
