"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeforcesController = void 0;
const codeforcesService_1 = require("../services/codeforcesService");
exports.codeforcesController = {
    async getUserStatus(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getUserStatus(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user status', error: error.message });
        }
    },
    async getProblems(req, res) {
        try {
            const result = await codeforcesService_1.codeforcesService.getProblems();
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching problems', error: error.message });
        }
    },
    async getUserRating(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getUserRating(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user rating', error: error.message });
        }
    },
    async getUserInfo(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getUserInfo(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user info', error: error.message });
        }
    },
    // 1. Total Questions (Easy/Med/Hard)
    async getSolvedProblemsStats(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getSolvedProblemsStats(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching solved problems stats', error: error.message });
        }
    },
    // 2. Total Active Days
    async getActiveDays(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getActiveDays(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching active days', error: error.message });
        }
    },
    // 3. Heatmap
    async getSubmissionHeatmap(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getSubmissionHeatmap(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching submission heatmap', error: error.message });
        }
    },
    // 4. Total Contests Participated
    async getTotalContests(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getTotalContests(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching total contests', error: error.message });
        }
    },
    // 5. Contest Rating & Graph
    async getContestRatingGraph(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getContestRatingGraph(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching contest rating graph', error: error.message });
        }
    },
    // 6. Awards / Badges
    async getAwards(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getAwards(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching awards', error: error.message });
        }
    },
    // 7. DSA Topic-Wise Analysis
    async getTopicWiseAnalysis(req, res) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService_1.codeforcesService.getTopicWiseAnalysis(handle);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching topic-wise analysis', error: error.message });
        }
    },
};
