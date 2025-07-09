import { Share2, Copy, ExternalLink, Calendar, Target, Flame, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const profileStats = [
  { label: "Total Problems", value: "363", icon: Target },
  { label: "Strongest Topic", value: "Arrays", icon: Trophy },
  { label: "Current Streak", value: "7 days", icon: Flame },
  { label: "Preferred Difficulty", value: "Medium", icon: Calendar },
];

const achievements = [
  { title: "Problem Solver", description: "Solved 100+ problems", earned: true },
  { title: "Consistent Coder", description: "30-day streak", earned: true },
  { title: "Topic Master", description: "Expert in 3+ topics", earned: false },
  { title: "Speed Runner", description: "Solve 10 problems in a day", earned: true },
];

export default function Profile() {
  const { toast } = useToast();

  const copyPublicUrl = () => {
    navigator.clipboard.writeText("https://codetrail.dev/profile/johndoe");
    toast({
      title: "URL copied!",
      description: "Public profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between animate-slide-in-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Public Profile</h1>
          <p className="text-muted-foreground text-lg">
            Share your coding achievements with others
          </p>
        </div>
        <Button onClick={copyPublicUrl} variant="outline" className="group hover-lift glass">
          <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Copy public URL
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in animate-delay-200 hover-lift shadow-soft">
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                This is how your public profile appears to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-hero rounded-lg p-6 border glass">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">JD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">John Doe</h3>
                    <p className="text-muted-foreground">@johndoe</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">Full Stack Developer</Badge>
                      <Badge variant="outline">JavaScript</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {profileStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button variant="default" size="sm" asChild>
                    <a href="#" target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      View Full Profile
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in animate-delay-300 hover-lift shadow-soft">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Badges and milestones you've earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.title}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.earned 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/30 border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <Trophy className={`h-5 w-5 ${
                          achievement.earned ? 'text-white' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge variant="secondary" className="mt-2">Earned</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 animate-slide-in-right animate-delay-200">
          <Card className="hover-lift shadow-soft glass">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Customize your public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Visibility</label>
                <select className="w-full p-2 border border-border rounded-md bg-background">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Show on Profile</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Problem solving stats</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Current streak</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Achievements</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Platform accounts</span>
                  </label>
                </div>
              </div>

              <Button className="w-full" variant="default">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}