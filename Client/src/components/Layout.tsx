import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      
      // Validate theme value
      if (savedTheme !== 'light' && savedTheme !== 'dark') {
        console.warn('Invalid theme value in localStorage, defaulting to light');
        localStorage.setItem('theme', 'light');
        setTheme('light');
      } else {
        setTheme(savedTheme);
      }
      
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      toast({
        variant: "destructive",
        title: "Theme Loading Error",
        description: "Failed to load saved theme preferences",
        duration: 3000,
      });
      setTheme('light');
    }
  }, [toast]);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      
      toast({
        title: "Theme Changed",
        description: `Switched to ${newTheme} mode`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling theme:', error);
      toast({
        variant: "destructive",
        title: "Theme Error",
        description: "Failed to change theme",
        duration: 3000,
      });
    }
  };

  const handleMobileMenuToggle = () => {
    try {
      setIsMobileMenuOpen(prev => !prev);
    } catch (error) {
      console.error('Error toggling mobile menu:', error);
      toast({
        variant: "destructive",
        title: "Menu Error",
        description: "Failed to toggle mobile menu",
        duration: 3000,
      });
    }
  };

  const handleMobileMenuClose = () => {
    try {
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error closing mobile menu:', error);
      toast({
        variant: "destructive",
        title: "Menu Error",
        description: "Failed to close mobile menu",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={handleMobileMenuClose} />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
              <Sidebar onMobileClose={handleMobileMenuClose} />
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-h-screen">
          <TopNavbar 
            onThemeToggle={toggleTheme} 
            theme={theme}
            onMobileMenuToggle={handleMobileMenuToggle}
          />
          <main className="flex-1 p-3 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}