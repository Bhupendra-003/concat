"use server"
import { db } from "@/db/index";
import { contest } from "@/db/schema";
import { eq, lt, gt, and, or, sql } from "drizzle-orm";

/**
 * Updates the status of contests based on their start time and duration
 * - Contests that haven't started yet (start time is in the future) -> 'Not Started' or 'upcoming'
 * - Contests that have started but not ended -> 'Active' or 'Ongoing'
 * - Contests that have ended -> 'Ended'
 */
export async function updateContestStatuses() {
    try {
        const now = new Date();

        // Get all contests
        const contests = await db.select().from(contest);

        // Update each contest status based on its start time and duration
        for (const c of contests) {
            const startTime = new Date(c.startTime);
            const endTime = new Date(startTime.getTime() + c.duration * 60 * 1000); // Convert minutes to milliseconds

            let newStatus: string;

            if (now < startTime) {
                // Contest hasn't started yet
                newStatus = 'Not Started';
            } else if (now >= startTime && now < endTime) {
                // Contest is currently active
                newStatus = 'Active';
            } else {
                // Contest has ended
                newStatus = 'Ended';
            }

            // Only update if status has changed
            if (c.status !== newStatus) {
                await db
                    .update(contest)
                    .set({ status: newStatus, updatedAt: now })
                    .where(eq(contest.id, c.id));

                console.log(`Updated contest ${c.name} status from ${c.status} to ${newStatus}`);
            }
        }

        return { success: true, message: "Contest statuses updated successfully" };
    } catch (error) {
        console.error("Error updating contest statuses:", error);
        return { success: false, error: "Failed to update contest statuses" };
    }
}

/**
 * Updates the status of a specific contest
 */
export async function updateContestStatus(contestId: string) {
    try {
        const now = new Date();

        // Get the contest
        const contestResult = await db.select().from(contest).where(eq(contest.id, contestId));

        if (!contestResult || contestResult.length === 0) {
            return { success: false, error: "Contest not found" };
        }

        const c = contestResult[0];
        const startTime = new Date(c.startTime);
        const endTime = new Date(startTime.getTime() + c.duration * 60 * 1000); // Convert minutes to milliseconds

        let newStatus: string;

        if (now < startTime) {
            // Contest hasn't started yet
            newStatus = 'Not Started';
        } else if (now >= startTime && now < endTime) {
            // Contest is currently active
            newStatus = 'Active';
        } else {
            // Contest has ended
            newStatus = 'Ended';
        }

        // Only update if status has changed
        if (c.status !== newStatus) {
            await db
                .update(contest)
                .set({ status: newStatus, updatedAt: now })
                .where(eq(contest.id, c.id));

            console.log(`Updated contest ${c.name} status from ${c.status} to ${newStatus}`);
            return { success: true, message: `Contest status updated to ${newStatus}` };
        }

        return { success: true, message: "Contest status is already up to date" };
    } catch (error) {
        console.error("Error updating contest status:", error);
        return { success: false, error: "Failed to update contest status" };
    }
}

/**
 * Batch update contest statuses using a single query
 * This is more efficient than updating each contest individually
 */
export async function batchUpdateContestStatuses() {
    try {
        const now = new Date();

        // Update contests that haven't started yet
        await db
            .update(contest)
            .set({
                status: 'Not Started',
                updatedAt: now
            })
            .where(
                and(
                    gt(contest.startTime, now),
                    or(
                        eq(contest.status, 'Active'),
                        eq(contest.status, 'Ongoing'),
                        eq(contest.status, 'Ended')
                    )
                )
            );

        // Update contests that are currently active
        await db
            .update(contest)
            .set({
                status: 'Active',
                updatedAt: now
            })
            .where(
                and(
                    lt(contest.startTime, now),
                    gt(
                        // Calculate end time: start_time + duration (in milliseconds)
                        sql`${contest.startTime} + (${contest.duration} * interval '1 minute')`,
                        now
                    ),
                    or(
                        eq(contest.status, 'Not Started'),
                        eq(contest.status, 'upcoming'),
                        eq(contest.status, 'Ended')
                    )
                )
            );

        // Update contests that have ended
        await db
            .update(contest)
            .set({
                status: 'Ended',
                updatedAt: now
            })
            .where(
                and(
                    lt(
                        // Calculate end time: start_time + duration (in milliseconds)
                        sql`${contest.startTime} + (${contest.duration} * interval '1 minute')`,
                        now
                    ),
                    or(
                        eq(contest.status, 'Not Started'),
                        eq(contest.status, 'upcoming'),
                        eq(contest.status, 'Active'),
                        eq(contest.status, 'Ongoing')
                    )
                )
            );

        return { success: true, message: "Contest statuses batch updated successfully" };
    } catch (error) {
        console.error("Error batch updating contest statuses:", error);
        return { success: false, error: "Failed to batch update contest statuses" };
    }
}
