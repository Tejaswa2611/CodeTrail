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

export default router;
