// Test markdown link parsing functionality

const testMarkdownParsing = () => {
    console.log('🧪 Testing markdown link parsing...');
    
    // Test recommendation with markdown links
    const testRecommendation = "Arrays are fundamental to programming. Try [Two Sum](https://leetcode.com/problems/two-sum/) to get started.";
    const cleanedRecommendation = testRecommendation.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    console.log('Original:', testRecommendation);
    console.log('Cleaned:', cleanedRecommendation);
    
    // Test problems with markdown format
    const testProblems = "[Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)|[Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)";
    const markdownLinks = testProblems.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    console.log('\n📋 Parsed problems:');
    if (markdownLinks) {
        markdownLinks.forEach(link => {
            const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
                const problemName = match[1].trim();
                const problemUrl = match[2].trim();
                console.log(`  - ${problemName} -> ${problemUrl}`);
            }
        });
    }
    
    console.log('\n✅ Markdown parsing test completed!');
};

testMarkdownParsing();
