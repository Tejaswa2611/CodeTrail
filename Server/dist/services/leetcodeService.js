"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeService = exports.LeetCodeService = void 0;
const axios_1 = __importDefault(require("axios"));
const queries_1 = require("../utils/leetcode/queries");
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
        const data = await this.queryLeetCodeAPI(queries_1.getUserProfileQuery, { username });
        return data.data;
    }
    async getUserSkillStats(username) {
        const data = await this.queryLeetCodeAPI(queries_1.skillStatsQuery, { username });
        return data.data;
    }
    async getUserContestRanking(username) {
        const data = await this.queryLeetCodeAPI(queries_1.userContestRankingInfoQuery, { username });
        return data.data;
    }
    async getUserCalendar(username, year) {
        const data = await this.queryLeetCodeAPI(queries_1.userProfileCalendarQuery, { username, year });
        return data.data;
    }
    async getUserQuestionProgress(userSlug) {
        const data = await this.queryLeetCodeAPI(queries_1.userProfileUserQuestionProgressV2Query, { userSlug });
        return data.data;
    }
    async getProblem(titleSlug) {
        const data = await this.queryLeetCodeAPI(queries_1.selectQuestion, { titleSlug });
        return data.data;
    }
    async getDailyProblem() {
        const data = await this.queryLeetCodeAPI(queries_1.dailyQuestion);
        return data.data;
    }
    async getProblems(categorySlug = '', limit = 50, skip = 0, filters = {}) {
        const data = await this.queryLeetCodeAPI(queries_1.problemListQuery, {
            categorySlug,
            limit,
            skip,
            filters
        });
        return data.data;
    }
    async getDiscussion(topicId) {
        const data = await this.queryLeetCodeAPI(queries_1.discussTopicQuery, { topicId });
        return data.data;
    }
    async getDiscussionComments(topicId, orderBy = 'newest_to_oldest', pageNo = 1, numPerPage = 10) {
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
