"use server"
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";

/**
 * Gets the global leaderboard across all contests
 */
export async function getGlobalLeaderboard() {
    try {
        // Get all users sorted by points (descending)
        const leaderboard = await db
            .select({
                id: user.id,
                name: user.name,
                username: user.username,
                points: user.points,
                rank: user.rank,
                image: user.image,
                updatedAt: user.updatedAt
            })
            .from(user)
            .where(eq(user.role, 'user')) // Only include regular users, not creators
            .orderBy(desc(user.points), asc(user.rank));

        // Calculate ranks (in case they're not updated in the database)
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1 // Ranks start at 1
        }));

        return { success: true, data: rankedLeaderboard };
    } catch (error) {
        console.error("Error fetching global leaderboard:", error);
        return { success: false, error: "Failed to fetch global leaderboard" };
    }
}
