import { Link, useLocation, useNavigate } from "react-router-dom";
import { Code, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
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

    const handleLogout = async () => {
        await logout();
        navigate('/');
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
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    // Minimal navbar for auth pages
    if (minimal) {
        return (
            <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <Code className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        CodeTrail
                    </span>
                </Link>

                <ThemeToggle />
            </header>
        );
    }

    // Full navbar for landing page
    return (
        <header className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    CodeTrail
                </span>
            </Link>

            <nav className="flex items-center space-x-2 md:space-x-8">
                <button
                    onClick={() => scrollToSection('features')}
                    className="hidden md:block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    Features
                </button>
                <button
                    onClick={() => scrollToSection('demo')}
                    className="hidden md:block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    Demo
                </button>
                <ThemeToggle />
                
                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
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
                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="outline" size="sm" className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup" replace>
                            <Button size="sm" className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
