import axios from 'axios';
import { CacheService } from './cacheService';

const BASE_URL = 'https://codeforces.com/api';

export const codeforcesService = {
    async getUserStatus(handle: string) {
        // Check cache first
        const cached = await CacheService.getCodeforcesStatus(handle);
        if (cached) {
            console.log(`🚀 Codeforces Status Cache HIT for: ${handle}`);
            return cached;
        }

        console.log(`🔄 Codeforces Status Cache MISS for: ${handle}, fetching from API...`);
        
        // Fetch from API if not cached
        const { data } = await axios.get(`${BASE_URL}/user.status?handle=${handle}`);
        
        // Cache the result
        await CacheService.setCodeforcesStatus(handle, data);
        
        return data;
    },
    
    async getProblems() {
        // Check cache first
        const cached = await CacheService.getCodeforcesProblems();
        if (cached) {
            console.log(`🚀 Codeforces Problems Cache HIT`);
            return cached;
        }

        console.log(`🔄 Codeforces Problems Cache MISS, fetching from API...`);
        
        // Fetch from API if not cached
        const { data } = await axios.get(`${BASE_URL}/problemset.problems`);
        
        // Cache the result (long TTL since problems are relatively static)
        await CacheService.setCodeforcesProblems(data);
        
        return data;
    },
    
    async getUserRating(handle: string) {
        // Check cache first
        const cached = await CacheService.getCodeforcesRating(handle);
        if (cached) {
            console.log(`🚀 Codeforces Rating Cache HIT for: ${handle}`);
            return cached;
        }

        console.log(`🔄 Codeforces Rating Cache MISS for: ${handle}, fetching from API...`);
        
        // Fetch from API if not cached
        const { data } = await axios.get(`${BASE_URL}/user.rating?handle=${handle}`);
        
        // Cache the result (longer TTL since ratings change less frequently)
        await CacheService.setCodeforcesRating(handle, data);
        
        return data;
    },
    
    async getUserInfo(handle: string) {
        // Check cache first
        const cached = await CacheService.getCodeforcesInfo(handle);
        if (cached) {
            console.log(`🚀 Codeforces Info Cache HIT for: ${handle}`);
            return cached;
        }

        console.log(`🔄 Codeforces Info Cache MISS for: ${handle}, fetching from API...`);
        
        // Fetch from API if not cached
        const { data } = await axios.get(`${BASE_URL}/user.info?handles=${handle}`);
        
        // Cache the result
        await CacheService.setCodeforcesInfo(handle, data);
        
        return data;
    },

    // 1. Total Questions (Easy/Med/Hard)
    async getSolvedProblemsStats(handle: string) {
        // This method combines multiple API calls, so we'll cache the final result
        // but use a shorter TTL since it's computed data
        const cacheKey = `cf:solved-stats:${handle}`;
        const cached = await CacheService.getCodeforcesStatus(handle); // Reuse status cache
        
        console.log(`🔄 Codeforces Solved Stats for: ${handle} (computed from cached/fresh data)`);
        
        const [statusRes, problemsRes] = await Promise.all([
            // Use our cached methods instead of direct axios calls
            this.getUserStatus(handle),
            this.getProblems()
        ]);
        
        const submissions = statusRes.result;
        const problems = problemsRes.result.problems;
        const solvedSet = new Set();
        submissions.forEach((sub: any) => {
            if (sub.verdict === 'OK') {
                solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
            }
        });
        const solvedProblems = problems.filter((p: any) => solvedSet.has(`${p.contestId}-${p.index}`));
        let easy = 0, medium = 0, hard = 0;
        solvedProblems.forEach((p: any) => {
            if (p.rating === undefined) return;
            if (p.rating <= 1200) easy++;
            else if (p.rating <= 1800) medium++;
            else hard++;
        });
        return { easy, medium, hard, total: easy + medium + hard };
    },

    // 2. Total Active Days
    async getActiveDays(handle: string) {
        console.log(`🔄 Codeforces Active Days for: ${handle} (computed from cached/fresh data)`);
        
        const statusResponse = await this.getUserStatus(handle);
        const submissions = statusResponse.result;
        const days = new Set();
        submissions.forEach((sub: any) => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
            days.add(date);
        });
        return { activeDays: days.size, days: Array.from(days) };
    },

    // 3. Heatmap (submission count per date)
    async getSubmissionHeatmap(handle: string) {
        console.log(`🔄 Codeforces Heatmap for: ${handle} (computed from cached/fresh data)`);
        
        const statusResponse = await this.getUserStatus(handle);
        const submissions = statusResponse.result;
        const heatmap: Record<string, number> = {};
        submissions.forEach((sub: any) => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
            heatmap[date] = (heatmap[date] || 0) + 1;
        });
        return heatmap;
    },

    // 4. Total Contests Participated
    async getTotalContests(handle: string) {
        console.log(`🔄 Codeforces Total Contests for: ${handle} (computed from cached/fresh data)`);
        
        const ratingResponse = await this.getUserRating(handle);
        return { contests: ratingResponse.result.length };
    },

    // 5. Contest Rating & Graph
    async getContestRatingGraph(handle: string) {
        console.log(`🔄 Codeforces Rating Graph for: ${handle} (computed from cached/fresh data)`);
        
        const ratingResponse = await this.getUserRating(handle);
        const graph = ratingResponse.result.map((c: any) => ({
            contestId: c.contestId,
            contestName: c.contestName,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingChange: c.newRating - c.oldRating,
            date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10)
        }));
        return graph;
    },

    // 6. Awards / Badges (custom)
    async getAwards(handle: string) {
        console.log(`🔄 Codeforces Awards for: ${handle} (computed from cached/fresh data)`);
        
        const infoResponse = await this.getUserInfo(handle);
        const user = infoResponse.result[0];
        const badges: string[] = [];
        if (user.maxRating >= 1800) badges.push('Expert');
        if (user.maxRating >= 2100) badges.push('Candidate Master');
        if (user.maxRating >= 2400) badges.push('Grandmaster');
        if (user.maxRating >= 2600) badges.push('Legendary Grandmaster');
        if (user.friendOfCount >= 100) badges.push('Popular');
        return badges;
    },

    // 7. DSA Topic-Wise Analysis
    async getTopicWiseAnalysis(handle: string) {
        console.log(`🔄 Codeforces Topic Analysis for: ${handle} (computed from cached/fresh data)`);
        
        const [statusRes, problemsRes] = await Promise.all([
            this.getUserStatus(handle),
            this.getProblems()
        ]);
        
        const submissions = statusRes.result;
        const problems = problemsRes.result.problems;
        const solvedSet = new Set();
        submissions.forEach((sub: any) => {
            if (sub.verdict === 'OK') {
                solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
            }
        });
        const solvedProblems = problems.filter((p: any) => solvedSet.has(`${p.contestId}-${p.index}`));
        const topicMap: Record<string, number> = {};
        solvedProblems.forEach((p: any) => {
            if (p.tags) {
                p.tags.forEach((tag: string) => {
                    topicMap[tag] = (topicMap[tag] || 0) + 1;
                });
            }
        });
        return topicMap;
    },
};
