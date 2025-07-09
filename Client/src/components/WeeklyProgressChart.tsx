import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: 'Mon', problems: 3, difficulty: 'Medium' },
  { day: 'Tue', problems: 5, difficulty: 'Easy' },
  { day: 'Wed', problems: 2, difficulty: 'Hard' },
  { day: 'Thu', problems: 4, difficulty: 'Medium' },
  { day: 'Fri', problems: 6, difficulty: 'Easy' },
  { day: 'Sat', problems: 3, difficulty: 'Medium' },
  { day: 'Sun', problems: 1, difficulty: 'Hard' },
];

export function WeeklyProgressChart() {
  const totalProblems = data.reduce((sum, day) => sum + day.problems, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weekly Progress
          <span className="text-2xl font-bold text-primary">{totalProblems}</span>
        </CardTitle>
        <CardDescription>
          Problems solved this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="problems" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ r: 6, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}