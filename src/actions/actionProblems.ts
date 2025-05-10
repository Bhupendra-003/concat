"use server"

import { problem } from "@/db/schema";
import { db } from "@/db/index";


export async function addProblemToDB(formData: typeof problem.$inferInsert[]) {
    try {
        console.log(formData);
        const res = await db.insert(problem).values(formData).onConflictDoNothing();
        if (res) {
            console.log('Problem added successfully:', res);
            return { success: true };
        }
    } catch (error) {
        console.error('Error adding problem:', error);
        return { success: false, error: 'Failed to add problem' };
    }
}