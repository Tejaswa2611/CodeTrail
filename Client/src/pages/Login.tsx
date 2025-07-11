import { useState } from "react";
import { Github, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroBackground from "@/assets/hero-background.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

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

  const handleOAuthLogin = (provider: string) => {
    // TODO: Implement OAuth login
    console.log(`${provider} login not implemented yet`);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      <Navbar minimal={true} />
      
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md space-y-8 animate-slide-down relative z-10">
        <div className="text-center animate-scale-in animate-delay-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg animate-floating">
              <span className="text-primary-foreground font-bold text-2xl">C</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in-up animate-delay-300">
            Welcome to CodeTrail
          </h1>
          <p className="text-white/90 text-lg animate-fade-in-up animate-delay-500">
            Track your coding journey. Let AI guide your next step.
          </p>
        </div>

        <Card className="shadow-glow glass animate-scale-in animate-delay-300 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Sign in to your account</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                    placeholder="Enter your password"
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
                className="w-full bg-gradient-primary hover-lift shadow-glow group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
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
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="group hover-lift glass"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">Continue with GitHub</span>
              </Button>

              <Button 
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="group hover-lift glass"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Continue with Google</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="/signup" replace className="text-white hover:text-white/80 underline">
            Sign up here
          </Link>
        </div>

       
        </div>
      </div>
    </div>
  );
}