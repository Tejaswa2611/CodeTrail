import { Request, Response } from 'express';
import { leetCodeService } from '../services/leetcodeService';
import { ResponseUtils } from '../utils/response';

export class LeetCodeController {
    async getUserProfile(req: Request, res: Response) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json(ResponseUtils.error('Username is required'));
            }

            const profileData = await leetCodeService.getUserProfile(username);
            return res.status(200).json(ResponseUtils.success('User profile retrieved successfully', profileData));
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch user profile', error.message));
        }
    }

    async getUserSkillStats(req: Request, res: Response) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json(ResponseUtils.error('Username is required'));
            }

            const skillStats = await leetCodeService.getUserSkillStats(username);
            return res.status(200).json(ResponseUtils.success('Skill stats retrieved successfully', skillStats));
        } catch (error: any) {
            console.error('Error fetching skill stats:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch skill stats', error.message));
        }
    }

    async getUserContestRanking(req: Request, res: Response) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json(ResponseUtils.error('Username is required'));
            }

            const contestData = await leetCodeService.getUserContestRanking(username);
            return res.status(200).json(ResponseUtils.success('Contest ranking retrieved successfully', contestData));
        } catch (error: any) {
            console.error('Error fetching contest ranking:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch contest ranking', error.message));
        }
    }

    async getUserCalendar(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const { year } = req.query;

            if (!username) {
                return res.status(400).json(ResponseUtils.error('Username is required'));
            }

            const calendarYear = year ? parseInt(year as string) : new Date().getFullYear();
            const calendarData = await leetCodeService.getUserCalendar(username, calendarYear);
            return res.status(200).json(ResponseUtils.success('Calendar data retrieved successfully', calendarData));
        } catch (error: any) {
            console.error('Error fetching calendar data:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch calendar data', error.message));
        }
    }

    async getUserQuestionProgress(req: Request, res: Response) {
        try {
            const { userSlug } = req.params;

            if (!userSlug) {
                return res.status(400).json(ResponseUtils.error('User slug is required'));
            }

            const progressData = await leetCodeService.getUserQuestionProgress(userSlug);
            return res.status(200).json(ResponseUtils.success('Question progress retrieved successfully', progressData));
        } catch (error: any) {
            console.error('Error fetching question progress:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch question progress', error.message));
        }
    }

    async getProblem(req: Request, res: Response) {
        try {
            const { titleSlug } = req.params;

            if (!titleSlug) {
                return res.status(400).json(ResponseUtils.error('Title slug is required'));
            }

            const problemData = await leetCodeService.getProblem(titleSlug);
            return res.status(200).json(ResponseUtils.success('Problem data retrieved successfully', problemData));
        } catch (error: any) {
            console.error('Error fetching problem data:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch problem data', error.message));
        }
    }

    async getDailyProblem(req: Request, res: Response) {
        try {
            const dailyProblem = await leetCodeService.getDailyProblem();
            return res.status(200).json(ResponseUtils.success('Daily problem retrieved successfully', dailyProblem));
        } catch (error: any) {
            console.error('Error fetching daily problem:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch daily problem', error.message));
        }
    }

    async getProblems(req: Request, res: Response) {
        try {
            const { categorySlug = '', limit = '50', skip = '0' } = req.query;
            const { filters = {} } = req.body;

            const problemsData = await leetCodeService.getProblems(
                categorySlug as string,
                parseInt(limit as string),
                parseInt(skip as string),
                filters
            );
            return res.status(200).json(ResponseUtils.success('Problems retrieved successfully', problemsData));
        } catch (error: any) {
            console.error('Error fetching problems:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch problems', error.message));
        }
    }

    async getDiscussion(req: Request, res: Response) {
        try {
            const { topicId } = req.params;

            if (!topicId) {
                return res.status(400).json(ResponseUtils.error('Topic ID is required'));
            }

            const discussionData = await leetCodeService.getDiscussion(parseInt(topicId));
            return res.status(200).json(ResponseUtils.success('Discussion retrieved successfully', discussionData));
        } catch (error: any) {
            console.error('Error fetching discussion:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch discussion', error.message));
        }
    }

    async getDiscussionComments(req: Request, res: Response) {
        try {
            const { topicId } = req.params;
            const { orderBy = 'newest_to_oldest', pageNo = '1', numPerPage = '10' } = req.query;

            if (!topicId) {
                return res.status(400).json(ResponseUtils.error('Topic ID is required'));
            }

            const commentsData = await leetCodeService.getDiscussionComments(
                parseInt(topicId),
                orderBy as string,
                parseInt(pageNo as string),
                parseInt(numPerPage as string)
            );
            return res.status(200).json(ResponseUtils.success('Discussion comments retrieved successfully', commentsData));
        } catch (error: any) {
            console.error('Error fetching discussion comments:', error);
            return res.status(500).json(ResponseUtils.error('Failed to fetch discussion comments', error.message));
        }
    }
}

export const leetCodeController = new LeetCodeController();
