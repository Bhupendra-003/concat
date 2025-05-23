"use server"
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Updates a user's profile information
 */
export async function updateUserProfile(userId: string, data: {
    name?: string;
    image?: string;
}) {
    try {
        // Only update fields that are provided
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.image !== undefined) updateData.image = data.image;

        // Don't proceed if there's nothing to update
        if (Object.keys(updateData).length === 0) {
            return { success: false, error: "No data provided for update" };
        }

        const result = await db
            .update(user)
            .set(updateData)
            .where(eq(user.id, userId))
            .returning();

        if (!result || result.length === 0) {
            return { success: false, error: "User not found" };
        }

        return { success: true, data: result[0] };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: "Failed to update user profile" };
    }
}
