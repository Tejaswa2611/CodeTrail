"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
// Trust proxy for Railway deployment
app.set('trust proxy', true);
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.default.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Request parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Logging middleware
app.use((0, morgan_1.default)('combined'));
// Custom request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - Body:`, req.body);
    next();
});
// Rate limiting middleware
app.use(rateLimiter_1.generalLimiter);
// API routes
app.use('/api', routes_1.default);
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format',
        });
    }
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: config_1.default.nodeEnv === 'development' ? err.message : undefined,
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Start server
const PORT = config_1.default.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config_1.default.nodeEnv}`);
    console.log(`📝 API available at: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});
exports.default = app;
