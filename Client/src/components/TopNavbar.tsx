import { useState } from "react";
import { Bell, Search, Sun, Moon, User, Settings, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import ScrambleLogo from "@/components/ScrambleLogo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavbarProps {
  onThemeToggle?: () => void;
  theme?: 'light' | 'dark';
  onMobileMenuToggle?: () => void;
}

export function TopNavbar({ onThemeToggle, theme = 'light', onMobileMenuToggle }: TopNavbarProps) {
  const [hasNotifications] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  // Get greeting with user's name
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good evening";
    
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    
    const userName = user?.firstName || "User";
    return `${timeGreeting}, ${userName}!`;
  };

  const handleLogout = async () => {
    try {
      console.log('🔓 Starting logout from TopNavbar...');
      await logout();
      console.log('✅ Logout successful, redirecting to home...');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
    console.log('📝 Edit Profile clicked - redirecting to profile page');
  };

  const handleSettings = () => {
    navigate('/settings');
    console.log('⚙️ Settings clicked - redirecting to settings page');
  };

  return (
    <header className="flex items-center justify-between px-3 md:px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo */}
        <div className="flex items-center">
          {/* Mobile: Circle C */}
          <div className="block sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border">
            <span className="text-2xl font-extrabold text-tech-primary-green font-mono select-none" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>C</span>
          </div>
          {/* Desktop: Full CodeTrail */}
          <div className="hidden sm:block">
            <ScrambleLogo 
              size="md"
              animated={true}
              autoScramble={false}
              variant="compact"
            />
          </div>
        </div>
        
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="relative"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>


        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              {getGreeting()}
            </p>
            <p className="text-xs text-muted-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              Ready to practice?
            </p>
          </div>
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:bg-gradient-primary/90 transition-colors cursor-pointer"
                onClick={() => console.log('🖱️ Profile button clicked in TopNavbar')}
              >
                <span className="text-white font-semibold">{getUserInitials()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Profile & Settings */}
              <DropdownMenuItem onClick={handleEditProfile}>
                <User className="mr-2 h-4 w-4" />
                <span className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  Edit Profile
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  Settings
                </span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Sign Out */}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  Sign Out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}