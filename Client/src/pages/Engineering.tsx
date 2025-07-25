import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export default function Engineering() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => {
      section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple Home Link */}
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="text-muted-foreground hover:text-[#E64373] transition-colors text-sm font-medium">
          Home
        </a>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-8 pt-60 pb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          <span className="text-white tracking-wider">Engineering behind </span>
          <span className="bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent tracking-wider">
            Codetrail
          </span>
        </h1>
        
        <p className="text-muted-foreground text-lg max-w-4xl leading-relaxed mb-16 whitespace-nowrap">
          How I reverse-engineered competitive programming platforms and built an AI coach that developers actually love.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Warming Up */}
        <div className="animate-on-scroll">
          <h2 className="text-4xl font-semibold mb-8 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            Warming up: What to expect..?
          </h2>
          <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
            I get it, this seems interesting. So let me tell you what we are going through here. First I will tell you 
            <span className="text-white font-bold"> what problem this application aims to solve</span>, then very quickly we move on to the 
            <span className="text-white font-bold"> high level design</span> of this application.
          </p>
          <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
            Still with me? Okay, then we will go through the <span className="text-white font-bold">database design</span> of this project. After that I will quickly share 
            how I built some of the most <span className="text-white font-bold">interesting features</span> of this project. I will conclude by mentioning the 
            <span className="text-white font-bold"> tech stack</span>.
          </p>
          <p className="text-muted-foreground mb-12 text-lg">
            <span className="bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent font-semibold text-xl">Let's begin!</span>
          </p>
        </div>

        {/* Origin Story */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            The problem
          </h2>
                                  <div className="bg-gradient-to-br from-card to-[#E64373]/5 border border-[#E64373]/20 rounded-lg p-8 mb-8">
              <p className="text-muted-foreground mb-4">
                Competitive programmers are juggling multiple platforms with no unified way to track progress or get personalized insights. The existing tools? Basic, boring, and definitely not intelligent.
              </p>
              <p className="text-muted-foreground mb-4">
                <strong className="text-white font-bold">Fragmented data. No insights. Zero AI guidance.</strong>
              </p>
              <p className="text-muted-foreground">
                That's where CodeTrail comes in—a clean, AI-powered platform that actually helps you improve, not just track numbers.
              </p>
            </div>
        </div>

        {/* High Level Design */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            System architecture
          </h2>
          
          {/* High-Level Architecture Diagram */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="font-mono text-xs leading-relaxed">
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-white mb-2">CodeTrail System Architecture</div>
                <div className="text-muted-foreground">Microservices • Multi-Platform • AI-Powered</div>
              </div>
              
              {/* Client Layer */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="text-sm font-bold text-blue-400 mb-2">CLIENT LAYER</div>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">React SPA</div>
                      <div className="text-xs text-muted-foreground">TypeScript + Vite</div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">UI Components</div>
                      <div className="text-xs text-muted-foreground">shadcn/ui + Tailwind</div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                      <div className="font-bold text-blue-400">State Management</div>
                      <div className="text-xs text-muted-foreground">React Context + TanStack</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold">⬇ HTTPS/REST API ⬇</div>
              </div>

              {/* Load Balancer & CDN */}
              <div className="mb-6">
                <div className="text-center">
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded p-2 inline-block">
                    <div className="font-bold text-purple-400">AWS Amplify</div>
                    <div className="text-xs text-muted-foreground">CDN + Load Balancing + SSL</div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* API Gateway */}
              <div className="mb-6">
                <div className="text-center">
                  <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
                    <div className="font-bold text-green-400">Express.js API Gateway</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Rate Limiting • CORS • Authentication • Request Routing
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* Middleware Layer */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-orange-400">MIDDLEWARE LAYER</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded p-2 text-center">
                    <div className="font-bold text-orange-400">Auth Middleware</div>
                    <div className="text-xs text-muted-foreground">JWT Validation</div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded p-2 text-center">
                    <div className="font-bold text-orange-400">Cache Middleware</div>
                    <div className="text-xs text-muted-foreground">Redis Integration</div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded p-2 text-center">
                    <div className="font-bold text-orange-400">Rate Limiter</div>
                    <div className="text-xs text-muted-foreground">API Protection</div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* Service Layer */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-cyan-400">SERVICE LAYER</div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Auth Service</div>
                    <div className="text-xs text-muted-foreground">JWT + bcrypt</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Dashboard Service</div>
                    <div className="text-xs text-muted-foreground">Data Aggregation</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">Analytics Service</div>
                    <div className="text-xs text-muted-foreground">Metrics Processing</div>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded p-2 text-center">
                    <div className="font-bold text-cyan-400">AI Coach Service</div>
                    <div className="text-xs text-muted-foreground">ML Processing</div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* External Integrations */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-red-400">EXTERNAL INTEGRATIONS</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Platform APIs */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">Platform APIs</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">Platform GraphQL</div>
                      <div className="text-xs text-muted-foreground">Reverse Engineered</div>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">Codeforces REST</div>
                      <div className="text-xs text-muted-foreground">Official API</div>
                    </div>
                  </div>
                  
                  {/* AI Services */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">AI Services</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">Deepseek LLM</div>
                      <div className="text-xs text-muted-foreground">AI Coaching</div>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">OpenRouter</div>
                      <div className="text-xs text-muted-foreground">API Gateway</div>
                    </div>
                  </div>
                  
                  {/* Infrastructure */}
                  <div className="space-y-2">
                    <div className="text-center text-xs font-semibold text-red-400">Infrastructure</div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">Railway</div>
                      <div className="text-xs text-muted-foreground">Backend Hosting</div>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-center">
                      <div className="font-bold text-red-400">AWS Amplify</div>
                      <div className="text-xs text-muted-foreground">Frontend Hosting</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-yellow-400 text-2xl font-bold mt-2">⬇</div>
              </div>

              {/* Data Layer */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-sm font-bold text-yellow-400">DATA LAYER</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Primary Database */}
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-center">
                    <div className="font-bold text-yellow-400">PostgreSQL</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Primary Database<br/>
                      ACID Compliance<br/>
                      Prisma ORM
                    </div>
                  </div>
                  
                  {/* Cache Layer */}
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-center">
                    <div className="font-bold text-yellow-400">Redis Cache</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Intelligent Caching<br/>
                      Session Storage<br/>
                      Rate Limiting
                    </div>
                  </div>
                  
                  {/* File Storage */}
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-center">
                    <div className="font-bold text-yellow-400">File System</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Static Assets<br/>
                      Logs & Analytics<br/>
                      Backup Storage
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow Arrows */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-xs font-bold text-white mb-2">DATA FLOW</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-blue-400">Client Request</span> → 
                    <span className="text-green-400"> API Gateway</span> → 
                    <span className="text-orange-400"> Middleware</span> → 
                    <span className="text-cyan-400"> Services</span> → 
                    <span className="text-red-400"> External APIs</span> → 
                    <span className="text-yellow-400"> Database</span>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="bg-muted/20 rounded p-2">
                    <div className="text-xs font-bold text-green-400">Response Time</div>
                    <div className="text-xs text-muted-foreground">&lt; 50ms (cached)</div>
                  </div>
                  <div className="bg-muted/20 rounded p-2">
                    <div className="text-xs font-bold text-blue-400">Cache Hit Rate</div>
                    <div className="text-xs text-muted-foreground">80%+ efficiency</div>
                  </div>
                  <div className="bg-muted/20 rounded p-2">
                    <div className="text-xs font-bold text-purple-400">Architecture</div>
                    <div className="text-xs text-muted-foreground">Horizontally Scalable</div>
                  </div>
                  <div className="bg-muted/20 rounded p-2">
                    <div className="text-xs font-bold text-orange-400">Uptime</div>
                    <div className="text-xs text-muted-foreground">99.9% SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Design */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            Database design
          </h2>
          
          {/* Database Flow Chart */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="font-mono text-sm leading-relaxed">
              <div className="text-center mb-8">
                <div className="text-lg font-semibold text-white mb-2">CodeTrail Database Schema</div>
                <div className="text-muted-foreground">7 Tables • Multi-Platform Architecture</div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Auth & User */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 mb-2">
                      <div className="font-bold text-blue-400">users</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        id, email, password<br/>
                        firstName, lastName
                      </div>
                    </div>
                    <div className="text-yellow-400">↓ 1:M</div>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 mt-2">
                      <div className="font-bold text-blue-400">refresh_tokens</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        token, userId (FK)<br/>
                        expiresAt
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Column - Platform Integration */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3 mb-2">
                      <div className="font-bold text-green-400">platform_profiles</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        userId (FK), platform<br/>
                        handle, currentRating
                      </div>
                    </div>
                    <div className="text-yellow-400">↓</div>
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3 mt-2 mb-2">
                      <div className="font-bold text-green-400">problems</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        platform, externalId<br/>
                        name, difficulty, tags[]
                      </div>
                    </div>
                    <div className="text-yellow-400">↓ M:1</div>
                    <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3 mt-2">
                      <div className="font-bold text-orange-400">submissions</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        userId (FK), problemId (FK)<br/>
                        platform, verdict, timestamp
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contest System */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-purple-500/20 border border-purple-500/50 rounded p-3 mb-2">
                      <div className="font-bold text-purple-400">contests</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        platform, contestId<br/>
                        name, startTime
                      </div>
                    </div>
                    <div className="text-yellow-400">↓</div>
                    <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3 mt-2">
                      <div className="font-bold text-orange-400">contest_participation</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        userId (FK), contestId<br/>
                        rank, oldRating, newRating
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom - Cache Layer */}
              <div className="mt-8 text-center">
                <div className="text-yellow-400 mb-2">↓ Performance Layer</div>
                <div className="bg-gray-500/20 border border-gray-500/50 rounded p-3 inline-block">
                  <div className="font-bold text-gray-400">calendar_cache</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    userId (FK), platform, date, count
                  </div>
                </div>
              </div>

              {/* Connection Legend */}
              <div className="mt-8 pt-4 border-t border-border">
                <div className="text-center text-xs text-muted-foreground">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><span className="text-blue-400">■</span> Authentication</div>
                    <div><span className="text-green-400">■</span> Platform Data</div>
                    <div><span className="text-orange-400">■</span> User Activity</div>
                    <div><span className="text-purple-400">■</span> Contest System</div>
                  </div>
                  <div className="mt-2">
                    <span className="text-yellow-400">→</span> Foreign Key Relations • 
                    <span className="text-muted-foreground"> CASCADE DELETE on user deletion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Magic: Reverse Engineering */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            The breakthrough
          </h2>
          <p className="text-muted-foreground mb-4">
            Most competitive programming platforms don't provide official APIs. Most developers give up here. I didn't. If their frontends could access the data, so could I.
          </p>
          <div className="bg-muted/30 border border-border rounded-md p-4 mb-6 overflow-x-auto font-mono text-sm">
            <pre className="text-muted-foreground">
{`// Reverse-engineer platform endpoints
const getUserProfileQuery = \`
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      profile { reputation, ranking }
      submissionCalendar
      submitStats { acSubmissionNum, totalSubmissionNum }
    }
  }
\`;

// Smart caching = 80% fewer API calls
async getUserProfile(username: string) {
  const cached = await CacheService.get(username);
  if (cached) return cached;
  return freshData;
}`}
            </pre>
          </div>
          <p className="text-muted-foreground mb-4">
            Result? 80% fewer API calls while keeping data fresh through intelligent caching.
          </p>
        </div>

        {/* Redis Implementation */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            Redis caching strategy
          </h2>
          <p className="text-muted-foreground mb-6">
            Built a sophisticated Redis-powered caching system with intelligent TTL strategies for different data types:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white font-bold mb-4">Cache Categories</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Profiles</span>
                  <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent font-mono">5min TTL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calendar Data</span>
                  <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent font-mono">1hr TTL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contest Rankings</span>
                  <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent font-mono">15min TTL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Static Problems</span>
                  <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent font-mono">24hr TTL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Context</span>
                  <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] bg-clip-text text-transparent font-mono">30min TTL</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white font-bold mb-4">Key Features</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>• Graceful fallback when Redis is unavailable</div>
                <div>• Organized cache keys with prefixes (platform:, user:, cache:)</div>
                <div>• Pattern-based cache invalidation</div>
                <div>• Connection retry logic with max attempts</div>
                <div>• Comprehensive health checks and monitoring</div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 border border-border rounded-md p-4 mb-4 overflow-x-auto font-mono text-sm">
            <pre className="text-muted-foreground">
{`// Example: Platform profile caching
static async getPlatformProfile(platform: string, username: string) {
  const key = \`\${platform}:profile:\${username}\`;
  return await RedisService.get(key);
}

static async setPlatformProfile(platform: string, username: string, data: any) {
  const key = \`\${platform}:profile:\${username}\`;
  return await RedisService.set(key, data, 300); // 5min TTL
}`}
            </pre>
          </div>
        </div>

        {/* Features */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            The cool stuff
          </h2>
          <p className="text-muted-foreground mb-8">
            Five features that make CodeTrail special, ranked by how fun they were to build:
          </p>

          {/* Feature 1: AI Coaching */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-[#E64373]/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">01</span>
              <h3 className="text-xl font-semibold text-white font-bold">AI Coach</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Not your typical chatbot. This AI analyzes your entire coding profile—weak topics, solving patterns, contest performance—and gives you personalized recommendations with direct problem links.
            </p>
            <p className="text-muted-foreground">
              Powered by <span className="text-white font-bold">Deepseek LLM</span> for context-aware coaching based on your actual performance data.
            </p>
          </div>

          {/* Feature 2: Light/Dark Mode */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-[#E64373]/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">02</span>
              <h3 className="text-xl font-semibold text-white font-bold">Adaptive Theming</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Built a comprehensive theming system with light/dark mode support that adapts to user preferences. Platform logos, charts, and UI elements all switch seamlessly.
            </p>
            <p className="text-muted-foreground">
              Uses <span className="text-white font-bold">React Context</span> for global state management with system preference detection and localStorage persistence.
            </p>
          </div>

          {/* Feature 3: Platform Sync */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-[#E64373]/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">03</span>
              <h3 className="text-xl font-semibold text-white font-bold">Platform Sync</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Pulls data from multiple competitive programming platforms. Smart aggregation detects duplicates and gives you unified analytics across your entire competitive programming journey.
            </p>
            <p className="text-muted-foreground">
              Parallel data fetching with intelligent normalization, powered by <span className="text-white font-bold">Redis</span> for real-time updates.
            </p>
          </div>

          {/* Feature 4: Smart Caching */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 hover:transform hover:-translate-y-1 hover:border-[#E64373]/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">04</span>
              <h3 className="text-xl font-semibold text-white font-bold">Smart Caching</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Users wanted real-time updates, even when external APIs were slow. So I built a Redis-powered caching system with different TTL strategies for different data types.
            </p>
            <p className="text-muted-foreground">
              Profile data: 5min cache. Calendar data: 1hr. Static problems: 24hr. Result: <span className="text-white font-bold">sub-50ms response times</span>.
            </p>
          </div>

          {/* Feature 5: Visual Analytics */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 hover:transform hover:-translate-y-1 hover:border-[#E64373]/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <span className="bg-gradient-to-r from-[#E64373] to-[#644EC9] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">05</span>
              <h3 className="text-xl font-semibold text-white font-bold">Visual Analytics</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Interactive charts, submission heatmaps, contest rating trends, and topic mastery visualization. All powered by intelligent caching for instant updates.
            </p>
            <p className="text-muted-foreground">
              Built with <span className="text-white font-bold">Recharts</span> for beautiful, responsive visualizations that actually help you understand your progress.
            </p>
          </div>
        </div>

        {/* Bonus: GraphQL Discovery */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            The detective work
          </h2>
          <p className="text-muted-foreground mb-4">
            Here's the thing: when most developers hit a wall (no official APIs), they pivot. I got curious. After digging through network requests, I found their internal <span className="text-white font-bold">API endpoints</span>.
          </p>
          <div className="bg-warning/10 border-l-4 border-warning p-4 mb-6 rounded-r">
            <p className="text-warning">
              This required careful rate limiting and graceful fallbacks for when platforms change their schemas. But the payoff? Access to data that even the platforms' own analytics don't provide.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="animate-on-scroll">
          <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded"></span>
            Tech choices
          </h2>
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <p className="text-foreground mb-6">Built entirely in <span className="text-white font-bold">TypeScript</span> because life's too short for runtime errors.</p>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">React + TypeScript + Vite</div>
                <div className="text-muted-foreground text-sm mt-1">Lightning-fast development with hot reload and type safety.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">Node.js + Express.js</div>
                <div className="text-muted-foreground text-sm mt-1">JavaScript everywhere = less context switching. Mature ecosystem.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">PostgreSQL + Prisma</div>
                <div className="text-muted-foreground text-sm mt-1">ACID compliance for data integrity. Type-safe queries eliminate runtime errors.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">Redis</div>
                <div className="text-muted-foreground text-sm mt-1">Sub-millisecond response times. Reduces external API calls by 80%.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">Deepseek LLM</div>
                <div className="text-muted-foreground text-sm mt-1">Advanced AI model for intelligent coaching and personalized recommendations.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">Tailwind CSS + shadcn/ui</div>
                <div className="text-muted-foreground text-sm mt-1">Utility-first CSS for rapid prototyping. Consistent design system.</div>
              </div>
              
              <div className="pb-4 border-b border-border">
                <div className="text-white font-bold text-lg">Recharts</div>
                <div className="text-muted-foreground text-sm mt-1">Beautiful, responsive charts built on D3.js with minimal configuration.</div>
              </div>
              
              <div>
                <div className="text-white font-bold text-lg">AWS Amplify + Railway</div>
                <div className="text-muted-foreground text-sm mt-1">Frontend deployed on AWS Amplify, backend on Railway with automated CI/CD.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border animate-on-scroll">
          <p className="text-muted-foreground mb-6">
            Built with passion for the competitive programming community by{" "}
            <span className="text-white font-bold">Tejaswa</span>
          </p>
          <Button asChild className="bg-gradient-to-r from-[#E64373] to-[#644EC9] hover:from-[#E64373]/90 hover:to-[#644EC9]/90 text-white font-semibold">
            <a href="https://github.com/Tejaswa2611/CodeTrail" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              Explore the Code
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-fade-in-up {
            animation: fadeInUp 0.7s ease-out forwards;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(2rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
} 