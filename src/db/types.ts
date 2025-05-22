
export interface Contest {
    id: string;
    contest_index?: number;
    name: string;
    startTime: Date;
    duration: number;
    questions: number;
    maxParticipants: number;
    participants: number;
    status: 'Not Started' | 'Active' | 'Ended' | 'upcoming' | 'Ongoing';
    createdAt: Date;
    updatedAt?: Date;
}
export interface ProblemForm {
    id: number;
    name: string;
    link: string;
    points: number;
    difficulty: "Easy" | "Medium" | "Hard" | "";
}
export interface Problem {
    id: string;
    leetcodeId: number;
    name: string;
    slug: string;
    link: string;
    points?: number; // Points is in the junction table, not in the problem table
    difficulty: "Easy" | "Medium" | "Hard" | "";
    createdAt?: Date;
    updatedAt?: Date;
}
export interface FormData {
    name: string;
    startTime: string;
    duration: string;
    maxParticipants: number;
    problems: Problem[];
    tags: string[];
}

export interface ContestProblem {
    contestId: string;
    problemId: string;
    points: number;
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

export interface RecentSubmission {
    lang: string;
    statusDisplay: string;
    timestamp: string; //1747207698
    title: string;
    titleSlug: string;
}