import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, BookOpen, Clock, Star, ChevronRight, Play, ExternalLink, AlertCircle, CheckCircle, BarChart, Users, Zap, RefreshCw, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import TopicAnalysisCard from '../components/TopicAnalysisCard';
import SuggestedQuestionCard from '../components/SuggestedQuestionCard';
import AIChatbot from '../components/AIChatbotNew';

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
    const [activeTab, setActiveTab] = useState<'topics' | 'questions' | 'mentor'>('mentor');
    const { actualTheme } = useTheme();

    useEffect(() => {
        // Handle hash navigation
        const hash = window.location.hash.substring(1); // Remove the '#' character
        if (hash === 'mentor' || hash === 'topics' || hash === 'questions') {
            setActiveTab(hash as 'topics' | 'questions' | 'mentor');
        }
        
        // Simulate loading time
        setTimeout(() => setIsLoading(false), 1000);
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
                <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                            <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Main navigation and AI Coach overview
                            </div>
                        </div>
                    </div>
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
                            onClick={() => setActiveTab('mentor')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'mentor'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            AI Mentor
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
                {activeTab === 'topics' && (
                    <div className="space-y-6">
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Summary of your performance across different coding topics
                                    </div>
                                </div>
                            </div>
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
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        AI-recommended coding problems based on your skill level
                                    </div>
                                </div>
                            </div>
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

                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Structured study plan to improve your weak areas
                                    </div>
                                </div>
                            </div>
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

                {activeTab === 'mentor' && (
                    <div className="space-y-6">
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        AI-powered mentoring and guidance
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    AI Mentor
                                </h2>
                            </div>

                            {/* AI Chatbot Component */}
                            <div className="h-[600px] flex justify-center">
                                <AIChatbot suggestedQuestions={[
                                    "How can I improve my problem-solving speed?",
                                    "What topics should I focus on next?",
                                    "Can you analyze my recent progress?",
                                    "What's the best practice routine for competitive programming?"
                                ]} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AICoach;
