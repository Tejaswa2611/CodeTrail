import { useState, useEffect } from "react";
import { ArrowRight, Code, TrendingUp, Target, Github, Star, Users, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import dashboardDemo from "@/assets/dashboard-demo.jpg";

const Landing = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  // Typewriter effect for both lines with continuous loop
  useEffect(() => {
    const lines = [
      "Track your coding journey.",
      "Let AI guide your next step."
    ];
    
    let charIndex = 0;
    let lineIndex = 0;
    let isErasing = false;
    let pauseTimer: NodeJS.Timeout;
    
    const timer = setInterval(() => {
      const currentLine = lines[lineIndex];
      
      if (!isErasing) {
        // Writing phase
        if (charIndex < currentLine.length) {
          setTypewriterText(currentLine.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Finished writing current line
          if (lineIndex === 0) {
            // Pause before erasing first line
            pauseTimer = setTimeout(() => {
              isErasing = true;
            }, 1500);
          } else {
            // Finished writing second line, pause before starting over
            pauseTimer = setTimeout(() => {
              isErasing = true;
            }, 2000);
          }
        }
      } else {
        // Erasing phase
        if (charIndex > 0) {
          setTypewriterText(currentLine.slice(0, charIndex - 1));
          charIndex--;
        } else {
          // Finished erasing
          isErasing = false;
          lineIndex++;
          
          // Reset to first line after completing both lines
          if (lineIndex >= lines.length) {
            lineIndex = 0;
          }
          
          charIndex = 0;
        }
      }
    }, isErasing ? 20 : 80); // Much faster erasing speed
    
    return () => {
      clearInterval(timer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, []);

  const demoImages = [
    dashboardDemo, // Dashboard screenshot
    dashboardDemo, // Profile screenshot  
    dashboardDemo, // Analytics screenshot
    dashboardDemo, // AI Coach screenshot
  ];

  const demoTitles = [
    "Dashboard Overview",
    "Profile Management", 
    "Analytics & Insights",
    "AI Coach Features"
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [demoImages.length]);

  // Handle hash-based navigation from other pages
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait a bit longer for the page to render
    }
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your coding journey across multiple platforms with detailed analytics and insights."
    },
    {
      icon: Target,
      title: "AI Recommendations",
      description: "Get personalized problem suggestions based on your skill level and learning patterns."
    },
    {
      icon: Code,
      title: "Multi-Platform Support",
      description: "Connect LeetCode, Codeforces, InterviewBit and more to centralize your progress."
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Problems Solved", value: "500K+", icon: CheckCircle },
    { label: "GitHub Stars", value: "2.5K+", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 page-enter">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-pulse-glow"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Badge variant="secondary" className="mb-6 animate-scale-in animate-delay-200 glass">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Tracking
          </Badge>
          
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight min-h-[2em]">
              <span className={`${
                typewriterText.includes('Track') 
                  ? 'bg-gradient-to-r from-foreground via-primary to-foreground' 
                  : 'bg-gradient-primary'
              } bg-clip-text text-transparent`}>
                {typewriterText}
              </span>
              <span className="animate-pulse text-primary">|</span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-1000">
            The smart way to monitor your progress across coding platforms and get personalized recommendations 
            to accelerate your learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animate-delay-1200">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group hover-lift shadow-glow">
                Start Tracking Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto group hover-lift glass">
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fade-in-up animate-delay-1400">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-2 hover-lift p-3 rounded-lg glass">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="font-semibold">{stat.value}</span>
                <span className="text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-6 py-16 relative">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            See CodeTrail in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven coding progress tracking
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto animate-scale-in animate-delay-300">
          <Card className="overflow-hidden shadow-soft border-0 bg-gradient-hero hover-lift">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {demoTitles[currentDemo]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentDemo + 1} of {demoImages.length}
                </p>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg blur-xl group-hover:opacity-30 transition-opacity"></div>
                <img 
                  src={demoImages[currentDemo]} 
                  alt={demoTitles[currentDemo]}
                  className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-glow transition-all duration-700 hover:scale-[1.02] relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg z-20" />
                
                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentDemo((prev) => (prev - 1 + demoImages.length) % demoImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-black/70"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDemo((prev) => (prev + 1) % demoImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-black/70"
                >
                  →
                </button>
              </div>
              
              <div className="flex justify-center mt-4 space-x-3">
                {demoImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDemo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentDemo === index 
                        ? 'bg-primary shadow-glow scale-125' 
                        : 'bg-muted hover:bg-muted-foreground/50 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 relative">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accelerate your coding journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group hover-lift border-0 bg-gradient-hero animate-fade-in-up glass" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-primary border-0 shadow-glow hover-lift animate-scale-in glass relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-primary/20 animate-pulse-glow"></div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white animate-fade-in-up">
              Ready to level up your coding?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              Join thousands of developers who are already tracking their progress with CodeTrail.
            </p>
            <Link to="/signup" className="inline-block animate-scale-in animate-delay-300">
              <Button size="lg" variant="secondary" className="group shadow-soft hover-lift">
                Get Started for Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
      
    </div>
  );
};

export default Landing;