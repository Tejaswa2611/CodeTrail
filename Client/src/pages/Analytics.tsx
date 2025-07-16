import React, { useState, useEffect, useCallback } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, Lightbulb, BookOpen, Clock, Star, ChevronRight, Play, ExternalLink, AlertCircle, CheckCircle, BarChart, Users, Zap, RefreshCw, HelpCircle, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { dashboardApi } from '../services/apiService';
import { AnalyticsContentLoader } from '../components/MatrixContentLoader';

// Mock data - will be replaced with real API data later
const mockAnalysis = {
    overallProgress: {
        score: 75,
        level: "Intermediate",
        strongAreas: ["Arrays", "Dynamic Programming", "Hash Tables"],
        weakAreas: ["Graph Algorithms", "Tree Traversal", "Backtracking"],
        improvementTrend: "+12% this month",
        recentProgress: {
            lastWeekSolved: 8,
            lastMonthSolved: 25,
            averageWeeklySolved: 6,
            consistencyScore: 85, // How consistent user is in solving problems
            difficultyProgression: "improving", // easy -> medium -> hard
            ratingTrend: {
                codeforces: { current: 1542, change: +22, trend: "improving" },
                leetcode: { current: 1685, change: -15, trend: "declining" }
            }
        }
    }
};

const Analytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [recentProgressData, setRecentProgressData] = useState({
        thisWeekSolved: 0,
        thisMonthSolved: 0,
        consistencyScore: 0,
        weeklyAverage: 0
    });
    const [contestRatings, setContestRatings] = useState({
        codeforces: null as number | null,
        leetcode: null as number | null,
        codeforcesRank: 'unrated' as string
    });
    const [dailySubmissionsData, setDailySubmissionsData] = useState<{
        date: string;
        displayDate?: string;
        leetcode: number;
        codeforces: number;
        total: number;
    }[]>([]);
    const [leetcodeHandle, setLeetcodeHandle] = useState<string | null>(null);
    const { actualTheme } = useTheme();
    const isMobile = useIsMobile();

    // Function to calculate metrics from submission calendar
    const calculateProgressMetrics = (submissionCalendar: string) => {
        const calendar = JSON.parse(submissionCalendar);
        const now = new Date();

        console.log('🔍 DEBUG: Current date:', now.toISOString());
        console.log('🔍 DEBUG: Day of week (0=Sunday):', now.getDay());

        // Calculate week boundaries - Let's try last 7 days instead of Sunday-based week
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        console.log('🔍 DEBUG: Seven days ago:', sevenDaysAgo.toISOString());

        // Also keep Sunday-based week for comparison
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Go to Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        console.log('🔍 DEBUG: Start of week (Sunday):', startOfWeek.toISOString());

        // Calculate month boundaries
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        console.log('🔍 DEBUG: Start of month:', startOfMonth.toISOString());

        // Calculate last 4 weeks for average
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

        // Calculate last 30 days for consistency
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let thisWeekSolved = 0;
        let last7DaysSolved = 0;
        let thisMonthSolved = 0;
        let last4WeeksSolved = 0;
        let activeDaysLast30 = 0;

        console.log('🔍 DEBUG: Calendar entries count:', Object.keys(calendar).length);

        Object.entries(calendar).forEach(([timestamp, count]) => {
            const originalDate = new Date(parseInt(timestamp) * 1000);
            // Subtract 1 day to fix the date shifting issue (same as dashboard)
            const adjustedDate = new Date(originalDate);
            adjustedDate.setDate(originalDate.getDate() - 1);
            const submissionCount = count as number;

            // Debug recent entries
            if (adjustedDate >= thirtyDaysAgo) {
                console.log('🔍 DEBUG: Recent entry:', {
                    originalTimestamp: timestamp,
                    originalDate: originalDate.toISOString(),
                    adjustedDate: adjustedDate.toISOString(),
                    dateString: adjustedDate.toDateString(),
                    count: submissionCount,
                    isThisWeekSunday: adjustedDate >= startOfWeek,
                    isLast7Days: adjustedDate >= sevenDaysAgo,
                    isThisMonth: adjustedDate >= startOfMonth
                });
            }

            // This week calculations (Sunday-based)
            if (adjustedDate >= startOfWeek) {
                thisWeekSolved += submissionCount;
            }

            // Last 7 days calculation
            if (adjustedDate >= sevenDaysAgo) {
                last7DaysSolved += submissionCount;
            }

            // This month calculations
            if (adjustedDate >= startOfMonth) {
                thisMonthSolved += submissionCount;
            }

            // Last 4 weeks for average
            if (adjustedDate >= fourWeeksAgo) {
                last4WeeksSolved += submissionCount;
            }

            // Active days in last 30 days for consistency
            if (adjustedDate >= thirtyDaysAgo && submissionCount > 0) {
                activeDaysLast30++;
            }
        });

        // Calculate metrics
        const weeklyAverage = Math.round(last4WeeksSolved / 4);
        const consistencyScore = Math.round((activeDaysLast30 / 30) * 100);

        console.log('🔍 DEBUG: Final calculations:', {
            thisWeekSolved: thisWeekSolved,
            last7DaysSolved: last7DaysSolved,
            thisMonthSolved,
            weeklyAverage,
            consistencyScore,
            last4WeeksSolved,
            activeDaysLast30
        });

        // Use last 7 days instead of Sunday-based week
        return {
            thisWeekSolved: last7DaysSolved, // Using last 7 days for more accurate "this week"
            thisMonthSolved,
            weeklyAverage,
            consistencyScore
        };
    };

    // Fetch user's platform profiles to get LeetCode handle and ratings
    const fetchUserProfiles = useCallback(async () => {
        try {
            console.log('🔍 DEBUG: Fetching user platform profiles...');
            const profiles = await dashboardApi.getUserPlatformProfiles();
            console.log('🔍 DEBUG: Platform profiles response:', profiles);

            // Extract LeetCode handle
            let leetcodeHandle = null;
            if (profiles?.connectedPlatforms?.leetcode?.handle) {
                leetcodeHandle = profiles.connectedPlatforms.leetcode.handle;
                console.log('🔍 DEBUG: Found LeetCode handle:', leetcodeHandle);
                setLeetcodeHandle(leetcodeHandle);
            } else {
                console.warn('🔍 DEBUG: No LeetCode handle found in user profiles');
            }

            // Extract contest ratings from platform profiles (same logic as dashboard)
            const codeforcesRating = profiles?.connectedPlatforms?.codeforces?.currentRating || null;
            const codeforcesRank = profiles?.connectedPlatforms?.codeforces?.rank || 'unrated';

            // For LeetCode rating, we'll need to get it from dashboard stats
            // Let's fetch dashboard stats to get contest rankings
            const dashboardStats = await dashboardApi.getDashboardStats();
            const leetcodeRating = dashboardStats?.contestRankings?.latest?.leetcode?.rank || null;

            console.log('🔍 DEBUG: Contest ratings:', {
                codeforces: codeforcesRating,
                codeforcesRank,
                leetcode: leetcodeRating
            });

            setContestRatings({
                codeforces: codeforcesRating,
                leetcode: leetcodeRating,
                codeforcesRank: String(codeforcesRank)
            });

            return leetcodeHandle;
        } catch (error) {
            console.error('Error fetching user profiles:', error);
            return null;
        }
    }, []);

    // Fetch daily submissions data for the chart
    const fetchDailySubmissions = useCallback(async () => {
        try {
            console.log('🔍 DEBUG: Fetching daily submissions data...');
            const data = await dashboardApi.getDailySubmissions();
            console.log('🔍 DEBUG: Daily submissions response:', data);

            if (data?.dailySubmissions) {
                // Format data for the chart with proper date formatting
                const formattedData = data.dailySubmissions.map(entry => ({
                    date: entry.date,
                    displayDate: new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    leetcode: entry.leetcode,
                    codeforces: entry.codeforces,
                    total: entry.total
                }));

                setDailySubmissionsData(formattedData);
                console.log('🔍 DEBUG: Formatted daily submissions data:', formattedData.length, 'entries');
            } else {
                console.warn('🔍 DEBUG: No daily submissions data found');
                setDailySubmissionsData([]);
            }
        } catch (error) {
            console.error('Error fetching daily submissions:', error);
            setDailySubmissionsData([]);
        }
    }, []);

    // Fetch real progress data
    const fetchProgressData = useCallback(async (handle: string) => {
        try {
            console.log('🔍 DEBUG: Fetching progress data for handle:', handle);
            const response = await fetch(`http://localhost:3001/api/leetcode/user/${handle}/profile`);
            console.log('🔍 DEBUG: API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('🔍 DEBUG: API response data keys:', Object.keys(data));

                if (data.data?.matchedUser?.submissionCalendar) {
                    console.log('🔍 DEBUG: Found submission calendar, length:', data.data.matchedUser.submissionCalendar.length);
                    const metrics = calculateProgressMetrics(data.data.matchedUser.submissionCalendar);
                    setRecentProgressData(metrics);
                } else {
                    console.warn('🔍 DEBUG: No submission calendar found in response');
                    console.log('🔍 DEBUG: Response structure:', JSON.stringify(data, null, 2));
                }
            } else {
                console.warn('Failed to fetch LeetCode profile data, status:', response.status);
                const errorText = await response.text();
                console.warn('Error response:', errorText);
            }
        } catch (error) {
            console.error('Error fetching progress data:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            console.log('🔍 DEBUG: Starting to load Analytics data...');

            // First get the user's LeetCode handle
            const handle = await fetchUserProfiles();

            // Fetch daily submissions data
            await fetchDailySubmissions();

            // Then fetch progress data if handle exists
            if (handle) {
                console.log('🔍 DEBUG: LeetCode handle found, fetching progress data...');
                await fetchProgressData(handle);
            } else {
                console.log('🔍 DEBUG: No LeetCode handle found, skipping progress data fetch');
            }

            // Simulate additional loading time
            setTimeout(() => setIsLoading(false), 1000);
        };

        loadData();
    }, [fetchUserProfiles, fetchDailySubmissions, fetchProgressData]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-3 lg:p-6">
                <AnalyticsContentLoader size="lg" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen ${isMobile ? 'p-2 gap-2' : 'p-3 lg:p-6 gap-4 lg:gap-6'}`}>
            {/* Main Content */}
            <main className={`flex-1 flex flex-col ${isMobile ? 'gap-2' : 'gap-4 lg:gap-6'}`}>
                {/* Header */}
                <div className={`bg-card/70 backdrop-blur-sm border border-border rounded-lg ${isMobile ? 'p-2' : 'p-6'} relative`}>
                    <div className="absolute top-4 right-4">
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                            <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Comprehensive analytics and insights about your coding progress
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Analytics & Insights</h1>
                            <p className="text-muted-foreground">Detailed analysis of your coding journey</p>
                        </div>
                    </div>
                </div>

                {/* Quick Navigate Section */}


                {/* Overview Section - Moved from AI Coach */}
                <div className="space-y-6">
                    <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'lg:grid-cols-3 gap-6'}`}>
                        {/* Overall Progress */}
                        <div className="lg:col-span-2 bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Your coding progress overview and performance metrics
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Overall Progress & Trends
                            </h2>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                {/* Daily Submissions Chart */}
                                <div className="bg-secondary/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <BarChart className="w-4 h-4" />
                                            Daily Submissions Trend
                                        </h3>
                                        <div className="group relative">
                                            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                            <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Your daily coding activity over the last 30 days
                                            </div>
                                        </div>
                                    </div>

                                    {dailySubmissionsData.length > 0 ? (
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={dailySubmissionsData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} />
                                                    <XAxis
                                                        dataKey="displayDate"
                                                        stroke="currentColor"
                                                        fontSize={10}
                                                        interval="preserveStartEnd"
                                                    />
                                                    <YAxis stroke="currentColor" fontSize={10} />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'hsl(var(--popover))',
                                                            border: '1px solid hsl(var(--border))',
                                                            borderRadius: '6px',
                                                            fontSize: '12px'
                                                        }}
                                                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="total"
                                                        stroke="hsl(var(--primary))"
                                                        strokeWidth={2}
                                                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                                                        activeDot={{ r: 5, stroke: 'hsl(var(--primary))' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="leetcode"
                                                        stroke="#f59e0b"
                                                        strokeWidth={1}
                                                        strokeDasharray="3 3"
                                                        dot={false}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="codeforces"
                                                        stroke="#3b82f6"
                                                        strokeWidth={1}
                                                        strokeDasharray="3 3"
                                                        dot={false}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                                            <div className="text-center">
                                                <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No submission data available</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Legend */}
                                    <div className="flex justify-center gap-4 mt-3 text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-0.5 bg-primary"></div>
                                            <span>Total</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                                            <span>LeetCode</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-0.5 border-t-2 border-dashed border-blue-500"></div>
                                            <span>Codeforces</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Strong Areas and Improvement Areas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-medium text-green-500 mb-2">Strong Areas</h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Coming soon with AI</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-red-500 mb-2">Areas for Improvement</h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Coming soon with AI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Trends Section */}
                            <div className="border-t border-border pt-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <BarChart className="w-4 h-4" />
                                    Recent Progress Analysis
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg relative group">
                                        <div className="absolute top-1 right-1">
                                            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                                            <div className="absolute top-4 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Submissions made in the last 7 days
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-green-500">
                                            {recentProgressData.thisWeekSolved}
                                        </div>
                                        <div className="text-xs text-muted-foreground">This Week</div>
                                    </div>
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg relative group">
                                        <div className="absolute top-1 right-1">
                                            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                                            <div className="absolute top-4 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Submissions made since the start of this month
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold">
                                            {recentProgressData.thisMonthSolved}
                                        </div>
                                        <div className="text-xs text-muted-foreground">This Month</div>
                                    </div>
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg relative group">
                                        <div className="absolute top-1 right-1">
                                            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                                            <div className="absolute top-4 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Percentage of days you made submissions in last 30 days
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-blue-500">
                                            {recentProgressData.consistencyScore}%
                                        </div>
                                        <div className="text-xs text-muted-foreground">Consistency</div>
                                    </div>
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg relative group">
                                        <div className="absolute top-1 right-1">
                                            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                                            <div className="absolute top-4 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Average submissions made per week in last 4 weeks
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-yellow-500">
                                            {recentProgressData.weeklyAverage}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Weekly Avg</div>
                                    </div>
                                </div>

                                {/* Rating Trends */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Codeforces Rating</span>
                                            <span className="text-lg font-bold">
                                                {contestRatings.codeforces ? contestRatings.codeforces : 'N/A'}
                                            </span>
                                        </div>
                                        {contestRatings.codeforces && (
                                            <div className="flex items-center gap-1">
                                                {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.trend === 'improving' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change > 0
                                                        ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change > 0 ? '+' : ''}
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">LeetCode Rating</span>
                                            <span className="text-lg font-bold">
                                                {contestRatings.leetcode ? contestRatings.leetcode : 'N/A'}
                                            </span>
                                        </div>
                                        {contestRatings.leetcode && (
                                            <div className="flex items-center gap-1">
                                                {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.trend === 'improving' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change > 0
                                                        ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change > 0 ? '+' : ''}
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Navigate & Progress Insights Column */}
                        <div className="space-y-6">
                            {/* Quick Navigate Section */}
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                                <div className="absolute top-4 right-4">
                                    <div className="group relative">
                                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                        <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            Quick access to common coding activities
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Quick Navigate
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* AI Mentor */}
                                    <div className="bg-secondary/20 rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer group">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                    <MessageCircle className="w-5 h-5 text-purple-500" />
                                                </div>
                                                <h3 className="font-medium">AI Mentor</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Get personalized guidance and coding advice
                                            </p>
                                            <button
                                                onClick={() => window.location.href = '/ai-coach#mentor'}
                                                className="w-full text-xs px-3 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Brain className="w-3 h-3" />
                                                Open AI Mentor
                                            </button>
                                        </div>
                                    </div>

                                    {/* Topic Wise Analysis */}
                                    <div className="bg-secondary/20 rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer group">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                    <Target className="w-5 h-5 text-green-500" />
                                                </div>
                                                <h3 className="font-medium">Topic Wise Analysis</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Analyse weak topics with AI and get detailed insights
                                            </p>
                                            <button
                                                onClick={() => window.location.href = '/ai-coach#topics'}
                                                className="w-full text-xs px-3 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Brain className="w-3 h-3" />
                                                Topic Analysis
                                            </button>
                                        </div>
                                    </div>

                                    {/* Suggested Questions */}
                                    <div className="bg-secondary/20 rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer group">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                                                    <BookOpen className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <h3 className="font-medium">Suggested Questions</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Get AI-suggested problems tailored to your skill level
                                            </p>
                                            <button
                                                onClick={() => window.location.href = '/ai-coach#questions'}
                                                className="w-full text-xs px-3 py-2 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Target className="w-3 h-3" />
                                                Suggested Questions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Insights Section */}
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                                <div className="absolute top-4 right-4">
                                    <div className="group relative">
                                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                        <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            AI-generated insights about your progress
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Progress Insights
                                </h2>

                                <div className="space-y-3">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                                Improving!
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            You solved 33% more problems this week compared to last week. Keep it up!
                                        </p>
                                    </div>

                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                Consistency Win
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            You've solved problems for 5 consecutive days!
                                        </p>
                                    </div>

                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Lightbulb className="w-4 h-4 text-purple-500" />
                                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                Coming Soon
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-600 dark:text-purple-400">
                                            More insights will be added after AI integration
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
