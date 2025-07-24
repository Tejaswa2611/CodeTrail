import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mail, Linkedin, Twitter, Globe, Calendar, Lock, ExternalLink, AlertTriangle, Plus, BarChart3, HelpCircle, User, Code, Target, Flame, Trophy } from 'lucide-react';
import { fetchDashboardData, DashboardStats, dashboardApi } from '../services/apiService';
import { useToast } from '@/hooks/use-toast';
import { getErrorToastConfig, logError, safeAsync } from '@/utils/errorHandling';
import ContestRatingGraph from '../components/ContestRatingGraph';
import { useTheme } from '../contexts/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeLoader, CodeSpinLoader, MatrixDotsLoader, OrbitLoader, CardSkeletonLoader, TypingLoader } from '@/components/ThemeLoaders';

// Import platform images
import codeforcesDarkLogo from '../assets/codeforces_dark.png';
import codeforcesLightLogo from '../assets/codeforces_light.png';
import leetcodeDarkLogo from '../assets/leetcode_dark.png';
import leetcodeLightLogo from '../assets/leetcode_light.png';

// Helper function to get theme-appropriate platform logos
const getPlatformLogo = (platform: 'leetcode' | 'codeforces', theme: 'light' | 'dark') => {
    if (platform === 'leetcode') {
        return theme === 'dark' ? leetcodeDarkLogo : leetcodeLightLogo;
    } else {
        return theme === 'dark' ? codeforcesDarkLogo : codeforcesLightLogo;
    }
};

// Simple tooltip component
const InfoTooltip = ({ message }: { message: string }) => {
    return (
        <div className="relative group">
            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm text-popover-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {message}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
            </div>
        </div>
    );
};

// Loading skeleton component
const LoadingSkeleton = ({ className = "h-4 w-20" }: { className?: string }) => (
    <CardSkeletonLoader className={className} />
);

// Loading spinner component (legacy - replaced with ThemeLoaders)
const LoadingSpinner = ({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) => {
    return <ThemeLoader variant="code" size={size} text={text} />;
};

// Helper function to get difficulty colors
const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-success';
        case 'medium': return 'text-warning';
        case 'hard': return 'text-destructive';
        default: return 'text-muted-foreground';
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

const Sidebar = ({ data, isLoading, refreshData }: { data: DashboardStats | null; isLoading: boolean; refreshData: () => Promise<void> }) => {
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
    const [platformHandle, setPlatformHandle] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { actualTheme } = useTheme();
    const isMobile = useIsMobile();

    // Get user profile data
    const getUserProfile = () => {
        try {
            return data?.userInfo?.profile || null;
        } catch (error) {
            console.warn('Error accessing user profile:', error);
            return null;
        }
    };

    // Safe data extraction with error handling
    const getLeetcodeProfile = () => {
        try {
            return data?.userInfo?.connectedPlatforms?.leetcode || null;
        } catch (error) {
            console.warn('Error accessing LeetCode profile:', error);
            return null;
        }
    };

    const getCodeforcesProfile = () => {
        try {
            return data?.userInfo?.connectedPlatforms?.codeforces || null;
        } catch (error) {
            console.warn('Error accessing Codeforces profile:', error);
            return null;
        }
    };

    const handlePlatformEdit = (platform: string) => {
        const currentHandle = platform === 'leetcode'
            ? getLeetcodeProfile()?.handle || ''
            : getCodeforcesProfile()?.handle || '';

        setPlatformHandle(currentHandle);
        setEditingPlatform(platform);
    };

    const { toast } = useToast();

    const handlePlatformSave = async () => {
        console.log('🎯 handlePlatformSave called with:', { editingPlatform, platformHandle: platformHandle.trim() });

        if (!editingPlatform || !platformHandle.trim()) {
            console.log('❌ Missing editingPlatform or platformHandle');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a valid handle",
                duration: 3000,
            });
            return;
        }

        setIsSaving(true);

        try {
            // Show loading toast
            toast({
                title: "Updating Platform Handle",
                description: `Validating and syncing ${editingPlatform} data...`,
                duration: 5000,
            });

            console.log('🔄 Calling dashboardApi.updatePlatformHandle...');
            // Make API call to update platform handle
            const response = await dashboardApi.updatePlatformHandle(editingPlatform, platformHandle.trim());
            console.log('📥 API response:', response);

            if (response?.success) {
                console.log('✅ Update successful');
                toast({
                    title: "Success",
                    description: `${editingPlatform} handle updated and data synced successfully`,
                    duration: 4000,
                });

                // Reset editing state
                setEditingPlatform(null);
                setPlatformHandle('');

                // Refresh dashboard data to show updated platform details
                console.log('🔄 Refreshing dashboard data after platform handle update...');
                await refreshData();

                toast({
                    title: "Dashboard Updated",
                    description: "Your profile and statistics have been refreshed with the latest data",
                    duration: 3000,
                });
            } else {
                console.log('❌ Update failed:', response?.message);
                throw new Error(response?.message || 'Failed to update handle');
            }
        } catch (error) {
            console.error('Error in handlePlatformSave:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update platform handle';

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
                duration: 5000,
            });

            // Don't reset editing state on error so user can try again
        } finally {
            setIsSaving(false);
        }
    };

    const userProfile = getUserProfile();
    const leetcodeProfile = getLeetcodeProfile();
    const codeforcesProfile = getCodeforcesProfile();

    return (
        <Card className={`w-full lg:w-80 modern-card shadow-medium ${isMobile ? 'p-2 gap-2 min-h-[30vh]' : 'p-4 lg:p-6 gap-4 lg:gap-6 min-h-[50vh] lg:min-h-[90vh]'} flex flex-col`}>
            {/* User Profile Section */}
            <div className="flex flex-col items-center gap-3 pb-6 border-b border-border">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold text-white shadow-lg">
                    {isLoading ? (
                        <OrbitLoader size="md" />
                    ) : (
                        userProfile?.firstName?.[0]?.toUpperCase() || <User className="w-8 h-8" />
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-lg lg:text-xl font-semibold text-foreground">
                        {isLoading ? (
                            <LoadingSkeleton className="w-32 h-5 mx-auto" />
                        ) : (
                            userProfile ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : 'User'
                        )}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? (
                            <LoadingSkeleton className="w-24 h-4 mx-auto" />
                        ) : (
                            userProfile?.email || 'No email'
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Joined: {isLoading ? (
                            <LoadingSkeleton className="w-20 h-3 inline-block" />
                        ) : (
                            userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'
                        )}
                    </p>
                </div>
            </div>

            {/* Platform Profiles Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Connected Platforms
                </h3>
                <div className="space-y-3">
                    {/* LeetCode */}
                    <Card className="p-3 hover:shadow-medium transition-all duration-200">
                        <div className="flex items-center gap-3 mb-2">
                            <img 
                                src={getPlatformLogo('leetcode', actualTheme)} 
                                alt="LeetCode" 
                                className="w-5 h-5 object-contain"
                            />

                            {editingPlatform === 'leetcode' ? (
                                <div className="flex-1 text-sm font-medium text-foreground">
                                    Edit LeetCode Handle
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handlePlatformEdit('leetcode')}
                                        className="flex-1 text-left text-sm hover:text-primary transition-colors"
                                    >
                                        LeetCode {leetcodeProfile?.handle ? `(@${leetcodeProfile.handle})` : ''}
                                    </button>
                                    <div className={`w-2 h-2 rounded-full ${leetcodeProfile ? 'bg-success animate-pulse' : 'bg-destructive'}`}></div>
                                </>
                            )}
                        </div>

                        {editingPlatform === 'leetcode' && (
                            <div className="space-y-3 ml-8">
                                <Input
                                    type="text"
                                    value={platformHandle}
                                    onChange={(e) => setPlatformHandle(e.target.value)}
                                    placeholder="Enter LeetCode handle"
                                    className="text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handlePlatformSave}
                                        disabled={isSaving}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {isSaving && <LoadingSpinner size="sm" />}
                                        {isSaving ? 'Syncing...' : 'Save & Sync'}
                                    </Button>
                                    <Button
                                        onClick={() => setEditingPlatform(null)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Codeforces */}
                    <Card className="p-3 hover:shadow-medium transition-all duration-200">
                        <div className="flex items-center gap-3 mb-2">
                            <img 
                                src={getPlatformLogo('codeforces', actualTheme)} 
                                alt="Codeforces" 
                                className="w-5 h-5 object-contain"
                            />

                            {editingPlatform === 'codeforces' ? (
                                <div className="flex-1 text-sm font-medium text-foreground">
                                    Edit Codeforces Handle
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handlePlatformEdit('codeforces')}
                                        className="flex-1 text-left text-sm hover:text-primary transition-colors"
                                    >
                                        Codeforces {codeforcesProfile?.handle ? `(@${codeforcesProfile.handle})` : ''}
                                    </button>
                                    <div className={`w-2 h-2 rounded-full ${codeforcesProfile ? 'bg-success animate-pulse' : 'bg-destructive'}`}></div>
                                </>
                            )}
                        </div>

                        {editingPlatform === 'codeforces' && (
                            <div className="space-y-3 ml-8">
                                <Input
                                    type="text"
                                    value={platformHandle}
                                    onChange={(e) => setPlatformHandle(e.target.value)}
                                    placeholder="Enter Codeforces handle"
                                    className="text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handlePlatformSave}
                                        disabled={isSaving}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {isSaving && <LoadingSpinner size="sm" />}
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        onClick={() => setEditingPlatform(null)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Rating info for Codeforces if available */}
                        {codeforcesProfile && codeforcesProfile.currentRating && (
                            <div className="text-xs text-muted-foreground ml-8 mt-2">
                                Rating: {codeforcesProfile.currentRating} ({codeforcesProfile.rank || 'Unrated'})
                                {codeforcesProfile.maxRating && (
                                    <span> • Max: {codeforcesProfile.maxRating}</span>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Quick Stats
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            Problems Solved
                        </span>
                        <span className="font-medium text-foreground">
                            {isLoading ? <LoadingSkeleton className="w-8 h-4" /> : (data?.totalQuestions?.total || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Flame className="w-3 h-3" />
                            Active Days
                        </span>
                        <span className="font-medium text-foreground">
                            {isLoading ? <LoadingSkeleton className="w-8 h-4" /> : (data?.totalActiveDays?.total || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Trophy className="w-3 h-3" />
                            Contests
                        </span>
                        <span className="font-medium text-foreground">
                            {isLoading ? <LoadingSkeleton className="w-8 h-4" /> : (data?.totalContests?.total || 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-muted-foreground space-y-2 mt-auto pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                    <span>Last Refresh:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Profile Status:</span>
                    <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                        Active
                    </span>
                </div>
            </div>
        </Card>
    );
};

const Dashboard2 = () => {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [showAllTopics, setShowAllTopics] = useState(false);
    const [selectedContestPlatform, setSelectedContestPlatform] = useState<'all' | 'leetcode' | 'codeforces'>('all');
    const maxRetries = 3;
    const { toast } = useToast();
    const { actualTheme } = useTheme();
    const heatmapRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Extract fetchData function to be reusable with useCallback
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const dashboardData = await fetchDashboardData();
            setData(dashboardData);
            setRetryCount(0); // Reset retry count on success

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
    }, [toast, retryCount, maxRetries]);

    useEffect(() => {
        const initialFetch = async () => {
            toast({
                title: "Loading Dashboard",
                description: "Fetching your coding statistics...",
                duration: 2000,
            });

            await fetchData();

            if (!error) {
                toast({
                    title: "Dashboard Loaded Successfully",
                    description: "Your coding statistics have been updated.",
                    duration: 3000,
                });
            }
        };

        initialFetch();
    }, [fetchData, toast, error]); // Now fetchData is properly memoized

    // Scroll heatmap to the latest (rightmost) position when data loads
    useEffect(() => {
        if (!isLoading && data && heatmapRef.current) {
            const timer = setTimeout(() => {
                if (heatmapRef.current) {
                    heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth - heatmapRef.current.clientWidth;
                }
            }, 300); // Wait a bit for the component to render completely

            return () => clearTimeout(timer);
        }
    }, [isLoading, data]);

    // Helper functions for data extraction with error handling
    const getConnectedPlatforms = () => {
        try {
            const platforms = data?.userInfo?.connectedPlatforms || {};
            return {
                leetcode: platforms.leetcode ? true : false,
                codeforces: platforms.codeforces ? true : false
            };
        } catch (error) {
            logError(error, 'getConnectedPlatforms');
            return { leetcode: false, codeforces: false };
        }
    };

    const getSelectedContestData = () => {
        try {
            const leetcodeContests = data?.totalContests?.leetcode || 0;
            const codeforcesContests = data?.totalContests?.codeforces || 0;
            
            switch (selectedContestPlatform) {
                case 'leetcode':
                    return { total: leetcodeContests, platform: 'LeetCode' };
                case 'codeforces':
                    return { total: codeforcesContests, platform: 'Codeforces' };
                case 'all':
                default:
                    return { total: leetcodeContests + codeforcesContests, platform: 'All Platforms' };
            }
        } catch (error) {
            logError(error, 'getSelectedContestData');
            return { total: 0, platform: 'All Platforms' };
        }
    };

    const getTotalQuestions = (): number => {
        try {
            // Always prioritize backend total first, then fallback to manual combination
            const backendTotal = data?.totalQuestions?.total;
            if (backendTotal !== undefined && backendTotal !== null) {
                return backendTotal;
            }
            
            // Fallback: manually combine LeetCode and Codeforces
            const leetcodeTotal = data?.totalQuestions?.leetcode || 0;
            const codeforcesTotal = data?.totalQuestions?.codeforces || 0;
            
            return leetcodeTotal + codeforcesTotal;
        } catch (error) {
            logError(error, 'getTotalQuestions');
            return 0;
        }
    };

    const getTotalActiveDays = (): number => {
        try {
            // Always prioritize backend total first, then fallback to manual combination
            const backendTotal = data?.totalActiveDays?.total;
            if (backendTotal !== undefined && backendTotal !== null) {
                return backendTotal;
            }
            
            // Fallback: manually combine LeetCode and Codeforces
            const leetcodeActiveDays = data?.totalActiveDays?.leetcode || 0;
            const codeforcesActiveDays = data?.totalActiveDays?.codeforces || 0;
            
            return leetcodeActiveDays + codeforcesActiveDays;
        } catch (error) {
            logError(error, 'getTotalActiveDays');
            return 0;
        }
    };

    const getHeatmapData = () => {
        try {
            // Use combined heatmap data to show activity from all platforms
            const combinedData = data?.heatmapData?.combined || {};
            const leetcodeData = data?.heatmapData?.leetcode || {};
            const codeforcesData = data?.heatmapData?.codeforces || {};
            
            console.log('🔍 Debug heatmap data:', {
                combinedKeys: Object.keys(combinedData).slice(0, 5),
                leetcodeKeys: Object.keys(leetcodeData).slice(0, 5),
                codeforcesKeys: Object.keys(codeforcesData).slice(0, 5),
                sampleCombined: Object.entries(combinedData).slice(0, 10),
                sampleLeetcode: Object.entries(leetcodeData).slice(0, 10),
                sampleCodeforces: Object.entries(codeforcesData).slice(0, 10),
                todayString: new Date().toISOString().split('T')[0],
                july2025Data: {
                    '2025-07-04': combinedData['2025-07-04'],
                    '2025-07-05': combinedData['2025-07-05'],
                    '2025-07-06': combinedData['2025-07-06'],
                    '2025-07-07': combinedData['2025-07-07']
                }
            });

            // Convert to months with weeks/days format for better organization
            const months = [];
            const today = new Date();
            
            // Include current month and show 12 months total (past + current + some future if data exists)
            // Start from 11 months ago to show a full year including current month
            const startDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);

            // Process data month by month for 12 months (this will include current month and future if data exists)
            for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
                const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthOffset, 1);
                const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
                const year = monthDate.getFullYear();
                
                // Get number of days in this month
                const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
                
                // Create weeks for this month
                const monthWeeks = [];
                let currentWeek = [];
                
                // Add padding for the first week if month doesn't start on Sunday
                const firstDayOfWeek = monthDate.getDay(); // 0 = Sunday
                for (let i = 0; i < firstDayOfWeek; i++) {
                    currentWeek.push(null); // Empty padding
                }
                
                // Add all days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
                    const dateKey = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                    
                    // Get submission counts from all platforms
                    const combinedSubmissions = combinedData[dateKey] || 0;
                    const leetcodeSubmissions = leetcodeData[dateKey] || 0;
                    const codeforcesSubmissions = codeforcesData[dateKey] || 0;
                    
                    currentWeek.push({
                        count: combinedSubmissions, // Use combined count for total activity
                        leetcodeCount: leetcodeSubmissions,
                        codeforcesCount: codeforcesSubmissions,
                        date: currentDate,
                        dateString: dateKey,
                        formattedDate: currentDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })
                    });
                    
                    // If week is complete (7 days) or it's the last day of month, start a new week
                    if (currentWeek.length === 7) {
                        monthWeeks.push([...currentWeek]);
                        currentWeek = [];
                    }
                }
                
                // Add remaining days to the last week with padding if needed
                if (currentWeek.length > 0) {
                    while (currentWeek.length < 7) {
                        currentWeek.push(null); // Empty padding
                    }
                    monthWeeks.push(currentWeek);
                }
                
                months.push({
                    name: monthName,
                    year: year,
                    weeks: monthWeeks
                });
            }

            // Count statistics for debugging
            const allDays = months.flatMap(month => 
                month.weeks.flatMap(week => 
                    week.filter(day => day !== null)
                )
            );
            const activeDaysCount = allDays.filter(day => day && day.count > 0).length;
            const totalSubmissions = allDays.reduce((sum, day) => sum + (day ? day.count : 0), 0);
            
            console.log('📊 Monthly heatmap processed:', {
                totalMonths: months.length,
                activeDays: activeDaysCount,
                totalSubmissions: totalSubmissions,
                sampleMonth: months[months.length - 1]?.name + ' ' + months[months.length - 1]?.year
            });

            return months.length > 0 ? months : [];
        } catch (error) {
            logError(error, 'getHeatmapData');
        }
        // Fallback - return empty months array
        return [];
    };

    const getLeetCodeStats = () => {
        try {
            // Use LeetCode-specific difficulty breakdown, not combined stats
            const leetcodeBreakdown = data?.totalQuestions?.platformBreakdown?.leetcode;
            if (leetcodeBreakdown) {
                return {
                    easy: leetcodeBreakdown.easy,
                    medium: leetcodeBreakdown.medium,
                    hard: leetcodeBreakdown.hard,
                    total: leetcodeBreakdown.easy + leetcodeBreakdown.medium + leetcodeBreakdown.hard
                };
            }
            
            // Fallback: if no platform breakdown, use LeetCode total count
            const leetcodeTotal = data?.totalQuestions?.leetcode || 0;
            return {
                easy: 0,
                medium: 0,
                hard: 0,
                total: leetcodeTotal
            };
        } catch (error) {
            logError(error, 'getLeetCodeStats');
        }
        return { easy: 0, medium: 0, hard: 0, total: 0 }; // Show zeros for new users
    };

    const getCodeforcesStats = () => {
        try {
            const totalSolved = data?.totalQuestions?.codeforces || 0;
            const totalContests = data?.totalContests?.codeforces || 0;
            return {
                total: totalSolved,
                contests: totalContests
            };
        } catch (error) {
            logError(error, 'getCodeforcesStats');
            return { total: 0, contests: 0 }; // Show zeros for new users
        }
    };

    const getContestRankings = () => {
        try {
            // Use actual contest ranking data without hardcoded fallbacks
            const leetcodeRating = data?.contestRankings?.latest?.leetcode?.rank || null;
            const codeforcesRating = data?.userInfo?.connectedPlatforms?.codeforces?.currentRating || null;
            const codeforcesRank = data?.userInfo?.connectedPlatforms?.codeforces?.rank || 'unrated';

            return {
                leetcode: leetcodeRating,
                codeforces: codeforcesRating,
                codeforcesRank: String(codeforcesRank)
            };
        } catch (error) {
            logError(error, 'getContestRankings');
            return {
                leetcode: null,
                codeforces: null,
                codeforcesRank: 'unrated'
            };
        }
    };

    const getTopicAnalysis = () => {
        try {
            // Debug DSA topics
            console.log('🔍 DSA Topic Analysis Debug:', {
                hasData: !!data,
                hasDSATopicAnalysis: !!data?.dsaTopicAnalysis,
                topicCount: data?.dsaTopicAnalysis ? Object.keys(data.dsaTopicAnalysis).length : 0,
                sampleTopics: data?.dsaTopicAnalysis ? Object.keys(data.dsaTopicAnalysis).slice(0, 10) : [],
                codeforcesHandle: data?.userInfo?.connectedPlatforms?.codeforces?.handle,
                codeforcesQuestions: data?.totalQuestions?.codeforces || 0
            });

            if (data?.dsaTopicAnalysis) {
                const processedTopics = Object.entries(data.dsaTopicAnalysis)
                    .map(([topicName, stats]: [string, any]) => {
                        console.log(`📊 Topic: ${topicName}`, stats);
                        return {
                            name: topicName,
                            count: stats.total,
                            category: stats.category || 'intermediate',
                            leetcode: stats.leetcode || 0,
                            codeforces: stats.codeforces || 0
                        };
                    })
                    .sort((a, b) => b.count - a.count);

                console.log('📈 Processed Topics:', processedTopics.slice(0, 10));

                // Only slice if we're not showing all topics - show more initially for better space utilization
                const topicsToShow = showAllTopics ? processedTopics : processedTopics.slice(0, 20);

                if (topicsToShow.length > 0) {
                    return { topics: topicsToShow, totalCount: processedTopics.length };
                }
            }
        } catch (error) {
            logError(error, 'getTopicAnalysis');
        }
        // Fallback data - empty for new users
        return { topics: [{ name: 'No topics yet', count: 0, category: 'intermediate' }], totalCount: 0 };
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
                                <LoadingSpinner size="sm" className="mr-2" />
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
        <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} bg-gradient-hero min-h-screen ${isMobile ? 'p-2 gap-2' : 'p-3 lg:p-6 gap-4 lg:gap-6'} w-full max-w-full overflow-x-hidden relative`}>
            {/* Background Elements - Consistent with Landing Page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#E64373]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#644EC9]/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
            {/* Sidebar */}
            <Sidebar data={data} isLoading={isLoading} refreshData={fetchData} />
            {/* Main Content */}
            <main className={`flex-1 flex flex-col ${isMobile ? 'gap-2' : 'gap-4 lg:gap-6'} w-full max-w-full min-w-0`}>
                {/* Row 1: 2 squares + 1 rectangle */}
                <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6'} w-full max-w-full min-w-0`}>
                    {/* Total Questions */}
                    <Card className={`lg:col-span-2 modern-card hover-lift ${isMobile ? 'p-3 min-h-[100px]' : 'p-4 lg:p-6 min-h-[120px]'} flex flex-col items-center justify-center relative w-full max-w-full min-w-0 border-l-4 border-l-[#E64373] hover:shadow-[#E64373]/20`}>
                        <div className="absolute top-3 right-3">
                            <InfoTooltip message="Combined total from all connected platforms" />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#E64373]" />
                            Total Questions
                        </div>
                        <div className="text-3xl lg:text-4xl font-bold text-foreground">
                            {isLoading ? <MatrixDotsLoader size="lg" /> : formatNumber(getTotalQuestions())}
                        </div>
                    </Card>
                    {/* Total Active Days */}
                    <Card className={`lg:col-span-2 modern-card hover-lift ${isMobile ? 'p-3 min-h-[100px]' : 'p-4 lg:p-6 min-h-[120px]'} flex flex-col items-center justify-center relative w-full max-w-full min-w-0`}>
                        <div className="absolute top-3 right-3">
                            <InfoTooltip message="Combined active days from all connected platforms" />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                            <Flame className="w-4 h-4" />
                            Active Days
                        </div>
                        <div className="text-3xl lg:text-4xl font-bold text-foreground">
                            {isLoading ? <CodeSpinLoader size="lg" /> : formatNumber(getTotalActiveDays())}
                        </div>
                    </Card>
                    {/* Heatmap */}
                    <Card className="md:col-span-2 lg:col-span-8 modern-card hover-lift p-4 lg:p-6 flex flex-col min-h-[120px] w-full max-w-full min-w-0 overflow-x-auto">
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-3 text-sm">
                            <span className="text-foreground font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {isLoading ? 'Loading...' : 'Activity Overview (All Platforms)'}
                            </span>
                            <span className="text-muted-foreground">
                                {(() => {
                                    try {
                                        const monthsData = getHeatmapData();
                                        const activeDays = monthsData.reduce((total, month) => 
                                            total + month.weeks.flat().filter(day => day && day.count > 0).length, 0
                                        );
                                        return `${activeDays} active days in the past year`;
                                    } catch (error) {
                                        return 'No activity data';
                                    }
                                })()}
                            </span>
                        </div>
                        
                        {/* Monthly Heatmap */}
                        {isLoading ? (
                            <div className="flex items-center justify-center h-24">
                                <LoadingSpinner size="md" />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {/* Heatmap Container */}
                                <div 
                                    ref={heatmapRef}
                                    className="overflow-x-auto pb-2 hide-scrollbar min-w-0 w-full"
                                >
                                    <div className="flex gap-2 min-w-max">
                                        {(() => {
                                            const monthsData = getHeatmapData();
                                            return monthsData.map((month, monthIndex) => {
                                                return (
                                                    <div key={`${month.year}-${month.name}`} className="flex flex-col">
                                                        {/* Month label */}
                                                        <div className="text-xs text-muted-foreground mb-1 text-center min-w-[50px]">
                                                            {month.name}
                                                        </div>
                                                        
                                                        {/* Days grid */}
                                                        <div className="flex gap-[2px]">
                                                            {month.weeks.map((week, weekIndex) => {
                                                                return (
                                                                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                                                                        {week.map((day, dayIndex) => {
                                                                            if (!day) {
                                                                                return <div key={`empty-${dayIndex}`} className="w-[11px] h-[11px]"></div>;
                                                                            }

                                                                            // Color logic
                                                                            let bgColor = 'bg-gray-200 dark:bg-gray-800';
                                                                            if (day.count > 0) {
                                                                                if (day.count >= 10) bgColor = 'bg-green-800';
                                                                                else if (day.count >= 5) bgColor = 'bg-green-700';
                                                                                else if (day.count >= 3) bgColor = 'bg-green-600';
                                                                                else if (day.count >= 2) bgColor = 'bg-green-400';
                                                                                else bgColor = 'bg-green-300';
                                                                            }

                                                                            // Tooltip text
                                                                            const tooltipText = day.count > 0 
                                                                                ? `${day.count} submission${day.count === 1 ? '' : 's'} on ${day.formattedDate}`
                                                                                : `No submissions on ${day.formattedDate}`;

                                                                            return (
                                                                                <div
                                                                                    key={day.dateString}
                                                                                    className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-blue-400 ${bgColor}`}
                                                                                    title={tooltipText}
                                                                                />
                                                                            );
                                                                        })}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                                
                                {/* Day labels */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                    <div className="flex items-center gap-6">
                                        <span>Mon</span>
                                        <span>Wed</span>
                                        <span>Fri</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground opacity-70">
                                        ← Drag to see full year →
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Activity level legend */}
                        <div className="flex justify-end items-center gap-1 text-xs mt-1">
                            <span className="text-muted-foreground">Less</span>
                            <div className="flex gap-[2px]">
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-gray-200 dark:bg-gray-800" title="No activity"></div>
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-green-300" title="1 submission"></div>
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-green-400" title="2 submissions"></div>
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-green-600" title="3-4 submissions"></div>
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-green-700" title="5-9 submissions"></div>
                                <div className="w-[11px] h-[11px] rounded-[2px] bg-green-800" title="10+ submissions"></div>
                            </div>
                            <span className="text-muted-foreground">More</span>
                        </div>
                    </Card>
                </div>
                {/* Row 2: 2 columns */}
                <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'xl:grid-cols-12 gap-4 lg:gap-6'} flex-1 w-full max-w-full min-w-0`}>
                    {/* Column 1: 4 stacked blocks */}
                    <div className={`xl:col-span-7 flex flex-col ${isMobile ? 'gap-2' : 'gap-4 lg:gap-6'} w-full max-w-full min-w-0`}>
                        {/* Total Contests */}
                        <Card className={`modern-card hover-lift ${isMobile ? 'p-3 gap-2 min-h-[80px]' : 'p-4 lg:p-6 gap-4 min-h-[120px]'} flex flex-col w-full max-w-full min-w-0`}>
                            {/* Main Content Area */}
                            <div className="flex items-center justify-between gap-6">
                                {/* Left Side - Total Number */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                                        <Trophy className="w-5 h-5" />
                                        Total Contests
                                    </div>
                                    <div className="text-4xl lg:text-5xl font-bold text-foreground">
                                        {isLoading ? (
                                            <OrbitLoader size="xl" />
                                        ) : (
                                            (() => {
                                                try {
                                                    const leetcodeContests = data?.totalContests?.leetcode || 0;
                                                    const codeforcesContests = data?.totalContests?.codeforces || 0;
                                                    return leetcodeContests + codeforcesContests;
                                                } catch (error) {
                                                    console.warn('Error calculating total contests:', error);
                                                    return 0;
                                                }
                                            })()
                                        )}
                                    </div>
                                    {!isLoading && (
                                        <div className="text-xs text-muted-foreground text-center mt-1">
                                            Total
                                        </div>
                                    )}
                                </div>
                                
                                {/* Right Side - Clickable Platform Cards */}
                                <div className="flex flex-col gap-3 flex-1">
                                    {!isLoading && (() => {
                                        const platforms = getConnectedPlatforms();
                                        return (
                                            <>
                                                {platforms.leetcode && (
                                                    <button 
                                                        onClick={() => setSelectedContestPlatform('leetcode')}
                                                        className={`rounded-lg px-3 py-2 flex items-center justify-between transition-all cursor-pointer border ${
                                                            selectedContestPlatform === 'leetcode' 
                                                                ? 'bg-orange-600 ring-2 ring-orange-400 border-orange-500' 
                                                                : 'bg-muted/70 hover:bg-muted border-border hover:border-orange-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <img src={getPlatformLogo('leetcode', actualTheme)} alt="LeetCode" className="w-4 h-4" />
                                                            <span className="text-sm font-bold text-foreground">LeetCode</span>
                                                        </div>
                                                        <span className="text-base font-bold text-foreground">
                                                            {(() => {
                                                                try {
                                                                    return data?.totalContests?.leetcode || 0;
                                                                } catch (error) {
                                                                    console.warn('Error getting LeetCode contest count:', error);
                                                                    return 0;
                                                                }
                                                            })()}
                                                        </span>
                                                    </button>
                                                )}
                                                
                                                {platforms.codeforces && (
                                                    <button 
                                                        onClick={() => setSelectedContestPlatform('codeforces')}
                                                        className={`rounded-lg px-3 py-2 flex items-center justify-between transition-all cursor-pointer border ${
                                                            selectedContestPlatform === 'codeforces' 
                                                                ? 'bg-blue-600 ring-2 ring-blue-400 border-blue-500' 
                                                                : 'bg-muted/70 hover:bg-muted border-border hover:border-blue-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <img src={getPlatformLogo('codeforces', actualTheme)} alt="CodeForces" className="w-4 h-4" />
                                                            <span className="text-sm font-bold text-foreground">CodeForces</span>
                                                        </div>
                                                        <span className="text-base font-bold text-foreground">
                                                            {(() => {
                                                                try {
                                                                    return data?.totalContests?.codeforces || 0;
                                                                } catch (error) {
                                                                    console.warn('Error getting Codeforces contest count:', error);
                                                                    return 0;
                                                                }
                                                            })()}
                                                        </span>
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Card>
                        
                        {/* Contest Rating Graph - Full Width */}
                        <div className="col-span-1 lg:col-span-2 w-full max-w-full min-w-0">
                            <ContestRatingGraph 
                                contestHistory={data?.contestHistory || { leetcode: [], codeforces: [], combined: [] }}
                                isLoading={isLoading}
                                selectedPlatform={selectedContestPlatform}
                            />
                        </div>
                        
                        {/* Contest Rankings */}
                        <Card className={`modern-card hover-lift ${isMobile ? 'p-3 min-h-[160px]' : 'p-4 lg:p-6 min-h-[260px] max-h-[360px]'} flex flex-col w-full max-w-full min-w-0`}>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center text-foreground flex items-center justify-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Contest Rankings
                                </h3>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <TypingLoader text="Loading rankings..." />
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
                                                            const rating = contestRankings.leetcode;
                                                            return rating ? Number(rating) : 'N/A';
                                                        } catch (error) {
                                                            console.warn('Error displaying LeetCode ranking:', error);
                                                            return 'N/A';
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-center">
                                                (contests: {(() => {
                                                    try {
                                                        return data?.totalContests?.leetcode || 0;
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
                                                            return 'unrated';
                                                        }
                                                    })()}
                                                </div>
                                                <div className="text-2xl lg:text-3xl font-bold">
                                                    {(() => {
                                                        try {
                                                            const rating = contestRankings.codeforces;
                                                            return rating ? Number(rating) : 'N/A';
                                                        } catch (error) {
                                                            console.warn('Error displaying Codeforces rating:', error);
                                                            return 'N/A';
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-center">
                                                (max: {(() => {
                                                    try {
                                                        const maxRating = data?.userInfo?.connectedPlatforms?.codeforces?.maxRating;
                                                        const currentRating = contestRankings.codeforces;
                                                        return maxRating || currentRating || 'N/A';
                                                    } catch (error) {
                                                        console.warn('Error getting max rating:', error);
                                                        return 'N/A';
                                                    }
                                                })()})
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                    {/* Column 2: 2 stacked blocks */}
                    <div className="xl:col-span-5 flex flex-col gap-4 lg:gap-6 w-full max-w-full min-w-0">
                        {/* Problems Solved + Competitive Programming Donut */}
                        <Card className="modern-card hover-lift p-4 lg:p-6 h-auto lg:h-60 flex flex-col gap-4 lg:gap-6 w-full max-w-full min-w-0">
                            <div>
                                <div className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Problems Solved
                                </div>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <TypingLoader text="Loading problems..." />
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
                        </Card>
                        {/* DSA Topic Analysis */}
                        <Card className="modern-card hover-lift p-4 lg:p-6 flex flex-col min-h-[540px] max-h-[758px] relative w-full max-w-full min-w-0 overflow-x-auto">
                            <div className="absolute top-4 right-4">
                                <InfoTooltip message="Topic analysis based on problems solved across all platforms" />
                            </div>
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <span className="text-lg font-semibold">DSA Topic Analysis</span>
                                <div className="flex items-center gap-2">
                                    {isLoading && <LoadingSpinner size="sm" />}
                                    {(() => {
                                        try {
                                            const analysisResult = topicAnalysis;
                                            return (
                                                <span className="text-xs text-muted-foreground">
                                                    {analysisResult.topics.length} topics
                                                </span>
                                            );
                                        } catch (error) {
                                            return null;
                                        }
                                    })()}
                                </div>
                            </div>
                            {/* Topic bar chart with constrained height */}
                            <div className="space-y-2 flex-1 overflow-y-auto pr-2 -mr-2 hide-scrollbar">
                                {(() => {
                                    try {
                                        const analysisResult = topicAnalysis;
                                        const topics = analysisResult.topics;
                                        
                                        return topics.map((topic, idx) => {
                                            const maxCount = topics[0]?.count || 1;
                                            const count = Number(topic.count) || 0;
                                            const name = String(topic.name) || 'Unknown';
                                            const category = topic.category || 'intermediate';

                                            // Category color coding
                                            const getCategoryColor = (cat: string) => {
                                                switch (cat) {
                                                    case 'fundamental': return 'bg-green-500';
                                                    case 'intermediate': return 'bg-blue-500';
                                                    case 'advanced': return 'bg-purple-500';
                                                    default: return 'bg-blue-500';
                                                }
                                            };

                                            // Category badge color
                                            const getCategoryBadgeColor = (cat: string) => {
                                                switch (cat) {
                                                    case 'fundamental': return 'bg-green-500/20 text-green-400 border-green-500/30';
                                                    case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                                                    case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                                                    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                                                }
                                            };

                                            return (
                                                <div key={idx} className="group hover:bg-muted/30 rounded-lg p-2 transition-colors duration-200 border border-transparent hover:border-border/50">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <span className="text-sm font-medium truncate" title={name}>
                                                                {name}
                                                            </span>
                                                            <span className={`text-xs px-1.5 py-0.5 rounded-full border text-nowrap ${getCategoryBadgeColor(category)}`}>
                                                                {category}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-custom-muted ml-2">{count}</span>
                                                    </div>
                                                    <div className="bg-muted/60 rounded-full h-2.5 border border-border/30">
                                                        <div
                                                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getCategoryColor(category)} group-hover:shadow-sm`}
                                                            style={{ width: `${Math.min((count / maxCount) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    } catch (error) {
                                        console.warn('Error rendering topic analysis:', error);
                                        return (
                                            <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg flex-1 flex flex-col items-center justify-center">
                                                <div className="text-2xl mb-3">📊</div>
                                                <div>Unable to load topic analysis</div>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                            {/* Show more/less button with topic count info */}
                            {(() => {
                                try {
                                    const analysisResult = topicAnalysis;
                                    const hasMoreTopics = analysisResult.totalCount > 20;
                                    
                                    if (hasMoreTopics) {
                                        return (
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 flex-shrink-0">
                                                <button 
                                                    className="text-blue-400 text-sm font-medium hover:text-blue-300 hover:underline transition-all duration-200 flex items-center gap-1"
                                                    onClick={() => setShowAllTopics(!showAllTopics)}
                                                >
                                                    {showAllTopics ? (
                                                        <>
                                                            Show Less
                                                            <span className="text-xs">↑</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show {analysisResult.totalCount - 20} More
                                                            <span className="text-xs">↓</span>
                                                        </>
                                                    )}
                                                </button>
                                                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                                                    {analysisResult.topics.length} of {analysisResult.totalCount}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                } catch (error) {
                                    console.warn('Error rendering show more button:', error);
                                    return null;
                                }
                            })()}
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard2;