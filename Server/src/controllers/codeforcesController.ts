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
};
