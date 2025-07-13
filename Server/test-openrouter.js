const fetch = require('node-fetch');

const testOpenRouter = async () => {
    const apiKey = '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';
    
    console.log('🧪 Testing OpenRouter API...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'CodeTrail AI Test'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat',
                messages: [
                    { role: 'user', content: 'Hello! Just testing if you work.' }
                ],
                max_tokens: 50,
                temperature: 0.7
            })
        });

        console.log('📊 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            return;
        }

        const data = await response.json();
        console.log('✅ Success! AI response:', data.choices[0].message.content);
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
};

testOpenRouter();
