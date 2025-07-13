// Simple test script for chatbot API
const axios = require('axios');

async function testChatbot() {
    try {
        console.log('Testing chatbot API...');
        
        // Test health endpoint
        const healthResponse = await axios.get('http://localhost:3001/api/chatbot/health');
        console.log('Health check:', healthResponse.data);
        
        // Note: To test the actual chat endpoints, you would need to:
        // 1. First authenticate and get a session
        // 2. Then call the protected chatbot endpoints
        
        console.log('✅ Chatbot API endpoints are accessible');
        
    } catch (error) {
        console.error('❌ Error testing chatbot API:', error.message);
    }
}

testChatbot();
