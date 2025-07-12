"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = exports.UserModel = void 0;
const prisma_1 = require("../lib/prisma");
class UserModel {
    /**
     * Create a new user
     */
    static async create(userData) {
        const user = await prisma_1.prisma.user.create({
            data: {
                email: userData.email.toLowerCase(),
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName || null,
            },
        });
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Find user by ID
     */
    static async findById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Update user
     */
    static async update(id, updates) {
        try {
            const user = await prisma_1.prisma.user.update({
                where: { id },
                data: {
                    ...updates,
                    updatedAt: new Date(),
                },
            });
            return {
                id: user.id,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Delete user
     */
    static async delete(id) {
        try {
            await prisma_1.prisma.user.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get user without password
     */
    static sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
exports.UserModel = UserModel;
class RefreshTokenModel {
    /**
     * Store refresh token
     */
    static async store(token, userId) {
        // Set expiration to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await prisma_1.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
    }
    /**
     * Check if refresh token exists and is valid
     */
    static async exists(token) {
        const refreshToken = await prisma_1.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!refreshToken)
            return false;
        // Check if token is expired
        if (refreshToken.expiresAt < new Date()) {
            // Remove expired token
            await this.remove(token);
            return false;
        }
        return true;
    }
    /**
     * Remove refresh token
     */
    static async remove(token) {
        try {
            await prisma_1.prisma.refreshToken.delete({
                where: { token },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Remove all refresh tokens for a user (logout from all devices)
     */
    static async removeAllForUser(userId) {
        await prisma_1.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    /**
     * Clean up expired tokens (can be called periodically)
     */
    static async cleanupExpiredTokens() {
        await prisma_1.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}
exports.RefreshTokenModel = RefreshTokenModel;
