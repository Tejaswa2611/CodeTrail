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
        const data = await this.queryLeetCodeAPI(getUserProfileQuery, { username });
        return data.data;
    }

    async getUserSkillStats(username: string) {
        const data = await this.queryLeetCodeAPI(skillStatsQuery, { username });
        return data.data;
    }

    async getUserContestRanking(username: string) {
        const data = await this.queryLeetCodeAPI(userContestRankingInfoQuery, { username });
        return data.data;
    }

    async getUserCalendar(username: string, year: number) {
        const data = await this.queryLeetCodeAPI(userProfileCalendarQuery, { username, year });
        return data.data;
    }

    async getUserQuestionProgress(userSlug: string) {
        const data = await this.queryLeetCodeAPI(userProfileUserQuestionProgressV2Query, { userSlug });
        return data.data;
    }

    async getProblem(titleSlug: string) {
        const data = await this.queryLeetCodeAPI(selectQuestion, { titleSlug });
        return data.data;
    }

    async getDailyProblem() {
        const data = await this.queryLeetCodeAPI(dailyQuestion);
        return data.data;
    }

    async getProblems(categorySlug: string = '', limit: number = 50, skip: number = 0, filters: any = {}) {
        const data = await this.queryLeetCodeAPI(problemListQuery, {
            categorySlug,
            limit,
            skip,
            filters
        });
        return data.data;
    }

    async getDiscussion(topicId: number) {
        const data = await this.queryLeetCodeAPI(discussTopicQuery, { topicId });
        return data.data;
    }

    async getDiscussionComments(topicId: number, orderBy: string = 'newest_to_oldest', pageNo: number = 1, numPerPage: number = 10) {
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
