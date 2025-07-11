import { Request } from 'express';

// User Data
interface UserDataProfile {
    aboutMe: string;
    company?: string;
    countryName?: string;
    realName: string;
    birthday?: string;
    userAvatar: string;
    ranking: number;
    reputation: number;
    school?: string;
    skillTags: string[];
    websites: string[];
}

interface MatchedUser {
    activeBadge: Badge;
    badges: Badge[];
    githubUrl: string;
    linkedinUrl?: string;
    profile: UserDataProfile;
    upcomingBadges: Badge[];
    username: string;
    twitterUrl?: string;
    submissionCalendar: string;
    submitStats: {
        totalSubmissionNum: {
            difficulty: Difficulty;
            count: number;
            submissions: number;
        }[];
        acSubmissionNum: {
            difficulty: Difficulty;
            count: number;
            submissions: number;
        }[];
        count: number;
    };
}

export interface UserData {
    userContestRanking: null | {
        attendedContestsCount: number;
        badge: Badge;
        globalRanking: number;
        rating: number;
        totalParticipants: number;
        topPercentage: number;
    };
    userContestRankingHistory: {
        attended: boolean;
        rating: number;
        ranking: number;
        trendDirection: string;
        problemsSolved: number;
        totalProblems: number;
        finishTimeInSeconds: number;
        contest: {
            title: string;
            startTime: string;
        };
    }[];
    matchedUser: MatchedUser;
    recentAcSubmissionList: {}[];
    recentSubmissionList: Submission[];
}

interface Badge {
    name: string;
    icon: string;
}

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

// User Details
export type FetchUserDataRequest = Request<
    { username: string },
    {},
    { username: string; limit: number },
    { limit: number }
>;

export type TransformedUserDataRequest = Request<
    {},
    {},
    { username: string; limit: number }
>;

// Problem Data
export interface ProblemSetQuestionListData {
    problemsetQuestionList: {
        total: number;
        questions: {}[];
    };
}

interface Submission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    runtime: string;
    url: string;
    isPending: string;
    memory: string;
    submissionId: number;
    lang: string;
    langName: string;
}

// Contest Data
export interface ContestRankingData {
    userContestRanking: {
        attendedContestsCount: number;
        rating: number;
        globalRanking: number;
        totalParticipants: number;
        topPercentage: number;
        badge: Badge;
    };
}

// Discussion Data
export interface DiscussionData {
    categoryTopicList: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                commentCount: number;
                viewCount: number;
                pinned: boolean;
                tags: Array<{
                    name: string;
                    slug: string;
                }>;
                post: {
                    id: string;
                    voteCount: number;
                    creationDate: number;
                    isHidden: boolean;
                    author: {
                        username: string;
                        isActive: boolean;
                        nameColor: string;
                        activeBadge: Badge;
                        profile: {
                            userAvatar: string;
                            reputation: number;
                        };
                    };
                };
            };
        }>;
    };
}

// Problem Details
export interface ProblemData {
    question: {
        questionId: string;
        questionFrontendId: string;
        title: string;
        titleSlug: string;
        content: string;
        difficulty: string;
        likes: number;
        dislikes: number;
        categoryTitle: string;
        topicTags: Array<{
            name: string;
            slug: string;
        }>;
        codeSnippets: Array<{
            lang: string;
            langSlug: string;
            code: string;
        }>;
        stats: string;
        hints: string[];
        solution: {
            id: string;
            canSeeDetail: boolean;
            paidOnly: boolean;
            hasVideoSolution: boolean;
            paidOnlyVideo: boolean;
        };
    };
}
