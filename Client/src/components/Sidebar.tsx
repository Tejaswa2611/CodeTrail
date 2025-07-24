import { useState } from "react";
import { NavLink } from "react-router-dom";
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
        <div className="flex-1"></div>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 relative group",
                "hover:bg-gradient-to-r hover:from-[#E64373]/10 hover:to-[#644EC9]/10",
                isActive 
                  ? "bg-gradient-to-r from-[#E64373]/20 to-[#644EC9]/20 text-[#E64373] border border-[#E64373]/30 shadow-lg" 
                  : "text-muted-foreground hover:text-foreground",
                isCollapsed && "justify-center",
                // Special styling for AI Coach
                item.name === "AI Coach" && !isActive && "hover:bg-gradient-to-r hover:from-[#644EC9]/20 hover:to-[#5D3B87]/20"
              )
            }
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-all duration-300",
              // Special glow effect for AI Coach icon
              item.name === "AI Coach" && "text-purple-400 group-hover:drop-shadow-[0_0_6px_rgba(147,51,234,0.8)] group-hover:scale-110"
            )} />
            {!isCollapsed && (
              <span className={cn(
                "font-medium",
                // Special glittering effect for AI Coach text
                item.name === "AI Coach" && [
                  "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent",
                  "relative",
                  "group-hover:animate-[glow_1.5s_ease-in-out_infinite_alternate]",
                  "animate-[matrix-flicker_3s_ease-in-out_infinite]",
                  "transition-all duration-300",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/20 before:to-transparent",
                  "before:animate-[matrix-scan_2s_linear_infinite] before:opacity-0 group-hover:before:opacity-100",
                  "font-bold uppercase tracking-wider"
                ]
              )}
              style={item.name === "AI Coach" ? {
                textShadow: "0 0 8px rgba(147, 51, 234, 0.4), 0 0 16px rgba(147, 51, 234, 0.2)",
                filter: "brightness(1.2)",
                fontFamily: "'JetBrains Mono', 'Courier New', monospace"
              } : {}}
            >
              {item.name}
            </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
            {getUserInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{getUserName()}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 flex items-center justify-between">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="User Profile"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}