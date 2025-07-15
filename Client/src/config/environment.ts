// Environment configuration for the application
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
};

export default config;
