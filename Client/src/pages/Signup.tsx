import { useState } from "react";
import { Github, Mail, ArrowRight, User, Eye, EyeOff, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroBackground from "@/assets/hero-background.jpg";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const errors: {[key: string]: string} = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        // lastName is now optional
        if (formData.lastName.trim() && formData.lastName.length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleOAuthSignup = (provider: string) => {
        // TODO: Implement OAuth signup
        console.log(`${provider} signup not implemented yet`);
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const success = await register(
            formData.email,
            formData.password,
            formData.firstName,
            formData.lastName
        );
        
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background no-page-animation">
            <Navbar minimal={true} />

            <div className="flex items-center justify-center p-4 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-2xl flex items-center justify-center shadow-lg">
                                <Code className="text-white font-bold text-2xl h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Join CodeTrail
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Start tracking your coding journey today
                        </p>
                    </div>

                    <Card className="shadow-glow glass hover-lift tech-card-enhanced">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl font-semibold terminal-text text-tech-primary-green" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>Create your account</CardTitle>
                            <CardDescription className="text-tech-gray">
                                Choose your preferred sign-up method to get started
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleEmailSignup} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className={`glass ${formErrors.firstName ? 'border-red-500' : ''}`}
                                        />
                                        {formErrors.firstName && (
                                            <p className="text-sm text-red-500">{formErrors.firstName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name (Optional)</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`glass ${formErrors.lastName ? 'border-red-500' : ''}`}
                                        />
                                        {formErrors.lastName && (
                                            <p className="text-sm text-red-500">{formErrors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className={`glass ${formErrors.email ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-sm text-red-500">{formErrors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className={`glass pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="text-sm text-red-500">{formErrors.password}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    variant="gradient"
                                    className="w-full group terminal-text glow-primary hover:shadow-glow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating account...
                                        </div>
                                    ) : (
                                        <>
                                            <User className="h-4 w-4" />
                                            Create Account
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                {/* Render Cold Start Warning */}
                                {isLoading && (
                                    <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                        <p className="text-xs text-orange-700 dark:text-orange-400 text-center">
                                            ⏳ <strong>First visit?</strong> Our server might take up to 30-40 seconds to wake up from sleep mode. Thanks for your patience!
                                        </p>
                                    </div>
                                )}
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    onClick={() => handleOAuthSignup('github')}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="lg"
                                    className="group hover-lift glass hover:glow-primary hover:border-tech-primary-green hover:text-tech-primary-green terminal-text"
                                >
                                    <Github className="h-5 w-5" />
                                    <span className="sr-only">Sign up with GitHub</span>
                                </Button>

                                <Button 
                                    onClick={() => handleOAuthSignup('google')}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="lg"
                                    className="group hover-lift glass hover:glow-primary hover:border-tech-primary-green hover:text-tech-primary-green terminal-text"
                                >
                                    <Mail className="h-5 w-5" />
                                    <span className="sr-only">Sign up with Google</span>
                                </Button>
                            </div>


                        </CardContent>
                    </Card>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" replace className="text-foreground hover:text-primary underline">
                            Sign in here
                        </Link>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-foreground hover:text-primary underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-foreground hover:text-primary underline">Privacy Policy</a>.
                    </div>


                </div>
            </div>
        </div>
    );
}
