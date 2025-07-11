import React from 'react';
import { Mail, Linkedin, Twitter, Globe, Calendar, Lock, ExternalLink, AlertTriangle, Plus, BarChart3 } from 'lucide-react';

const Sidebar = () => (
    <aside className="w-full lg:w-80 bg-card rounded-2xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 min-h-[50vh] lg:min-h-[90vh]">
        {/* Profile */}
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-pink-600 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold mb-2">T</div>
            <h2 className="text-lg lg:text-xl font-semibold">Tejaswa Mathur</h2>
            <p className="text-primary text-sm">@Prof</p>
            <button className="bg-orange-500 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm font-medium mt-2">
                <Lock className="inline w-4 h-4 mr-2" /> Get your Codolio Card
            </button>
        </div>
        {/* Socials */}
        <div className="flex gap-3 justify-center">
            <Mail className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Linkedin className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Twitter className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Globe className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <Calendar className="w-5 h-5 text-muted-foreground cursor-pointer" />
        </div>
        {/* Location/Institution */}
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>📍</span> <span>India</span></div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>🎓</span> <span>Indian Institute of Technology -</span></div>
        </div>
        {/* About/Stats */}
        <div>
            <h3 className="text-sm font-semibold mb-3">About</h3>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Problem Solving Stats</span>
                    <span className="text-xs text-muted-foreground">^</span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center"><span className="text-xs">LC</span></div>
                        <span className="text-sm">LeetCode</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center"><span className="text-xs">CC</span></div>
                        <span className="text-sm">CodeChef</span>
                        <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center"><span className="text-xs">CF</span></div>
                        <span className="text-sm">CodeForces</span>
                        <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
                <button className="flex items-center gap-2 text-orange-500 text-sm mt-3"><Plus className="w-4 h-4" /> Add Platform</button>
            </div>
        </div>
        {/* Development Stats */}
        <div>
            <h3 className="text-sm font-semibold mb-3">Development Stats</h3>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">Leaderboard</span><span className="text-primary text-xs">How it works ?</span></div>
                <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Global Rank</div>
                    <div className="text-xs text-muted-foreground">Based on C Score</div>
                    <div className="flex items-center gap-2 mt-2"><BarChart3 className="w-4 h-4" /><Lock className="w-4 h-4" /></div>
                </div>
            </div>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">View Leaderboard</button>
        </div>
        {/* Footer */}
        <div className="text-xs text-muted-foreground space-y-1 mt-auto">
            <div className="flex justify-between"><span>Profile Views:</span><span>0</span></div>
            <div className="flex justify-between"><span>Last Refresh:</span><span>11 Jul 2025</span></div>
            <div className="flex justify-between"><span>Profile Visibility:</span><span>Public</span></div>
        </div>
    </aside>
);

const Dashboard2 = () => {
    return (
        <div className="flex flex-col lg:flex-row bg-background min-h-screen p-3 lg:p-6 gap-4 lg:gap-6">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-4 lg:gap-6">
                {/* Row 1: 2 squares + 1 rectangle */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Total Questions */}
                    <div className="lg:col-span-2 bg-card rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center min-h-[110px]">
                        <div className="text-sm text-muted-foreground mb-2">Total Questions</div>
                        <div className="text-3xl lg:text-4xl font-bold">297</div>
                    </div>
                    {/* Total Active Days */}
                    <div className="lg:col-span-2 bg-card rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center min-h-[110px]">
                        <div className="text-sm text-muted-foreground mb-2">Total Active Days</div>
                        <div className="text-3xl lg:text-4xl font-bold">114</div>
                    </div>
                    {/* Heatmap */}
                    <div className="md:col-span-2 lg:col-span-8 bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[110px]">
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-2 text-xs">
                            <span className="text-muted-foreground">239 submissions</span>
                            <span className="text-muted-foreground">Max.Streak 15</span>
                            <span className="text-muted-foreground">Current Streak 8</span>
                        </div>
                        {/* Fake heatmap grid */}
                        <div className="flex items-end gap-1 overflow-x-auto pb-1">
                            {[...Array(7)].map((_, week) => (
                                <div key={week} className="flex flex-col gap-1">
                                    {[...Array(6)].map((_, day) => (
                                        <div key={day} className={`w-2 h-2 lg:w-3 lg:h-3 rounded ${((week+day)%3===0)?'bg-green-500':'bg-muted'}`}></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                </div>
                {/* Row 2: 2 columns */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 flex-1">
                    {/* Column 1: 4 stacked blocks */}
                    <div className="xl:col-span-7 flex flex-col gap-4 lg:gap-6">
                        {/* Total Contests */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col gap-4 min-h-[90px]">
                            <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-2">
                                <span className="text-lg font-semibold">Total Contests</span>
                                <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1"><span>🏆</span> CodeChef <span className="ml-1">7</span></span>
                                <span className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1"><span>🏅</span> CodeForces <span className="ml-1">3</span></span>
                            </div>
                            <div className="text-3xl lg:text-4xl font-bold">10</div>
                        </div>
                        {/* Rating Chart */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-muted-foreground">Rating</span>
                                <span className="text-lg font-bold ml-auto">1548</span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">16 Jan 2023</div>
                            <div className="text-xs text-muted-foreground mb-2">January Long 2023 Division 3 (Rated)</div>
                            <div className="text-xs text-muted-foreground mb-2">Rank: 140</div>
                            {/* Fake line chart */}
                            <div className="w-full h-16 lg:h-24 bg-gradient-to-t from-yellow-700/30 to-yellow-400/60 rounded mt-2 flex items-end">
                                <div className="w-full h-3/4 bg-gradient-to-r from-yellow-400/80 to-yellow-700/40 rounded-b-full"></div>
                            </div>
                        </div>
                        {/* Awards */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[90px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-semibold">Awards</span>
                                <span className="text-lg font-bold">2</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <span className="text-3xl lg:text-4xl">🏅</span>
                                <span className="text-3xl lg:text-4xl">🛡️</span>
                            </div>
                            <button className="text-blue-400 text-sm underline w-fit">show more</button>
                        </div>
                        {/* DSA Topic Analysis */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex flex-col min-h-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-semibold">DSA Topic Analysis</span>
                            </div>
                            {/* Fake bar chart */}
                            <div className="space-y-1">
                                {[
                                    { name: 'Arrays', count: 130 },
                                    { name: 'Dynamic Programming', count: 61 },
                                    { name: 'HashMap and Set', count: 45 },
                                    { name: 'String', count: 41 },
                                    { name: 'Sorting', count: 31 },
                                    { name: 'DFS', count: 30 },
                                    { name: 'Two Pointers', count: 26 },
                                    { name: 'Greedy Algorithms', count: 24 },
                                    { name: 'BFS', count: 23 },
                                    { name: 'Trees', count: 22 }
                                ].map((topic, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="w-24 lg:w-32 text-xs text-muted-foreground truncate">{topic.name}</span>
                                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(topic.count / 130) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs text-white w-6 lg:w-8 text-right">{topic.count}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="text-blue-400 text-sm underline mt-2 w-fit">show more</button>
                        </div>
                    </div>
                    {/* Column 2: 2 stacked blocks */}
                    <div className="xl:col-span-5 flex flex-col gap-4 lg:gap-6">
                        {/* Problems Solved + Competitive Programming Donut */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 h-auto lg:h-60 flex flex-col gap-4 lg:gap-6">
                            <div>
                                <div className="text-lg font-semibold mb-2">Problems Solved</div>
                                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                                    {/* DSA Donut */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-8 border-yellow-400 border-t-red-500 border-b-green-500 border-l-yellow-400 flex items-center justify-center text-2xl lg:text-3xl font-bold mb-2">252</div>
                                        <div className="text-xs text-muted-foreground">DSA</div>
                                        <div className="text-xs text-green-400">Easy 75</div>
                                        <div className="text-xs text-yellow-400">Medium 142</div>
                                        <div className="text-xs text-red-400">Hard 35</div>
                                    </div>
                                    {/* Competitive Programming Donut */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-8 border-yellow-400 border-t-green-500 border-b-yellow-400 border-l-yellow-400 flex items-center justify-center text-xl lg:text-2xl font-bold mb-2">45</div>
                                        <div className="text-xs text-muted-foreground text-center">Competitive Programming</div>
                                        <div className="text-xs text-green-400">Codechef 37</div>
                                        <div className="text-xs text-yellow-400">Codeforces 8</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Contest Rankings */}
                        <div className="bg-card rounded-xl p-4 lg:p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Contest Rankings</h3>
                                <div className="mb-6 lg:mb-8">
                                    <div className="text-xs text-muted-foreground mb-1 text-center">CODECHEF</div>
                                    <div className="flex flex-col items-center mb-2">
                                        <div className="flex gap-1 mb-1">
                                            <span className="text-green-400 text-xl">&#11088;&#11088;</span>
                                        </div>
                                        <div className="text-2xl lg:text-3xl font-bold">1548</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-center">(max : 1548)</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1 text-center">CODEFORCES</div>
                                    <div className="flex flex-col items-center mb-2">
                                        <div className="text-lg lg:text-xl font-bold text-muted-foreground">Newbie</div>
                                        <div className="text-2xl lg:text-3xl font-bold">849</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-center">(max : 849)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard2;




// hello remove this line to change the code