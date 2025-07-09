import { DashboardStats } from "@/components/DashboardStats";
import { WeeklyProgressChart } from "@/components/WeeklyProgressChart";
import { PlatformBreakdown } from "@/components/PlatformBreakdown";
import { TopicMasteryHeatmap } from "@/components/TopicMasteryHeatmap";
import { AIPracticeRecommender } from "@/components/AIPracticeRecommender";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="animate-slide-in-left">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's your coding progress overview.
        </p>
      </div>

      <div className="animate-fade-in animate-delay-200">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-slide-in-left animate-delay-300">
            <WeeklyProgressChart />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="animate-scale-in animate-delay-500">
              <PlatformBreakdown />
            </div>
            <div className="animate-scale-in animate-delay-500">
              <TopicMasteryHeatmap />
            </div>
          </div>
        </div>
        
        <div className="space-y-6 animate-slide-in-right animate-delay-300">
          <AIPracticeRecommender />
        </div>
      </div>
    </div>
  );
}