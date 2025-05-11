"use server"
import { problem, contest, contestProblems } from "@/db/schema";
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
        const res = await db.insert(problem).values(formatted).onConflictDoUpdate({
            target: problem.leetcodeId,
            set: {
                slug: problem.slug,
            }
        }).returning();
        if (res) {
            return { success: true, res: res };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add problem' };
    }
}

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
        // Inserting contest into contest table
        console.log("Creating Contest...", data)
        const contestRes = await db.insert(contest).values(data).returning();
        if (contestRes) {
            console.log('Contest created successfully:', contestRes[0].id);
            return { success: true, res: contestRes };
        }

    } catch (error: any) {
        console.log('Error inserting contest in DB:', error);
        if(error.code === '23505'){
            return { success: false, error: 'Contest name already exists' };
        }
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
        console.error('Error fetching contest from DB:', error);
        return { success: false, error: 'Failed to fetch contest' };
    }
}

export async function addProblemToContestJunctionTable(formData: any[]) {
    try {
        // Map and sanitize all entries
        const data = formData.map(item => ({
            contestId: item.contestId,
            problemId: item.problemId,
            points: Number(item.points),
        }));

        const res = await db.insert(contestProblems).values(data).returning().onConflictDoNothing();
        if (res) {
            console.log('Problems added to contest junction table successfully:', res);
            return { success: true, res: res };
        }
    } catch (error) {
        console.error('Error adding problems to contest junction table:', error);
        return { success: false, error: 'Failed to add problems to contest junction table' };
    }
}
