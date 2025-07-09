import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const topics = [
  { name: 'Arrays', solved: 45, total: 60, level: 'Advanced' },
  { name: 'Strings', solved: 38, total: 50, level: 'Advanced' },
  { name: 'Linked Lists', solved: 25, total: 30, level: 'Intermediate' },
  { name: 'Trees', solved: 32, total: 45, level: 'Intermediate' },
  { name: 'Graphs', solved: 15, total: 40, level: 'Beginner' },
  { name: 'Dynamic Programming', solved: 12, total: 50, level: 'Beginner' },
  { name: 'Backtracking', solved: 8, total: 25, level: 'Beginner' },
  { name: 'Binary Search', solved: 20, total: 25, level: 'Intermediate' },
];

const getMasteryLevel = (solved: number, total: number) => {
  const percentage = (solved / total) * 100;
  if (percentage >= 80) return { level: 'Expert', color: 'bg-codetrail-green', intensity: 'opacity-100' };
  if (percentage >= 60) return { level: 'Advanced', color: 'bg-codetrail-blue', intensity: 'opacity-80' };
  if (percentage >= 40) return { level: 'Intermediate', color: 'bg-codetrail-orange', intensity: 'opacity-60' };
  return { level: 'Beginner', color: 'bg-codetrail-red', intensity: 'opacity-40' };
};

export function TopicMasteryHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Mastery</CardTitle>
        <CardDescription>
          Your progress across different topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((topic) => {
            const mastery = getMasteryLevel(topic.solved, topic.total);
            const percentage = Math.round((topic.solved / topic.total) * 100);
            
            return (
              <div
                key={topic.name}
                className={cn(
                  "p-4 rounded-lg border border-border transition-all duration-200 hover:scale-105 cursor-pointer",
                  mastery.color,
                  mastery.intensity
                )}
              >
                <div className="text-white">
                  <h4 className="font-semibold text-sm mb-2">{topic.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">
                      {topic.solved}/{topic.total}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="bg-white/20 text-white text-xs"
                    >
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="mt-2 bg-white/20 rounded-full h-1.5">
                    <div 
                      className="bg-white rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-codetrail-red opacity-40 rounded" />
            <span className="text-muted-foreground">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-codetrail-orange opacity-60 rounded" />
            <span className="text-muted-foreground">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-codetrail-blue opacity-80 rounded" />
            <span className="text-muted-foreground">Advanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-codetrail-green opacity-100 rounded" />
            <span className="text-muted-foreground">Expert</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}