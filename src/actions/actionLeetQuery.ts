"use server"
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