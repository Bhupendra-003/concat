
export interface Contest {
    id: string;
    name: string;
    startTime: Date;
    duration: number;
    questions: number;
    maxParticipants: number;
    participants: number;
    status: string;
    createdAt: Date;
}
export interface Problem {
    id: number;
    name: string;
    link: string;
    points: number;
    difficulty: "Easy" | "Medium" | "Hard" | "";
    tags: string[];
}
export interface FormData {
    name: string;
    startTime: string;
    duration: string;
    maxParticipants: number;
    problems: Problem[];
    tags: string[];
}

export interface LeetCodeProblem {
    acRate: number;
    difficulty: "Easy" | "Medium" | "Hard";
    freqBar: null;
    hasSolution: boolean;
    hasVideoSolution: boolean;
    isFavor: boolean;
    isPaidOnly: boolean;
    questionFrontendId: string;
    status: null | string;
    title: string;
    titleSlug: string;
    topicTags: {
        id: string;
        name: string;
        slug: string;
    }[];
}