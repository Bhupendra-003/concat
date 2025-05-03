import React from 'react'
import { FileText, Trash2, Trophy, Tag, SearchCheck } from 'lucide-react'
import { FormData, Problem } from '@/db/types'
import { getProblem } from '@/actions/actionProblems'

type Props = {
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    handleRemoveProblem: (index: number) => void
    handleAddProblem: () => void
    handleProblemChange: (index: number, field: keyof Problem, value: any) => void
}
function AddProblem({ formData, setFormData, handleRemoveProblem, handleProblemChange }: Props) {

    return (
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

                    <div className="mb-4 ">
                        <label className="block mb-2 text-sm font-medium text-zinc-300">Problem Name</label>

                        <div className='relative'>
                            <input
                                type="text"
                                placeholder="e.g., Two Sum"
                                value={p.name}
                                onChange={(e) => handleProblemChange(index, "name", e.target.value)}
                                className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button className='absolute active:bg-popover/70 bg-popover p-3 rounded-lg right-4 top-1/2 -translate-y-1/2'>
                                <SearchCheck size={22} />
                            </button>
                        </div>
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
                                <Tag className="absolute left-4 top-5 text-zinc-500 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AddProblem
