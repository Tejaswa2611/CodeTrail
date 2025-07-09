import { TrendingUp, Target, Flame, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Problems",
    value: "363",
    change: "+12 this week",
    icon: Target,
    color: "text-codetrail-blue"
  },
  {
    title: "Current Streak",
    value: "7 days",
    change: "Personal best!",
    icon: Flame,
    color: "text-codetrail-orange"
  },
  {
    title: "Weekly Goal",
    value: "24/30",
    change: "80% complete",
    icon: TrendingUp,
    color: "text-codetrail-green"
  },
  {
    title: "Rank",
    value: "#1,247",
    change: "+156 positions",
    icon: Trophy,
    color: "text-codetrail-purple"
  }
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}