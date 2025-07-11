import axios from 'axios';

const BASE_URL = 'https://codeforces.com/api';

export const codeforcesService = {
    async getUserStatus(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.status?handle=${handle}`);
        return data;
    },
    async getProblems() {
        const { data } = await axios.get(`${BASE_URL}/problemset.problems`);
        return data;
    },
    async getUserRating(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.rating?handle=${handle}`);
        return data;
    },
    async getUserInfo(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.info?handles=${handle}`);
        return data;
    },

    // 1. Total Questions (Easy/Med/Hard)
    async getSolvedProblemsStats(handle: string) {
        const [statusRes, problemsRes] = await Promise.all([
            axios.get(`${BASE_URL}/user.status?handle=${handle}`),
            axios.get(`${BASE_URL}/problemset.problems`)
        ]);
        const submissions = statusRes.data.result;
        const problems = problemsRes.data.result.problems;
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
        const { data } = await axios.get(`${BASE_URL}/user.status?handle=${handle}`);
        const submissions = data.result;
        const days = new Set();
        submissions.forEach((sub: any) => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
            days.add(date);
        });
        return { activeDays: days.size, days: Array.from(days) };
    },

    // 3. Heatmap (submission count per date)
    async getSubmissionHeatmap(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.status?handle=${handle}`);
        const submissions = data.result;
        const heatmap: Record<string, number> = {};
        submissions.forEach((sub: any) => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
            heatmap[date] = (heatmap[date] || 0) + 1;
        });
        return heatmap;
    },

    // 4. Total Contests Participated
    async getTotalContests(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.rating?handle=${handle}`);
        return { contests: data.result.length };
    },

    // 5. Contest Rating & Graph
    async getContestRatingGraph(handle: string) {
        const { data } = await axios.get(`${BASE_URL}/user.rating?handle=${handle}`);
        const graph = data.result.map((c: any) => ({
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
        const { data } = await axios.get(`${BASE_URL}/user.info?handles=${handle}`);
        const user = data.result[0];
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
        const [statusRes, problemsRes] = await Promise.all([
            axios.get(`${BASE_URL}/user.status?handle=${handle}`),
            axios.get(`${BASE_URL}/problemset.problems`)
        ]);
        const submissions = statusRes.data.result;
        const problems = problemsRes.data.result.problems;
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
