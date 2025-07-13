import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import config from '../config';

const prisma = new PrismaClient();

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatbotResponse {
    message: string;
    isError: boolean;
}

export class ChatbotService {
    private static readonly OPENROUTER_API_KEY = config.ai.openRouterApiKey;
    private static readonly OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    private static readonly MODEL = 'deepseek/deepseek-chat'; // Updated to match actual usage

    static {
        // Debug API key on service initialization
        console.log('🔑 ChatbotService initialized with API key:', 
            ChatbotService.OPENROUTER_API_KEY ? 
            `${ChatbotService.OPENROUTER_API_KEY.substring(0, 10)}...` : 
            'NOT SET'
        );
    }

    /**
     * Get user's DSA topic distribution for personalized recommendations
     */
    private static async getDSATopicDistribution(userId: string): Promise<string> {
        try {
            // Get platform profiles
            const platformProfiles = await prisma.platformProfile.findMany({
                where: { userId },
                select: { platform: true, handle: true }
            });

            // Get all accepted submissions with problem tags
            const submissions = await prisma.submission.findMany({
                where: {
                    userId,
                    verdict: { in: ['AC', 'OK'] }
                },
                include: {
                    problem: {
                        select: { tags: true, name: true, difficulty: true }
                    }
                }
            });

            const topicAnalysis: { [topic: string]: { total: number; leetcode: number; codeforces: number; category?: string } } = {};

            // Analyze from submission data
            submissions.forEach(submission => {
                submission.problem.tags.forEach((tag: string) => {
                    if (!topicAnalysis[tag]) {
                        topicAnalysis[tag] = {
                            total: 0,
                            leetcode: 0,
                            codeforces: 0,
                        };
                    }

                    if (submission.platform === 'leetcode') {
                        topicAnalysis[tag].leetcode++;
                    } else {
                        topicAnalysis[tag].codeforces++;
                    }
                    topicAnalysis[tag].total++;
                });
            });

            // Enhanced analysis with LeetCode Skills API
            const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
            if (leetcodeProfile?.handle) {
                try {
                    // Import LeetCode service dynamically
                    const { LeetCodeService } = await import('./leetcodeService');
                    const leetcodeService = new LeetCodeService();
                    
                    const skillsData = await leetcodeService.getUserSkillStats(leetcodeProfile.handle);
                    
                    if (skillsData?.matchedUser?.tagProblemCounts) {
                        const tagProblemCounts = skillsData.matchedUser.tagProblemCounts;
                        
                        // Process all skill categories
                        ['fundamental', 'intermediate', 'advanced'].forEach(category => {
                            if (tagProblemCounts[category]) {
                                tagProblemCounts[category].forEach((skillTag: any) => {
                                    const tagName = skillTag.tagName;
                                    const problemsSolved = skillTag.problemsSolved;
                                    
                                    if (!topicAnalysis[tagName]) {
                                        topicAnalysis[tagName] = {
                                            total: 0,
                                            leetcode: 0,
                                            codeforces: 0,
                                            category: category
                                        };
                                    }
                                    
                                    // Update with accurate LeetCode data
                                    topicAnalysis[tagName].leetcode = problemsSolved;
                                    topicAnalysis[tagName].total = topicAnalysis[tagName].codeforces + problemsSolved;
                                    topicAnalysis[tagName].category = category;
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.warn('Could not fetch LeetCode skills data for DSA analysis:', error);
                }
            }

            // Filter out daily-activity topics and sort by frequency
            const filteredTopics = Object.entries(topicAnalysis)
                .filter(([topic]) => !topic.includes('daily-activity') && topic.length > 1)
                .sort(([, a], [, b]) => b.total - a.total);

            if (filteredTopics.length === 0) {
                return 'No DSA topic data available yet.';
            }

            // Build DSA distribution string
            let dsaDistribution = `DSA Topic Distribution (Total: ${filteredTopics.length} topics):

Strong Areas (Top 10):`;

            const topTopics = filteredTopics.slice(0, 10);
            topTopics.forEach(([topic, data]) => {
                const categoryLabel = data.category ? ` (${data.category})` : '';
                dsaDistribution += `\n- ${topic}: ${data.total} problems${categoryLabel}`;
                if (data.leetcode > 0 && data.codeforces > 0) {
                    dsaDistribution += ` [LC: ${data.leetcode}, CF: ${data.codeforces}]`;
                }
            });

            // Identify weak areas (topics with low problem counts)
            const weakAreas = filteredTopics.filter(([, data]) => data.total < 5).slice(0, 8);
            if (weakAreas.length > 0) {
                dsaDistribution += `\n\nWeaker Areas (need more practice):`;
                weakAreas.forEach(([topic, data]) => {
                    const categoryLabel = data.category ? ` (${data.category})` : '';
                    dsaDistribution += `\n- ${topic}: ${data.total} problems${categoryLabel}`;
                });
            }

            // Category breakdown
            const categoryBreakdown = filteredTopics.reduce((acc, [, data]) => {
                if (data.category) {
                    acc[data.category] = (acc[data.category] || 0) + data.total;
                }
                return acc;
            }, {} as Record<string, number>);

            if (Object.keys(categoryBreakdown).length > 0) {
                dsaDistribution += `\n\nSkill Level Distribution:`;
                Object.entries(categoryBreakdown).forEach(([category, count]) => {
                    dsaDistribution += `\n- ${category}: ${count} problems`;
                });
            }

            return dsaDistribution;

        } catch (error) {
            console.error('Error getting DSA topic distribution:', error);
            return 'DSA topic analysis temporarily unavailable.';
        }
    }

    /**
     * Assess user's skill level based on their activity and ratings
     */
    private static getSkillLevelAssessment(totalSubmissions: number, platformProfiles: any[], contestParticipation: any[]): string {
        const leetcodeProfile = platformProfiles.find(p => p.platform === 'leetcode');
        const codeforcesProfile = platformProfiles.find(p => p.platform === 'codeforces');
        
        let assessment = '';
        
        // Determine skill level based on submissions and ratings
        if (totalSubmissions < 50) {
            assessment = 'BEGINNER LEVEL - Focus on fundamentals and building consistent practice habits';
        } else if (totalSubmissions < 200) {
            assessment = 'INTERMEDIATE LEVEL - Balance weak areas with strengthening moderate areas';
        } else {
            assessment = 'ADVANCED LEVEL - Focus on optimization and advanced concepts';
        }
        
        // Add rating-based assessment
        if (leetcodeProfile?.currentRating) {
            if (leetcodeProfile.currentRating < 1400) {
                assessment += '\n- LeetCode Rating suggests focusing on easy to medium problems';
            } else if (leetcodeProfile.currentRating < 1800) {
                assessment += '\n- LeetCode Rating suggests targeting medium to hard problems';
            } else {
                assessment += '\n- LeetCode Rating suggests advanced problem-solving and contest strategies';
            }
        }
        
        if (codeforcesProfile?.currentRating) {
            if (codeforcesProfile.currentRating < 1200) {
                assessment += '\n- Codeforces Rating suggests working on implementation and basic algorithms';
            } else if (codeforcesProfile.currentRating < 1600) {
                assessment += '\n- Codeforces Rating suggests focusing on common patterns and data structures';
            } else {
                assessment += '\n- Codeforces Rating suggests advanced algorithms and optimization techniques';
            }
        }
        
        // Contest participation assessment
        if (contestParticipation.length === 0) {
            assessment += '\n- No contest participation - recommend starting with virtual contests';
        } else if (contestParticipation.length < 5) {
            assessment += '\n- Limited contest experience - increase participation for better ranking improvement';
        } else {
            assessment += '\n- Active contest participant - focus on consistency and time management';
        }
        
        return assessment;
    }

    /**
     * Get total problems solved from DSA analysis (matching dashboard calculation)
     */
    private static async getTotalProblemsFromDSA(userId: string): Promise<number> {
        try {
            // Get all submissions (matching dashboard service logic)
            const submissions = await prisma.submission.findMany({
                where: { userId },
                include: {
                    problem: {
                        select: { externalId: true, tags: true }
                    }
                }
            });

            // Count unique problems using same logic as dashboard service
            const solvedProblems = new Set();

            submissions
                .filter(sub => {
                    // Handle different verdict formats for different platforms
                    if (sub.platform === 'leetcode') {
                        return sub.verdict === 'AC' || sub.verdict === 'Accepted';
                    } else if (sub.platform === 'codeforces') {
                        return sub.verdict === 'OK';
                    }
                    return sub.verdict === 'AC' || sub.verdict === 'OK' || sub.verdict === 'Accepted';
                })
                // Exclude daily activity problems (they're only for tracking active days, not actual solved problems)
                .filter(sub => !sub.problem.tags?.includes('daily-activity'))
                .forEach(submission => {
                    const problemKey = `${submission.platform}-${submission.problem.externalId}`;
                    solvedProblems.add(problemKey);
                });

            return solvedProblems.size;
        } catch (error) {
            console.error('Error getting total problems count:', error);
            return 0;
        }
    }

    /**
     * Get user context for personalized chat responses
     */
    private static async  getUserContext(userId: string): Promise<string> {
        try {
            // Get user's basic info
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { firstName: true, email: true }
            });

            // Get platform profiles
            const platformProfiles = await prisma.platformProfile.findMany({
                where: { userId },
                select: { platform: true, handle: true, currentRating: true, maxRating: true, rank: true }
            });

            // Get recent submissions (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentSubmissions = await prisma.submission.findMany({
                where: {
                    userId,
                    timestamp: { gte: thirtyDaysAgo }
                },
                include: { problem: true },
                orderBy: { timestamp: 'desc' },
                take: 20
            });

            // Get contest participation
            const contestParticipation = await prisma.contestParticipation.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 10
            });

            // Get DSA topic distribution
            const dsaDistribution = await this.getDSATopicDistribution(userId);
            
            // Calculate total problems solved from DSA data
            const totalProblemsSolved = await this.getTotalProblemsFromDSA(userId);
            console.log(`🎯 Chatbot: Total problems solved for user ${userId}: ${totalProblemsSolved}`);

            // Build context string with comprehensive profile analysis
            let context = `USER PROFILE ANALYSIS:

Basic Info:
- Name: ${user?.firstName || 'User'}
- Platforms: ${platformProfiles.map(p =>
                `${p.platform} (${p.handle}${p.currentRating ? `, Current Rating: ${p.currentRating}` : ''}${p.maxRating ? `, Max Rating: ${p.maxRating}` : ''}${p.rank ? `, Rank: ${p.rank}` : ''})`
            ).join(', ')}

OVERALL PROGRESS:
- Total Problems Solved: ${totalProblemsSolved}
- Recent Activity: ${recentSubmissions.length} submissions in last 30 days

SKILL LEVEL ASSESSMENT:
${this.getSkillLevelAssessment(totalProblemsSolved, platformProfiles, contestParticipation)}

Recent Activity Details:
- Total submissions: ${recentSubmissions.length}
- Accepted solutions: ${recentSubmissions.filter(s => s.verdict === 'AC' || s.verdict === 'OK').length}
- Success rate: ${recentSubmissions.length > 0 ? Math.round((recentSubmissions.filter(s => s.verdict === 'AC' || s.verdict === 'OK').length / recentSubmissions.length) * 100) : 0}%`;

            if (recentSubmissions.length > 0) {
                const problemDifficulties = recentSubmissions
                    .filter(s => s.problem.difficulty)
                    .map(s => s.problem.difficulty!);

                const difficultyCount = problemDifficulties.reduce((acc, diff) => {
                    acc[diff] = (acc[diff] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                context += `
- Problem difficulties: ${Object.entries(difficultyCount).map(([diff, count]) => `${diff}: ${count}`).join(', ')}`;
            }

            if (contestParticipation.length > 0) {
                context += `
- Recent contests: ${contestParticipation.length}
- Best contest rank: ${Math.min(...contestParticipation.filter(c => c.rank).map(c => c.rank!))}`;
            }

            // Add DSA topic distribution
            context += `\n\n${dsaDistribution}`;

            return context;

        } catch (error) {
            console.error('Error getting user context:', error);
            return 'User context unavailable';
        }
    }

    /**
     * Generate system prompt for the AI mentor
     */
    private static getSystemPrompt(userContext: string): string {
        return `You are an AI Mentor for CodeTrail, a platform that helps users track their coding progress across LeetCode and Codeforces. You are knowledgeable, encouraging, and provide actionable advice ONLY about coding, programming, algorithms, data structures, and competitive programming.

User Context:
${userContext}

Your role:
1. Help users analyze their coding progress and identify areas for improvement
2. Provide personalized study recommendations based on their DSA topic distribution
3. Suggest specific problems and practice routines for weak areas with DIRECT LINKS
4. Motivate users and help them overcome coding challenges
5. Answer questions about algorithms, data structures, and competitive programming
6. Use the DSA topic analysis to give targeted advice about which topics to focus on next

IMPORTANT PROBLEM RECOMMENDATION FORMAT:
When suggesting specific problems to practice, ALWAYS provide direct clickable links in this format:

For LeetCode problems:
- [Problem Name](https://leetcode.com/problems/problem-slug/) - Brief description
Example: [Two Sum](https://leetcode.com/problems/two-sum/) - Classic array problem for beginners

For Codeforces problems:
- [Problem Name](https://codeforces.com/problem/CONTEST/PROBLEM) - Brief description  
Example: [A + B Problem](https://codeforces.com/problem/1/A) - Basic input/output practice

SPECIFIC PROBLEM SUGGESTIONS BY TOPIC:

**Arrays (Beginner):**
- [Two Sum](https://leetcode.com/problems/two-sum/) - Hash map fundamentals
- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) - Single pass optimization
- [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) - Set operations

**Arrays (Intermediate):**
- [3Sum](https://leetcode.com/problems/3sum/) - Two pointer technique
- [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) - Prefix/suffix arrays
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - Kadane's algorithm

**Strings (Beginner):**
- [Valid Anagram](https://leetcode.com/problems/valid-anagram/) - Character counting
- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) - Two pointers
- [Reverse String](https://leetcode.com/problems/reverse-string/) - In-place operations

**Linked Lists:**
- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) - Pointer manipulation
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) - Merging technique
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) - Floyd's cycle detection

**Trees (Beginner):**
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) - DFS/BFS basics
- [Same Tree](https://leetcode.com/problems/same-tree/) - Tree comparison
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) - Tree manipulation

**Dynamic Programming (Beginner):**
- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) - Basic DP concept
- [House Robber](https://leetcode.com/problems/house-robber/) - State transitions
- [Coin Change](https://leetcode.com/problems/coin-change/) - Bottom-up DP

**Graphs (Beginner):**
- [Number of Islands](https://leetcode.com/problems/number-of-islands/) - DFS/BFS on grid
- [Clone Graph](https://leetcode.com/problems/clone-graph/) - Graph traversal
- [Course Schedule](https://leetcode.com/problems/course-schedule/) - Topological sort

**Binary Search:**
- [Binary Search](https://leetcode.com/problems/binary-search/) - Basic template
- [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) - Modified binary search
- [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) - Array rotation

**Codeforces Practice by Rating:**
- **800-900 Rating:** [Watermelon](https://codeforces.com/problem/4/A), [Way Too Long Words](https://codeforces.com/problem/71/A)
- **1000-1100 Rating:** [Petya and Strings](https://codeforces.com/problem/112/A), [Team](https://codeforces.com/problem/231/A)
- **1200-1300 Rating:** [Dubstep](https://codeforces.com/problem/208/A), [Puzzles](https://codeforces.com/problem/337/A)

CRITICAL ANALYSIS REQUIREMENT:
For EVERY question asked, you MUST first analyze the user's complete coding profile including:
- Current contest ratings (LeetCode/Codeforces)
- Total problems solved and difficulty distribution
- DSA topic strengths (topics with >10 problems) vs weaknesses (topics with <5 problems)
- Recent activity and submission patterns
- Contest participation history
- Skill level distribution (fundamental/intermediate/advanced)

Based on this analysis, provide recommendations that match their current level:

BEGINNER PROFILE (0-100 problems, low ratings):
- Focus on fundamentals (Arrays, Strings, Basic Math)
- Suggest easy problems and pattern recognition
- Build consistent practice habits
- Avoid advanced topics until basics are solid

INTERMEDIATE PROFILE (100-500 problems, moderate ratings):
- Balance weak areas with strengthening moderate areas
- Introduce intermediate concepts (DP, Graphs, Trees)
- Focus on contest strategy and time management
- Target specific weak topics for improvement

ADVANCED PROFILE (500+ problems, high ratings):
- Focus on advanced concepts and optimization
- Suggest hard problems in strong areas
- Work on speed and advanced patterns
- Prepare for challenging contests and interviews

IMPORTANT BOUNDARIES:
- ONLY respond to questions related to coding, programming, algorithms, data structures, competitive programming, LeetCode, Codeforces, software development, and career advice in tech
- If a user asks about anything unrelated to coding/programming (like general life advice, other subjects, random topics, etc.), politely redirect them by saying: "I'm your coding mentor and can only help with programming, algorithms, data structures, and competitive programming questions. Let's focus on improving your coding skills! Is there anything about your DSA progress or coding practice you'd like to discuss?"
- Always stay focused on the user's coding journey and technical improvement

Guidelines:
- ALWAYS start by analyzing their profile data before giving recommendations
- Be encouraging and supportive but realistic about their current level
- Provide specific, actionable advice based on their actual DSA topic strengths and weaknesses
- Reference specific numbers from their profile (e.g., "Since you've solved 130 array problems...")
- Suggest practice strategies based on their weak areas (topics with <5 problems solved)
- **ALWAYS include direct clickable links when recommending specific problems**
- Use the problem link format above for all problem suggestions
- Recommend appropriate difficulty level based on their total solved count and ratings
- Keep responses concise but helpful (2-4 paragraphs max)
- Focus on practical coding improvement strategies
- If recommending topics to practice, prioritize based on their current skill gaps and level
- Consider the difficulty distribution (fundamental/intermediate/advanced) when giving advice
- If the question is not about coding/programming, use the redirect message above

Profile-Based Recommendations:
- Strong areas (>10 problems): Suggest harder problems and advanced concepts, but only if they're ready
- Moderate areas (5-10 problems): Recommend consistent practice and pattern recognition
- Weak areas (<5 problems): Suggest starting with fundamentals and easy problems
- No data areas: Recommend based on their overall skill level and experience

Contest Strategy Based on Rating:
- Low rating (0-1200): Focus on implementation and basic algorithms
- Medium rating (1200-1600): Work on common patterns and medium problems
- High rating (1600+): Advanced algorithms and optimization techniques

Remember: You're a specialized coding mentor who MUST analyze the user's actual performance data before every recommendation. Always reference their specific stats and tailor advice to their exact skill level and experience.`;
    }

    /**
     * Send chat message to AI and get response
     */
    static async sendMessage(userId: string, message: string, chatHistory: ChatMessage[] = []): Promise<ChatbotResponse> {
        try {
            // Validate API key is configured
            if (!this.OPENROUTER_API_KEY) {
                console.error('❌ OpenRouter API key not configured');
                return {
                    message: 'AI Mentor service is not properly configured. Please contact support.',
                    isError: true
                };
            }

            // Get user context for personalized responses
            const userContext = await this.getUserContext(userId);
            const systemPrompt = this.getSystemPrompt(userContext);

            // Prepare messages for the API
            const messages = [
                { role: 'system', content: systemPrompt },
                // Include recent chat history (last 10 messages)
                ...chatHistory.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: message }
            ];

            // Call OpenRouter API using fetch (like working example)
            const response = await fetch(this.OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3001',
                    'X-Title': 'CodeTrail AI Mentor',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: ChatbotService.MODEL,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.9,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenRouter API Error:', response.status, errorText);
                throw new Error(`OpenRouter API error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.choices && data.choices[0]) {
                const aiMessage = data.choices[0].message.content;
                return {
                    message: aiMessage,
                    isError: false
                };
            } else {
                throw new Error('Invalid response from AI service');
            }

        } catch (error: any) {
            console.error('Chatbot service error:', error);

            // Handle different types of errors
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                return {
                    message: 'Sorry, the AI mentor is taking too long to respond. Please try again.',
                    isError: true
                };
            }

            if (error.response?.status === 401) {
                return {
                    message: 'AI service authentication failed. Please contact support.',
                    isError: true
                };
            }

            if (error.response?.status === 429) {
                return {
                    message: 'AI mentor is busy right now. Please wait a moment and try again.',
                    isError: true
                };
            }

            return {
                message: 'Sorry, I\'m having trouble responding right now. Please try again later.',
                isError: true
            };
        }
    }

    /**
     * Get suggested conversation starters based on user profile
     */
    static async getSuggestedQuestions(userId: string): Promise<string[]> {
        try {
            const platformProfiles = await prisma.platformProfile.findMany({
                where: { userId },
                select: { platform: true, currentRating: true }
            });

            const hasLeetCode = platformProfiles.some(p => p.platform === 'leetcode');
            const hasCodeforces = platformProfiles.some(p => p.platform === 'codeforces');

            const suggestions = [
                "Analyze my DSA topic strengths and weaknesses",
                "What topics should I focus on based on my progress?",
                "Can you suggest a study plan for my weak areas?",
                "How can I improve my problem-solving speed?",
                "What's the best practice routine for competitive programming?"
            ];

            if (hasLeetCode) {
                suggestions.push("Which LeetCode topics need more practice?");
                suggestions.push("How can I improve my LeetCode performance?");
            }

            if (hasCodeforces) {
                suggestions.push("What's the best strategy to increase my Codeforces rating?");
            }

            // Add DSA-specific suggestions
            suggestions.push("Which advanced topics should I learn next?");
            suggestions.push("How do I balance practicing weak vs strong areas?");

            return suggestions.slice(0, 8); // Return max 8 suggestions

        } catch (error) {
            console.error('Error getting suggested questions:', error);
            return [
                "Analyze my DSA topic distribution",
                "What should I practice next?",
                "Can you help me with my progress?",
                "What are good problem-solving strategies?",
                "How can I improve my coding skills?",
                "What topics need more attention?"
            ];
        }
    }

    /**
     * Send chat message to AI and get streaming response
     */
    static async sendMessageStream(userId: string, message: string, chatHistory: ChatMessage[] = []): Promise<Response> {
        try {
            // Validate API key is configured
            if (!this.OPENROUTER_API_KEY) {
                console.error('❌ OpenRouter API key not configured');
                throw new Error('AI Mentor service is not properly configured');
            }

            // Get user context for personalized responses
            const userContext = await this.getUserContext(userId);
            const systemPrompt = this.getSystemPrompt(userContext);

            // Prepare messages for the API
            const messages = [
                { role: 'system', content: systemPrompt },
                // Include recent chat history (last 10 messages)
                ...chatHistory.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: message }
            ];

            // Call OpenRouter API with streaming (like working example)
            const response = await fetch(this.OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3001',
                    'X-Title': 'CodeTrail AI Mentor',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: ChatbotService.MODEL,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.9,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }

            return response;

        } catch (error: any) {
            console.error('Chatbot streaming service error:', error);
            throw error;
        }
    }
}
