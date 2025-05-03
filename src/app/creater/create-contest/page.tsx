"use client";
import React, { useEffect, useState } from "react";
import { Clock, Users, Trash2, Tag, PlusCircle, FileText, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { createContest } from "@/actions/actionContest";
import { Problem } from "@/db/types";
import { getProblems } from "@/actions/actionProblems";
import { AddProblem } from "@/components/SelectProblem";

interface FormData {
    name: string;
    startTime: string;
    duration: string;
    maxParticipants: number;
    tags: string[];
    problems: Problem[];
}

const problems: {
    acRate: number;
    difficulty: "Easy" | "Medium" | "Hard";
    freqBar: null;
    hasSolution: boolean;
    hasVideoSolution: boolean;
    isFavor: boolean;
    isPaidOnly: boolean;
    questionFrontendId: string;
    status: null | string;
    title: string;
    titleSlug: string;
    topicTags: {
        id: string;
        name: string;
        slug: string;
    }[];
}[] = [];



const page = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        startTime: "",
        duration: "",
        maxParticipants: 0,
        tags: [],
        problems: [],
    });
    useEffect(() => {
        const fetchProblems = async () => {
            const res = await getProblems("EASY");
            problems.push(...res);
            console.log(problems)
        };
        fetchProblems();  
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "tags") {
            setFormData((prev) => ({ ...prev, tags: value.split(",").map((t) => t.trim()) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleProblemChange = (index: number, field: keyof Problem, value: any) => {
        const updated = [...formData.problems];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, problems: updated });
    };

    const handleAddProblem = () => {
        setFormData({
            ...formData,
            problems: [
                ...formData.problems,
                { id: formData.problems.length + 1, name: "", link: "", points: 0, difficulty: "", tags: [] },
            ],
        }); 
    };

    const handleRemoveProblem = (index: number) => {
        const updated = formData.problems.filter((_, i) => i !== index);
        setFormData({ ...formData, problems: updated });
    };

    const insertFormData = async () => {
        console.log('Inserting contest data:', formData);
        toast.promise(createContest(formData), {
            loading: "Creating contest...",
            success: "Contest created successfully",
            error: "Failed to create contest"
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        insertFormData();   
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h1 className="text-4xl font-bold mb-2">Create New Contest</h1>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        Design your perfect coding challenge and invite participants to compete
                    </p>
                </div>

                {/* Contest Details */}
                <div className="space-y-8">
                    <div className="bg-zinc-800 bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm border border-zinc-700">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <Trophy className="mr-2 text-red-500 w-5 h-5" />
                            Contest Details
                        </h2>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-zinc-300">Contest Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Weekly Algorithm Challenge"
                                    className="w-full p-4 pl-12 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <Trophy className="absolute left-4 top-4 text-zinc-500 w-5 h-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-zinc-300">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    min={new Date().toISOString().slice(0, 16)}
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-zinc-300">Duration (minutes)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g., 90"
                                        className="w-full p-4 pl-12 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Clock className="absolute left-4 top-4 text-zinc-500 w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Problems Section */}
                    <div className="bg-zinc-800 bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm border border-zinc-700">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <FileText className="mr-2 text-red-500 w-5 h-5" />
                            Contest Problems
                        </h2>

                        {formData.problems.length === 0 ? (
                            <div className="text-center py-8 text-zinc-400">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No problems added yet</p>
                                <p className="text-sm mt-1">Add your first problem to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {formData.problems.map((p, index) => (
                                    <div key={index} className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center">
                                                <FileText className="mr-2 text-red-500" /> Problem {index + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProblem(index)}
                                                className="p-2 rounded-lg hover:bg-zinc-800 text-red-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove problem"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-zinc-300">Problem Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Two Sum"
                                                value={p.name}
                                                onChange={(e) => handleProblemChange(index, "name", e.target.value)}
                                                className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <AddProblem data={problems} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-zinc-300">Problem Link</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., https://example.com/problem"
                                                    value={p.link}
                                                    onChange={(e) => handleProblemChange(index, "link", e.target.value)}
                                                    className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-zinc-300">Points</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g., 100"
                                                    value={p.points}
                                                    onChange={(e) => handleProblemChange(index, "points", Number(e.target.value))}
                                                    className="w-full pl-12 p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                                <Trophy className="relative -top-10 -right-4 w-5 h-5" color="#ff4507" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-zinc-300">Difficulty</label>
                                                <select
                                                    value={p.difficulty}
                                                    onChange={(e) => handleProblemChange(index, "difficulty", e.target.value)}
                                                    className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    <option value="">Select difficulty</option>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-zinc-300">Problem Tags</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., dp, arrays, sorting"
                                                        value={p.tags.join(", ")}
                                                        onChange={(e) =>
                                                            handleProblemChange(
                                                                index,
                                                                "tags",
                                                                e.target.value.split(",").map((tag) => tag.trim())
                                                            )
                                                        }
                                                        className="w-full p-4 pl-12 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                    <Tag className="absolute left-4 top-4 text-zinc-500 w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={handleAddProblem}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-medium flex items-center gap-2 transition-colors"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Add Problem
                            </button>
                        </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="bg-zinc-800 bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm border border-zinc-700">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <Users className="mr-2 text-red-500 w-5 h-5" />
                            Additional Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-zinc-300">Max Participants</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        placeholder="e.g., 500"
                                        className="w-full p-4 pl-12 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Users className="absolute left-4 top-4 text-zinc-500 w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-zinc-300">Contest Tags</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags.join(", ")}
                                        onChange={handleChange}
                                        placeholder="e.g., dp, graphs"
                                        className="w-full p-4 pl-12 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Tag className="absolute left-4 top-4 text-zinc-500 w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSubmit}
                            className="px-12 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-medium text-lg hover:from-red-700 hover:to-red-600 transition-all shadow-lg flex items-center gap-2 group"
                        >
                            <Trophy className="group-hover:scale-110 transition-transform" />
                            Create Contest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;