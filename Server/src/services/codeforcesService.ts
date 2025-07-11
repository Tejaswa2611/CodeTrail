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
};
