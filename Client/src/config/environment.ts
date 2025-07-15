// Test environment variables
console.log('🔍 Environment Check:');
console.log('- API URL:', import.meta.env.VITE_API_URL);
console.log('- Mode:', import.meta.env.MODE);
console.log('- Dev Mode:', import.meta.env.DEV);
console.log('- Prod Mode:', import.meta.env.PROD);

// Export for use in components
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
};

export default config;
