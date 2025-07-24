import { useState, useEffect } from "react";
import { Link2, Save, User, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/services/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsContentLoader } from "@/components/MatrixContentLoader";
import { LogoLoading } from "@/components/LogoVariants";
import { MatrixSpinner } from "@/components/MatrixLoader";

interface PlatformHandle {
  platform: string;
  name: string;
  handle: string;
  connected: boolean;
  color: string;
  icon: string;
  placeholder: string;
}

export default function Settings() {
  const [platforms, setPlatforms] = useState<PlatformHandle[]>([
    { 
      platform: "leetcode", 
      name: "LeetCode", 
      handle: "", 
      connected: false, 
      color: "bg-orange-500",
      icon: "LC",
      placeholder: "Enter your LeetCode username"
    },
    { 
      platform: "codeforces", 
      name: "Codeforces", 
      handle: "", 
      connected: false, 
      color: "bg-blue-500",
      icon: "CF",
      placeholder: "Enter your Codeforces handle"
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load existing platform handles
  useEffect(() => {
    const loadPlatformHandles = async () => {
      try {
        const response = await dashboardApi.getUserPlatformProfiles();
        if (response?.connectedPlatforms) {
          const connectedPlatforms = response.connectedPlatforms;
          
          setPlatforms(prev => prev.map(platform => ({
            ...platform,
            handle: connectedPlatforms[platform.platform as keyof typeof connectedPlatforms]?.handle || "",
            connected: !!(connectedPlatforms[platform.platform as keyof typeof connectedPlatforms]?.handle)
          })));
        }
      } catch (error) {
        console.error('Error loading platform handles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlatformHandles();
  }, []);

  const handleInputChange = (platform: string, value: string) => {
    setPlatforms(prev => 
      prev.map(p => 
        p.platform === platform 
          ? { ...p, handle: value }
          : p
      )
    );
  };

  const handleSavePlatform = async (platform: PlatformHandle) => {
    const trimmedHandle = platform.handle.trim();
    
    if (!trimmedHandle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Please enter a valid ${platform.name} handle`,
        duration: 3000,
      });
      return;
    }

    setIsSaving(platform.platform);

    try {
      const response = await dashboardApi.updatePlatformHandle(platform.platform, trimmedHandle);
      
      if (response?.success) {
        // Update the platform state
        setPlatforms(prev => 
          prev.map(p => 
            p.platform === platform.platform 
              ? { ...p, connected: true }
              : p
          )
        );

        toast({
          title: "Success",
          description: `${platform.name} handle updated successfully!`,
          duration: 3000,
        });
      } else {
        throw new Error(response?.message || 'Failed to update handle');
      }
    } catch (error: unknown) {
      console.error('Error updating platform handle:', error);
      
      const errorMessage = error instanceof Error ? error.message : `Failed to update ${platform.name} handle`;
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-dark">
        <LogoLoading 
          size="lg" 
          message="Loading settings configuration"
        />
      </div>
    );
  }

  return (
            <div className="space-y-6">
          <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
          Settings
        </h1>
        <p className="text-muted-foreground text-lg terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
          Manage your coding platform handles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
                      <Card className="hover-lift shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                <Link2 className="h-5 w-5" />
                Platform Handles
              </CardTitle>
              <CardDescription className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                Connect your coding platform accounts to sync your progress automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {platforms.map((platform) => (
                <div key={platform.platform} className="p-4 border border-border rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white font-bold text-sm font-mono`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                          {platform.name}
                        </h4>
                        <p className="text-sm text-muted-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                          {platform.connected ? `@${platform.handle}` : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.connected && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-md text-xs font-medium">
                          <Check className="h-3 w-3" />
                          Connected
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={platform.platform} className="text-sm font-medium terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                        {platform.name} Handle
                      </Label>
                      <Input
                        id={platform.platform}
                        value={platform.handle}
                        onChange={(e) => handleInputChange(platform.platform, e.target.value)}
                        placeholder={platform.placeholder}
                        className="font-mono"
                        disabled={isSaving === platform.platform}
                      />
                    </div>
                    
                    <Button
                      onClick={() => handleSavePlatform(platform)}
                      disabled={isSaving === platform.platform || !platform.handle.trim()}
                      className="w-full font-mono bg-tech-primary-green hover:bg-tech-primary-green/80 text-tech-deep-black"
                    >
                      {isSaving === platform.platform ? (
                        <div className="flex items-center gap-2">
                          <MatrixSpinner size="sm" />
                          Validating & Syncing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          {platform.connected ? "Update Handle" : "Connect Platform"}
                        </div>
                      )}
                    </Button>
                    
                    {platform.platform === 'leetcode' && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs text-blue-800 dark:text-blue-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                          Use your LeetCode username, not email. You can find it in your profile URL: leetcode.com/u/username
                        </div>
                      </div>
                    )}
                    
                    {platform.platform === 'codeforces' && (
                      <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md text-xs text-purple-800 dark:text-purple-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                          Use your Codeforces handle. You can find it in your profile URL: codeforces.com/profile/handle
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

                  <div className="space-y-6">
          <Card className="hover-lift shadow-soft glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>Display Name</Label>
                <Input 
                  id="name" 
                  value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'} 
                  readOnly 
                  className="font-mono bg-muted" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || 'user@example.com'} 
                  readOnly 
                  className="font-mono bg-muted" 
                />
              </div>

              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                <p className="text-xs text-amber-800 dark:text-amber-400 terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  Profile information is read-only. Contact support to make changes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-soft glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                <Link2 className="h-5 w-5" />
                Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <span className="text-sm font-medium terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                    {platform.name}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              ))}
              
              <div className="mt-4 text-xs text-muted-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                Connected platforms sync automatically every 24 hours
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
