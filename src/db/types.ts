
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