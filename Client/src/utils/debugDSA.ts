// Debug utility to check DSA Topic Analysis issues
export const debugDSATopics = {
  
  // Check if user has Codeforces connected
  checkCodeforcesPlatform: (data: any) => {
    console.log('🔍 DSA Debug - Checking Codeforces platform:', {
      hasUserInfo: !!data?.userInfo,
      hasConnectedPlatforms: !!data?.userInfo?.connectedPlatforms,
      codeforcesProfile: data?.userInfo?.connectedPlatforms?.codeforces,
      codeforcesHandle: data?.userInfo?.connectedPlatforms?.codeforces?.handle
    });
  },

  // Check DSA topic analysis data
  checkTopicAnalysis: (data: any) => {
    console.log('🔍 DSA Debug - Topic Analysis Data:', {
      hasDSATopicAnalysis: !!data?.dsaTopicAnalysis,
      topicCount: data?.dsaTopicAnalysis ? Object.keys(data.dsaTopicAnalysis).length : 0,
      sampleTopics: data?.dsaTopicAnalysis ? Object.keys(data.dsaTopicAnalysis).slice(0, 5) : [],
      codeforcesTopics: data?.dsaTopicAnalysis ? Object.entries(data.dsaTopicAnalysis)
        .filter(([topic, stats]: [string, any]) => stats.codeforces > 0)
        .map(([topic, stats]) => ({ topic, codeforces: stats.codeforces }))
        .slice(0, 5) : []
    });
  },

  // Check submissions data
  checkSubmissions: (data: any) => {
    console.log('🔍 DSA Debug - Submissions:', {
      hasTotalQuestions: !!data?.totalQuestions,
      totalQuestionsData: data?.totalQuestions,
      codeforcesQuestions: data?.totalQuestions?.codeforces || 0
    });
  },

  // Full debug check
  fullDebug: (data: any) => {
    console.log('🐛 Full DSA Topic Debug:');
    debugDSATopics.checkCodeforcesPlatform(data);
    debugDSATopics.checkTopicAnalysis(data);
    debugDSATopics.checkSubmissions(data);
  }
};

// Helper to show what's actually in the topic analysis
export const logTopicAnalysisDetails = (dsaTopicAnalysis: any) => {
  if (!dsaTopicAnalysis) {
    console.log('❌ No DSA Topic Analysis data found');
    return;
  }

  const topics = Object.entries(dsaTopicAnalysis);
  console.log('📊 DSA Topic Analysis Details:', {
    totalTopics: topics.length,
    topicsWithCodeforces: topics.filter(([_, stats]: [string, any]) => stats.codeforces > 0).length,
    topicsWithLeetcode: topics.filter(([_, stats]: [string, any]) => stats.leetcode > 0).length,
    top10Topics: topics
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.total - a.total)
      .slice(0, 10)
      .map(([topic, stats]) => ({ topic, ...stats }))
  });
};
