// src/actions/createContest.ts
'use server';

import db from '@/db';
import { contest } from '@/db/schema';

export async function addContestToDB(formData: any) {
    const data: typeof contest.$inferInsert = {
        name: formData.name,
        startTime: new Date(formData.startTime),
        duration: Number(formData.duration),
        maxParticipants: Number(formData.maxParticipants),
        questions: formData.problems.length,
        participants: 0,
        status: 'Not Started',
    };

    try {
        const res = await db.insert(contest).values(data);
        if (res) {
            console.log('Contest created successfully:', res);
            return { success: true };
        }
    } catch (error) {
        console.error('Error creating contest:', error);
        return { success: false, error: 'Failed to create contest' };
    }
}
export async function getContest() {
    try {
        const res = await db.select().from(contest);
        if (res) {
            console.log('Contest fetched successfully:', res);
            return { success: true, data: res };
        }
    } catch (error) {
        console.error('Error fetching contest:', error);
        return { success: false, error: 'Failed to fetch contest' };
    }
}
