"use server"
import { RecentSubmission } from "@/db/types";
import { LeetCode } from "leetcode-query";
const leetcode = new LeetCode();

export async function getQuestion(query: string) {
    if (!query || query.trim() === '') {
        console.error("Please provide name of problem");
        throw new Error("Please provide name of problem");
    }
    try {
        const slug = query.replace(/\s+/g, "-");
        const problem = await leetcode.problem(slug);
        if (!problem) throw new Error("Problem not found");
        else return problem;
    } catch (error) {
        console.error("Error fetching question:", error);
        throw error;
    }
}

export async function getRecentSubmissions(username: string): Promise<RecentSubmission[]> {
    try {
        const profile = await leetcode.user(username);
        if (!profile) throw new Error("Submissions not found");
        else{
            console.log("Submissions found", profile.recentSubmissionList);
            return profile.recentSubmissionList!;
        };
    } catch (error) {
        console.error("Error fetching submissions:", error);
        throw error;
    }
}

export async function getLeetCodeUserProfile(username: string) {
    try {
        const user = await leetcode.user(username);
        if (!user) throw new Error("User not found");

        // Extract profile data including real name and avatar
        const profileData = {
            username: username,
            realName: user.matchedUser?.profile?.realName || "",
            userAvatar: user.matchedUser?.profile?.userAvatar || "",
            ranking: user.matchedUser?.profile?.ranking,
            recentSubmissions: user.recentSubmissionList || [],
            // Add any other relevant profile data
        };

        console.log("LeetCode profile found:", profileData);
        return profileData;
    } catch (error) {
        console.error("Error fetching LeetCode profile:", error);
        throw error;
    }
}