import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
  { platform: 'LeetCode', problems: 156, color: '#FFA500' },
  { platform: 'Codeforces', problems: 89, color: '#1E88E5' },
  { platform: 'InterviewBit', problems: 45, color: '#4CAF50' },
  { platform: 'HackerRank', problems: 73, color: '#00C851' },
];

export function PlatformBreakdown() {
  const totalProblems = data.reduce((sum, platform) => sum + platform.problems, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Breakdown</CardTitle>
        <CardDescription>
          Problems solved across different platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {data.map((platform) => (
            <div key={platform.platform} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: platform.color }}
                />
                <span className="font-medium">{platform.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{platform.problems}</Badge>
                <span className="text-sm text-muted-foreground">
                  {((platform.problems / totalProblems) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} />
            <YAxis 
              type="category" 
              dataKey="platform" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              width={80}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="problems" 
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}