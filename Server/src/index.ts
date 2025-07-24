import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config';
import routes from './routes';
import { generalLimiter } from './middleware/rateLimiter';
import { RedisService } from './services/redisService';

const app = express();

// Trust proxy for Railway deployment
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
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
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (config.nodeEnv !== 'test') {
    app.use(morgan('combined'));
}

// Rate limiting
app.use(generalLimiter);

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
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
app.use((error: any, req: any, res: any, next: any) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(config.nodeEnv === 'development' && { error: error.message, stack: error.stack }),
    });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`📝 API available at: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Redis caching: ${config.redis.url ? 'Enabled' : 'Disabled'}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    try {
        // Close HTTP server
        console.log('🔌 Closing HTTP server...');
        server.close(async () => {
            console.log('✅ HTTP server closed');
            
            // Close Redis connection
            console.log('🔌 Closing Redis connection...');
            await RedisService.disconnect();
            
            console.log('✅ Graceful shutdown completed');
            process.exit(0);
        });
        
        // Force exit after 10 seconds
        setTimeout(() => {
            console.error('❌ Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
        
    } catch (error) {
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

export default app;