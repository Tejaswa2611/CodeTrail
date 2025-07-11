import { Router } from 'express';
import { codeforcesController } from '../controllers/codeforcesController';

const router = Router();

// GET /api/codeforces/user/status/:handle
router.get('/user/status/:handle', codeforcesController.getUserStatus);

// GET /api/codeforces/problemset/problems
router.get('/problemset/problems', codeforcesController.getProblems);

// GET /api/codeforces/user/rating/:handle
router.get('/user/rating/:handle', codeforcesController.getUserRating);

// GET /api/codeforces/user/info/:handle
router.get('/user/info/:handle', codeforcesController.getUserInfo);

// 1. Total Questions (Easy/Med/Hard)
router.get('/user/solved-stats/:handle', codeforcesController.getSolvedProblemsStats);

// 2. Total Active Days
router.get('/user/active-days/:handle', codeforcesController.getActiveDays);

// 3. Heatmap
router.get('/user/heatmap/:handle', codeforcesController.getSubmissionHeatmap);

// 4. Total Contests Participated
router.get('/user/contests/:handle', codeforcesController.getTotalContests);

// 5. Contest Rating & Graph
router.get('/user/rating-graph/:handle', codeforcesController.getContestRatingGraph);

// 6. Awards / Badges
router.get('/user/awards/:handle', codeforcesController.getAwards);

// 7. DSA Topic-Wise Analysis
router.get('/user/topic-analysis/:handle', codeforcesController.getTopicWiseAnalysis);

export default router;
