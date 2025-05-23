"use server"
import { db } from "@/db/index";
import { contest, contestLeaderboard, user, userContest, userContestProblem } from "@/db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";

/**
 * Updates the participant count for a contest and adds the user to the contest participants
 */
export async function participateInContest(contestId: string, userId: string) {
    try {
        // 1. Update the contest participants count
        const contestResult = await db
            .update(contest)
            .set({
                participants: sql`${contest.participants} + 1`
            })
            .where(eq(contest.id, contestId))
            .returning();

        if (!contestResult || contestResult.length === 0) {
            throw new Error("Contest not found");
        }

        // 2. Add user to the userContest table (if not already there)
        const userContestResult = await db
            .insert(userContest)
            .values({
                userId: userId,
                contestId: contestId,
                totalPoints: 0,
                rank: 0, // Will be updated later
            })
            .onConflictDoNothing()
            .returning();

        // 3. Add user to the contestLeaderboard table (if not already there)
        const leaderboardResult = await db
            .insert(contestLeaderboard)
            .values({
                contestId: contestId,
                userId: userId,
                score: 0,
                rank: 0, // Will be updated later
            })
            .onConflictDoNothing()
            .returning();

        // 4. Update all ranks in the leaderboard
        await updateLeaderboardRanks(contestId);

        return {
            success: true,
            data: {
                contest: contestResult[0],
                userContest: userContestResult,
                leaderboard: leaderboardResult
            }
        };
    } catch (error) {
        console.error("Error participating in contest:", error);
        return { success: false, error: "Failed to participate in contest" };
    }
}

/**
 * Updates the points for a user in a contest when they solve a problem
 */
export async function updateUserContestPoints(contestId: string, userId: string, problemId: string, points: number) {
    try {
        // 1. Check if the user has already solved this problem
        const existingSolution = await db
            .select()
            .from(userContestProblem)
            .where(
                and(
                    eq(userContestProblem.contestId, contestId),
                    eq(userContestProblem.userId, userId),
                    eq(userContestProblem.problemId, problemId)
                )
            );

        // If the user has already solved this problem, don't update points
        if (existingSolution && existingSolution.length > 0) {
            return { success: true, data: existingSolution[0], message: "Problem already solved" };
        }

        // 2. Add the user-contest-problem record
        await db
            .insert(userContestProblem)
            .values({
                userId: userId,
                contestId: contestId,
                problemId: problemId,
                pointsEarned: points,
                timeTakenSeconds: 0, // This could be calculated if needed
            })
            .onConflictDoNothing();

        // 3. Update the user's total points in the userContest table
        const userContestResult = await db
            .update(userContest)
            .set({
                totalPoints: sql`${userContest.totalPoints} + ${points}`
            })
            .where(
                and(
                    eq(userContest.contestId, contestId),
                    eq(userContest.userId, userId)
                )
            )
            .returning();

        // 4. Update the user's score in the contestLeaderboard table
        const leaderboardResult = await db
            .update(contestLeaderboard)
            .set({
                score: sql`${contestLeaderboard.score} + ${points}`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(contestLeaderboard.contestId, contestId),
                    eq(contestLeaderboard.userId, userId)
                )
            )
            .returning();

        // 5. Update all ranks in the leaderboard
        await updateLeaderboardRanks(contestId);

        return {
            success: true,
            data: {
                userContest: userContestResult[0],
                leaderboard: leaderboardResult[0]
            }
        };
    } catch (error) {
        console.error("Error updating user contest points:", error);
        return { success: false, error: "Failed to update user contest points" };
    }
}

/**
 * Updates the ranks for all users in a contest leaderboard
 */
async function updateLeaderboardRanks(contestId: string) {
    // Get all leaderboard entries sorted by score (descending)
    const leaderboardEntries = await db
        .select()
        .from(contestLeaderboard)
        .where(eq(contestLeaderboard.contestId, contestId))
        .orderBy(desc(contestLeaderboard.score));

    // Update ranks for each entry
    for (let i = 0; i < leaderboardEntries.length; i++) {
        const entry = leaderboardEntries[i];
        const rank = i + 1; // Ranks start at 1

        // Update the rank in the contestLeaderboard table
        await db
            .update(contestLeaderboard)
            .set({ rank })
            .where(
                and(
                    eq(contestLeaderboard.contestId, contestId),
                    eq(contestLeaderboard.userId, entry.userId)
                )
            );

        // Also update the rank in the userContest table
        await db
            .update(userContest)
            .set({ rank })
            .where(
                and(
                    eq(userContest.contestId, contestId),
                    eq(userContest.userId, entry.userId)
                )
            );
    }
}

/**
 * Gets the leaderboard for a specific contest
 */
export async function getContestLeaderboard(contestId: string) {
    try {
        // Join contestLeaderboard with user to get user details
        const leaderboard = await db
            .select({
                rank: contestLeaderboard.rank,
                score: contestLeaderboard.score,
                userId: contestLeaderboard.userId,
                name: user.name,
                username: user.username,
                image: user.image,
                updatedAt: contestLeaderboard.updatedAt
            })
            .from(contestLeaderboard)
            .innerJoin(user, eq(contestLeaderboard.userId, user.id))
            .where(eq(contestLeaderboard.contestId, contestId))
            .orderBy(asc(contestLeaderboard.rank));

        return { success: true, data: leaderboard };
    } catch (error) {
        console.error("Error getting contest leaderboard:", error);
        return { success: false, error: "Failed to get contest leaderboard" };
    }
}
