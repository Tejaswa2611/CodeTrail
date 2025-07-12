"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const validation_1 = require("../utils/validation");
const response_1 = require("../utils/response");
class AuthController {
    /**
     * Register a new user
     */
    static async register(req, res) {
        try {
            // Validate input
            const { error, value } = (0, validation_1.validateUserRegistration)(req.body);
            if (error) {
                const errorMessages = error.details.map((detail) => detail.message);
                res.status(400).json(response_1.ResponseUtils.validationError(errorMessages));
                return;
            }
            // Register user
            const result = await authService_1.AuthService.register(value);
            // Set both tokens as httpOnly cookies
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(201).json(response_1.ResponseUtils.success('User registered successfully', {
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json(response_1.ResponseUtils.error(error.message));
            }
            else {
                res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
            }
        }
    }
    /**
     * Login user
     */
    static async login(req, res) {
        try {
            // Validate input
            const { error, value } = (0, validation_1.validateUserLogin)(req.body);
            if (error) {
                const errorMessages = error.details.map((detail) => detail.message);
                res.status(400).json(response_1.ResponseUtils.validationError(errorMessages));
                return;
            }
            // Login user
            const result = await authService_1.AuthService.login(value);
            // Set both tokens as httpOnly cookies
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json(response_1.ResponseUtils.success('Login successful', {
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json(response_1.ResponseUtils.error(error.message));
            }
            else {
                res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
            }
        }
    }
    /**
     * Refresh access token
     */
    static async refreshToken(req, res) {
        try {
            // Get refresh token from cookie or body
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
            if (!refreshToken) {
                res.status(401).json(response_1.ResponseUtils.error('Refresh token required'));
                return;
            }
            // Validate input
            const { error } = (0, validation_1.validateRefreshToken)({ refreshToken });
            if (error) {
                const errorMessages = error.details.map((detail) => detail.message);
                res.status(400).json(response_1.ResponseUtils.validationError(errorMessages));
                return;
            }
            // Refresh tokens
            const newTokens = await authService_1.AuthService.refreshToken(refreshToken);
            // Set new access token as httpOnly cookie
            res.cookie('accessToken', newTokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            // Set new refresh token as httpOnly cookie
            res.cookie('refreshToken', newTokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json(response_1.ResponseUtils.success('Token refreshed successfully'));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json(response_1.ResponseUtils.error(error.message));
            }
            else {
                res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
            }
        }
    }
    /**
     * Logout user
     */
    static async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
            if (refreshToken) {
                await authService_1.AuthService.logout(refreshToken);
            }
            // Clear both cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json(response_1.ResponseUtils.success('Logout successful'));
        }
        catch (error) {
            res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
        }
    }
    /**
     * Get user profile
     */
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json(response_1.ResponseUtils.error('Authentication required'));
                return;
            }
            const user = await authService_1.AuthService.getProfile(req.user.userId);
            res.status(200).json(response_1.ResponseUtils.success('Profile retrieved successfully', { user }));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json(response_1.ResponseUtils.error(error.message));
            }
            else {
                res.status(500).json(response_1.ResponseUtils.error('Internal server error'));
            }
        }
    }
    /**
     * Health check endpoint
     */
    static async healthCheck(req, res) {
        res.status(200).json(response_1.ResponseUtils.success('Auth service is healthy'));
    }
}
exports.AuthController = AuthController;
