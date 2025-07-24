import { useState } from "react";
import { Github, Mail, ArrowRight, Eye, EyeOff, Code, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="min-h-screen bg-background no-page-animation">
      <Navbar minimal={true} />
      
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-2xl flex items-center justify-center shadow-lg">
                <Code className="text-white font-bold text-2xl h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg">
              Sign in to continue your coding journey
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-glow glass hover-lift tech-card-enhanced">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold terminal-text text-tech-primary-green" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>Sign in to your account</CardTitle>
              <CardDescription className="text-tech-gray">
                Enter your credentials to access your dashboard
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
                    placeholder="Enter your email address"
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
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
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
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
                  className="group hover-lift glass hover:glow-primary hover:border-tech-primary-green hover:text-tech-primary-green terminal-text"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">Sign in with GitHub</span>
                </Button>

                <Button 
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                  className="group hover-lift glass hover:glow-primary hover:border-tech-primary-green hover:text-tech-primary-green terminal-text"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Sign in with Google</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}