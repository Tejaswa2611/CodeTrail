import { Github, Database, Server, Code, Zap, Brain, BarChart3, Shield, Globe, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Engineering() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-2xl flex items-center justify-center shadow-lg">
              <Code className="text-white h-10 w-10" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent">
            🚀 Engineering behind <strong>CodeTrail</strong>
          </h1>
          
          <p className="text-xl text-muted-foreground italic">
            A documentation of things that matter - by <a href="https://github.com/Tejaswa" className="text-[#644EC9] hover:text-[#E64373] transition-colors">@Tejaswa</a>
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#E64373] to-[#644EC9] mx-auto rounded-full"></div>
        </div>

        {/* Introduction */}
        <Card className="mb-12 border-l-4 border-l-[#644EC9]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-[#644EC9]" />
              🧠 Warming up: What to expect...?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              CodeTrail is a competitive programming tracker built with cutting-edge technologies. Behind the curtain lies a well-planned architecture with key decisions documented for the engineering mind 🧠.
            </p>
            <blockquote className="border-l-4 border-[#E64373] pl-4 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
              This document dives deep into the design, architecture decisions, and various features implemented in the CodeTrail ecosystem — aimed at fellow developers and curious minds who want to understand how it's built and why it's built this way.
            </blockquote>
            <div className="pt-4">
              <Button asChild variant="outline" className="border-[#644EC9] text-[#644EC9] hover:bg-[#644EC9]/10">
                <a href="https://github.com/Tejaswa2611/CodeTrail" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Visit Project
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Origin Story */}
        <Card className="mb-12 border-l-4 border-l-[#E64373]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="h-6 w-6 text-[#E64373]" />
              📖 Once upon a time...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              In 2024, a developer decided to solve a problem for the competitive programming community. The idea came from the struggle to track progress across multiple platforms consistently. Several trackers existed, but none provided comprehensive analytics with AI insights. With the rise of AI and modern web technologies, the idea evolved into <strong>CodeTrail</strong>.
            </p>
            <blockquote className="border-l-4 border-[#5D3B87] pl-4 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
              CodeTrail is a competitive programming tracker powered by AI-based analysis and comprehensive progress monitoring. It uses intelligent caching, real-time data fetching, and serverless architecture to deliver instant insights and beautiful analytics across all major coding platforms.
            </blockquote>
          </CardContent>
        </Card>

        {/* High Level Architecture */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Server className="h-6 w-6 text-[#644EC9]" />
              📊 High Level Architecture
            </CardTitle>
            <CardDescription>System overview and data flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-8 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 text-center">HIGH LEVEL DIAGRAM OF CODETRAIL</h3>
              <div className="bg-background p-6 rounded-lg border-2 border-dashed border-muted-foreground/30">
                <p className="text-center text-muted-foreground italic mb-4">
                  [Architecture Diagram Placeholder - To be added]
                </p>
                <div className="text-sm font-mono text-muted-foreground">
                  <pre className="whitespace-pre-wrap text-center">{`Client (React + TypeScript)
  |
  | HTTP Requests
  ↓
[Express.js + Node.js Backend]
      |
      ↓
[Redis Cache Layer]
      |
---------------------------------
|         |         |           |
↓         ↓         ↓           ↓
LeetCode  Codeforces  PostgreSQL  OpenRouter
API       API       Database    AI API
↓         ↓         ↓           ↓
User Data Contest   Analytics   AI Coach
Sync      Results   Storage     Insights`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Design */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Database className="h-6 w-6 text-[#5D3B87]" />
              🗃️ Database Design
            </CardTitle>
            <CardDescription>Entity relationships and data modeling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-8 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 text-center">DATABASE DESIGN OF CODETRAIL</h3>
              <div className="bg-background p-6 rounded-lg border-2 border-dashed border-muted-foreground/30 min-h-[300px] flex items-center justify-center">
                <p className="text-center text-muted-foreground italic">
                  [Entity Relationship Diagram Placeholder - To be added]
                </p>
              </div>
            </div>
            <blockquote className="border-l-4 border-[#5D3B87] pl-4 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
              Uses PostgreSQL with Prisma ORM for type-safe database operations. Relationships between users, platforms, problems, submissions, contests, and AI analysis are carefully modeled for optimal performance and data integrity.
            </blockquote>
          </CardContent>
        </Card>

        {/* APIs & Actions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-[#E64373]" />
              📲 There are APIs & Actions!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              There's a lot more under the hood — user data is fetched from multiple platforms, processed & cached. AI analysis, progress tracking, and analytics are all coordinated through Express.js APIs with Redis caching.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <pre className="text-sm font-mono overflow-x-auto">
{`const response = await fetch('/api/dashboard/stats', {
    method: "GET",
    headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
// Returns cached analytics or fresh data from platforms`}
              </pre>
            </div>
            <blockquote className="border-l-4 border-[#E64373] pl-4 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
              This same logic is used to invoke AI models for personalized coaching and problem recommendations.
            </blockquote>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            💡 Let's talk about features
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Let's discuss each of the noteworthy modules and decisions that make up this system.
          </p>

          <div className="grid gap-8">
            {/* Feature 1 */}
            <Card className="border-l-4 border-l-[#644EC9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#644EC9]" />
                  01. AI Analysis & Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• CodeTrail's backend integrates OpenRouter API for intelligent analysis and personalized coaching.</li>
                  <li>• The input comes from user's submission history and performance data — the result is tailored advice and problem recommendations.</li>
                  <li>• AI analyzes weak topics, suggests improvement strategies, and provides topic-specific guidance.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-l-4 border-l-[#E64373]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#E64373]" />
                  02. Multi-Platform Data Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• The system fetches data from LeetCode, Codeforces, and other platforms in real-time.</li>
                  <li>• Smart caching with Redis ensures fast response times and reduces API calls.</li>
                  <li>• Automatic data synchronization keeps user profiles updated across all platforms.</li>
                </ul>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <pre className="text-sm font-mono">
{`Platform Data → API Fetch → Redis Cache → Database
                           ↘
                        Real-time Dashboard Updates`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-l-4 border-l-[#5D3B87]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#5D3B87]" />
                  03. Intelligent Caching System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Redis-powered caching system with different TTL strategies for various data types.</li>
                  <li>• Smart cache invalidation ensures data freshness while maintaining performance.</li>
                  <li>• Graceful fallback to direct API calls when cache is unavailable.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-l-4 border-l-[#6E1453]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#6E1453]" />
                  04. Secure Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JWT-based authentication with secure token management.</li>
                  <li>• Password hashing using bcrypt for maximum security.</li>
                  <li>• Protected routes and middleware for API security.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-l-4 border-l-[#644EC9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#644EC9]" />
                  05. Beautiful Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Interactive charts and graphs using Recharts for data visualization.</li>
                  <li>• Real-time progress tracking with beautiful UI components.</li>
                  <li>• Comprehensive analytics including submission trends, topic analysis, and contest performance.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-l-4 border-l-[#E64373]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#E64373]" />
                  06. Modern UI/UX Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Professional dark/light mode with smooth transitions.</li>
                  <li>• Responsive design using Tailwind CSS and shadcn/ui components.</li>
                  <li>• Smooth animations and modern glassmorphism effects.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="h-6 w-6 text-[#644EC9]" />
              🧰 Tech Stack
            </CardTitle>
            <CardDescription>Built with modern technologies for scale and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed mb-8">
              Built completely in <strong>TypeScript</strong>. Why? Type safety prevents runtime errors and improves developer productivity.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#E64373]/10 text-[#E64373] border-[#E64373]/30">React + Vite</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Lightning-fast development with hot module replacement and modern build tooling. React's component architecture scales beautifully.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#644EC9]/10 text-[#644EC9] border-[#644EC9]/30">Tailwind + shadcn/ui</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Utility-first CSS for rapid prototyping combined with beautiful, accessible components. Design system consistency out of the box.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#5D3B87]/10 text-[#5D3B87] border-[#5D3B87]/30">Express.js + Node.js</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Mature, battle-tested backend framework with excellent ecosystem. JavaScript everywhere means faster development cycles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#6E1453]/10 text-[#6E1453] border-[#6E1453]/30">PostgreSQL + Prisma</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> ACID compliance for data integrity with Prisma's type-safe ORM. Complex queries made simple, migrations handled elegantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#E64373]/10 text-[#E64373] border-[#E64373]/30">Redis</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Sub-millisecond response times for cached data. Reduces API calls to external platforms by 80% while maintaining data freshness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#644EC9]/10 text-[#644EC9] border-[#644EC9]/30">OpenRouter AI</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Access to multiple LLM providers through one API. Cost-effective AI integration with fallback models for reliability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#5D3B87]/10 text-[#5D3B87] border-[#5D3B87]/30">Recharts</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Beautiful, responsive charts built on D3.js. Perfect for data visualization with minimal configuration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1 bg-[#6E1453]/10 text-[#6E1453] border-[#6E1453]/30">Docker</Badge>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Why?</strong> Containerization ensures consistent environments across development, testing, and production. One-command deployment.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground">
            Designed and built with ❤️ by Tejaswa
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild variant="outline" size="sm">
              <a href="https://github.com/Tejaswa2611/CodeTrail" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 