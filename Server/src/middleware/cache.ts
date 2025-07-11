import apicache from 'apicache';

// Create cache middleware with different durations for different endpoints
export const createCacheMiddleware = (duration: string) => {
    return apicache.middleware(duration);
};

// Pre-configured cache middlewares for different use cases
export const shortCache = createCacheMiddleware('5 minutes');  // For user profiles
export const mediumCache = createCacheMiddleware('15 minutes'); // For problems list
export const longCache = createCacheMiddleware('1 hour');      // For daily problem
export const extraLongCache = createCacheMiddleware('6 hours'); // For static content

// Clear cache function for admin use
export const clearCache = () => {
    apicache.clear();
};
