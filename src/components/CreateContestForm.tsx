import React from 'react';

const CreateContestForm = () => {
    return (
        <div className="bg-[#1F1F23] text-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-red-500">Create New Contest</h2>

            <form className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium">Contest Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Weekly Algorithm Challenge"
                        className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Start Time</label>
                        <input
                            type="datetime-local"
                            className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Duration (in minutes)</label>
                        <input
                            type="number"
                            placeholder="e.g., 90"
                            className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium">Questions to Add</label>
                    <textarea
                        placeholder="Enter question IDs or paste full questions here..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Max Participants</label>
                        <input
                            type="number"
                            placeholder="e.g., 500"
                            className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">Tags</label>
                        <input
                            type="text"
                            placeholder="e.g., dynamic-programming, graphs"
                            className="w-full p-3 rounded-xl bg-[#2B2B30] text-white border border-[#3C3C42] focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="mt-4 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl text-white font-semibold"
                    >
                        Create Contest
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateContestForm;
