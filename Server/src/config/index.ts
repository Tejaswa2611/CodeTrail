import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DATABASE_URL);
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serverUrl: process.env.SERVER_URL || 'http://localhost:3001',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  ai: {
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately, connect when first command is called
  },
};

export default config;
