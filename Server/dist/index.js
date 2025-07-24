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
const redisService_1 = require("./services/redisService");
const app = (0, express_1.default)();
// Trust proxy for Railway deployment
app.set('trust proxy', true);
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.default.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
// Request parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Logging middleware
if (config_1.default.nodeEnv !== 'test') {
    app.use((0, morgan_1.default)('combined'));
}
// Rate limiting
app.use(rateLimiter_1.generalLimiter);
// API routes
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: config_1.default.nodeEnv,
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(config_1.default.nodeEnv === 'development' && { error: error.message, stack: error.stack }),
    });
});
// Start server
const PORT = config_1.default.port;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config_1.default.nodeEnv}`);
    console.log(`📝 API available at: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Redis caching: ${config_1.default.redis.url ? 'Enabled' : 'Disabled'}`);
});
// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    try {
        // Close HTTP server
        console.log('🔌 Closing HTTP server...');
        server.close(async () => {
            console.log('✅ HTTP server closed');
            // Close Redis connection
            console.log('🔌 Closing Redis connection...');
            await redisService_1.RedisService.disconnect();
            console.log('✅ Graceful shutdown completed');
            process.exit(0);
        });
        // Force exit after 10 seconds
        setTimeout(() => {
            console.error('❌ Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    }
    catch (error) {
        console.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
    }
};
// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
exports.default = app;
