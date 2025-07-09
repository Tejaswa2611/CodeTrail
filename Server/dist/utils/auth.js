"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class AuthUtils {
    /**
     * Hash password using bcrypt
     */
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, config_1.default.security.bcryptRounds);
    }
    /**
     * Compare password with hash
     */
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Generate access token
     */
    static generateAccessToken(payload) {
        const tokenPayload = { ...payload, type: 'access' };
        const options = { expiresIn: config_1.default.jwt.expiresIn };
        return jsonwebtoken_1.default.sign(tokenPayload, config_1.default.jwt.secret, options);
    }
    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload) {
        const tokenPayload = { ...payload, type: 'refresh' };
        const options = { expiresIn: config_1.default.jwt.refreshExpiresIn };
        return jsonwebtoken_1.default.sign(tokenPayload, config_1.default.jwt.refreshSecret, options);
    }
    /**
     * Generate both access and refresh tokens
     */
    static generateTokenPair(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
    /**
     * Verify access token
     */
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    }
    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.refreshSecret);
    }
    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}
exports.AuthUtils = AuthUtils;
