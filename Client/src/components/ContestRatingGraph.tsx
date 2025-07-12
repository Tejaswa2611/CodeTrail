import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ContestData {
    platform: string;
    contestId: string;
    rating: number;
    oldRating?: number;
    rank: number;
    timestamp: string;
    problemsSolved?: number;
    totalProblems?: number;
}

interface ContestHistory {
    leetcode: ContestData[];
    codeforces: ContestData[];
    combined: ContestData[];
}

interface ContestRatingGraphProps {
    contestHistory: ContestHistory;
    isLoading?: boolean;
    selectedPlatform?: 'all' | 'leetcode' | 'codeforces';
}

const ContestRatingGraph: React.FC<ContestRatingGraphProps> = ({ 
    contestHistory, 
    isLoading, 
    selectedPlatform = 'all' 
}) => {
    if (isLoading) {
        return (
            <div className="bg-card rounded-xl p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Contest Rating Progress</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading contest data...</div>
                </div>
            </div>
        );
    }

    // Prepare data for the chart
    const prepareChartData = () => {
        // Filter data based on selected platform
        let leetcodeData = [];
        let codeforcesData = [];

        if (selectedPlatform === 'all' || selectedPlatform === 'leetcode') {
            leetcodeData = contestHistory.leetcode.map(contest => ({
                date: new Date(contest.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                timestamp: new Date(contest.timestamp).getTime(),
                leetcodeRating: contest.rating,
                contestId: contest.contestId,
                platform: 'LeetCode' as const
            }));
        }

        if (selectedPlatform === 'all' || selectedPlatform === 'codeforces') {
            codeforcesData = contestHistory.codeforces.map(contest => ({
                date: new Date(contest.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                timestamp: new Date(contest.timestamp).getTime(),
                codeforcesRating: contest.rating,
                contestId: contest.contestId,
                platform: 'Codeforces' as const
            }));
        }

        // Combine and sort by timestamp
        const allData = [...leetcodeData, ...codeforcesData].sort((a, b) => a.timestamp - b.timestamp);
        
        // Group by date and merge ratings
        const groupedData: Record<string, {
            date: string;
            timestamp: number;
            leetcodeRating?: number;
            codeforcesRating?: number;
        }> = {};
        
        allData.forEach(item => {
            if (!groupedData[item.date]) {
                groupedData[item.date] = { date: item.date, timestamp: item.timestamp };
            }
            if ('leetcodeRating' in item) {
                groupedData[item.date].leetcodeRating = item.leetcodeRating;
            }
            if ('codeforcesRating' in item) {
                groupedData[item.date].codeforcesRating = item.codeforcesRating;
            }
        });

        return Object.values(groupedData).sort((a, b) => a.timestamp - b.timestamp);
    };

    const chartData = prepareChartData();
    
    // Update data visibility based on selected platform
    const hasLeetCodeData = (selectedPlatform === 'all' || selectedPlatform === 'leetcode') && contestHistory.leetcode.length > 0;
    const hasCodeforcesData = (selectedPlatform === 'all' || selectedPlatform === 'codeforces') && contestHistory.codeforces.length > 0;

    // Show no data message if no relevant data for selected platform
    if (!hasLeetCodeData && !hasCodeforcesData) {
        const noDataMessage = selectedPlatform === 'all' 
            ? "No contest data available" 
            : `No ${selectedPlatform === 'leetcode' ? 'LeetCode' : 'Codeforces'} contest data available`;
            
        return (
            <div className="bg-card rounded-xl p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Contest Rating Progress</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">{noDataMessage}</div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: Array<{
            color: string;
            name: string;
            value: number;
        }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-2">{label}</p>
                    {payload.map((entry, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-card rounded-xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contest Rating Progress</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    {hasLeetCodeData && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>LeetCode ({contestHistory.leetcode.length})</span>
                        </div>
                    )}
                    {hasCodeforcesData && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Codeforces ({contestHistory.codeforces.length})</span>
                        </div>
                    )}
                    {selectedPlatform !== 'all' && (
                        <div className="text-xs text-muted-foreground/70 ml-2">
                            Showing {selectedPlatform === 'leetcode' ? 'LeetCode' : 'Codeforces'} only
                        </div>
                    )}
                </div>
            </div>
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                            className="text-muted-foreground"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        {hasLeetCodeData && (
                            <Line
                                type="monotone"
                                dataKey="leetcodeRating"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                                name="LeetCode Rating"
                                connectNulls={false}
                            />
                        )}
                        
                        {hasCodeforcesData && (
                            <Line
                                type="monotone"
                                dataKey="codeforcesRating"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                name="Codeforces Rating"
                                connectNulls={false}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Stats below chart */}
            <div className={`mt-4 gap-4 text-sm ${hasLeetCodeData && hasCodeforcesData ? 'grid grid-cols-2' : 'flex justify-center'}`}>
                {hasLeetCodeData && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="font-medium text-orange-600 dark:text-orange-400">LeetCode</div>
                        <div className="text-muted-foreground mt-1">
                            Current: {contestHistory.leetcode[contestHistory.leetcode.length - 1]?.rating || 'N/A'}
                        </div>
                        <div className="text-muted-foreground">
                            Peak: {Math.max(...contestHistory.leetcode.map(c => c.rating))}
                        </div>
                    </div>
                )}
                
                {hasCodeforcesData && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="font-medium text-blue-600 dark:text-blue-400">Codeforces</div>
                        <div className="text-muted-foreground mt-1">
                            Current: {contestHistory.codeforces[contestHistory.codeforces.length - 1]?.rating || 'N/A'}
                        </div>
                        <div className="text-muted-foreground">
                            Peak: {Math.max(...contestHistory.codeforces.map(c => c.rating))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestRatingGraph;
