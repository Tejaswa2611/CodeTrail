"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const codeforcesController_1 = require("../controllers/codeforcesController");
const router = (0, express_1.Router)();
// GET /api/codeforces/user/status/:handle
router.get('/user/status/:handle', codeforcesController_1.codeforcesController.getUserStatus);
// GET /api/codeforces/problemset/problems
router.get('/problemset/problems', codeforcesController_1.codeforcesController.getProblems);
// GET /api/codeforces/user/rating/:handle
router.get('/user/rating/:handle', codeforcesController_1.codeforcesController.getUserRating);
// GET /api/codeforces/user/info/:handle
router.get('/user/info/:handle', codeforcesController_1.codeforcesController.getUserInfo);
// 1. Total Questions (Easy/Med/Hard)
router.get('/user/solved-stats/:handle', codeforcesController_1.codeforcesController.getSolvedProblemsStats);
// 2. Total Active Days
router.get('/user/active-days/:handle', codeforcesController_1.codeforcesController.getActiveDays);
// 3. Heatmap
router.get('/user/heatmap/:handle', codeforcesController_1.codeforcesController.getSubmissionHeatmap);
// 4. Total Contests Participated
router.get('/user/contests/:handle', codeforcesController_1.codeforcesController.getTotalContests);
// 5. Contest Rating & Graph
router.get('/user/rating-graph/:handle', codeforcesController_1.codeforcesController.getContestRatingGraph);
// 6. Awards / Badges
router.get('/user/awards/:handle', codeforcesController_1.codeforcesController.getAwards);
// 7. DSA Topic-Wise Analysis
router.get('/user/topic-analysis/:handle', codeforcesController_1.codeforcesController.getTopicWiseAnalysis);
exports.default = router;
