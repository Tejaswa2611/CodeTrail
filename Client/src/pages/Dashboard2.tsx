import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Twitter, Globe, Calendar, Lock, ExternalLink, AlertTriangle, Plus, BarChart3, Loader2 } from 'lucide-react';
import { fetchDashboardData, DashboardData } from '../services/apiService';
import { useToast } from '@/hooks/use-toast';
import { getErrorToastConfig, logError, safeAsync } from '@/utils/errorHandling';

// Default usernames - these should come from user settings/profile in a real app
const DEFAULT_LEETCODE_USERNAME = 'Himfakeishe'; // Replace with actual username
const DEFAULT_CODEFORCES_HANDLE = 'Yash_ktii'; // Replace with actual handle

// Helper function to get difficulty colors
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

// Helper function to format numbers
const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

// Helper function to generate heatmap data from calendar
const generateHeatmapFromCalendar = (submissionCalendar: string) => {
  try {
    if (!submissionCalendar || typeof submissionCalendar !== 'string') {
      throw new Error('Invalid submission calendar data: Data is not a string');
    }
    
    const calendar = JSON.parse(submissionCalendar);
    
    if (!calendar || typeof calendar !== 'object') {
      throw new Error('Invalid calendar format: Parsed data is not an object');
    }
    
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today.getTime() - (52 * 7 * 24 * 60 * 60 * 1000)); // 52 weeks ago
    
    // Validate date calculations
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid date calculation');
    }
    
    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate.getTime() + ((week * 7 + day) * 24 * 60 * 60 * 1000));
        
        if (isNaN(currentDate.getTime())) {
          console.warn(`Invalid date calculation for week ${week}, day ${day}`);
          weekData.push(0);
          continue;
        }
        
        const timestamp = Math.floor(currentDate.getTime() / 1000).toString();
        const submissions = Number(calendar[timestamp]) || 0;
        
        // Ensure submissions is a valid number
        if (isNaN(submissions) || submissions < 0) {
          weekData.push(0);
        } else {
          weekData.push(Math.min(submissions, 50)); // Cap at 50 to prevent UI issues
        }
      }
      weeks.push(weekData);
    }
    
    return weeks;
  } catch (error) {
    console.warn('Error parsing submission calendar:', error);
    // Fallback to dummy data if parsing fails
    return Array(52).fill(0).map(() => Array(7).fill(0).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0));
  }
};

const Sidebar = ({ data, isLoading }: { data: DashboardData | null; isLoading: boolean }) => {
  const { toast } = useToast();
  
  // Safe data extraction with error handling
  const getLeetcodeProfile = () => {
    try {
      return data?.leetcode?.profile?.matchedUser || null;
    } catch (error) {
      console.warn('Error accessing LeetCode profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Access Error",
        description: "Unable to access LeetCode profile data",
        duration: 3000,
      });
      return null;
    }
  };

  const getCodeforcesUser = () => {
    try {
      return data?.codeforces?.userInfo?.result?.[0] || null;
    } catch (error) {
      console.warn('Error accessing Codeforces user:', error);
      toast({
        variant: "destructive",
        title: "Profile Access Error",
        description: "Unable to access Codeforces profile data",
        duration: 3000,
      });
      return null;
    }
  };

  const getUserDisplayName = () => {
    try {
      const leetcodeProfile = getLeetcodeProfile();
      const codeforcesUser = getCodeforcesUser();
      
      return (
        leetcodeProfile?.profile?.realName || 
        `${codeforcesUser?.firstName || ''} ${codeforcesUser?.lastName || ''}`.trim() || 
        'User'
      );
    } catch (error) {
      console.warn('Error getting user display name:', error);
      return 'User';
    }
  };

  const getUserInitial = () => {
    try {
      const leetcodeProfile = getLeetcodeProfile();
      const codeforcesUser = getCodeforcesUser();
      
      return (
        leetcodeProfile?.profile?.realName?.[0] || 
        codeforcesUser?.firstName?.[0] || 
        'U'
      );
    } catch (error) {
      console.warn('Error getting user initial:', error);
      return 'U';
    }
  };

  const getUsername = () => {
    try {
      const leetcodeProfile = getLeetcodeProfile();
      const codeforcesUser = getCodeforcesUser();
      
      return leetcodeProfile?.username || codeforcesUser?.handle || 'user';
    } catch (error) {
      console.warn('Error getting username:', error);
      return 'user';
    }
  };

  const getUserLocation = () => {
    try {
      const leetcodeProfile = getLeetcodeProfile();
      const codeforcesUser = getCodeforcesUser();
      
      return (
        leetcodeProfile?.profile?.location || 
        codeforcesUser?.city || 
        codeforcesUser?.country || 
        'Unknown'
      );
    } catch (error) {
      console.warn('Error getting user location:', error);
      return 'Unknown';
    }
  };

  const getUserOrganization = () => {
    try {
      const codeforcesUser = getCodeforcesUser();
      return codeforcesUser?.organization || 'Not specified';
    } catch (error) {
      console.warn('Error getting user organization:', error);
      return 'Not specified';
    }
  };

  return (
    <aside className="w-full lg:w-80 bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 min-h-[50vh] lg:min-h-[90vh]">
        {/* Profile */}
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-pink-600 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold mb-2">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                getUserInitial()
              )}
            </div>
            <h2 className="text-lg lg:text-xl font-semibold">
              {isLoading ? 'Loading...' : getUserDisplayName()}
            </h2>
            <p className="text-primary text-sm">
              @{isLoading ? '...' : getUsername()}
            </p>
            <button className="bg-orange-500 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm font-medium mt-2">
                <Lock className="inline w-4 h-4 mr-2" /> Get your Codolio Card
            </button>
        </div>
        {/* Socials */}
        <div className="flex gap-3 justify-center">
            <Mail className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Linkedin className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Twitter className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Globe className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Calendar className="w-5 h-5 text-muted-foreground cursor-pointer" />
        </div>
        {/* Location/Institution */}
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>📍</span> 
              <span>{isLoading ? 'Loading...' : getUserLocation()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🎓</span> 
              <span>{isLoading ? 'Loading...' : getUserOrganization()}</span>
            </div>
        </div>
        {/* About/Stats */}
        <div>
            <h3 className="text-sm font-semibold mb-3">About</h3>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Problem Solving Stats</span>
                    <span className="text-xs text-muted-foreground">^</span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center"><span className="text-xs">LC</span></div>
                        <span className="text-sm">LeetCode</span>
                        <div className={`w-2 h-2 rounded-full ml-auto ${data?.leetcode?.profile ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center"><span className="text-xs">CC</span></div>
                        <span className="text-sm">CodeChef</span>
                        <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center"><span className="text-xs">CF</span></div>
                        <span className="text-sm">Codeforces</span>
                        <div className={`w-2 h-2 rounded-full ml-auto ${data?.codeforces?.userInfo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
                <button className="flex items-center gap-2 text-orange-500 text-sm mt-3"><Plus className="w-4 h-4" /> Add Platform</button>
            </div>
        </div>
        {/* Development Stats */}
        <div>
            <h3 className="text-sm font-semibold mb-3">Development Stats</h3>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">Leaderboard</span><span className="text-primary text-xs">How it works ?</span></div>
                <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Global Rank</div>
                    <div className="text-xs text-muted-foreground">Based on C Score</div>
                    <div className="flex items-center gap-2 mt-2"><BarChart3 className="w-4 h-4" /><Lock className="w-4 h-4" /></div>
                </div>
            </div>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">View Leaderboard</button>
        </div>
        {/* Footer */}
        <div className="text-xs text-muted-foreground space-y-1 mt-auto">
            <div className="flex justify-between"><span>Profile Views:</span><span>0</span></div>
            <div className="flex justify-between"><span>Last Refresh:</span><span>{new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span>Profile Visibility:</span><span>Public</span></div>
        </div>
    </aside>
  );
};

const Dashboard2 = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                toast({
                    title: "Loading Dashboard",
                    description: "Fetching your coding statistics...",
                    duration: 2000,
                });

                const dashboardData = await fetchDashboardData(DEFAULT_LEETCODE_USERNAME, DEFAULT_CODEFORCES_HANDLE);
                setData(dashboardData);
                setRetryCount(0); // Reset retry count on success
                
                toast({
                    title: "Dashboard Loaded Successfully",
                    description: "Your coding statistics have been updated.",
                    duration: 3000,
                });
                
            } catch (err) {
                logError(err, 'Dashboard data fetch');
                const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
                setError(errorMessage);
                
                // Show error toast using utility
                toast(getErrorToastConfig(err));
                
                // Auto-retry logic
                if (retryCount < maxRetries) {
                    console.log(`Retrying... Attempt ${retryCount + 1}/${maxRetries}`);
                    
                    toast({
                        title: "Retrying...",
                        description: `Attempt ${retryCount + 1} of ${maxRetries}`,
                        duration: 2000,
                    });
                    
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 2000 * (retryCount + 1)); // Exponential backoff
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to Load Dashboard",
                        description: `Failed after ${maxRetries} attempts. Please try again later.`,
                        duration: 10000,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [retryCount, toast]);

    // Helper functions for data extraction with error handling
    const getTotalQuestions = (): number => {
        try {
            if (data?.leetcode?.profile?.matchedUser?.submitStats?.acSubmissionNum) {
                const submissions = data.leetcode.profile.matchedUser.submitStats.acSubmissionNum;
                if (Array.isArray(submissions)) {
                    const total = submissions.reduce((sum, item) => {
                        const count = Number(item?.count) || 0;
                        return sum + count;
                    }, 0);
                    return total;
                }
            }
            if (data?.codeforces?.solvedStats?.totalSolved) {
                return Number(data.codeforces.solvedStats.totalSolved) || 0;
            }
            return 297; // fallback
        } catch (error) {
            logError(error, 'getTotalQuestions');
            return 297; // fallback
        }
    };

    const getTotalActiveDays = (): number => {
        try {
            if (data?.codeforces?.activeDays?.activeDays) {
                return Number(data.codeforces.activeDays.activeDays) || 0;
            }
            if (data?.leetcode?.calendar?.data?.matchedUser?.userCalendar?.submissionCalendar) {
                const calendar = JSON.parse(data.leetcode.calendar.data.matchedUser.userCalendar.submissionCalendar);
                if (calendar && typeof calendar === 'object') {
                    return Object.keys(calendar).filter(date => Number(calendar[date]) > 0).length;
                }
            }
            return 114; // fallback
        } catch (error) {
            logError(error, 'getTotalActiveDays');
            return 114; // fallback
        }
    };

    const getHeatmapData = () => {
        try {
            if (data?.leetcode?.calendar?.data?.matchedUser?.userCalendar?.submissionCalendar) {
                return generateHeatmapFromCalendar(data.leetcode.calendar.data.matchedUser.userCalendar.submissionCalendar);
            }
        } catch (error) {
            logError(error, 'getHeatmapData');
        }
        // Fallback dummy data
        return Array(52).fill(0).map(() => Array(7).fill(0).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0));
    };

    const getLeetCodeStats = () => {
        try {
            if (data?.leetcode?.profile?.matchedUser?.submitStats?.acSubmissionNum && Array.isArray(data.leetcode.profile.matchedUser.submitStats.acSubmissionNum)) {
                const stats = data.leetcode.profile.matchedUser.submitStats.acSubmissionNum;
                const easy = Number(stats.find(s => s?.difficulty === 'Easy')?.count) || 0;
                const medium = Number(stats.find(s => s?.difficulty === 'Medium')?.count) || 0;
                const hard = Number(stats.find(s => s?.difficulty === 'Hard')?.count) || 0;
                return {
                    easy,
                    medium,
                    hard,
                    total: easy + medium + hard
                };
            }
        } catch (error) {
            logError(error, 'getLeetCodeStats');
        }
        return { easy: 75, medium: 142, hard: 35, total: 252 }; // fallback
    };

    const getCodeforcesStats = () => {
        try {
            const totalSolved = Number(data?.codeforces?.solvedStats?.totalSolved) || 0;
            const totalContests = Number(data?.codeforces?.contests?.totalContests) || 0;
            return {
                total: totalSolved,
                contests: totalContests
            };
        } catch (error) {
            logError(error, 'getCodeforcesStats');
            return { total: 45, contests: 8 }; // fallback
        }
    };

    const getContestRankings = () => {
        try {
            const leetcodeRating = Number(data?.leetcode?.contest?.data?.userContestRanking?.rating) || 1548;
            const codeforcesRating = Number(data?.codeforces?.userInfo?.result?.[0]?.rating) || 849;
            const codeforcesRank = data?.codeforces?.userInfo?.result?.[0]?.rank || 'newbie';
            
            return {
                leetcode: leetcodeRating,
                codeforces: codeforcesRating,
                codeforcesRank: String(codeforcesRank)
            };
        } catch (error) {
            logError(error, 'getContestRankings');
            return {
                leetcode: 1548,
                codeforces: 849,
                codeforcesRank: 'newbie'
            };
        }
    };

    const getTopicAnalysis = () => {
        try {
            if (data?.leetcode?.skills?.data?.matchedUser?.tagProblemCounts) {
                const skillData = data.leetcode.skills.data.matchedUser.tagProblemCounts;
                const allTopics = [
                    ...(Array.isArray(skillData.fundamental) ? skillData.fundamental : []),
                    ...(Array.isArray(skillData.intermediate) ? skillData.intermediate : []),
                    ...(Array.isArray(skillData.advanced) ? skillData.advanced : [])
                ];
                
                const processedTopics = allTopics
                    .filter(topic => topic && typeof topic === 'object' && topic.tagName && typeof topic.problemsSolved === 'number')
                    .sort((a, b) => Number(b.problemsSolved) - Number(a.problemsSolved))
                    .slice(0, 10)
                    .map(topic => ({
                        name: String(topic.tagName),
                        count: Number(topic.problemsSolved)
                    }));
                
                if (processedTopics.length > 0) {
                    return processedTopics;
                }
            }
        } catch (error) {
            logError(error, 'getTopicAnalysis');
        }
        // Fallback data
        return [
            { name: 'Arrays', count: 130 },
            { name: 'Dynamic Programming', count: 61 },
            { name: 'HashMap and Set', count: 45 },
            { name: 'String', count: 41 },
            { name: 'Sorting', count: 31 },
            { name: 'DFS', count: 30 },
            { name: 'Two Pointers', count: 26 },
            { name: 'Greedy Algorithms', count: 24 },
            { name: 'BFS', count: 23 },
            { name: 'Trees', count: 22 }
        ];
    };

    const handleRetry = () => {
        setRetryCount(0);
        setError(null);
        toast({
            title: "Retrying Dashboard Load",
            description: "Attempting to reload your coding statistics...",
            duration: 2000,
        });
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    {retryCount < maxRetries ? (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Retrying automatically... ({retryCount}/{maxRetries})
                            </p>
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span className="text-sm">Please wait</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Failed after {maxRetries} attempts
                            </p>
                            <button 
                                onClick={handleRetry}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="block w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const heatmapData = getHeatmapData();
    const leetcodeStats = getLeetCodeStats();
    const codeforcesStats = getCodeforcesStats();
    const contestRankings = getContestRankings();
    const topicAnalysis = getTopicAnalysis();

    return (
        <div className="flex flex-col lg:flex-row bg-background min-h-screen p-3 lg:p-6 gap-4 lg:gap-6">
            {/* Sidebar */}
            <Sidebar data={data} isLoading={isLoading} />
            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-4 lg:gap-6">
                {/* Row 1: 2 squares + 1 rectangle */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Total Questions */}
                    <div className="lg:col-span-2 bg-card rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center min-h-[110px]">
                        <div className="text-sm text-muted-foreground mb-2">Total Questions</div>
                        <div className="text-3xl lg:text-4xl font-bold">
                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : formatNumber(getTotalQuestions())}
                        </div>
                    </div>
                    {/* Total Active Days */}
                    <div className="lg:col-span-2 bg-card rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center min-h-[110px]">
                        <div className="text-sm text-muted-foreground mb-2">Total Active Days</div>
                        <div className="text-3xl lg:text-4xl font-bold">
                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : formatNumber(getTotalActiveDays())}
                        </div>
                    </div>
                    {/* Heatmap */}
                    <div className="md:col-span-2 lg:col-span-8 bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[110px]">
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-2 text-xs">
                            <span className="text-muted-foreground">
                                {isLoading ? 'Loading...' : 'Activity Overview'}
                            </span>
                        </div>
                        {/* Heatmap grid */}
                        {isLoading ? (
                            <div className="flex items-center justify-center h-24">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex items-end gap-1 overflow-x-auto pb-1">
                                {heatmapData.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-1">
                                        {week.map((day, dayIdx) => (
                                            <div 
                                                key={dayIdx} 
                                                className={`w-2 h-2 lg:w-3 lg:h-3 rounded ${
                                                    day > 0 ? 'bg-green-500' : 'bg-muted'
                                                }`}
                                                title={`${day} submissions`}
                                            ></div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                </div>
                {/* Row 2: 2 columns */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 flex-1">
                    {/* Column 1: 4 stacked blocks */}
                    <div className="xl:col-span-7 flex flex-col gap-4 lg:gap-6">
                        {/* Total Contests */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col gap-4 min-h-[90px]">
                            <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-2">
                                <span className="text-lg font-semibold">Total Contests</span>
                                {!isLoading && (
                                    <>
                                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <span>🏆</span> LeetCode <span className="ml-1">
                                                {(() => {
                                                    try {
                                                        return Number(data?.leetcode?.contest?.data?.userContestRanking?.attendedContestsCount) || 0;
                                                    } catch (error) {
                                                        console.warn('Error getting LeetCode contest count:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </span>
                                        </span>
                                        <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <span>🏅</span> Codeforces <span className="ml-1">
                                                {(() => {
                                                    try {
                                                        return Number(data?.codeforces?.contests?.totalContests) || 0;
                                                    } catch (error) {
                                                        console.warn('Error getting Codeforces contest count:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="text-3xl lg:text-4xl font-bold">
                                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : (() => {
                                    try {
                                        const leetcodeContests = Number(data?.leetcode?.contest?.data?.userContestRanking?.attendedContestsCount) || 0;
                                        const codeforcesContests = Number(data?.codeforces?.contests?.totalContests) || 0;
                                        return leetcodeContests + codeforcesContests || 10;
                                    } catch (error) {
                                        console.warn('Error calculating total contests:', error);
                                        return 10; // fallback
                                    }
                                })()}
                            </div>
                        </div>
                        {/* Rating Chart */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-muted-foreground">
                                    {isLoading ? 'Loading...' : 'Latest Contest Rating'}
                                </span>
                                <span className="text-lg font-bold ml-auto">
                                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (() => {
                                        try {
                                            return Number(contestRankings.leetcode) || 0;
                                        } catch (error) {
                                            console.warn('Error displaying contest rating:', error);
                                            return 0;
                                        }
                                    })()}
                                </span>
                            </div>
                            {!isLoading && (
                                <>
                                    <div className="text-xs text-muted-foreground mb-1">LeetCode Contest Rating</div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                        Global Ranking: {(() => {
                                            try {
                                                return data?.leetcode?.contest?.data?.userContestRanking?.globalRanking || 'N/A';
                                            } catch (error) {
                                                console.warn('Error getting global ranking:', error);
                                                return 'N/A';
                                            }
                                        })()}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                        Contests Attended: {(() => {
                                            try {
                                                return Number(data?.leetcode?.contest?.data?.userContestRanking?.attendedContestsCount) || 0;
                                            } catch (error) {
                                                console.warn('Error getting attended contests:', error);
                                                return 0;
                                            }
                                        })()}
                                    </div>
                                </>
                            )}
                            {/* Rating visualization */}
                            <div className="w-full h-16 lg:h-24 bg-gradient-to-t from-blue-700/30 to-blue-400/60 rounded mt-2 flex items-end">
                                <div className="w-full h-3/4 bg-gradient-to-r from-blue-400/80 to-blue-700/40 rounded-b-full"></div>
                            </div>
                        </div>
                        {/* Awards */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[90px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-semibold">Awards</span>
                                <span className="text-lg font-bold">2</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <span className="text-3xl lg:text-4xl">🏅</span>
                                <span className="text-3xl lg:text-4xl">🛡️</span>
                            </div>
                            <button className="text-blue-400 text-sm underline w-fit">show more</button>
                        </div>
                        {/* DSA Topic Analysis */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-semibold">DSA Topic Analysis</span>
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            </div>
                            {/* Topic bar chart */}
                            <div className="space-y-1">
                                {(() => {
                                    try {
                                        return topicAnalysis.map((topic, idx) => {
                                            const maxCount = topicAnalysis[0]?.count || 1;
                                            const count = Number(topic.count) || 0;
                                            const name = String(topic.name) || 'Unknown';
                                            
                                            return (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="w-24 lg:w-32 text-xs text-muted-foreground truncate" title={name}>
                                                        {name}
                                                    </span>
                                                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                                            style={{ width: `${Math.min((count / maxCount) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-white w-6 lg:w-8 text-right">{count}</span>
                                                </div>
                                            );
                                        });
                                    } catch (error) {
                                        console.warn('Error rendering topic analysis:', error);
                                        return (
                                            <div className="text-sm text-muted-foreground text-center py-4">
                                                Unable to load topic analysis
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                            <button className="text-blue-400 text-sm underline mt-2 w-fit">show more</button>
                        </div>
                    </div>
                    {/* Column 2: 2 stacked blocks */}
                    <div className="xl:col-span-5 flex flex-col gap-4 lg:gap-6">
                        {/* Problems Solved + Competitive Programming Donut */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 h-auto lg:h-60 flex flex-col gap-4 lg:gap-6">
                            <div>
                                <div className="text-lg font-semibold mb-2">Problems Solved</div>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                                        {/* LeetCode DSA Donut */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-8 border-yellow-400 border-t-red-500 border-b-green-500 border-l-yellow-400 flex items-center justify-center text-2xl lg:text-3xl font-bold mb-2">
                                                {(() => {
                                                    try {
                                                        return Number(leetcodeStats.total) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying LeetCode total:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">LeetCode</div>
                                            <div className="text-xs text-green-400">
                                                Easy {(() => {
                                                    try {
                                                        return Number(leetcodeStats.easy) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying LeetCode easy:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                            <div className="text-xs text-yellow-400">
                                                Medium {(() => {
                                                    try {
                                                        return Number(leetcodeStats.medium) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying LeetCode medium:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                            <div className="text-xs text-red-400">
                                                Hard {(() => {
                                                    try {
                                                        return Number(leetcodeStats.hard) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying LeetCode hard:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                        {/* Codeforces Donut */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-8 border-blue-400 border-t-green-500 border-b-blue-400 border-l-blue-400 flex items-center justify-center text-xl lg:text-2xl font-bold mb-2">
                                                {(() => {
                                                    try {
                                                        return Number(codeforcesStats.total) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying Codeforces total:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                            <div className="text-xs text-muted-foreground text-center">Codeforces</div>
                                            <div className="text-xs text-blue-400">
                                                Problems {(() => {
                                                    try {
                                                        return Number(codeforcesStats.total) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying Codeforces problems:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                            <div className="text-xs text-green-400">
                                                Contests {(() => {
                                                    try {
                                                        return Number(codeforcesStats.contests) || 0;
                                                    } catch (error) {
                                                        console.warn('Error displaying Codeforces contests:', error);
                                                        return 0;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Contest Rankings */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Contest Rankings</h3>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6 lg:mb-8">
                                            <div className="text-xs text-muted-foreground mb-1 text-center">LEETCODE</div>
                                            <div className="flex flex-col items-center mb-2">
                                                <div className="flex gap-1 mb-1">
                                                    <span className="text-blue-400 text-xl">🏆</span>
                                                </div>
                                                <div className="text-2xl lg:text-3xl font-bold">
                                                    {(() => {
                                                        try {
                                                            return Number(contestRankings.leetcode) || 0;
                                                        } catch (error) {
                                                            console.warn('Error displaying LeetCode ranking:', error);
                                                            return 0;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-center">
                                                (contests: {(() => {
                                                    try {
                                                        return Number(data?.leetcode?.contest?.data?.userContestRanking?.attendedContestsCount) || 0;
                                                    } catch (error) {
                                                        console.warn('Error getting LeetCode contest count:', error);
                                                        return 0;
                                                    }
                                                })()})
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground mb-1 text-center">CODEFORCES</div>
                                            <div className="flex flex-col items-center mb-2">
                                                <div className="text-lg lg:text-xl font-bold text-muted-foreground capitalize">
                                                    {(() => {
                                                        try {
                                                            return String(contestRankings.codeforcesRank);
                                                        } catch (error) {
                                                            console.warn('Error getting Codeforces rank:', error);
                                                            return 'newbie';
                                                        }
                                                    })()}
                                                </div>
                                                <div className="text-2xl lg:text-3xl font-bold">
                                                    {(() => {
                                                        try {
                                                            return Number(contestRankings.codeforces) || 0;
                                                        } catch (error) {
                                                            console.warn('Error displaying Codeforces rating:', error);
                                                            return 0;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-center">
                                                (max: {(() => {
                                                    try {
                                                        return Number(data?.codeforces?.userInfo?.result?.[0]?.maxRating) || Number(contestRankings.codeforces) || 0;
                                                    } catch (error) {
                                                        console.warn('Error getting max rating:', error);
                                                        return 0;
                                                    }
                                                })()})
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard2;