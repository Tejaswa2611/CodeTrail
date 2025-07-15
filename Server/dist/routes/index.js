"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const leetcode_1 = __importDefault(require("./leetcode"));
const codeforces_1 = __importDefault(require("./codeforces"));
const dashboard_1 = __importDefault(require("./dashboard"));
const chatbot_1 = __importDefault(require("./chatbot"));
const router = (0, express_1.Router)();
// API routes
router.use('/auth', auth_1.default);
router.use('/leetcode', leetcode_1.default);
router.use('/codeforces', codeforces_1.default);
router.use('/dashboard', dashboard_1.default);
router.use('/chatbot', chatbot_1.default);
// Health check for the entire API
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
