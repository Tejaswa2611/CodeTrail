import { Request, Response } from 'express';
import { codeforcesService } from '../services/codeforcesService';

export const codeforcesController = {
    async getUserStatus(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getUserStatus(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user status', error: (error as Error).message });
        }
    },
    async getProblems(req: Request, res: Response) {
        try {
            const result = await codeforcesService.getProblems();
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching problems', error: (error as Error).message });
        }
    },
    async getUserRating(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getUserRating(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user rating', error: (error as Error).message });
        }
    },
    async getUserInfo(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getUserInfo(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user info', error: (error as Error).message });
        }
    },

    // 1. Total Questions (Easy/Med/Hard)
    async getSolvedProblemsStats(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getSolvedProblemsStats(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching solved problems stats', error: (error as Error).message });
        }
    },

    // 2. Total Active Days
    async getActiveDays(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getActiveDays(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching active days', error: (error as Error).message });
        }
    },

    // 3. Heatmap
    async getSubmissionHeatmap(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getSubmissionHeatmap(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching submission heatmap', error: (error as Error).message });
        }
    },

    // 4. Total Contests Participated
    async getTotalContests(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getTotalContests(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching total contests', error: (error as Error).message });
        }
    },

    // 5. Contest Rating & Graph
    async getContestRatingGraph(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getContestRatingGraph(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching contest rating graph', error: (error as Error).message });
        }
    },

    // 6. Awards / Badges
    async getAwards(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getAwards(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching awards', error: (error as Error).message });
        }
    },

    // 7. DSA Topic-Wise Analysis
    async getTopicWiseAnalysis(req: Request, res: Response) {
        try {
            const { handle } = req.params;
            const result = await codeforcesService.getTopicWiseAnalysis(handle);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching topic-wise analysis', error: (error as Error).message });
        }
    },
};
