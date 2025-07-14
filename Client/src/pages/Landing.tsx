import { useState, useEffect } from "react";
import { ArrowRight, Code, TrendingUp, Target, Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import ScrambleLogo from "@/components/ScrambleLogo";
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
import { useRef } from "react";

// MatrixRain animation for hero section
const MatrixRain = () => {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number; duration: number; char: string }>>([]);
  useEffect(() => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newDrops = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      char: characters[Math.floor(Math.random() * characters.length)]
    }));
    setDrops(newDrops);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {drops.map(drop => (
        <span
          key={drop.id}
          className="absolute text-hacker-green neon-text-bright animate-matrix-rain select-none"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            fontSize: '1.5rem',
            top: 0,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace"
          }}
        >
          {drop.char}
        </span>
      ))}
    </div>
  );
};

const Landing = () => {
  const { actualTheme } = useTheme();
  const [currentDemo, setCurrentDemo] = useState(0);

  // Ensure fonts are loaded
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded successfully');
      });
    }
  }, []);

  // Hacker code reveal animation for headline
  const [revealedText, setRevealedText] = useState("");
  const targetText = "Let AI guide your coding journey";
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=|<>?";
    function reveal() {
      let display = "";
      for (let i = 0; i < targetText.length; i++) {
        if (i < frame) {
          display += targetText[i];
        } else if (targetText[i] === " ") {
          display += " ";
        } else {
          display += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setRevealedText(display);
      if (frame <= targetText.length) {
        frame++;
        animationRef.current = window.setTimeout(reveal, 70);
      }
    }
    reveal();
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
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

  const demoCatchyLines = [
    "Your coding journey at a glance - Track progress, view achievements, and stay motivated!",
    "Deep dive into your performance with smart insights and trend analysis!",
    "Get personalized guidance from AI - Your 24/7 coding companion that never sleeps!",
    "Unlock patterns in your coding style with intelligent analysis and recommendations!"
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

  // Platform logos based on theme
  const platforms = [
    {
      name: "LeetCode",
      logo: actualTheme === 'dark' ? leetcodeDark : leetcodeLight,
      alt: "LeetCode"
    },
    {
      name: "Codeforces",
      logo: actualTheme === 'dark' ? codeforcesDark : codeforcesLight,
      alt: "Codeforces"
    },
    {
      name: "CodeChef",
      logo: actualTheme === 'dark' ? codechefDark : codechefLight,
      alt: "CodeChef"
    },
    {
      name: "GeeksforGeeks",
      logo: gfgLogo,
      alt: "GeeksforGeeks"
    },
    {
      name: "CodeStudio",
      logo: actualTheme === 'dark' ? codestudioDark : codestudioLight,
      alt: "CodeStudio"
    },
    {
      name: "InterviewBit",
      logo: interviewbitLogo,
      alt: "InterviewBit"
    }
  ];

  return (
    <div className="min-h-screen matrix-bg page-enter font-brand flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Matrix Rain Animation */}
        <MatrixRain />
        {/* Optionally keep scanline effect below if desired */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 animate-tech-glow opacity-40">
            {/* Matrix scanline effect */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-tech-primary-green to-transparent animate-pulse" style={{ top: '30%' }} />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-tech-accent-green to-transparent animate-pulse opacity-60" style={{ top: '60%' }} />
          </div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Animated Brand Logo */}
          <div className="mb-8 animate-scale-in animate-delay-100">
            <ScrambleLogo
              size="hero"
              animated={true}
              autoScramble={true}
              variant="default"
              className="justify-center"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight terminal-text neon-text-bright animate-fade-in-up animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", letterSpacing: "0.03em" }}>
              {revealedText}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8 animate-fade-in-up animate-delay-200">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group tech-button tech-transition animate-glow-pulse btn-primary-glow">
                Start Tracking Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto group tech-transition border-hacker-green text-hacker-green hover:bg-hacker-green-muted hover:text-hacker-green-bright font-brand glow-primary"
              onClick={() => window.open('https://github.com/Tejaswa2611/CodeTrail', '_blank')}
            >
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
            </Button>
          </div>

          {/* Supported Platforms */}
          <div className="text-center mb-8 animate-fade-in-up animate-delay-300">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 terminal-text neon-text-bright animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              {'<>'} _Supported Platforms_
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center items-center max-w-4xl mx-auto animate-fade-in-up animate-delay-400">
            {platforms.map((platform, index) => (
              <div key={index} className="tech-card-enhanced animate-float p-4 rounded-tech card-hover transition-all duration-300 hover:scale-105 hacker-glow flex flex-col items-center space-y-3">
                <img
                  src={platform.logo}
                  alt={platform.alt}
                  className="w-10 h-10 object-contain animate-tech-glow"
                />
                <span className="font-bold text-hacker-green font-brand text-xs neon-text animate-glow-pulse">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-6 py-16 relative animate-fade-in-up animate-delay-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-bright font-brand terminal-text animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
            {'>'} See CodeTrail in Action
          </h2>
          <p className="text-xl text-tech-gray max-w-2xl mx-auto font-brand">
            Experience the power of AI-driven coding progress tracking
          </p>
        </div>

        <div className="max-w-5xl mx-auto animate-scale-in animate-delay-300">
          <Card className="tech-card-enhanced overflow-hidden hacker-glow animate-pulse-glow">
            <CardContent className="p-6 relative">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold terminal-text mb-1 font-brand neon-text-bright animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  [System] {demoTitles[currentDemo]}
                </h3>
                <p className="text-sm text-tech-gray font-brand mb-2">
                  {currentDemo + 1} of {demoImages.length}
                </p>
                <p className="text-base text-hacker-green font-brand italic animate-pulse animate-glow-pulse">
                  {demoCatchyLines[currentDemo]}
                </p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-hacker-green/20 rounded-tech blur-xl group-hover:opacity-30 transition-opacity animate-glow-pulse"></div>
                <img
                  src={demoImages[currentDemo]}
                  alt={demoTitles[currentDemo]}
                  className="w-full h-auto max-h-[400px] object-cover rounded-tech transition-all duration-700 hover:scale-[1.02] relative z-10 shadow-glow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hacker-black/40 to-transparent rounded-tech z-20" />

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentDemo((prev) => (prev - 1 + demoImages.length) % demoImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 tech-card-enhanced text-hacker-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 tech-transition z-30 terminal-text neon-text-bright animate-glow-pulse"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDemo((prev) => (prev + 1) % demoImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 tech-card-enhanced text-hacker-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 tech-transition z-30 terminal-text neon-text-bright animate-glow-pulse"
                >
                  →
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {demoImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDemo(index)}
                    className={`w-3 h-3 rounded-full tech-transition ${currentDemo === index
                        ? 'bg-hacker-green glow-primary scale-125 animate-glow-pulse'
                        : 'bg-hacker-green-muted hover:bg-hacker-green hover:scale-110'
                      }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 relative animate-fade-in-up animate-delay-700">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-bright font-brand terminal-text animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
            {'<>'} Powerful Features
          </h2>
          <p className="text-xl text-tech-gray max-w-2xl mx-auto font-brand">
            Everything you need to accelerate your coding journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="tech-card-enhanced hacker-glow animate-fade-in-up animate-float flex flex-col items-center text-center p-8" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <feature.icon className="w-10 h-10 text-hacker-green animate-glow-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-hacker-green font-brand neon-text terminal-text animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>{feature.title}</h3>
                <p className="text-tech-gray leading-relaxed font-brand animate-fade-in-up animate-delay-200">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 animate-fade-in-up animate-delay-900">
        <Card className="tech-card-enhanced animate-scale-in relative overflow-hidden glow-primary hacker-glow animate-glow-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-hacker-green/10 via-hacker-green-bright/10 to-hacker-green/10 animate-glow-pulse"></div>
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text-bright animate-fade-in-up font-brand terminal-text animate-glow-pulse" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
              {'<>'} Ready to level up your coding?
            </h2>
            <p className="text-xl text-tech-gray mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-200 font-brand">
              Join thousands of developers who are already tracking their progress with CodeTrail.
            </p>
            <Link to="/signup" className="inline-block animate-scale-in animate-delay-300">
              <Button size="lg" variant="secondary" className="group tech-button tech-transition animate-glow-pulse btn-primary-glow">
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