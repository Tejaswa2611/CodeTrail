import { useState, useEffect } from "react";
import { ArrowRight, Code, TrendingUp, Target, Github, Zap, BarChart, Brain, Users, Star, CheckCircle, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import dashboardDemo from "@/assets/dashboard-demo.jpg";
import dashboardLight from "@/assets/dashboard light.png";
import dashboardDark from "@/assets/dashboard dark.png";
import analyticsLight from "@/assets/analytics lilght.png";
import analyticsDark from "@/assets/analytics dark.png";
import aiMentorLight from "@/assets/AI mentor light.png";
import aiMentorDark from "@/assets/AI mentor dark.png";
import aiAnalysisLight from "@/assets/AI analysis light.png";
import aiAnalysisDark from "@/assets/AI analysis dark.png";
import leetcodeDark from "@/assets/leetcode_dark.png";
import leetcodeLight from "@/assets/leetcode_light.png";
import codeforcesDark from "@/assets/codeforces_dark.png";
import codeforcesLight from "@/assets/codeforces_light.png";
import codechefDark from "@/assets/codechef_dark.png";
import codechefLight from "@/assets/codechef_light.png";
import codestudioDark from "@/assets/codestudio_dark.png";
import codestudioLight from "@/assets/codestudio_light.png";
import gfgLogo from "@/assets/gfg.png";
import interviewbitLogo from "@/assets/interviewbit.png";

const Landing = () => {
  const { actualTheme } = useTheme();
  const [currentDemo, setCurrentDemo] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Professional text reveal animation
  const [revealedText, setRevealedText] = useState("");
  const [codeTrailText, setCodeTrailText] = useState("");
  const targetText = "Code smarter, grow faster";
  const codeTrailTarget = "CodeTrail";

  useEffect(() => {
    // Animate CodeTrail first
    let codeTrailIndex = 0;
    const codeTrailTimer = setInterval(() => {
      if (codeTrailIndex <= codeTrailTarget.length) {
        setCodeTrailText(codeTrailTarget.slice(0, codeTrailIndex));
        codeTrailIndex++;
      } else {
        clearInterval(codeTrailTimer);
        
        // Then animate the subtitle after a delay
        setTimeout(() => {
          let index = 0;
          const timer = setInterval(() => {
            if (index <= targetText.length) {
              setRevealedText(targetText.slice(0, index));
              index++;
            } else {
              clearInterval(timer);
            }
          }, 50);
        }, 500);
      }
    }, 150);
    
    return () => clearInterval(codeTrailTimer);
  }, []);

  const demoImages = [
    actualTheme === 'dark' ? dashboardDark : dashboardLight,
    actualTheme === 'dark' ? analyticsDark : analyticsLight,
    actualTheme === 'dark' ? aiMentorDark : aiMentorLight,
    actualTheme === 'dark' ? aiAnalysisDark : aiAnalysisLight,
  ];

  const demoTitles = [
    "Dashboard Overview",
    "Analytics & Insights", 
    "AI Mentor",
    "AI Analysis"
  ];

  // Auto-play carousel with pause on interaction
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [demoImages.length, isAutoPlaying]);

  const handleManualChange = (index: number) => {
    setCurrentDemo(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const features = [
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Deep insights into your coding patterns, strengths, and areas for improvement with beautiful visualizations.",
      color: "text-[#E64373]",
      bgColor: "bg-gradient-to-br from-[#E64373]/20 to-[#E64373]/10"
    },
    {
      icon: Brain,
      title: "AI-Powered Coaching",
      description: "Personalized recommendations and smart guidance tailored to your learning style and goals.",
      color: "text-[#644EC9]",
      bgColor: "bg-gradient-to-br from-[#644EC9]/20 to-[#644EC9]/10"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set ambitious goals and track your progress with intelligent milestones and celebrations.",
      color: "text-[#5D3B87]",
      bgColor: "bg-gradient-to-br from-[#5D3B87]/20 to-[#5D3B87]/10"
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Compare with peers, join coding challenges, and learn from the global programming community. Coming Soon!",
      color: "text-[#6E1453]",
      bgColor: "bg-gradient-to-br from-[#6E1453]/20 to-[#6E1453]/10"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Instant synchronization across all platforms with live updates and notifications.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Star,
      title: "Performance Insights",
      description: "Detailed performance metrics and trends to help you understand your coding evolution.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    }
  ];

  const platforms = [
    { name: "LeetCode", light: leetcodeLight, dark: leetcodeDark },
    { name: "Codeforces", light: codeforcesLight, dark: codeforcesDark },
    { name: "CodeChef", light: codechefLight, dark: codechefDark },
    { name: "Coding Ninjas", light: codestudioLight, dark: codestudioDark },
    { name: "GeeksforGeeks", light: gfgLogo, dark: gfgLogo },
    { name: "InterviewBit", light: interviewbitLogo, dark: interviewbitLogo }
  ];



  // Auto-rotate demo images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [demoImages.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Increased offset to show more of the features section content
      const headerOffset = sectionId === 'features-carousel' ? -250 : -250;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero overflow-x-hidden">
      {/* Sticky Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20" id="hero">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-8">
                <Badge className="animate-bounce-subtle text-sm px-4 py-2 bg-gradient-to-r from-[#E64373]/20 to-[#644EC9]/20 text-[#E64373] border border-[#E64373]/30 hover:border-[#644EC9]/50 transition-all duration-300">
                  <Zap className="w-4 h-4 mr-2 text-[#644EC9]" />
                  AI-Powered
                </Badge>
                
                <h1 className="text-6xl lg:text-8xl font-bold leading-tight tracking-tight">
                  <div className="relative inline-block group mb-4">
                    {/* Subtle background effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent blur-sm opacity-20 scale-105">
                      {codeTrailTarget}
                    </span>
                    
                    {/* Main animated text */}
                    <span 
                      className="relative font-extrabold text-gradient-glow"
                      style={{
                        filter: 'brightness(1.05) contrast(1.02)',
                        textShadow: '0 0 20px rgba(230, 67, 115, 0.2), 0 0 40px rgba(100, 78, 201, 0.15)'
                      }}
                    >
                      {codeTrailText}
                      {codeTrailText.length < codeTrailTarget.length && (
                        <span className="animate-pulse" style={{ color: '#E64373' }}>|</span>
                      )}
                    </span>
                  </div>
                  <br />
                  <span className="text-foreground text-4xl lg:text-6xl">
                    {revealedText}
                    {revealedText.length > 0 && revealedText.length < targetText.length && (
                      <span className="animate-pulse" style={{ color: '#E64373' }}>|</span>
                    )}
                  </span>
                </h1>
                
                <p className="text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                  Connect your coding platforms and track your progress with graphs and AI-powered insights.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button asChild size="lg" className="text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] hover:from-[#E64373]/90 hover:via-[#644EC9]/90 hover:to-[#5D3B87]/90 text-white font-semibold">
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => scrollToSection('features-carousel')}
                  className="text-xl px-12 py-8 rounded-2xl border-2 border-[#644EC9] text-[#644EC9] hover:bg-[#644EC9]/10 hover:border-[#E64373] hover:text-[#E64373] transition-all duration-300 hover:scale-105"
                >
                  <Target className="mr-3 h-6 w-6" />
                  Features
                </Button>
              </div>



              {/* Platform Logos Preview */}
              <div className="pt-16">
                <p className="text-sm text-muted-foreground mb-8 font-medium">
                  Integrates with popular platforms
                </p>
                <div className="flex items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300 flex-wrap">
                  {platforms.map((platform, index) => (
                    <div key={platform.name} 
                         className="w-12 h-12 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      <img
                        src={actualTheme === 'dark' ? platform.dark : platform.light}
                        alt={platform.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection('features')}
              className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-all duration-300 group"
            >
              <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/20" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything you need to excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools and insights designed to accelerate your competitive programming journey
              and help you reach your full potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover-lift animate-scale-in border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:shadow-[#644EC9]/20" 
                    style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-transparent group-hover:border-current`}
                       style={{ borderColor: feature.color.replace('text-', '') }}>
                    <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 text-center transition-colors duration-300 ${feature.color}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section className="py-24" id="features-carousel">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful features to accelerate your growth
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive dashboard and AI-powered features designed to provide actionable insights
              and help you track your coding journey effectively.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Main Feature Carousel */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20 group">
              <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
                <div 
                  className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentDemo * 100}%)` }}
                >
                  {demoImages.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                      <img
                        src={image}
                        alt={demoTitles[index]}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                      
                      {/* Feature Title Overlay */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-border/50 transform transition-all duration-300">
                          <h3 className="text-xl font-semibold text-center">
                            {demoTitles[index]}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => handleManualChange((currentDemo - 1 + demoImages.length) % demoImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 flex items-center justify-center hover:bg-background transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleManualChange((currentDemo + 1) % demoImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 flex items-center justify-center hover:bg-background transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Feature Navigation */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {demoTitles.map((title, index) => {
                const colors = ['#E64373', '#644EC9', '#5D3B87', '#6E1453'];
                const isActive = index === currentDemo;
                
                return (
                  <button
                    key={title}
                    onClick={() => handleManualChange(index)}
                    className={`p-6 rounded-2xl transition-all duration-500 text-left group hover:scale-105 hover:shadow-lg ${
                      isActive
                        ? 'shadow-lg scale-105 border-2'
                        : 'bg-card border border-border hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${colors[index]}15` : undefined,
                      borderColor: isActive ? colors[index] : undefined,
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          isActive ? 'w-4 h-4' : 'group-hover:scale-125'
                        }`}
                        style={{ backgroundColor: colors[index] }}
                      />
                      <h4 
                        className={`font-semibold transition-colors duration-300 ${
                          isActive ? '' : 'group-hover:text-foreground'
                        }`}
                        style={{ color: isActive ? colors[index] : undefined }}
                      >
                        {title}
                      </h4>
                    </div>
                    <p className={`text-sm mt-2 transition-colors duration-300 ${
                      isActive ? 'opacity-80' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                    style={{ color: isActive ? colors[index] : undefined }}>
                      {index === 0 && "Track your progress with comprehensive analytics"}
                      {index === 1 && "Visualize your growth with detailed insights"}
                      {index === 2 && "Get personalized AI-powered guidance"}
                      {index === 3 && "Deep analysis of your coding patterns"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {demoImages.map((_, index) => {
                const colors = ['#E64373', '#644EC9', '#5D3B87', '#6E1453'];
                const isActive = index === currentDemo;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleManualChange(index)}
                    className={`rounded-full transition-all duration-500 hover:scale-125 ${
                      isActive ? 'w-8 h-3' : 'w-3 h-3 hover:w-4 hover:h-4'
                    }`}
                    style={{
                      backgroundColor: isActive ? colors[index] : '#64748b40',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Platforms Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              Integrations
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Connect all your platforms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Seamlessly integrate with all major competitive programming platforms
              and get a unified view of your progress.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {platforms.map((platform, index) => (
              <div key={platform.name} 
                   className="flex flex-col items-center space-y-4 animate-fade-in hover-lift group"
                   style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-20 h-20 rounded-2xl bg-background shadow-lg border border-border flex items-center justify-center overflow-hidden group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <img
                    src={actualTheme === 'dark' ? platform.dark : platform.light}
                    alt={platform.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center group-hover:text-primary transition-colors duration-300">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6E1453 0%, #5D3B87 50%, #644EC9 100%)' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E1453] via-[#5D3B87] to-[#644EC9]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Get Started Today
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
              Ready to level up your coding journey?
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto text-white/90">
              Connect your platforms and track your coding journey with beautiful graphs today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white text-[#5D3B87] hover:bg-white/90 font-semibold">
                <Link to="/signup">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 border-white/50 text-white hover:bg-white/20 hover:border-[#E64373] hover:text-[#E64373] transition-all duration-300">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Made with ❤️ by <span className="text-primary font-semibold">Tejaswa</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;