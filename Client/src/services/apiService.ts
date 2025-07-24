// API Service for CodeTrail Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Custom error classes for better error handling
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class NetworkError extends Error {
    constructor(message: string, public endpoint?: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Enhanced generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;

    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(fullUrl, {
            ...options,
            signal: controller.signal,
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(
                `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
                response.status,
                endpoint
            );
        }

        const result: ApiResponse<T> = await response.json();

        if (result.success && result.data !== undefined) {
            return result.data;
        } else {
            throw new ApiError(
                result.error || result.message || 'Unknown API error',
                undefined,
                endpoint
            );
        }
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new NetworkError(`Network error accessing ${endpoint}. Please check your connection.`, endpoint);
        }

        if (error.name === 'AbortError') {
            throw new NetworkError(`Request timeout for ${endpoint}. Please try again.`, endpoint);
        }

        if (error instanceof ApiError || error instanceof NetworkError) {
            throw error;
        }

        throw new ApiError(`Unexpected error calling ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, endpoint);
    }
}

// LeetCode API interfaces
export interface LeetCodeProfile {
    allQuestionsCount: Array<{
        difficulty: string;
        count: number;
    }>;
    matchedUser: {
        username: string;
        profile: {
            realName: string;
            aboutMe: string;
            userAvatar: string;
            location: string;
            reputation: number;
            ranking: number;
        };
        submitStats: {
            acSubmissionNum: Array<{
                difficulty: string;
                count: number;
                submissions: number;
            }>;
            totalSubmissionNum: Array<{
                difficulty: string;
                count: number;
                submissions: number;
            }>;
        };
    };
    recentSubmissionList: Array<{
        title: string;
        titleSlug: string;
        timestamp: string;
        statusDisplay: string;
    }>;
}

export interface LeetCodeSkillStats {
    data: {
        matchedUser: {
            tagProblemCounts: {
                advanced: Array<{
                    tagName: string;
                    tagSlug: string;
                    problemsSolved: number;
                }>;
                intermediate: Array<{
                    tagName: string;
                    tagSlug: string;
                    problemsSolved: number;
                }>;
                fundamental: Array<{
                    tagName: string;
                    tagSlug: string;
                    problemsSolved: number;
                }>;
            };
        };
    };
}

export interface LeetCodeContestRanking {
    data: {
        userContestRanking: {
            attendedContestsCount: number;
            rating: number;
            globalRanking: number;
            badge: {
                name: string;
            } | null;
        };
        userContestRankingHistory: Array<{
            attended: boolean;
            trendDirection: string;
            problemsSolved: number;
            totalProblems: number;
            finishTimeInSeconds: number;
            rating: number;
            ranking: number;
            contest: {
                title: string;
                startTime: number;
            };
        }>;
    };
}

export interface LeetCodeCalendar {
    data: {
        matchedUser: {
            userCalendar: {
                submissionCalendar: string; // JSON string of timestamps
                activeYears: number[];
            };
        };
    };
}

export interface LeetCodeProgress {
    data: {
        allQuestionsCount: Array<{
            difficulty: string;
            count: number;
        }>;
        matchedUser: {
            submitStats: {
                acSubmissionNum: Array<{
                    difficulty: string;
                    count: number;
                    submissions: number;
                }>;
            };
        };
    };
}

export interface CodeforcesRating {
    result: Array<{
        contestId: number;
        contestName: string;
        handle: string;
        rank: number;
        ratingUpdateTimeSeconds: number;
        oldRating: number;
        newRating: number;
    }>;
}

// Codeforces API interfaces
export interface CodeforcesUserInfo {
    result: Array<{
        handle: string;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        organization?: string;
        contribution: number;
        rank: string;
        rating: number;
        maxRank: string;
        maxRating: number;
        lastOnlineTimeSeconds: number;
        registrationTimeSeconds: number;
        friendOfCount: number;
        avatar: string;
        titlePhoto: string;
    }>;
}

export interface CodeforcesSolvedStats {
    totalSolved: number;
    byDifficulty: {
        [rating: string]: number;
    };
    uniqueProblems: number;
}

export interface CodeforcesActiveDays {
    activeDays: number;
    submissionDays: string[]; // Array of date strings
}

export interface CodeforcesHeatmap {
    heatmapData: {
        [date: string]: number; // date -> submission count
    };
    maxSubmissions: number;
    totalSubmissions: number;
}

export interface CodeforcesContests {
    totalContests: number;
    ratedContests: number;
    bestRank: number;
    worstRank: number;
}

export interface CodeforcesRatingGraph {
    ratingHistory: Array<{
        contestId: number;
        contestName: string;
        handle: string;
        rank: number;
        ratingUpdateTimeSeconds: number;
        oldRating: number;
        newRating: number;
    }>;
    maxRating: number;
    currentRating: number;
}

export interface CodeforcesTopicAnalysis {
    topicStats: {
        [topic: string]: {
            solved: number;
            attempted: number;
            tags: string[];
        };
    };
    totalUniqueTags: number;
}

// LeetCode API functions
export const leetcodeApi = {
    getUserProfile: (username: string): Promise<LeetCodeProfile | null> =>
        apiCall<LeetCodeProfile>(`/leetcode/user/${username}/profile`),

    getUserSkills: (username: string): Promise<LeetCodeSkillStats | null> =>
        apiCall<LeetCodeSkillStats>(`/leetcode/user/${username}/skills`),

    getUserContest: (username: string): Promise<LeetCodeContestRanking | null> =>
        apiCall<LeetCodeContestRanking>(`/leetcode/user/${username}/contest`),

    getUserCalendar: (username: string, year?: number): Promise<LeetCodeCalendar | null> =>
        apiCall<LeetCodeCalendar>(`/leetcode/user/${username}/calendar${year ? `?year=${year}` : ''}`),

    getUserProgress: (userSlug: string): Promise<LeetCodeProgress | null> =>
        apiCall<LeetCodeProgress>(`/leetcode/user/${userSlug}/progress`),
};

// Codeforces API functions
export const codeforcesApi = {
    getUserInfo: (handle: string): Promise<CodeforcesUserInfo | null> =>
        apiCall<CodeforcesUserInfo>(`/codeforces/user/info/${handle}`),

    getSolvedStats: (handle: string): Promise<CodeforcesSolvedStats | null> =>
        apiCall<CodeforcesSolvedStats>(`/codeforces/user/solved-stats/${handle}`),

    getActiveDays: (handle: string): Promise<CodeforcesActiveDays | null> =>
        apiCall<CodeforcesActiveDays>(`/codeforces/user/active-days/${handle}`),

    getHeatmap: (handle: string): Promise<CodeforcesHeatmap | null> =>
        apiCall<CodeforcesHeatmap>(`/codeforces/user/heatmap/${handle}`),

    getContests: (handle: string): Promise<CodeforcesContests | null> =>
        apiCall<CodeforcesContests>(`/codeforces/user/contests/${handle}`),

    getRatingGraph: (handle: string): Promise<CodeforcesRatingGraph | null> =>
        apiCall<CodeforcesRatingGraph>(`/codeforces/user/rating-graph/${handle}`),

    getTopicAnalysis: (handle: string): Promise<CodeforcesTopicAnalysis | null> =>
        apiCall<CodeforcesTopicAnalysis>(`/codeforces/user/topic-analysis/${handle}`),

    getRating: (handle: string): Promise<CodeforcesRating | null> =>
        apiCall<CodeforcesRating>(`/codeforces/user/rating/${handle}`),
};

// Dashboard API functions
export const dashboardApi = {
    getDashboardStats: (): Promise<DashboardStats | null> =>
        apiCall<DashboardStats>('/dashboard/stats'),

    getDailySubmissions: (): Promise<DailySubmissionsData | null> =>
        apiCall<DailySubmissionsData>('/dashboard/daily-submissions'),

    getUserPlatformProfiles: (): Promise<UserPlatformProfiles | null> =>
        apiCall<UserPlatformProfiles>('/dashboard/user-profiles'),

    updatePlatformHandle: async (platform: string, handle: string): Promise<any> => {
        try {
            console.log(`🔄 Updating platform handle: ${platform} -> ${handle}`);

            const response = await fetch(`${API_BASE_URL}/dashboard/platform-handle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ platform, handle }),
            });

            console.log('🔍 Response status:', response.status);
            console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorData;
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                } else {
                    // If not JSON, get text content (likely HTML error page)
                    const errorText = await response.text();
                    console.error('Non-JSON error response:', errorText);
                    errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
                }

                console.error('API Error:', errorData);
                throw new ApiError(errorData.message || 'Failed to update platform handle', response.status, errorData);
            }

            return await response.json();
        } catch (error) {
            console.error('Network error in updatePlatformHandle:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new NetworkError('Network error while updating platform handle');
        }
    },

    getAICoachTopicAnalysis: (): Promise<any | null> =>
        apiCall<any>('/dashboard/ai-coach-analysis'),
};

// Analytics API functions
export const analyticsApi = {
    getAnalyticsData: (): Promise<any | null> =>
        apiCall<any>('/analytics/data'),

    getCacheStats: (): Promise<any | null> =>
        apiCall<any>('/analytics/cache/stats'),

    invalidateCache: async (): Promise<any | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/analytics/cache`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error invalidating analytics cache:', error);
            throw error;
        }
    },

    healthCheck: (): Promise<any | null> =>
        apiCall<any>('/analytics/health'),
};

// New Dashboard API interfaces matching the backend
export interface DashboardStats {
    totalQuestions: {
        total: number;
        leetcode: number;
        codeforces: number;
        byDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
        platformBreakdown: {
            leetcode: {
                easy: number;
                medium: number;
                hard: number;
            };
            codeforces: {
                easy: number;
                medium: number;
                hard: number;
            };
        };
    };
    totalActiveDays: {
        total: number;
        leetcode: number;
        codeforces: number;
    };
    heatmapData: {
        leetcode: { [date: string]: number };
        codeforces: { [date: string]: number };
        combined: { [date: string]: number };
    };
    totalContests: {
        total: number;
        leetcode: number;
        codeforces: number;
    };
    contestRankings: {
        latest: {
            leetcode?: {
                contestId: string;
                rank: number;
                timestamp: string;
            };
            codeforces?: {
                contestId: string;
                rank: number;
                oldRating: number;
                newRating: number;
                timestamp: string;
            };
        };
        best: {
            leetcode?: {
                contestId: string;
                rank: number;
                timestamp: string;
            };
            codeforces?: {
                contestId: string;
                rank: number;
                oldRating: number;
                newRating: number;
                timestamp: string;
            };
        };
        ratingHistory: {
            leetcode: Array<{
                contestId: string;
                rank: number;
                timestamp: string;
            }>;
            codeforces: Array<{
                contestId: string;
                rank: number;
                oldRating: number;
                newRating: number;
                timestamp: string;
            }>;
        };
    };
    contestHistory: {
        leetcode: Array<{
            platform: string;
            contestId: string;
            rating: number;
            rank: number;
            timestamp: string;
            problemsSolved?: number;
            totalProblems?: number;
        }>;
        codeforces: Array<{
            platform: string;
            contestId: string;
            rating: number;
            oldRating?: number;
            rank: number;
            timestamp: string;
        }>;
        combined: Array<{
            platform: string;
            contestId: string;
            rating: number;
            oldRating?: number;
            rank: number;
            timestamp: string;
            problemsSolved?: number;
            totalProblems?: number;
        }>;
    };
    dsaTopicAnalysis: {
        [topic: string]: {
            total: number;
            leetcode: number;
            codeforces: number;
            problems: string[];
            category?: string;
        };
    };
    userInfo: {
        profile: {
            id: string;
            email: string;
            firstName: string;
            lastName: string | null;
            createdAt: string;
        };
        connectedPlatforms: {
            leetcode?: {
                handle: string;
                syncedAt: string | null;
            };
            codeforces?: {
                handle: string;
                currentRating: number | null;
                maxRating: number | null;
                rank: string | null;
                syncedAt: string | null;
            };
        };
    };
}

export interface UserPlatformProfiles {
    connectedPlatforms: {
        leetcode?: {
            handle: string;
            syncedAt: string | null;
        };
        codeforces?: {
            handle: string;
            currentRating: number | null;
            maxRating: number | null;
            rank: string | null;
            syncedAt: string | null;
        };
    };
}

export interface DailySubmissionsData {
    dailySubmissions: {
        date: string;
        leetcode: number;
        codeforces: number;
        total: number;
    }[];
    totalDays: number;
    dateRange: {
        start: string | null;
        end: string | null;
    };
}

// AI Coach Analysis interface
export interface AICoachAnalysis {
    overallProgress: {
        score: number;
        level: string;
        strongAreas: string[];
        weakAreas: string[];
        improvementTrend: string;
        recentProgress: {
            lastWeekSolved: number;
            lastMonthSolved: number;
            averageWeeklySolved: number;
            consistencyScore: number;
            difficultyProgression: string;
            ratingTrend: {
                codeforces: {
                    current: number | null;
                    change: number;
                    trend: string;
                };
                leetcode: {
                    current: number | null;
                    change: number;
                    trend: string;
                };
            };
        };
    };
    topicAnalysis: Array<{
        topic: string;
        proficiency: number;
        problemsSolved: number;
        totalProblems: number;
        trend: string;
        importance: string;
        companyFrequency: number;
        recommendation: string;
        nextSteps: Array<{
            text: string;
            url: string | null;
            type: 'link' | 'text';
        }>;
        category: string;
        platformBreakdown: {
            leetcode: number;
            codeforces: number;
        };
    }>;
    suggestedQuestions: Array<{
        id: number;
        title: string;
        difficulty: string;
        topic: string;
        platform: string;
        url: string;
        reason: string;
        estimatedTime: string;
        companies: string[];
        priority: string;
    }>;
    totalTopics: number;
    lastUpdated: string;
}

// Chatbot API interfaces
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ChatbotResponse {
    message: string;
    timestamp: string;
}

// Chatbot API functions
export const chatbotApi = {
    sendMessage: async (message: string, chatHistory: ChatMessage[] = []): Promise<ChatbotResponse | null> =>
        apiCall<ChatbotResponse>('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify({ message, chatHistory }),
        }),

    getSuggestedQuestions: (): Promise<{ suggestions: string[] } | null> =>
        apiCall<{ suggestions: string[] }>('/chatbot/suggestions'),
};

// Function to fetch all dashboard data
export async function fetchDashboardData(): Promise<DashboardStats | null> {
    console.log('Fetching comprehensive dashboard data...');

    try {
        const dashboardStats = await dashboardApi.getDashboardStats();

        if (!dashboardStats) {
            throw new ApiError('No dashboard data received', undefined, 'dashboard');
        }

        console.log('Dashboard data fetch completed successfully');
        return dashboardStats;
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
}
