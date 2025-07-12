import React from 'react';
import { BookOpen, Clock, ExternalLink, AlertCircle, Star, Target, CheckCircle, Building } from 'lucide-react';

interface SuggestedQuestionProps {
    question: {
        id: number;
        title: string;
        difficulty: string;
        topic: string;
        platform: string;
        url: string;
        reason: string;
        estimatedTime: string;
        companies: string[];
        priority: string;
    };
}

const SuggestedQuestionCard: React.FC<SuggestedQuestionProps> = ({ question }) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            case 'Medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
            case 'Hard': return 'text-red-500 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'high': return <Star className="w-4 h-4 text-orange-500" />;
            case 'medium': return <Target className="w-4 h-4 text-yellow-500" />;
            case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return null;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
            case 'high': return 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
            case 'low': return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
            default: return 'border-l-gray-500 bg-gray-50/50 dark:bg-gray-900/10';
        }
    };

    const handleSolveClick = () => {
        window.open(question.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`bg-card/70 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityColor(question.priority)}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                    {getPriorityIcon(question.priority)}
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {question.title}
                    </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {question.topic}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {question.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1 capitalize text-primary">
                        {question.priority} priority
                    </span>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium text-foreground">{question.reason}</p>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Companies that ask this:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {question.companies.map((company, idx) => (
                            <span 
                                key={idx} 
                                className="px-2 py-1 bg-secondary/50 hover:bg-secondary/70 rounded-md text-xs font-medium transition-colors"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={handleSolveClick}
                        className="flex-1 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Solve on {question.platform}
                    </button>
                    <button className="p-3 bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors">
                        <Star className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestedQuestionCard;
