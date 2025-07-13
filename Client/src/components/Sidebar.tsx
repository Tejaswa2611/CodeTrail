import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Target, 
  Settings, 
  User, 
  BarChart3, 
  Brain,
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Coach", href: "/ai-coach", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onMobileClose?: () => void;
}

export function Sidebar({ className, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  // Get user's full name
  const getUserName = () => {
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  return (
    <div className={cn(
      "relative flex flex-col bg-card border-r border-border transition-all duration-300 h-full min-h-screen",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-tech-primary-green to-tech-accent-green rounded-lg flex items-center justify-center border border-tech-border glow-primary">
              <span className="text-tech-deep-black font-bold text-lg font-mono">C</span>
            </div>
            <span className="font-bold text-xl text-tech-primary-green neon-text terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              CodeTrail
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => onMobileClose?.()} // Close mobile menu when navigating
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-tech-primary-green text-tech-deep-black" : "text-muted-foreground",
                isCollapsed && "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          {!isCollapsed && (
            <span className="text-sm font-medium text-muted-foreground terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              Theme
            </span>
          )}
          <ThemeToggle />
        </div>
        
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg bg-accent/50",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                {getUserName()}
              </p>
              <p className="text-xs text-muted-foreground truncate terminal-text" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}