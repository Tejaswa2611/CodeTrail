import { Link, useLocation, useNavigate } from "react-router-dom";
import { Code, LogOut, User, Settings, Bell, HelpCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
    minimal?: boolean;
}

export function Navbar({ minimal = false }: NavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { actualTheme } = useTheme();

    const handleLogout = async () => {
        try {
            console.log('🔓 Starting logout process...');
            await logout();
            console.log('✅ Logout successful, redirecting to home...');
            navigate('/', { replace: true });
        } catch (error) {
            console.error('❌ Logout error:', error);
            // Even if logout fails, redirect to home for security
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

    const handleNotifications = () => {
        console.log('🔔 Notifications clicked - feature coming soon');
    };

    const handleHelp = () => {
        console.log('❓ Help clicked - feature coming soon');
    };

    const handlePrivacy = () => {
        console.log('🔒 Privacy & Security clicked - feature coming soon');
    };

    const scrollToSection = (sectionId: string) => {
        // If we're not on the landing page, navigate to landing page first
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
            // Set hash in URL for the section we want to scroll to
            window.location.hash = sectionId;
            return;
        }

        // If we're already on landing page, scroll immediately
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        const first = user.firstName && typeof user.firstName === 'string' && user.firstName.length > 0 ? user.firstName.charAt(0) : '';
        const last = user.lastName && typeof user.lastName === 'string' && user.lastName.length > 0 ? user.lastName.charAt(0) : '';
        const initials = `${first}${last}`.toUpperCase();
        return initials || 'U';
    };

    // Minimal navbar for auth pages
    if (minimal) {
        return (
            <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <button
                    type="button"
                    className="hover:opacity-80 transition-opacity duration-150 cursor-pointer select-none bg-transparent border-none p-0"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-lg flex items-center justify-center shadow-lg">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CodeTrail</span>
                    </div>
                </button>

                <ThemeToggle />
            </header>
        );
    }

    // Full navbar for landing page
    return (
        <header className="w-full px-2 sm:px-6 py-3 flex items-center justify-between overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-auto">
                        <Code className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent hidden sm:block will-change-auto">CodeTrail</span>
                </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center space-x-2 md:space-x-8">
                <div className="hidden md:block relative">
                    {/* Simplified shining border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] p-[1px] opacity-60">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] opacity-10 blur-sm"></div>
                    </div>
                    
                    <Link
                        to="/engineering"
                        className="relative block px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg text-[#E64373] hover:text-[#644EC9] transition-all duration-200 font-semibold group hover:bg-background will-change-auto"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="animate-bounce-subtle">✨</span>
                            Engineering
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E64373] to-[#644EC9] transition-all duration-200 group-hover:w-full"></span>
                    </Link>
                </div>
                <ThemeToggle />

                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white font-semibold">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Dashboard & Profile */}
                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEditProfile}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Edit Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Settings & Preferences */}
                            <DropdownMenuItem onClick={handleSettings}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleNotifications}>
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Notifications</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrivacy}>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Privacy & Security</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Help & Support */}
                            <DropdownMenuItem onClick={handleHelp}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help & Support</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Sign Out */}
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link to="/login">
                        <Button variant="outline" size="sm" className="text-sm font-medium border-[#644EC9] text-[#644EC9] hover:bg-[#644EC9]/10 hover:border-[#E64373] hover:text-[#E64373] transition-all duration-200 will-change-auto">
                            Login
                        </Button>
                    </Link>
                )}
            </nav>

            {/* Mobile nav: only logo and theme toggle */}
            <div className="flex sm:hidden items-center gap-2">
                <ThemeToggle />
            </div>
        </header>
    );
}
