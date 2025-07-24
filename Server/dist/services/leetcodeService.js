"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeService = exports.LeetCodeService = void 0;
const axios_1 = __importDefault(require("axios"));
const queries_1 = require("../utils/leetcode/queries");
const cacheService_1 = require("./cacheService");
const LEETCODE_API_URL = 'https://leetcode.com/graphql';
class LeetCodeService {
    async queryLeetCodeAPI(query, variables = {}) {
        try {
            const response = await axios_1.default.post(LEETCODE_API_URL, {
                query,
                variables
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Error from LeetCode API: ${error.response.data}`);
            }
            else if (error.request) {
                throw new Error('No response received from LeetCode API');
            }
            else {
                throw new Error(`Error in setting up the request: ${error.message}`);
            }
        }
    }
    async getUserProfile(username) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeProfile(username);
        if (cached) {
            console.log(`🚀 LeetCode Profile Cache HIT for: ${username}`);
            return cached;
        }
        console.log(`🔄 LeetCode Profile Cache MISS for: ${username}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.getUserProfileQuery, { username });
        const result = data.data;
        // Cache the result
        await cacheService_1.CacheService.setLeetCodeProfile(username, result);
        return result;
    }
    async getUserSkillStats(username) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeSkills(username);
        if (cached) {
            console.log(`🚀 LeetCode Skills Cache HIT for: ${username}`);
            return cached;
        }
        console.log(`🔄 LeetCode Skills Cache MISS for: ${username}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.skillStatsQuery, { username });
        const result = data.data;
        // Cache the result
        await cacheService_1.CacheService.setLeetCodeSkills(username, result);
        return result;
    }
    async getUserContestRanking(username) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeContest(username);
        if (cached) {
            console.log(`🚀 LeetCode Contest Cache HIT for: ${username}`);
            return cached;
        }
        console.log(`🔄 LeetCode Contest Cache MISS for: ${username}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.userContestRankingInfoQuery, { username });
        const result = data.data;
        // Cache the result
        await cacheService_1.CacheService.setLeetCodeContest(username, result);
        return result;
    }
    async getUserCalendar(username, year) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeCalendar(username, year);
        if (cached) {
            console.log(`🚀 LeetCode Calendar Cache HIT for: ${username}:${year}`);
            return cached;
        }
        console.log(`🔄 LeetCode Calendar Cache MISS for: ${username}:${year}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.userProfileCalendarQuery, { username, year });
        const result = data.data;
        // Cache the result (longer TTL since calendar changes daily)
        await cacheService_1.CacheService.setLeetCodeCalendar(username, year, result);
        return result;
    }
    async getUserQuestionProgress(userSlug) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeProgress(userSlug);
        if (cached) {
            console.log(`🚀 LeetCode Progress Cache HIT for: ${userSlug}`);
            return cached;
        }
        console.log(`🔄 LeetCode Progress Cache MISS for: ${userSlug}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.userProfileUserQuestionProgressV2Query, { userSlug });
        const result = data.data;
        // Cache the result
        await cacheService_1.CacheService.setLeetCodeProgress(userSlug, result);
        return result;
    }
    async getProblem(titleSlug) {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeProblem(titleSlug);
        if (cached) {
            console.log(`🚀 LeetCode Problem Cache HIT for: ${titleSlug}`);
            return cached;
        }
        console.log(`🔄 LeetCode Problem Cache MISS for: ${titleSlug}, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.selectQuestion, { titleSlug });
        const result = data.data;
        // Cache the result (long TTL since problems are static)
        await cacheService_1.CacheService.setLeetCodeProblem(titleSlug, result);
        return result;
    }
    async getDailyProblem() {
        // Check cache first
        const cached = await cacheService_1.CacheService.getLeetCodeDaily();
        if (cached) {
            console.log(`🚀 LeetCode Daily Problem Cache HIT`);
            return cached;
        }
        console.log(`🔄 LeetCode Daily Problem Cache MISS, fetching from API...`);
        // Fetch from API if not cached
        const data = await this.queryLeetCodeAPI(queries_1.dailyQuestion);
        const result = data.data;
        // Cache the result (24 hour TTL since it's daily)
        await cacheService_1.CacheService.setLeetCodeDaily(result);
        return result;
    }
    async getProblems(categorySlug = '', limit = 50, skip = 0, filters = {}) {
        // For problems list, we don't cache as much since it can vary by parameters
        // But we could implement more sophisticated caching here if needed
        console.log(`🔄 LeetCode Problems fetching from API (not cached due to dynamic parameters)`);
        const data = await this.queryLeetCodeAPI(queries_1.problemListQuery, {
            categorySlug,
            limit,
            skip,
            filters
        });
        return data.data;
    }
    async getDiscussion(topicId) {
        // Discussions are dynamic content, not cached
        console.log(`🔄 LeetCode Discussion fetching from API (not cached - dynamic content)`);
        const data = await this.queryLeetCodeAPI(queries_1.discussTopicQuery, { topicId });
        return data.data;
    }
    async getDiscussionComments(topicId, orderBy = 'newest_to_oldest', pageNo = 1, numPerPage = 10) {
        // Comments are dynamic content, not cached
        console.log(`🔄 LeetCode Discussion Comments fetching from API (not cached - dynamic content)`);
        const data = await this.queryLeetCodeAPI(queries_1.discussCommentsQuery, {
            topicId,
            orderBy,
            pageNo,
            numPerPage
        });
        return data.data;
    }
}
exports.LeetCodeService = LeetCodeService;
exports.leetCodeService = new LeetCodeService();
