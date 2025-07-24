import axios from 'axios';
import {
    getUserProfileQuery,
    skillStatsQuery,
    userContestRankingInfoQuery,
    userProfileCalendarQuery,
    userProfileUserQuestionProgressV2Query,
    selectQuestion,
    dailyQuestion,
    problemListQuery,
    discussTopicQuery,
    discussCommentsQuery
} from '../utils/leetcode/queries';
import { CacheService } from './cacheService';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export class LeetCodeService {
    private async queryLeetCodeAPI(query: string, variables: any = {}) {
        try {
            const response = await axios.post(LEETCODE_API_URL, {
                query,
                variables
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(`Error from LeetCode API: ${error.response.data}`);
            } else if (error.request) {
                throw new Error('No response received from LeetCode API');
            } else {
                throw new Error(`Error in setting up the request: ${error.message}`);
            }
        }
    }

    async getUserProfile(username: string) {
        // Check cache first
        const cached = await CacheService.getLeetCodeProfile(username);
        if (cached) {
            console.log(`🚀 LeetCode Profile Cache HIT for: ${username}`);
            return cached;
        }

        console.log(`🔄 LeetCode Profile Cache MISS for: ${username}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(getUserProfileQuery, { username });
        const result = data.data;
        
        // Cache the result
        await CacheService.setLeetCodeProfile(username, result);
        
        return result;
    }

    async getUserSkillStats(username: string) {
        // Check cache first
        const cached = await CacheService.getLeetCodeSkills(username);
        if (cached) {
            console.log(`🚀 LeetCode Skills Cache HIT for: ${username}`);
            return cached;
        }

        console.log(`🔄 LeetCode Skills Cache MISS for: ${username}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(skillStatsQuery, { username });
        const result = data.data;
        
        // Cache the result
        await CacheService.setLeetCodeSkills(username, result);
        
        return result;
    }

    async getUserContestRanking(username: string) {
        // Check cache first
        const cached = await CacheService.getLeetCodeContest(username);
        if (cached) {
            console.log(`🚀 LeetCode Contest Cache HIT for: ${username}`);
            return cached;
        }

        console.log(`🔄 LeetCode Contest Cache MISS for: ${username}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(userContestRankingInfoQuery, { username });
        const result = data.data;
        
        // Cache the result
        await CacheService.setLeetCodeContest(username, result);
        
        return result;
    }

    async getUserCalendar(username: string, year: number) {
        // Check cache first
        const cached = await CacheService.getLeetCodeCalendar(username, year);
        if (cached) {
            console.log(`🚀 LeetCode Calendar Cache HIT for: ${username}:${year}`);
            return cached;
        }

        console.log(`🔄 LeetCode Calendar Cache MISS for: ${username}:${year}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(userProfileCalendarQuery, { username, year });
        const result = data.data;
        
        // Cache the result (longer TTL since calendar changes daily)
        await CacheService.setLeetCodeCalendar(username, year, result);
        
        return result;
    }

    async getUserQuestionProgress(userSlug: string) {
        // Check cache first
        const cached = await CacheService.getLeetCodeProgress(userSlug);
        if (cached) {
            console.log(`🚀 LeetCode Progress Cache HIT for: ${userSlug}`);
            return cached;
        }

        console.log(`🔄 LeetCode Progress Cache MISS for: ${userSlug}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(userProfileUserQuestionProgressV2Query, { userSlug });
        const result = data.data;
        
        // Cache the result
        await CacheService.setLeetCodeProgress(userSlug, result);
        
        return result;
    }

    async getProblem(titleSlug: string) {
        // Check cache first
        const cached = await CacheService.getLeetCodeProblem(titleSlug);
        if (cached) {
            console.log(`🚀 LeetCode Problem Cache HIT for: ${titleSlug}`);
            return cached;
        }

        console.log(`🔄 LeetCode Problem Cache MISS for: ${titleSlug}, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(selectQuestion, { titleSlug });
        const result = data.data;
        
        // Cache the result (long TTL since problems are static)
        await CacheService.setLeetCodeProblem(titleSlug, result);
        
        return result;
    }

    async getDailyProblem() {
        // Check cache first
        const cached = await CacheService.getLeetCodeDaily();
        if (cached) {
            console.log(`🚀 LeetCode Daily Problem Cache HIT`);
            return cached;
        }

        console.log(`🔄 LeetCode Daily Problem Cache MISS, fetching from API...`);
        
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(dailyQuestion);
        const result = data.data;
        
        // Cache the result (24 hour TTL since it's daily)
        await CacheService.setLeetCodeDaily(result);
        
        return result;
    }

    async getProblems(categorySlug: string = '', limit: number = 50, skip: number = 0, filters: any = {}) {
        // For problems list, we don't cache as much since it can vary by parameters
        // But we could implement more sophisticated caching here if needed
        console.log(`🔄 LeetCode Problems fetching from API (not cached due to dynamic parameters)`);
        
        const data = await this.queryLeetCodeAPI(problemListQuery, {
            categorySlug,
            limit,
            skip,
            filters
        });
        return data.data;
    }

    async getDiscussion(topicId: number) {
        // Discussions are dynamic content, not cached
        console.log(`🔄 LeetCode Discussion fetching from API (not cached - dynamic content)`);
        
        const data = await this.queryLeetCodeAPI(discussTopicQuery, { topicId });
        return data.data;
    }

    async getDiscussionComments(topicId: number, orderBy: string = 'newest_to_oldest', pageNo: number = 1, numPerPage: number = 10) {
        // Comments are dynamic content, not cached
        console.log(`🔄 LeetCode Discussion Comments fetching from API (not cached - dynamic content)`);
        
        const data = await this.queryLeetCodeAPI(discussCommentsQuery, {
            topicId,
            orderBy,
            pageNo,
            numPerPage
        });
        return data.data;
    }
}

export const leetCodeService = new LeetCodeService();
