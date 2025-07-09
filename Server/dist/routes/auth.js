"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Public routes with rate limiting
router.post('/register', rateLimiter_1.authLimiter, authController_1.AuthController.register);
router.post('/login', rateLimiter_1.authLimiter, authController_1.AuthController.login);
router.post('/refresh-token', rateLimiter_1.authLimiter, authController_1.AuthController.refreshToken);
router.post('/logout', authController_1.AuthController.logout);
// Protected routes
router.get('/profile', auth_1.authenticateToken, authController_1.AuthController.getProfile);
// Health check
router.get('/health', authController_1.AuthController.healthCheck);
exports.default = router;
