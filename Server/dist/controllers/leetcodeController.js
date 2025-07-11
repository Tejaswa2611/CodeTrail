"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetCodeController = exports.LeetCodeController = void 0;
const leetcodeService_1 = require("../services/leetcodeService");
const response_1 = require("../utils/response");
class LeetCodeController {
    async getUserProfile(req, res) {
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json(response_1.ResponseUtils.error('Username is required'));
            }
            const profileData = await leetcodeService_1.leetCodeService.getUserProfile(username);
            return res.status(200).json(response_1.ResponseUtils.success('User profile retrieved successfully', profileData));
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch user profile', error.message));
        }
    }
    async getUserSkillStats(req, res) {
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json(response_1.ResponseUtils.error('Username is required'));
            }
            const skillStats = await leetcodeService_1.leetCodeService.getUserSkillStats(username);
            return res.status(200).json(response_1.ResponseUtils.success('Skill stats retrieved successfully', skillStats));
        }
        catch (error) {
            console.error('Error fetching skill stats:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch skill stats', error.message));
        }
    }
    async getUserContestRanking(req, res) {
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json(response_1.ResponseUtils.error('Username is required'));
            }
            const contestData = await leetcodeService_1.leetCodeService.getUserContestRanking(username);
            return res.status(200).json(response_1.ResponseUtils.success('Contest ranking retrieved successfully', contestData));
        }
        catch (error) {
            console.error('Error fetching contest ranking:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch contest ranking', error.message));
        }
    }
    async getUserCalendar(req, res) {
        try {
            const { username } = req.params;
            const { year } = req.query;
            if (!username) {
                return res.status(400).json(response_1.ResponseUtils.error('Username is required'));
            }
            const calendarYear = year ? parseInt(year) : new Date().getFullYear();
            const calendarData = await leetcodeService_1.leetCodeService.getUserCalendar(username, calendarYear);
            return res.status(200).json(response_1.ResponseUtils.success('Calendar data retrieved successfully', calendarData));
        }
        catch (error) {
            console.error('Error fetching calendar data:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch calendar data', error.message));
        }
    }
    async getUserQuestionProgress(req, res) {
        try {
            const { userSlug } = req.params;
            if (!userSlug) {
                return res.status(400).json(response_1.ResponseUtils.error('User slug is required'));
            }
            const progressData = await leetcodeService_1.leetCodeService.getUserQuestionProgress(userSlug);
            return res.status(200).json(response_1.ResponseUtils.success('Question progress retrieved successfully', progressData));
        }
        catch (error) {
            console.error('Error fetching question progress:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch question progress', error.message));
        }
    }
    async getProblem(req, res) {
        try {
            const { titleSlug } = req.params;
            if (!titleSlug) {
                return res.status(400).json(response_1.ResponseUtils.error('Title slug is required'));
            }
            const problemData = await leetcodeService_1.leetCodeService.getProblem(titleSlug);
            return res.status(200).json(response_1.ResponseUtils.success('Problem data retrieved successfully', problemData));
        }
        catch (error) {
            console.error('Error fetching problem data:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch problem data', error.message));
        }
    }
    async getDailyProblem(req, res) {
        try {
            const dailyProblem = await leetcodeService_1.leetCodeService.getDailyProblem();
            return res.status(200).json(response_1.ResponseUtils.success('Daily problem retrieved successfully', dailyProblem));
        }
        catch (error) {
            console.error('Error fetching daily problem:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch daily problem', error.message));
        }
    }
    async getProblems(req, res) {
        try {
            const { categorySlug = '', limit = '50', skip = '0' } = req.query;
            const { filters = {} } = req.body;
            const problemsData = await leetcodeService_1.leetCodeService.getProblems(categorySlug, parseInt(limit), parseInt(skip), filters);
            return res.status(200).json(response_1.ResponseUtils.success('Problems retrieved successfully', problemsData));
        }
        catch (error) {
            console.error('Error fetching problems:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch problems', error.message));
        }
    }
    async getDiscussion(req, res) {
        try {
            const { topicId } = req.params;
            if (!topicId) {
                return res.status(400).json(response_1.ResponseUtils.error('Topic ID is required'));
            }
            const discussionData = await leetcodeService_1.leetCodeService.getDiscussion(parseInt(topicId));
            return res.status(200).json(response_1.ResponseUtils.success('Discussion retrieved successfully', discussionData));
        }
        catch (error) {
            console.error('Error fetching discussion:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch discussion', error.message));
        }
    }
    async getDiscussionComments(req, res) {
        try {
            const { topicId } = req.params;
            const { orderBy = 'newest_to_oldest', pageNo = '1', numPerPage = '10' } = req.query;
            if (!topicId) {
                return res.status(400).json(response_1.ResponseUtils.error('Topic ID is required'));
            }
            const commentsData = await leetcodeService_1.leetCodeService.getDiscussionComments(parseInt(topicId), orderBy, parseInt(pageNo), parseInt(numPerPage));
            return res.status(200).json(response_1.ResponseUtils.success('Discussion comments retrieved successfully', commentsData));
        }
        catch (error) {
            console.error('Error fetching discussion comments:', error);
            return res.status(500).json(response_1.ResponseUtils.error('Failed to fetch discussion comments', error.message));
        }
    }
}
exports.LeetCodeController = LeetCodeController;
exports.leetCodeController = new LeetCodeController();
