"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = auth_1.AuthUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            res.status(401).json(response_1.ResponseUtils.error('Access token required'));
            return;
        }
        const decoded = auth_1.AuthUtils.verifyAccessToken(token);
        if (decoded.type !== 'access') {
            res.status(401).json(response_1.ResponseUtils.error('Invalid token type'));
            return;
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json(response_1.ResponseUtils.error('Token expired'));
                return;
            }
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json(response_1.ResponseUtils.error('Invalid token'));
                return;
            }
        }
        res.status(401).json(response_1.ResponseUtils.error('Authentication failed'));
    }
};
exports.authenticateToken = authenticateToken;
