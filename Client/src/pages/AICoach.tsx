import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, Lightbulb, BookOpen, Clock, Star, ChevronRight, Play, ExternalLink, AlertCircle, CheckCircle, BarChart, Users, Zap, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import TopicAnalysisCard from '../components/TopicAnalysisCard';
import SuggestedQuestionCard from '../components/SuggestedQuestionCard';

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
    },
    topicAnalysis: [
        {
            topic: "Arrays",
            proficiency: 85,
            problemsSolved: 45,
            totalProblems: 120,
            trend: "excellent",
            importance: "high",
            companyFrequency: 95,
            recommendation: "You're excelling in arrays! Focus on advanced array manipulation techniques.",
            nextSteps: ["Practice sliding window problems", "Master two-pointer technique"]
        },
        {
            topic: "Dynamic Programming",
            proficiency: 78,
            problemsSolved: 23,
            totalProblems: 80,
            trend: "good",
            importance: "high",
            companyFrequency: 88,
            recommendation: "Strong foundation in DP. Work on optimization patterns.",
            nextSteps: ["Study memoization vs tabulation", "Practice state transition problems"]
        },
        {
            topic: "Graph Algorithms",
            proficiency: 45,
            problemsSolved: 8,
            totalProblems: 60,
            trend: "needs_work",
            importance: "high",
            companyFrequency: 75,
            recommendation: "Critical area for improvement. Graph problems are common in interviews.",
            nextSteps: ["Master BFS and DFS", "Learn shortest path algorithms", "Practice topological sorting"]
        },
        {
            topic: "Tree Traversal",
            proficiency: 55,
            problemsSolved: 12,
            totalProblems: 45,
            trend: "improving",
            importance: "medium",
            companyFrequency: 70,
            recommendation: "Making progress but needs more practice with complex tree problems.",
            nextSteps: ["Practice binary tree problems", "Learn tree reconstruction techniques"]
        }
    ],
    suggestedQuestions: [
        {
            id: 1,
            title: "Two Sum",
            difficulty: "Easy",
            topic: "Arrays",
            platform: "LeetCode",
            url: "https://leetcode.com/problems/two-sum/",
            reason: "Perfect for strengthening your array fundamentals",
            estimatedTime: "15-20 min",
            companies: ["Google", "Amazon", "Facebook"],
            priority: "high"
        },
        {
            id: 2,
            title: "Course Schedule",
            difficulty: "Medium",
            topic: "Graph",
            platform: "LeetCode", 
            url: "https://leetcode.com/problems/course-schedule/",
            reason: "Essential graph problem to improve your weak area",
            estimatedTime: "30-45 min",
            companies: ["Microsoft", "Amazon", "Google"],
            priority: "critical"
        },
        {
            id: 3,
            title: "Binary Tree Level Order Traversal",
            difficulty: "Medium",
            topic: "Tree",
            platform: "LeetCode",
            url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
            reason: "Builds on your improving tree traversal skills",
            estimatedTime: "25-30 min",
            companies: ["Apple", "Microsoft", "Amazon"],
            priority: "medium"
        },
        {
            id: 4,
            title: "Climbing Stairs",
            difficulty: "Easy",
            topic: "Dynamic Programming",
            platform: "LeetCode",
            url: "https://leetcode.com/problems/climbing-stairs/",
            reason: "Reinforce your strong DP foundation",
            estimatedTime: "10-15 min",
            companies: ["Adobe", "LinkedIn", "Uber"],
            priority: "low"
        }
    ]
};

const AICoach = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'questions'>('overview');
    const { actualTheme } = useTheme();

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Brain className="w-16 h-16 text-primary animate-pulse mb-4" />
                    <h2 className="text-2xl font-bold mb-2">AI Coach is analyzing your progress...</h2>
                    <p className="text-muted-foreground">Preparing personalized recommendations</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6 gap-4 lg:gap-6">
            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-4 lg:gap-6">
                {/* Header */}
                <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">AI Coach</h1>
                            <p className="text-muted-foreground">Personalized analysis and recommendations</p>
                        </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex gap-2 border-b border-border">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'overview'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'topics'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Topic Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('questions')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'questions'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Suggested Questions
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-primary">{mockAnalysis.overallProgress.score}%</div>
                                <div className="text-sm text-muted-foreground">Overall Score</div>
                            </div>
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-green-500">{mockAnalysis.overallProgress.strongAreas.length}</div>
                                <div className="text-sm text-muted-foreground">Strong Topics</div>
                            </div>
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-red-500">{mockAnalysis.overallProgress.weakAreas.length}</div>
                                <div className="text-sm text-muted-foreground">Focus Areas</div>
                            </div>
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-500">{mockAnalysis.suggestedQuestions.length}</div>
                                <div className="text-sm text-muted-foreground">Suggested Problems</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Overall Progress */}
                            <div className="lg:col-span-2 bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Overall Progress & Trends
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="relative w-32 h-32 mx-auto mb-4">
                                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    className="text-muted"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    strokeDasharray={`${mockAnalysis.overallProgress.score * 2.51} 251`}
                                                    className="text-primary"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold">{mockAnalysis.overallProgress.score}%</div>
                                                    <div className="text-sm text-muted-foreground">{mockAnalysis.overallProgress.level}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-green-500">{mockAnalysis.overallProgress.improvementTrend}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-green-500 mb-2">Strong Areas</h3>
                                            <div className="space-y-1">
                                                {mockAnalysis.overallProgress.strongAreas.map((area, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm">{area}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-red-500 mb-2">Areas for Improvement</h3>
                                            <div className="space-y-1">
                                                {mockAnalysis.overallProgress.weakAreas.map((area, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <Target className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm">{area}</span>
                                                    </div>
                                                ))}
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
                                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                            <div className="text-lg font-bold text-green-500">
                                                {mockAnalysis.overallProgress.recentProgress.lastWeekSolved}
                                            </div>
                                            <div className="text-xs text-muted-foreground">This Week</div>
                                        </div>
                                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                            <div className="text-lg font-bold">
                                                {mockAnalysis.overallProgress.recentProgress.lastMonthSolved}
                                            </div>
                                            <div className="text-xs text-muted-foreground">This Month</div>
                                        </div>
                                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                            <div className="text-lg font-bold text-blue-500">
                                                {mockAnalysis.overallProgress.recentProgress.consistencyScore}%
                                            </div>
                                            <div className="text-xs text-muted-foreground">Consistency</div>
                                        </div>
                                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                            <div className="text-lg font-bold text-yellow-500">
                                                {mockAnalysis.overallProgress.recentProgress.averageWeeklySolved}
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
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.current}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.trend === 'improving' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${
                                                    mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change > 0 
                                                        ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change > 0 ? '+' : ''}
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.codeforces.change}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">LeetCode Rating</span>
                                                <span className="text-lg font-bold">
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.current}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.trend === 'improving' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${
                                                    mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change > 0 
                                                        ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change > 0 ? '+' : ''}
                                                    {mockAnalysis.overallProgress.recentProgress.ratingTrend.leetcode.change}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions & Progress Insights */}
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Quick Actions
                                </h2>
                                
                                <div className="space-y-3 mb-6">
                                    <button className="w-full p-3 text-left bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Start Practice Session</div>
                                                <div className="text-sm text-muted-foreground">Graph Algorithms</div>
                                            </div>
                                            <Play className="w-4 h-4" />
                                        </div>
                                    </button>

                                    <button className="w-full p-3 text-left bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Review Weak Topics</div>
                                                <div className="text-sm text-muted-foreground">3 topics need attention</div>
                                            </div>
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                    </button>

                                    <button className="w-full p-3 text-left bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Daily Challenge</div>
                                                <div className="text-sm text-muted-foreground">Recommended problem</div>
                                            </div>
                                            <Target className="w-4 h-4" />
                                        </div>
                                    </button>
                                </div>

                                {/* Progress Insights */}
                                <div className="border-t border-border pt-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Progress Insights
                                    </h3>
                                    
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

                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                                    Focus Needed
                                                </span>
                                            </div>
                                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                                Your graph algorithms success rate dropped to 45%. Time to practice!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'topics' && (
                    <div className="space-y-6">
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BarChart className="w-5 h-5" />
                                Topic Performance Summary
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-500">
                                        {mockAnalysis.overallProgress.strongAreas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Strong Topics</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-500">
                                        {mockAnalysis.topicAnalysis.filter(t => t.trend === 'improving').length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Improving</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500">
                                        {mockAnalysis.overallProgress.weakAreas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Need Focus</div>
                                </div>
                            </div>
                        </div>

                        {mockAnalysis.topicAnalysis.map((topic, idx) => (
                            <TopicAnalysisCard key={idx} topic={topic} />
                        ))}
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Personalized Question Recommendations
                                </h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh Suggestions
                                </button>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                These questions are carefully selected based on your current progress, weak areas, and interview patterns.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {mockAnalysis.suggestedQuestions.map((question) => (
                                <SuggestedQuestionCard key={question.id} question={question} />
                            ))}
                        </div>

                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                Study Plan Suggestion
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2 text-red-500">This Week (Priority Focus)</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <span>Complete 3 Graph Algorithm problems</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-orange-500" />
                                            <span>Practice BFS and DFS traversals</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                            <span>Review tree reconstruction techniques</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 text-green-500">Next Week (Reinforcement)</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Advanced Array manipulation</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-green-500" />
                                            <span>Dynamic Programming optimizations</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-green-500" />
                                            <span>Hash Table advanced problems</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AICoach;
