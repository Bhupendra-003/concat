"use server"
import { problem, contest, contestProblems, user } from "@/db/schema";
import { db } from "@/db/index";
import { eq, inArray } from "drizzle-orm";


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
            console.log('Contests fetched successfully:', res);
            return { success: true, data: res };
        }
    } catch (error) {
        console.error('Error fetching contests from DB:', error);
        return { success: false, error: 'Failed to fetch contests' };
    }
}

export async function getContestById(contestId: string) {
    try {
        const res = await db.select().from(contest).where(eq(contest.id, contestId));
        if (res && res.length > 0) {
            console.log('Contest fetched successfully:', res[0]);
            return { success: true, data: res[0] };
        } else {
            return { success: false, error: 'Contest not found' };
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

export async function deleteContest(contestId: string) {
    try {
        const res = await db.delete(contest).where(eq(contest.id, contestId));
        if (res) {
            console.log('Contest deleted successfully:', res);
            return { success: true, error: null };
        }
    } catch (error) {
        console.error('Error deleting contest from DB:', error);
        return { success: false, error: 'Failed to delete contest' };
    }
}

export async function getProblemsByContestId(contestId: string) {
    try {
        const res = await db.select().from(contestProblems).where(eq(contestProblems.contestId, contestId));
        if (res) {
            console.log('Contest problems fetched successfully:', res);
            return { success: true, data: res };
        }
    } catch (error) {
        console.error('Error fetching contest problems from DB:', error);
        return { success: false, error: 'Failed to fetch contest problems' };
    }
}

export async function getProblemById(problemId: string) {
    try {
        const res = await db.select().from(problem).where(eq(problem.id, problemId));
        if (res && res.length > 0) {
            console.log('Problem fetched successfully:', res[0]);
            return { success: true, data: res[0] };
        } else {
            return { success: false, error: 'Problem not found' };
        }
    } catch (error) {
        console.error('Error fetching problem from DB:', error);
        return { success: false, error: 'Failed to fetch problem' };
    }
}

export async function getContestProblemsWithDetails(contestId: string) {
    try {
        // First get the contest-problem relationships
        const contestProblemsRes = await db.select().from(contestProblems)
            .where(eq(contestProblems.contestId, contestId));

        if (!contestProblemsRes || contestProblemsRes.length === 0) {
            return { success: true, data: [] };
        }

        // Get all problem IDs
        const problemIds = contestProblemsRes.map(cp => cp.problemId);

        // Fetch all problems in one query
        const problemsRes = await db.select().from(problem)
            .where(inArray(problem.id, problemIds));

        // Combine the data
        const result = contestProblemsRes.map(cp => {
            const problemData = problemsRes.find(p => p.id === cp.problemId);
            return {
                ...cp,
                problem: problemData || null
            };
        });

        console.log('Contest problems with details fetched successfully:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching contest problems with details:', error);
        return { success: false, error: 'Failed to fetch contest problems with details' };
    }
}

export async function updateUserLeetCodeUsername(userId: string, leetcodeUsername: string) {
    try {
        const res = await db.update(user).set({ username: leetcodeUsername }).where(eq(user.email, userId));
        if (res) {
            console.log('User updated successfully:', res);
            return { success: true, data: res };
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}