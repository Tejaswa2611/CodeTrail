"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.extraLongCache = exports.longCache = exports.mediumCache = exports.shortCache = exports.createCacheMiddleware = void 0;
const apicache_1 = __importDefault(require("apicache"));
// Create cache middleware with different durations for different endpoints
const createCacheMiddleware = (duration) => {
    return apicache_1.default.middleware(duration);
};
exports.createCacheMiddleware = createCacheMiddleware;
// Pre-configured cache middlewares for different use cases
exports.shortCache = (0, exports.createCacheMiddleware)('5 minutes'); // For user profiles
exports.mediumCache = (0, exports.createCacheMiddleware)('15 minutes'); // For problems list
exports.longCache = (0, exports.createCacheMiddleware)('1 hour'); // For daily problem
exports.extraLongCache = (0, exports.createCacheMiddleware)('6 hours'); // For static content
// Clear cache function for admin use
const clearCache = () => {
    apicache_1.default.clear();
};
exports.clearCache = clearCache;
