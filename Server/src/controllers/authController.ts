import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { validateUserRegistration, validateUserLogin, validateRefreshToken } from '../utils/validation';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
    /**
     * Register a new user
     */
    static async register(req: Request, res: Response): Promise<void> {
        try {
            // Validate input
            const { error, value } = validateUserRegistration(req.body);
            if (error) {
                const errorMessages = error.details.map((detail: any) => detail.message);
                res.status(400).json(ResponseUtils.validationError(errorMessages));
                return;
            }

            // Register user
            const result = await AuthService.register(value);

            // Set both tokens as httpOnly cookies
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json(ResponseUtils.success('User registered successfully', {
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            }));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(ResponseUtils.error(error.message));
            } else {
                res.status(500).json(ResponseUtils.error('Internal server error'));
            }
        }
    }

    /**
     * Login user
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            // Validate input
            const { error, value } = validateUserLogin(req.body);
            if (error) {
                const errorMessages = error.details.map((detail: any) => detail.message);
                res.status(400).json(ResponseUtils.validationError(errorMessages));
                return;
            }

            // Login user
            const result = await AuthService.login(value);

            // Set both tokens as httpOnly cookies
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json(ResponseUtils.success('Login successful', {
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            }));
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json(ResponseUtils.error(error.message));
            } else {
                res.status(500).json(ResponseUtils.error('Internal server error'));
            }
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            // Get refresh token from cookie or body
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

            if (!refreshToken) {
                res.status(401).json(ResponseUtils.error('Refresh token required'));
                return;
            }

            // Validate input
            const { error } = validateRefreshToken({ refreshToken });
            if (error) {
                const errorMessages = error.details.map((detail: any) => detail.message);
                res.status(400).json(ResponseUtils.validationError(errorMessages));
                return;
            }

            // Refresh tokens
            const newTokens = await AuthService.refreshToken(refreshToken);

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

            res.status(200).json(ResponseUtils.success('Token refreshed successfully'));
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json(ResponseUtils.error(error.message));
            } else {
                res.status(500).json(ResponseUtils.error('Internal server error'));
            }
        }
    }

    /**
     * Logout user
     */
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }

            // Clear both cookies with same settings used when setting them
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            res.status(200).json(ResponseUtils.success('Logout successful'));
        } catch (error) {
            res.status(500).json(ResponseUtils.error('Internal server error'));
        }
    }

    /**
     * Get user profile
     */
    static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Authentication required'));
                return;
            }

            const user = await AuthService.getProfile(req.user.userId);

            res.status(200).json(ResponseUtils.success('Profile retrieved successfully', { user }));
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json(ResponseUtils.error(error.message));
            } else {
                res.status(500).json(ResponseUtils.error('Internal server error'));
            }
        }
    }

    /**
     * Health check endpoint
     */
    static async healthCheck(req: Request, res: Response): Promise<void> {
        res.status(200).json(ResponseUtils.success('Auth service is healthy'));
    }
}
