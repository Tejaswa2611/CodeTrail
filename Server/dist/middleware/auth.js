"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    try {
        console.log('🍪 All cookies received:', req.cookies);
        // Try to get token from cookie first, then fallback to Authorization header
        const token = req.cookies?.accessToken || auth_1.AuthUtils.extractTokenFromHeader(req.headers.authorization);
        console.log('🎫 Access token found:', token ? 'YES' : 'NO');
        console.log('🎫 Token preview:', token ? token.substring(0, 20) + '...' : 'None');
        if (!token) {
            console.log('❌ No access token provided');
            res.status(401).json(response_1.ResponseUtils.error('Access token required'));
            return;
        }
        const decoded = auth_1.AuthUtils.verifyAccessToken(token);
        console.log('✅ Token decoded successfully:', { userId: decoded.userId, email: decoded.email });
        if (decoded.type !== 'access') {
            console.log('❌ Invalid token type:', decoded.type);
            res.status(401).json(response_1.ResponseUtils.error('Invalid token type'));
            return;
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        console.log('✅ Authentication successful for user:', decoded.userId);
        next();
    }
    catch (error) {
        console.log('❌ Authentication error:', error);
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                console.log('❌ Token expired');
                res.status(401).json(response_1.ResponseUtils.error('Token expired'));
                return;
            }
            if (error.name === 'JsonWebTokenError') {
                console.log('❌ Invalid token format');
                res.status(401).json(response_1.ResponseUtils.error('Invalid token'));
                return;
            }
        }
        res.status(401).json(response_1.ResponseUtils.error('Authentication failed'));
    }
};
exports.authenticateToken = authenticateToken;
