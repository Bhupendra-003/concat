"use server"
import { problem, contest, contestProblems, user, userContest, userContestProblem, contestLeaderboard } from "@/db/schema";
import { db } from "@/db/index";
import { eq, inArray, and, sql } from "drizzle-orm";


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

/**
 * Gets a user's LeetCode username by their email
 */
export async function getUserLeetCodeUsername(userEmail: string) {
    try {
        const res = await db.select({ username: user.username }).from(user).where(eq(user.email, userEmail));
        if (res && res.length > 0) {
            console.log('User LeetCode username fetched successfully:', res[0].username);
            return { success: true, username: res[0].username };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error fetching user LeetCode username:', error);
        return { success: false, error: 'Failed to fetch user LeetCode username' };
    }
}

/**
 * Updates a contest with new information
 */
export async function updateContest(contestData: {
    id: string;
    name: string;
    startTime: Date;
    duration: number;
    maxParticipants: number;
}) {
    try {
        const { id, ...updateData } = contestData;

        // Update the contest
        const res = await db
            .update(contest)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(contest.id, id))
            .returning();

        if (res && res.length > 0) {
            console.log('Contest updated successfully:', res[0]);
            return { success: true, data: res[0] };
        } else {
            return { success: false, error: 'Contest not found' };
        }
    } catch (error) {
        console.error('Error updating contest:', error);
        return { success: false, error: 'Failed to update contest' };
    }
}

/**
 * Gets all participants for a specific contest with their details
 */
export async function getContestParticipants(contestId: string) {
    try {
        // Join userContest with user to get user details
        const participants = await db
            .select({
                userId: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                image: user.image,
                joinedAt: userContest.createdAt,
                totalPoints: userContest.totalPoints,
                rank: userContest.rank
            })
            .from(userContest)
            .innerJoin(user, eq(userContest.userId, user.id))
            .where(eq(userContest.contestId, contestId))
            .orderBy(userContest.rank);

        return { success: true, data: participants };
    } catch (error) {
        console.error('Error getting contest participants:', error);
        return { success: false, error: 'Failed to get contest participants' };
    }
}

/**
 * Removes a participant from a contest
 */
export async function removeParticipant(contestId: string, userId: string) {
    try {
        // First, check if the participant exists
        const participant = await db
            .select()
            .from(userContest)
            .where(
                and(
                    eq(userContest.contestId, contestId),
                    eq(userContest.userId, userId)
                )
            );

        if (!participant || participant.length === 0) {
            return { success: false, error: 'Participant not found' };
        }

        // Begin transaction to ensure all operations succeed or fail together
        // 1. Delete from userContestProblem
        await db
            .delete(userContestProblem)
            .where(
                and(
                    eq(userContestProblem.contestId, contestId),
                    eq(userContestProblem.userId, userId)
                )
            );

        // 2. Delete from contestLeaderboard
        await db
            .delete(contestLeaderboard)
            .where(
                and(
                    eq(contestLeaderboard.contestId, contestId),
                    eq(contestLeaderboard.userId, userId)
                )
            );

        // 3. Delete from userContest
        await db
            .delete(userContest)
            .where(
                and(
                    eq(userContest.contestId, contestId),
                    eq(userContest.userId, userId)
                )
            );

        // 4. Decrement the participants count in the contest
        await db
            .update(contest)
            .set({
                participants: sql`${contest.participants} - 1`,
                updatedAt: new Date()
            })
            .where(eq(contest.id, contestId));

        return { success: true };
    } catch (error) {
        console.error('Error removing participant:', error);
        return { success: false, error: 'Failed to remove participant' };
    }
}

/**
 * Gets all submissions for a specific contest with user and problem details
 */
export async function getContestSubmissions(contestId: string) {
    try {
        // Join userContestProblem with user and problem to get all details
        const submissions = await db
            .select({
                userId: user.id,
                userName: user.name,
                userImage: user.image,
                problemId: problem.id,
                problemName: problem.name,
                problemDifficulty: problem.difficulty,
                pointsEarned: userContestProblem.pointsEarned,
                timeTakenSeconds: userContestProblem.timeTakenSeconds,
                submittedAt: userContestProblem.submittedAt
            })
            .from(userContestProblem)
            .innerJoin(user, eq(userContestProblem.userId, user.id))
            .innerJoin(problem, eq(userContestProblem.problemId, problem.id))
            .where(eq(userContestProblem.contestId, contestId))
            .orderBy(userContestProblem.submittedAt);

        return { success: true, data: submissions };
    } catch (error) {
        console.error('Error getting contest submissions:', error);
        return { success: false, error: 'Failed to get contest submissions' };
    }
}