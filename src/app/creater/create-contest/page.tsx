"use client";
import React, { useEffect, useState } from "react";
import { Clock, Users, Tag, PlusCircle, FileText, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { createContest } from "@/actions/actionContest";
import { Problem } from "@/db/types";
import AddProblem from "@/components/AddProblem";
import { FormData } from "@/db/types";

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
        console.log(formData)
    }, [formData]);

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
                            <AddProblem formData={formData} setFormData={setFormData} handleRemoveProblem={handleRemoveProblem} handleAddProblem={handleAddProblem} handleProblemChange={handleProblemChange} />
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