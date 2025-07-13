import React from 'react';
import { TrendingUp, TrendingDown, Star, ChevronRight, Target, CheckCircle, ExternalLink } from 'lucide-react';

interface TopicAnalysisProps {
    topic: {
        topic: string;
        proficiency: number;
        problemsSolved: number;
        totalProblems: number;
        trend: string;
        importance: string;
        companyFrequency: number;
        recommendation: string;
        nextSteps: Array<{
            text: string;
            url: string | null;
            type: 'link' | 'text';
        }>;
    };
}

const TopicAnalysisCard: React.FC<TopicAnalysisProps> = ({ topic }) => {
    const getProficiencyColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-custom-orange'; /* Your orange for good progress */
        return 'text-red-500';
    };

    const getProficiencyBg = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-custom-orange'; /* Your orange */
        return 'bg-red-500';
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'excellent':
            case 'good':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'improving':
                return <TrendingUp className="w-4 h-4 text-custom-orange" />; /* Your orange */
            case 'needs_work':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            case 'medium': return 'text-custom-orange bg-orange-100 dark:bg-orange-900/30'; /* Your orange */
            case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            default: return 'text-custom-gray-medium bg-gray-100 dark:bg-gray-900/30'; /* Your gray */
        }
    };

    return (
        <div className="bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{topic.topic}</h3>
                    {getTrendIcon(topic.trend)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(topic.importance)}`}>
                        {topic.importance} priority
                    </span>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-bold ${getProficiencyColor(topic.proficiency)}`}>
                        {topic.proficiency}%
                    </div>
                    <div className="text-sm text-muted-foreground">Proficiency</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground mb-2">Progress</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${getProficiencyBg(topic.proficiency)}`}
                                    style={{ width: `${topic.proficiency}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">
                                {topic.problemsSolved}/{topic.totalProblems}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Company Frequency</div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-custom-orange" /> /* Your orange */
                            <span className="font-medium">{topic.companyFrequency}%</span>
                            <span className="text-xs text-muted-foreground">asked in interviews</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            AI Recommendation
                        </div>
                        <p className="text-sm bg-secondary/30 p-3 rounded-lg border-l-4 border-primary">
                            {topic.recommendation}
                        </p>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            Next Steps
                            {topic.nextSteps.some(step => step.type === 'link') && (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                    ✓ Links Active
                                </span>
                            )}
                        </div>
                        <ul className="space-y-2">
                            {topic.nextSteps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex items-start gap-2 text-sm group">
                                    <ChevronRight className="w-3 h-3 text-custom-blue mt-0.5 group-hover:translate-x-1 transition-transform" />
                                    <div className="flex-1">
                                        {step.type === 'link' && step.url ? (
                                            <a 
                                                href={step.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-custom-blue hover:text-custom-blue-light underline underline-offset-2 flex items-center gap-1 group/link"
                                            >
                                                <span>{step.text}</span>
                                                <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <span className="text-foreground">{step.text}</span>
                                        )}
                                    </div>
                                    <CheckCircle className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicAnalysisCard;
