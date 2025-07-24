import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, BookOpen, Clock, Star, ChevronRight, Play, ExternalLink, AlertCircle, CheckCircle, BarChart, Users, Zap, RefreshCw, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';
import TopicAnalysisCard from '../components/TopicAnalysisCard';
import SuggestedQuestionCard from '../components/SuggestedQuestionCard';
import AIChatbot from '../components/AIChatbotNew';
import { dashboardApi, AICoachAnalysis } from '../services/apiService';
import { AICoachContentLoader } from '../components/MatrixContentLoader';

const AICoach = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'topics' | 'questions' | 'mentor'>('mentor');
    const [analysisData, setAnalysisData] = useState<AICoachAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { actualTheme } = useTheme();
    const isMobile = useIsMobile();

    useEffect(() => {
        // Handle hash navigation
        const hash = window.location.hash.substring(1); // Remove the '#' character
        if (hash === 'mentor' || hash === 'topics' || hash === 'questions') {
            setActiveTab(hash as 'topics' | 'questions' | 'mentor');
        }
        
        // Fetch real data from API
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await dashboardApi.getAICoachTopicAnalysis();
                setAnalysisData(data);
            } catch (error) {
                console.error('Error fetching AI Coach data:', error);
                setError('Failed to load AI Coach analysis. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-3 lg:p-6">
                <AICoachContentLoader size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Failed to Load AI Analysis</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <BarChart className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
                    <p className="text-muted-foreground">Start solving problems to see your AI-powered analysis!</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Unable to Load AI Coach</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="flex flex-col lg:flex-row bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen p-3 lg:p-6">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
                    <p className="text-muted-foreground">Please connect your coding platforms and solve some problems first.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} bg-gradient-hero min-h-screen ${isMobile ? 'p-2 gap-2' : 'p-3 lg:p-6 gap-4 lg:gap-6'} relative`}>
            {/* Background Elements - Consistent with Landing Page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#E64373]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#644EC9]/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
            {/* Main Content */}
            <main className={`flex-1 flex flex-col ${isMobile ? 'gap-2' : 'gap-4 lg:gap-6'}`}>
                {/* Header */}
                <div className={`bg-card/70 backdrop-blur-sm border border-border rounded-lg ${isMobile ? 'p-2' : 'p-6'} relative flex-shrink-0`}>
                    <div className="absolute top-4 right-4">
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                            <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Main navigation and AI Coach overview
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-2xl flex items-center justify-center shadow-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent">AI Coach</h1>
                            <p className="text-muted-foreground">Personalized analysis and recommendations</p>
                        </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className={`flex ${isMobile ? 'flex-col gap-1' : 'gap-2'} border-b border-border flex-shrink-0`}>
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
                    <div className={`${isMobile ? 'space-y-2' : 'space-y-6'}`}>
                        <div className={`bg-card/70 backdrop-blur-sm border border-border rounded-lg ${isMobile ? 'p-2' : 'p-6'} relative`}>
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
                            <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-3 gap-6'}`}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-500">
                                        {analysisData.overallProgress.strongAreas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Strong Topics</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-500">
                                        {analysisData.topicAnalysis.filter(t => t.trend === 'improving').length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Improving</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500">
                                        {analysisData.overallProgress.weakAreas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Need Focus</div>
                                </div>
                            </div>
                        </div>

                        {analysisData.topicAnalysis.length > 0 ? (
                            analysisData.topicAnalysis.map((topic, idx) => (
                                <TopicAnalysisCard key={idx} topic={topic} />
                            ))
                        ) : (
                            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-8 text-center">
                                <BarChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Topic Analysis Available</h3>
                                <p className="text-muted-foreground">Start solving problems to see your topic-wise analysis!</p>
                            </div>
                        )}
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

                        <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'lg:grid-cols-2 gap-6'}`}>
                            {analysisData.suggestedQuestions && analysisData.suggestedQuestions.length > 0 ? (
                                analysisData.suggestedQuestions.map((question) => (
                                    <SuggestedQuestionCard key={question.id} question={question} />
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8">
                                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        AI is generating personalized question recommendations...
                                    </p>
                                </div>
                            )}
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
                            <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 gap-6'}`}>
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
                        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 relative min-h-[600px] flex flex-col">
                            <div className="absolute top-4 right-4">
                                <div className="group relative">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                                    <div className="absolute top-6 right-0 bg-popover border border-border rounded-md p-2 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        AI-powered mentoring and guidance
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    AI Mentor
                                </h2>
                            </div>

                            {/* AI Chatbot Component */}
                            <div className="flex-1 flex justify-center">
                                <AIChatbot suggestedQuestions={[
                                    "Analyze my DSA topic strengths and weaknesses",
                                    "What topics should I focus on based on my progress?",
                                    analysisData.overallProgress.weakAreas.length > 0 
                                        ? `Help me improve in ${analysisData.overallProgress.weakAreas.slice(0, 2).join(' and ')}`
                                        : "Can you suggest a study plan for my weak areas?",
                                    "How can I improve my problem-solving speed?",
                                    `I've solved ${analysisData.topicAnalysis.reduce((sum, topic) => sum + topic.problemsSolved, 0)} problems. What should I do next?`,
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
