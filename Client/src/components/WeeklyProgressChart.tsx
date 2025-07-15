import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi, DailySubmissionsData } from '../services/apiService';
import { useTheme } from '../contexts/ThemeContext';

interface ChartDataPoint {
  date: string;
  leetcode: number;
  codeforces: number;
  total: number;
  formattedDate: string; // For display
}

export function WeeklyProgressChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dailyData = await dashboardApi.getDailySubmissions();
        
        if (dailyData?.dailySubmissions) {
          // Transform data for chart
          const chartData: ChartDataPoint[] = dailyData.dailySubmissions.map(item => ({
            date: item.date,
            leetcode: item.leetcode,
            codeforces: item.codeforces,
            total: item.total,
            formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
          }));
          
          setData(chartData);
        } else {
          setError('No submission data available');
        }
      } catch (err) {
        console.error('Error fetching daily submissions:', err);
        setError('Failed to load submission data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProblems = data.reduce((sum, day) => sum + day.total, 0);
  const leetcodeTotal = data.reduce((sum, day) => sum + day.leetcode, 0);
  const codeforcesTotal = data.reduce((sum, day) => sum + day.codeforces, 0);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Submission Trend</CardTitle>
          <CardDescription>Loading submission data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Submission Trend</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Unable to load chart data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Submission Trend</span>
          <div className="flex gap-4 text-sm">
            <span className="text-[#FFA500] font-bold">LC: {leetcodeTotal}</span>
            <span className="text-[#1E88E5] font-bold">CF: {codeforcesTotal}</span>
            <span className="text-primary font-bold">Total: {totalProblems}</span>
          </div>
        </CardTitle>
        <CardDescription>
          Problems solved over the last 30 days ({data.length} days with data)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              interval="preserveStartEnd"
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
                color: 'hsl(var(--foreground))',
              }}
              labelFormatter={(value) => `Date: ${value}`}
            />
            <Legend />
            
            {/* LeetCode Line */}
            <Line 
              type="monotone" 
              dataKey="leetcode" 
              stroke="#FFA500"
              strokeWidth={2}
              dot={{ r: 4, fill: '#FFA500' }}
              activeDot={{ r: 6, fill: '#FFA500' }}
              name="LeetCode"
            />
            
            {/* Codeforces Line */}
            <Line 
              type="monotone" 
              dataKey="codeforces" 
              stroke="#1E88E5"
              strokeWidth={2}
              dot={{ r: 4, fill: '#1E88E5' }}
              activeDot={{ r: 6, fill: '#1E88E5' }}
              name="Codeforces"
            />
            
            {/* Total Line */}
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 5, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 7, fill: 'hsl(var(--primary))' }}
              name="Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}