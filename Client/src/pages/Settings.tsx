import { useState } from "react";
import { Link2, Zap, Bell, Shield, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  { name: "LeetCode", username: "johndoe_lc", connected: true, color: "bg-orange-500" },
  { name: "Codeforces", username: "", connected: false, color: "bg-blue-500" },
  { name: "InterviewBit", username: "john.doe", connected: true, color: "bg-green-500" },
  { name: "HackerRank", username: "", connected: false, color: "bg-emerald-500" },
];

export default function Settings() {
  const [autoSync, setAutoSync] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const { toast } = useToast();

  const handleConnect = (platform: string) => {
    toast({
      title: "Connection initiated",
      description: `Connecting to ${platform}...`,
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="animate-slide-in-left">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account settings and platform integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in animate-delay-200 hover-lift shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Platform Integrations
              </CardTitle>
              <CardDescription>
                Connect your coding platform accounts to sync your progress automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                    <div>
                      <h4 className="font-medium text-foreground">{platform.name}</h4>
                      {platform.connected ? (
                        <p className="text-sm text-muted-foreground">@{platform.username}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleConnect(platform.name)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Auto-sync Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync your progress every 24 hours
                    </p>
                  </div>
                  <Switch
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in animate-delay-300 hover-lift shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive updates and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekly progress reports and AI recommendations
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Daily practice reminders and streak notifications
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Notification Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Daily practice reminders</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Weekly progress reports</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">New AI recommendations</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Achievement unlocks</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 animate-slide-in-right animate-delay-200">
          <Card className="hover-lift shadow-soft glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="john@example.com" type="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="johndoe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  className="w-full p-2 border border-border rounded-md bg-background resize-none"
                  rows={3}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-soft glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Preferred Difficulty</Label>
                <select id="difficulty" className="w-full p-2 border border-border rounded-md bg-background">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Mixed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus">Focus Areas</Label>
                <select id="focus" className="w-full p-2 border border-border rounded-md bg-background">
                  <option>Interview Preparation</option>
                  <option>Competitive Programming</option>
                  <option>Algorithm Fundamentals</option>
                  <option>Data Structures</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Weekly Goal</Label>
                <Input id="goal" defaultValue="30" type="number" />
                <p className="text-xs text-muted-foreground">Problems per week</p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} className="w-full hover-lift shadow-soft bg-gradient-primary">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}