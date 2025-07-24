import { RedisService } from './redisService';

/**
 * Cache service with intelligent TTL strategies for different data types
 */
export class CacheService {
    // Cache key prefixes for organization
    private static readonly PREFIXES = {
        LEETCODE_PROFILE: 'lc:profile',
        LEETCODE_CALENDAR: 'lc:calendar',
        LEETCODE_CONTEST: 'lc:contest',
        LEETCODE_SKILLS: 'lc:skills',
        LEETCODE_PROGRESS: 'lc:progress',
        LEETCODE_PROBLEM: 'lc:problem',
        LEETCODE_DAILY: 'lc:daily',
        CODEFORCES_INFO: 'cf:info',
        CODEFORCES_STATUS: 'cf:status',
        CODEFORCES_RATING: 'cf:rating',
        CODEFORCES_PROBLEMS: 'cf:problems',
        DASHBOARD_STATS: 'dash:stats',
        AI_CONTEXT: 'ai:context',
        // Analytics-specific prefixes
        ANALYTICS_DATA: 'analytics:data',
        ANALYTICS_PROGRESS: 'analytics:progress',
        ANALYTICS_METRICS: 'analytics:metrics',
        ANALYTICS_TRENDS: 'analytics:trends',
    };

    // TTL strategies (in seconds)
    private static readonly TTL = {
        VERY_SHORT: 60,        // 1 minute - for rapidly changing data
        SHORT: 300,            // 5 minutes - for user profiles, recent activity
        MEDIUM: 900,           // 15 minutes - for contest data, skills
        LONG: 3600,            // 1 hour - for calendar data, problem lists
        VERY_LONG: 86400,      // 24 hours - for static content, daily problems
        DASHBOARD: 900,        // 15 minutes - for dashboard stats
        AI_CONTEXT: 1800,      // 30 minutes - for AI context
        // Analytics-specific TTL
        ANALYTICS_DATA: 600,   // 10 minutes - for comprehensive analytics data
        ANALYTICS_PROGRESS: 300, // 5 minutes - for progress metrics
        ANALYTICS_TRENDS: 900, // 15 minutes - for trend analysis
    };

    /**
     * LeetCode Profile Caching
     */
    static async getLeetCodeProfile(username: string): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_PROFILE}:${username}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeProfile(username: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_PROFILE}:${username}`;
        return await RedisService.set(key, data, this.TTL.SHORT);
    }

    /**
     * LeetCode Calendar Caching (longer TTL since it changes daily)
     */
    static async getLeetCodeCalendar(username: string, year: number): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_CALENDAR}:${username}:${year}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeCalendar(username: string, year: number, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_CALENDAR}:${username}:${year}`;
        return await RedisService.set(key, data, this.TTL.LONG);
    }

    /**
     * LeetCode Contest Ranking Caching
     */
    static async getLeetCodeContest(username: string): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_CONTEST}:${username}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeContest(username: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_CONTEST}:${username}`;
        return await RedisService.set(key, data, this.TTL.MEDIUM);
    }

    /**
     * LeetCode Skills Caching
     */
    static async getLeetCodeSkills(username: string): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_SKILLS}:${username}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeSkills(username: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_SKILLS}:${username}`;
        return await RedisService.set(key, data, this.TTL.MEDIUM);
    }

    /**
     * LeetCode Question Progress Caching
     */
    static async getLeetCodeProgress(username: string): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_PROGRESS}:${username}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeProgress(username: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_PROGRESS}:${username}`;
        return await RedisService.set(key, data, this.TTL.SHORT);
    }

    /**
     * LeetCode Problem Caching (static content)
     */
    static async getLeetCodeProblem(titleSlug: string): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_PROBLEM}:${titleSlug}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeProblem(titleSlug: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_PROBLEM}:${titleSlug}`;
        return await RedisService.set(key, data, this.TTL.VERY_LONG);
    }

    /**
     * LeetCode Daily Problem Caching
     */
    static async getLeetCodeDaily(): Promise<any | null> {
        const key = `${this.PREFIXES.LEETCODE_DAILY}:${new Date().toISOString().split('T')[0]}`;
        return await RedisService.get(key);
    }

    static async setLeetCodeDaily(data: any): Promise<boolean> {
        const key = `${this.PREFIXES.LEETCODE_DAILY}:${new Date().toISOString().split('T')[0]}`;
        return await RedisService.set(key, data, this.TTL.VERY_LONG);
    }

    /**
     * Codeforces User Info Caching
     */
    static async getCodeforcesInfo(handle: string): Promise<any | null> {
        const key = `${this.PREFIXES.CODEFORCES_INFO}:${handle}`;
        return await RedisService.get(key);
    }

    static async setCodeforcesInfo(handle: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.CODEFORCES_INFO}:${handle}`;
        return await RedisService.set(key, data, this.TTL.MEDIUM);
    }

    /**
     * Codeforces User Status Caching
     */
    static async getCodeforcesStatus(handle: string): Promise<any | null> {
        const key = `${this.PREFIXES.CODEFORCES_STATUS}:${handle}`;
        return await RedisService.get(key);
    }

    static async setCodeforcesStatus(handle: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.CODEFORCES_STATUS}:${handle}`;
        return await RedisService.set(key, data, this.TTL.SHORT);
    }

    /**
     * Codeforces Rating Caching
     */
    static async getCodeforcesRating(handle: string): Promise<any | null> {
        const key = `${this.PREFIXES.CODEFORCES_RATING}:${handle}`;
        return await RedisService.get(key);
    }

    static async setCodeforcesRating(handle: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.CODEFORCES_RATING}:${handle}`;
        return await RedisService.set(key, data, this.TTL.LONG);
    }

    /**
     * Codeforces Problems Caching (static content)
     */
    static async getCodeforcesProblems(): Promise<any | null> {
        const key = `${this.PREFIXES.CODEFORCES_PROBLEMS}:all`;
        return await RedisService.get(key);
    }

    static async setCodeforcesProblems(data: any): Promise<boolean> {
        const key = `${this.PREFIXES.CODEFORCES_PROBLEMS}:all`;
        return await RedisService.set(key, data, this.TTL.VERY_LONG);
    }

    /**
     * Dashboard Stats Caching
     */
    static async getDashboardStats(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.DASHBOARD_STATS}:${userId}`;
        return await RedisService.get(key);
    }

    static async setDashboardStats(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.DASHBOARD_STATS}:${userId}`;
        return await RedisService.set(key, data, this.TTL.DASHBOARD);
    }

    /**
     * AI Context Caching
     */
    static async getAIContext(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.AI_CONTEXT}:${userId}`;
        return await RedisService.get(key);
    }

    static async setAIContext(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.AI_CONTEXT}:${userId}`;
        return await RedisService.set(key, data, this.TTL.AI_CONTEXT);
    }

    /**
     * Analytics Data Caching
     */
    static async getAnalyticsData(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.ANALYTICS_DATA}:${userId}`;
        return await RedisService.get(key);
    }

    static async setAnalyticsData(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.ANALYTICS_DATA}:${userId}`;
        return await RedisService.set(key, data, this.TTL.ANALYTICS_DATA);
    }

    /**
     * Analytics Progress Caching
     */
    static async getAnalyticsProgress(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.ANALYTICS_PROGRESS}:${userId}`;
        return await RedisService.get(key);
    }

    static async setAnalyticsProgress(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.ANALYTICS_PROGRESS}:${userId}`;
        return await RedisService.set(key, data, this.TTL.ANALYTICS_PROGRESS);
    }

    /**
     * Analytics Metrics Caching
     */
    static async getAnalyticsMetrics(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.ANALYTICS_METRICS}:${userId}`;
        return await RedisService.get(key);
    }

    static async setAnalyticsMetrics(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.ANALYTICS_METRICS}:${userId}`;
        return await RedisService.set(key, data, this.TTL.ANALYTICS_DATA);
    }

    /**
     * Analytics Trends Caching
     */
    static async getAnalyticsTrends(userId: string): Promise<any | null> {
        const key = `${this.PREFIXES.ANALYTICS_TRENDS}:${userId}`;
        return await RedisService.get(key);
    }

    static async setAnalyticsTrends(userId: string, data: any): Promise<boolean> {
        const key = `${this.PREFIXES.ANALYTICS_TRENDS}:${userId}`;
        return await RedisService.set(key, data, this.TTL.ANALYTICS_TRENDS);
    }

    /**
     * Cache Invalidation Methods
     */

    /**
     * Invalidate all cache for a specific user
     */
    static async invalidateUserCache(userId: string): Promise<void> {
        console.log(`🗑️ Invalidating all cache for user: ${userId}`);
        await Promise.all([
            RedisService.delPattern(`${this.PREFIXES.DASHBOARD_STATS}:${userId}`),
            RedisService.delPattern(`${this.PREFIXES.AI_CONTEXT}:${userId}`),
            RedisService.delPattern(`${this.PREFIXES.ANALYTICS_DATA}:${userId}`),
            RedisService.delPattern(`${this.PREFIXES.ANALYTICS_PROGRESS}:${userId}`),
            RedisService.delPattern(`${this.PREFIXES.ANALYTICS_METRICS}:${userId}`),
            RedisService.delPattern(`${this.PREFIXES.ANALYTICS_TRENDS}:${userId}`),
        ]);
    }

    /**
     * Invalidate cache for a specific platform handle
     */
    static async invalidatePlatformCache(platform: 'leetcode' | 'codeforces', handle: string): Promise<void> {
        console.log(`🗑️ Invalidating ${platform} cache for handle: ${handle}`);
        
        if (platform === 'leetcode') {
            await Promise.all([
                RedisService.delPattern(`${this.PREFIXES.LEETCODE_PROFILE}:${handle}`),
                RedisService.delPattern(`${this.PREFIXES.LEETCODE_CALENDAR}:${handle}:*`),
                RedisService.delPattern(`${this.PREFIXES.LEETCODE_CONTEST}:${handle}`),
                RedisService.delPattern(`${this.PREFIXES.LEETCODE_SKILLS}:${handle}`),
                RedisService.delPattern(`${this.PREFIXES.LEETCODE_PROGRESS}:${handle}`),
            ]);
        } else if (platform === 'codeforces') {
            await Promise.all([
                RedisService.delPattern(`${this.PREFIXES.CODEFORCES_INFO}:${handle}`),
                RedisService.delPattern(`${this.PREFIXES.CODEFORCES_STATUS}:${handle}`),
                RedisService.delPattern(`${this.PREFIXES.CODEFORCES_RATING}:${handle}`),
            ]);
        }
    }

    /**
     * Get cache statistics
     */
    static async getCacheStats(): Promise<any> {
        const redisStats = await RedisService.getStats();
        return {
            redis: redisStats,
            prefixes: this.PREFIXES,
            ttlStrategies: this.TTL,
        };
    }

    /**
     * Health check for cache service
     */
    static async healthCheck(): Promise<{ status: string; redis: boolean; timestamp: string }> {
        const isRedisConnected = await RedisService.isConnected();
        return {
            status: isRedisConnected ? 'healthy' : 'degraded',
            redis: isRedisConnected,
            timestamp: new Date().toISOString(),
        };
    }
} 