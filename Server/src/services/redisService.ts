import Redis from 'ioredis';
import config from '../config';

export class RedisService {
    private static redis: Redis | null = null;
    private static isEnabled = true;
    private static connectionAttempts = 0;
    private static maxConnectionAttempts = 3;

    /**
     * Initialize Redis connection with graceful fallback
     */
    private static async initializeRedis(): Promise<Redis | null> {
        if (this.redis) {
            return this.redis;
        }

        if (!this.isEnabled || this.connectionAttempts >= this.maxConnectionAttempts) {
            return null;
        }

        try {
            console.log('🔗 Initializing Redis connection...');
            this.connectionAttempts++;

            // Try to connect using URL first, then fall back to individual config
            if (config.redis.url) {
                this.redis = new Redis(config.redis.url);
            } else {
                this.redis = new Redis({
                    host: config.redis.host,
                    port: config.redis.port,
                    password: config.redis.password || undefined,
                    db: config.redis.db,
                    maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
                    lazyConnect: config.redis.lazyConnect,
                });
            }

            // Handle connection events
            this.redis.on('connect', () => {
                console.log('✅ Redis connected successfully');
                this.connectionAttempts = 0; // Reset attempts on successful connection
            });

            this.redis.on('error', (error) => {
                console.error('❌ Redis connection error:', error.message);
                if (this.connectionAttempts >= this.maxConnectionAttempts) {
                    console.warn('⚠️ Redis disabled after max connection attempts. Falling back to direct API calls.');
                    this.isEnabled = false;
                    this.redis = null;
                }
            });

            this.redis.on('close', () => {
                console.log('🔌 Redis connection closed');
            });

            // Test the connection
            await this.redis.ping();
            console.log('🏓 Redis ping successful');

            return this.redis;
        } catch (error) {
            console.error('❌ Failed to initialize Redis:', error);
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                console.warn('⚠️ Redis disabled. Application will continue without caching.');
                this.isEnabled = false;
            }
            this.redis = null;
            return null;
        }
    }

    /**
     * Get Redis instance with lazy initialization
     */
    private static async getRedis(): Promise<Redis | null> {
        if (!this.isEnabled) {
            return null;
        }

        if (!this.redis) {
            return await this.initializeRedis();
        }

        // Check if connection is still alive
        try {
            await this.redis.ping();
            return this.redis;
        } catch (error) {
            console.warn('⚠️ Redis connection lost, attempting to reconnect...');
            this.redis = null;
            return await this.initializeRedis();
        }
    }

    /**
     * Generic get method with fallback
     */
    static async get(key: string): Promise<any | null> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                return null; // Cache miss when Redis unavailable
            }

            const cached = await redis.get(key);
            if (cached) {
                console.log(`📋 Cache HIT: ${key}`);
                return JSON.parse(cached);
            } else {
                console.log(`❌ Cache MISS: ${key}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Redis GET error for key ${key}:`, error);
            return null; // Graceful fallback on error
        }
    }

    /**
     * Generic set method with fallback
     */
    static async set(key: string, value: any, ttlSeconds = 300): Promise<boolean> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                console.log(`⚠️ Redis unavailable, skipping cache SET: ${key}`);
                return false;
            }

            await redis.setex(key, ttlSeconds, JSON.stringify(value));
            console.log(`💾 Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
            return true;
        } catch (error) {
            console.error(`❌ Redis SET error for key ${key}:`, error);
            return false; // Graceful fallback on error
        }
    }

    /**
     * Delete a key
     */
    static async del(key: string): Promise<boolean> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                return false;
            }

            const result = await redis.del(key);
            console.log(`🗑️ Cache DELETE: ${key} (deleted: ${result > 0})`);
            return result > 0;
        } catch (error) {
            console.error(`❌ Redis DELETE error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete multiple keys matching a pattern
     */
    static async delPattern(pattern: string): Promise<number> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                return 0;
            }

            const keys = await redis.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }

            const result = await redis.del(...keys);
            console.log(`🗑️ Cache DELETE pattern: ${pattern} (deleted: ${result} keys)`);
            return result;
        } catch (error) {
            console.error(`❌ Redis DELETE pattern error for ${pattern}:`, error);
            return 0;
        }
    }

    /**
     * Check Redis connection status
     */
    static async isConnected(): Promise<boolean> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                return false;
            }
            await redis.ping();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get cache statistics
     */
    static async getStats(): Promise<any> {
        try {
            const redis = await this.getRedis();
            if (!redis) {
                return { connected: false, enabled: this.isEnabled };
            }

            const info = await redis.info('memory');
            return {
                connected: true,
                enabled: this.isEnabled,
                connectionAttempts: this.connectionAttempts,
                memoryInfo: info,
            };
        } catch (error) {
            return { 
                connected: false, 
                enabled: this.isEnabled, 
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Gracefully close Redis connection
     */
    static async disconnect(): Promise<void> {
        try {
            if (this.redis) {
                await this.redis.quit();
                this.redis = null;
                console.log('👋 Redis connection closed gracefully');
            }
        } catch (error) {
            console.error('❌ Error closing Redis connection:', error);
        }
    }
} 