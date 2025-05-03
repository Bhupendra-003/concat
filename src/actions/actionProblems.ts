"use server"
import { LeetCode } from "leetcode-query";

export const getProblems = async (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    const leetcode = new LeetCode();
    const problems = await leetcode.problems({
        limit: 1000,
        filters: {
            difficulty: difficulty,
        }
    });
    const data = problems.questions;
    return data;
}