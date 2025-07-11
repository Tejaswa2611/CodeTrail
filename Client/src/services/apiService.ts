// API Service for CodeTrail Backend Integration
const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Custom error classes for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public endpoint?: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Enhanced generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
        response.status,
        endpoint
      );
    }
    
    const result: ApiResponse<T> = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new ApiError(
        result.error || result.message || 'Unknown API error',
        undefined,
        endpoint
      );
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError(`Network error accessing ${endpoint}. Please check your connection.`, endpoint);
    }
    
    if (error.name === 'AbortError') {
      throw new NetworkError(`Request timeout for ${endpoint}. Please try again.`, endpoint);
    }
    
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }
    
    throw new ApiError(`Unexpected error calling ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, endpoint);
  }
}

// LeetCode API interfaces
export interface LeetCodeProfile {
  allQuestionsCount: Array<{
    difficulty: string;
    count: number;
  }>;
  matchedUser: {
    username: string;
    profile: {
      realName: string;
      aboutMe: string;
      userAvatar: string;
      location: string;
      reputation: number;
      ranking: number;
    };
    submitStats: {
      acSubmissionNum: Array<{
        difficulty: string;
        count: number;
        submissions: number;
      }>;
      totalSubmissionNum: Array<{
        difficulty: string;
        count: number;
        submissions: number;
      }>;
    };
  };
  recentSubmissionList: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
  }>;
}

export interface LeetCodeSkillStats {
  data: {
    matchedUser: {
      tagProblemCounts: {
        advanced: Array<{
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }>;
        intermediate: Array<{
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }>;
        fundamental: Array<{
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }>;
      };
    };
  };
}

export interface LeetCodeContestRanking {
  data: {
    userContestRanking: {
      attendedContestsCount: number;
      rating: number;
      globalRanking: number;
      badge: {
        name: string;
      } | null;
    };
    userContestRankingHistory: Array<{
      attended: boolean;
      trendDirection: string;
      problemsSolved: number;
      totalProblems: number;
      finishTimeInSeconds: number;
      rating: number;
      ranking: number;
      contest: {
        title: string;
        startTime: number;
      };
    }>;
  };
}

export interface LeetCodeCalendar {
  data: {
    matchedUser: {
      userCalendar: {
        submissionCalendar: string; // JSON string of timestamps
        activeYears: number[];
      };
    };
  };
}

export interface LeetCodeProgress {
  data: {
    allQuestionsCount: Array<{
      difficulty: string;
      count: number;
    }>;
    matchedUser: {
      submitStats: {
        acSubmissionNum: Array<{
          difficulty: string;
          count: number;
          submissions: number;
        }>;
      };
    };
  };
}

export interface CodeforcesRating {
  result: Array<{
    contestId: number;
    contestName: string;
    handle: string;
    rank: number;
    ratingUpdateTimeSeconds: number;
    oldRating: number;
    newRating: number;
  }>;
}

// Codeforces API interfaces
export interface CodeforcesUserInfo {
  result: Array<{
    handle: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    city?: string;
    organization?: string;
    contribution: number;
    rank: string;
    rating: number;
    maxRank: string;
    maxRating: number;
    lastOnlineTimeSeconds: number;
    registrationTimeSeconds: number;
    friendOfCount: number;
    avatar: string;
    titlePhoto: string;
  }>;
}

export interface CodeforcesSolvedStats {
  totalSolved: number;
  byDifficulty: {
    [rating: string]: number;
  };
  uniqueProblems: number;
}

export interface CodeforcesActiveDays {
  activeDays: number;
  submissionDays: string[]; // Array of date strings
}

export interface CodeforcesHeatmap {
  heatmapData: {
    [date: string]: number; // date -> submission count
  };
  maxSubmissions: number;
  totalSubmissions: number;
}

export interface CodeforcesContests {
  totalContests: number;
  ratedContests: number;
  bestRank: number;
  worstRank: number;
}

export interface CodeforcesRatingGraph {
  ratingHistory: Array<{
    contestId: number;
    contestName: string;
    handle: string;
    rank: number;
    ratingUpdateTimeSeconds: number;
    oldRating: number;
    newRating: number;
  }>;
  maxRating: number;
  currentRating: number;
}

export interface CodeforcesTopicAnalysis {
  topicStats: {
    [topic: string]: {
      solved: number;
      attempted: number;
      tags: string[];
    };
  };
  totalUniqueTags: number;
}

// LeetCode API functions
export const leetcodeApi = {
  getUserProfile: (username: string): Promise<LeetCodeProfile | null> =>
    apiCall<LeetCodeProfile>(`/leetcode/user/${username}/profile`),
  
  getUserSkills: (username: string): Promise<LeetCodeSkillStats | null> =>
    apiCall<LeetCodeSkillStats>(`/leetcode/user/${username}/skills`),
  
  getUserContest: (username: string): Promise<LeetCodeContestRanking | null> =>
    apiCall<LeetCodeContestRanking>(`/leetcode/user/${username}/contest`),
  
  getUserCalendar: (username: string, year?: number): Promise<LeetCodeCalendar | null> =>
    apiCall<LeetCodeCalendar>(`/leetcode/user/${username}/calendar${year ? `?year=${year}` : ''}`),
  
  getUserProgress: (userSlug: string): Promise<LeetCodeProgress | null> =>
    apiCall<LeetCodeProgress>(`/leetcode/user/${userSlug}/progress`),
};

// Codeforces API functions
export const codeforcesApi = {
  getUserInfo: (handle: string): Promise<CodeforcesUserInfo | null> =>
    apiCall<CodeforcesUserInfo>(`/codeforces/user/info/${handle}`),
  
  getSolvedStats: (handle: string): Promise<CodeforcesSolvedStats | null> =>
    apiCall<CodeforcesSolvedStats>(`/codeforces/user/solved-stats/${handle}`),
  
  getActiveDays: (handle: string): Promise<CodeforcesActiveDays | null> =>
    apiCall<CodeforcesActiveDays>(`/codeforces/user/active-days/${handle}`),
  
  getHeatmap: (handle: string): Promise<CodeforcesHeatmap | null> =>
    apiCall<CodeforcesHeatmap>(`/codeforces/user/heatmap/${handle}`),
  
  getContests: (handle: string): Promise<CodeforcesContests | null> =>
    apiCall<CodeforcesContests>(`/codeforces/user/contests/${handle}`),
  
  getRatingGraph: (handle: string): Promise<CodeforcesRatingGraph | null> =>
    apiCall<CodeforcesRatingGraph>(`/codeforces/user/rating-graph/${handle}`),
  
  getTopicAnalysis: (handle: string): Promise<CodeforcesTopicAnalysis | null> =>
    apiCall<CodeforcesTopicAnalysis>(`/codeforces/user/topic-analysis/${handle}`),
  
  getRating: (handle: string): Promise<CodeforcesRating | null> =>
    apiCall<CodeforcesRating>(`/codeforces/user/rating/${handle}`),
};

// Combined dashboard data interface
export interface DashboardData {
  leetcode: {
    profile: LeetCodeProfile | null;
    skills: LeetCodeSkillStats | null;
    contest: LeetCodeContestRanking | null;
    calendar: LeetCodeCalendar | null;
  };
  codeforces: {
    userInfo: CodeforcesUserInfo | null;
    solvedStats: CodeforcesSolvedStats | null;
    activeDays: CodeforcesActiveDays | null;
    heatmap: CodeforcesHeatmap | null;
    contests: CodeforcesContests | null;
    ratingGraph: CodeforcesRatingGraph | null;
    topicAnalysis: CodeforcesTopicAnalysis | null;
  };
}

// Function to fetch all dashboard data with comprehensive error handling
export async function fetchDashboardData(leetcodeUsername: string, codeforcesHandle: string): Promise<DashboardData> {
  console.log(`Fetching dashboard data for LeetCode: ${leetcodeUsername}, Codeforces: ${codeforcesHandle}`);
  
  // Validate input parameters
  if (!leetcodeUsername || typeof leetcodeUsername !== 'string' || leetcodeUsername.trim().length === 0) {
    throw new ValidationError('LeetCode username is required and must be a non-empty string', 'leetcodeUsername');
  }
  
  if (!codeforcesHandle || typeof codeforcesHandle !== 'string' || codeforcesHandle.trim().length === 0) {
    throw new ValidationError('Codeforces handle is required and must be a non-empty string', 'codeforcesHandle');
  }
  
  const errors: Record<string, Error> = {};
  let hasAtLeastOneSuccess = false;
  
  // Helper function to safely execute API calls
  const safeApiCall = async <T>(
    apiCall: () => Promise<T | null>,
    name: string
  ): Promise<T | null> => {
    try {
      const result = await apiCall();
      if (result !== null) {
        hasAtLeastOneSuccess = true;
      }
      return result;
    } catch (error) {
      console.warn(`Failed to fetch ${name}:`, error);
      errors[name] = error instanceof Error ? error : new Error(`Unknown error fetching ${name}`);
      return null;
    }
  };
  
  // Execute all API calls with individual error handling
  const [
    leetcodeProfile,
    leetcodeSkills,
    leetcodeContest,
    leetcodeCalendar,
    codeforcesUserInfo,
    codeforcesSolvedStats,
    codeforcesActiveDays,
    codeforcesHeatmap,
    codeforcesContests,
    codeforcesRatingGraph,
    codeforcesTopicAnalysis
  ] = await Promise.allSettled([
    safeApiCall(() => leetcodeApi.getUserProfile(leetcodeUsername), 'LeetCode Profile'),
    safeApiCall(() => leetcodeApi.getUserSkills(leetcodeUsername), 'LeetCode Skills'),
    safeApiCall(() => leetcodeApi.getUserContest(leetcodeUsername), 'LeetCode Contest'),
    safeApiCall(() => leetcodeApi.getUserCalendar(leetcodeUsername), 'LeetCode Calendar'),
    safeApiCall(() => codeforcesApi.getUserInfo(codeforcesHandle), 'Codeforces User Info'),
    safeApiCall(() => codeforcesApi.getSolvedStats(codeforcesHandle), 'Codeforces Solved Stats'),
    safeApiCall(() => codeforcesApi.getActiveDays(codeforcesHandle), 'Codeforces Active Days'),
    safeApiCall(() => codeforcesApi.getHeatmap(codeforcesHandle), 'Codeforces Heatmap'),
    safeApiCall(() => codeforcesApi.getContests(codeforcesHandle), 'Codeforces Contests'),
    safeApiCall(() => codeforcesApi.getRatingGraph(codeforcesHandle), 'Codeforces Rating Graph'),
    safeApiCall(() => codeforcesApi.getTopicAnalysis(codeforcesHandle), 'Codeforces Topic Analysis')
  ]);
  
  // Extract values from settled promises
  const getValue = <T>(result: PromiseSettledResult<T | null>): T | null => {
    return result.status === 'fulfilled' ? result.value : null;
  };
  
  const dashboardData: DashboardData = {
    leetcode: {
      profile: getValue(leetcodeProfile),
      skills: getValue(leetcodeSkills),
      contest: getValue(leetcodeContest),
      calendar: getValue(leetcodeCalendar)
    },
    codeforces: {
      userInfo: getValue(codeforcesUserInfo),
      solvedStats: getValue(codeforcesSolvedStats),
      activeDays: getValue(codeforcesActiveDays),
      heatmap: getValue(codeforcesHeatmap),
      contests: getValue(codeforcesContests),
      ratingGraph: getValue(codeforcesRatingGraph),
      topicAnalysis: getValue(codeforcesTopicAnalysis)
    }
  };
  
  // Log detailed error information
  const errorCount = Object.keys(errors).length;
  if (errorCount > 0) {
    console.warn(`Dashboard data fetch completed with ${errorCount} errors:`, errors);
  }
  
  // If no API calls succeeded, throw an aggregated error
  if (!hasAtLeastOneSuccess) {
    const errorMessages = Object.entries(errors)
      .map(([name, error]) => `${name}: ${error.message}`)
      .join('; ');
    
    throw new ApiError(
      `Failed to fetch any dashboard data. Errors: ${errorMessages}`,
      undefined,
      'dashboard'
    );
  }
  
  console.log(`Dashboard data fetch completed. Success rate: ${(11 - errorCount) / 11 * 100}%`);
  return dashboardData;
}
