"use server"

import { problem } from "@/db/schema";
import { db } from "@/db/index";


export async function addProblemToDB(problems: any) {
    try {
        // To resolve leetcode_id and lcid mismatch
        const formatted = problems.map((problem: any) => ({
            name: problem.name,
            link: problem.link,
            difficulty: problem.difficulty,
            slug: problem.slug,
            leetcodeId: Number(problem.lcid),
        }));
        const res = await db.insert(problem).values(formatted).onConflictDoNothing();
        if (res) {
            return { success: true };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add problem' };
    }
}