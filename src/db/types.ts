
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