"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
class AuthService {
    /**
     * Register a new user
     */
    static async register(userData) {
        // Check if user already exists
        const existingUser = await User_1.UserModel.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await auth_1.AuthUtils.hashPassword(userData.password);
        // Create user
        const user = await User_1.UserModel.create({
            ...userData,
            password: hashedPassword,
        });
        // Generate tokens
        const tokens = auth_1.AuthUtils.generateTokenPair({
            userId: user.id,
            email: user.email,
        });
        // Store refresh token
        await User_1.RefreshTokenModel.store(tokens.refreshToken, user.id);
        return {
            user: User_1.UserModel.sanitizeUser(user),
            tokens,
        };
    }
    /**
     * Login user
     */
    static async login(credentials) {
        // Find user
        const user = await User_1.UserModel.findByEmail(credentials.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await auth_1.AuthUtils.comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate tokens
        const tokens = auth_1.AuthUtils.generateTokenPair({
            userId: user.id,
            email: user.email,
        });
        // Store refresh token
        await User_1.RefreshTokenModel.store(tokens.refreshToken, user.id);
        return {
            user: User_1.UserModel.sanitizeUser(user),
            tokens,
        };
    }
    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken) {
        // Verify refresh token
        const decoded = auth_1.AuthUtils.verifyRefreshToken(refreshToken);
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        // Check if refresh token exists in storage
        const tokenExists = await User_1.RefreshTokenModel.exists(refreshToken);
        if (!tokenExists) {
            throw new Error('Invalid refresh token');
        }
        // Verify user still exists
        const user = await User_1.UserModel.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Generate new tokens
        const newTokens = auth_1.AuthUtils.generateTokenPair({
            userId: user.id,
            email: user.email,
        });
        // Remove old refresh token and store new one
        await User_1.RefreshTokenModel.remove(refreshToken);
        await User_1.RefreshTokenModel.store(newTokens.refreshToken, user.id);
        return newTokens;
    }
    /**
     * Logout user
     */
    static async logout(refreshToken) {
        await User_1.RefreshTokenModel.remove(refreshToken);
    }
    /**
     * Get user profile
     */
    static async getProfile(userId) {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return User_1.UserModel.sanitizeUser(user);
    }
}
exports.AuthService = AuthService;
