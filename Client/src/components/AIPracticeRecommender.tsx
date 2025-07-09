import { useState } from "react";
import { Brain, Sparkles, ExternalLink, Clock, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProblemRecommendation {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: string;
  tags: string[];
  estimatedTime: string;
  url: string;
  reasoning: string;
}

const mockRecommendations: ProblemRecommendation[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    platform: 'LeetCode',
    tags: ['Array', 'Hash Table'],
    estimatedTime: '15 min',
    url: '#',
    reasoning: 'Perfect for practicing hash table fundamentals before moving to harder array problems.'
  },
  {
    id: '2',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    platform: 'LeetCode',
    tags: ['Tree', 'BFS'],
    estimatedTime: '25 min',
    url: '#',
    reasoning: 'Builds on your tree knowledge and introduces BFS concepts you\'ll need for graph problems.'
  },
  {
    id: '3',
    title: 'Coin Change',
    difficulty: 'Medium',
    platform: 'LeetCode',
    tags: ['Dynamic Programming'],
    estimatedTime: '30 min',
    url: '#',
    reasoning: 'Classic DP problem that will help you understand the pattern for optimization problems.'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-codetrail-green';
    case 'Medium': return 'bg-codetrail-orange';
    case 'Hard': return 'bg-codetrail-red';
    default: return 'bg-muted';
  }
};

const getPlatformIcon = (platform: string) => {
  // In a real app, you'd have actual platform icons
  return '🔗';
};

export function AIPracticeRecommender() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ProblemRecommendation[]>([]);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRecommendations(mockRecommendations);
    setIsLoading(false);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Practice Recommender
        </CardTitle>
        <CardDescription>
          Get personalized problem recommendations based on your goals and current progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            What should I practice next?
          </label>
          <Textarea
            placeholder="E.g., 'I want to improve my dynamic programming skills' or 'Prepare for Google interviews' or 'Focus on graph algorithms'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleAskAI}
            disabled={!query.trim() || isLoading}
            variant="ai"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Analyzing your progress...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Ask CodeTrail AI
              </>
            )}
          </Button>
        </div>

        {recommendations.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recommended Problems
              </h4>
              
              {recommendations.map((problem) => (
                <div 
                  key={problem.id}
                  className="p-4 border border-border rounded-lg hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-foreground">{problem.title}</h5>
                        <span className="text-sm">{getPlatformIcon(problem.platform)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getDifficultyColor(problem.difficulty)} text-white`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {problem.estimatedTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={problem.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    💡 {problem.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}