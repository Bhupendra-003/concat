"use client";
import React, { useState, ChangeEvent } from "react";
import { Plus } from "lucide-react";
const problemsList: string[] = [
    "Two Sum",
    "Longest Substring Without Repeating Characters",
    "Median of Two Sorted Arrays",
    "Binary Tree Inorder Traversal",
    "Maximum Subarray",
    "Word Ladder",
    "N-Queens",
    "Merge Intervals",
];

const ProblemSearchBox: React.FC = () => {
    const [query, setQuery] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const filteredProblems = problemsList.filter((problem) =>
        problem.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full border rounded-lg h-full gap-2">
            <input
                type="text"
                placeholder="Search Problems..."
                value={query}
                onChange={handleInputChange}
                className="bg-input text-sm text-foreground placeholder-muted-foreground placeholder:text-sm rounded-md py-2 px-4 w-full focus:outline-none" />
            <ul className="rounded-lg max-h-60 overflow-y-auto">
                {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem, index) => (
                        <li key={index} className="p-2 flex justify-between group hover:bg-muted cursor-pointer">
                            {problem}
                            <span className="text-muted-foreground text-sm"><Plus size={16} className="mr-4 text-transparent group-hover:text-primary" /></span>
                        </li>
                    ))
                ) : (
                    <li className="p-2 text-zinc-500">No matching problems</li>
                )}
            </ul>
        </div>
    );
};

export default ProblemSearchBox;
