import React from 'react';
import { AlertCircle, ArrowUpRight, Pencil, PenOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PiMedalMilitaryBold } from "react-icons/pi";
import Link from 'next/link';
import { Problem, ValidationErrors } from '../validation';
import toast from 'react-hot-toast';
import { getQuestion } from '@/actions/actionLeetQuery';

interface ProblemFormProps {
    newProblem: Problem;
    setNewProblem: React.Dispatch<React.SetStateAction<Problem>>;
    validationErrors: ValidationErrors;
    setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
    addProblem: () => Promise<void>;
    updateProblem: () => Promise<void>;
    cancelEdit: () => void;
    editMode: boolean;
    contestProblems: Problem[];
}

const ProblemForm: React.FC<ProblemFormProps> = ({
    newProblem,
    setNewProblem,
    validationErrors,
    setValidationErrors,
    addProblem,
    updateProblem,
    cancelEdit,
    editMode,
    contestProblems
}) => {
    const fetchProblem = async () => {
        if (!newProblem.name) {
            toast.error("Please provide name of problem");
            return;
        }
        try {
            toast.promise(getQuestion(newProblem.name), {
                loading: 'Getting Problem from Leetcode',
                success: 'Done',
            }).then((problem) => {
                // Check if the problem already exists in the contest
                const lcid = problem?.questionId ? parseInt(problem?.questionId) : -1;
                
                if (!editMode && contestProblems.some(p => p.lcid === lcid)) {
                    toast.error("This problem is already added to the contest");
                    return;
                }
                
                setNewProblem({
                    ...newProblem,
                    difficulty: problem?.difficulty || 'Unknown',
                    slug: problem?.titleSlug || '',
                    name: problem?.title || '',
                    lcid: lcid,
                    link: `https://leetcode.com/problems/${problem?.titleSlug}/description/`
                });
            }).catch((error) => {
                toast.error(error.message);
            });
        } catch (error) {
            console.error('Error fetching problem difficulty:', error);
            toast.error("Failed to fetch problem from LeetCode");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
                <label className="text-muted-foreground text-sm">
                    Problem Name (or slug)
                </label>
                <input
                    type="text"
                    value={newProblem.name}
                    onChange={(e) =>
                        setNewProblem({ ...newProblem, name: e.target.value })
                    }
                    placeholder="Problem Name"
                    className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.newProblem?.name ? 'border border-red-500' : ''}`}
                />
                {validationErrors.newProblem?.name && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {validationErrors.newProblem.name}
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <div className="flex relative flex-1 flex-col items-start gap-2">
                    <label className="text-muted-foreground text-sm">Link</label>
                    <input
                        type="url"
                        value={newProblem.link}
                        onChange={(e) =>
                            setNewProblem({ ...newProblem, link: e.target.value })
                        }
                        placeholder="https://leetcode.com/..."
                        className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.newProblem?.link ? 'border border-red-500' : ''}`}
                    />
                    {
                        newProblem.link ? (
                            <Link
                                href={`https://${newProblem.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-2 top-[34px] text-white"
                            >
                                <ArrowUpRight />
                            </Link>
                        ) : (
                            <span
                                className="absolute right-2 top-[34px] text-gray-400 cursor-not-allowed"
                                title="No link provided"
                            >
                                <ArrowUpRight />
                            </span>
                        )
                    }
                    {validationErrors.newProblem?.link && (
                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            {validationErrors.newProblem.link}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-start gap-2 relative">
                    <label className="text-muted-foreground text-sm">Points</label>
                    <input
                        type="number"
                        value={newProblem.points}
                        onChange={(e) =>
                            setNewProblem({ ...newProblem, points: e.target.value })
                        }
                        placeholder="0"
                        className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-64 pl-10 ${validationErrors.newProblem?.points ? 'border border-red-500' : ''}`}
                    />
                    <PiMedalMilitaryBold className="absolute left-2 top-[55%] size-5 text-primary" />
                    {validationErrors.newProblem?.points && (
                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            {validationErrors.newProblem.points}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1 items-start gap-2">
                    <label className="text-muted-foreground text-sm">Difficulty <PenOff size={12} className="ml-2 inline" /></label>
                    <input
                        type="text"
                        value={newProblem.difficulty}
                        disabled
                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                    />
                </div>
                <div className="flex flex-col items-start gap-2">
                    <label className="text-muted-foreground text-sm">LeetCode ID <PenOff size={12} className="ml-2 inline" /></label>
                    <input
                        type="text"
                        value={newProblem.lcid}
                        disabled
                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                    />
                </div>
                <div className="flex flex-col items-start gap-2">
                    <label className="text-muted-foreground text-sm">Slug <PenOff size={12} className="ml-2 inline" /></label>
                    <input
                        type="text"
                        value={newProblem.slug}
                        disabled
                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <Button
                    className="w-fit mt-4 bg-color-3 hover:bg-color-3/80 text-black"
                    onClick={fetchProblem}
                    disabled={editMode}
                >
                    Get from Leetcode
                </Button>
                {editMode ? (
                    <>
                        <Button
                            className="w-fit mt-4 bg-accent hover:bg-accent/80 text-white"
                            onClick={updateProblem}
                        >
                            <Pencil size={16} className="mr-2" /> Update Problem
                        </Button>
                        <Button
                            className="w-fit mt-4 bg-red-600 hover:bg-red-700 text-white"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button
                        className="w-fit mt-4 bg-accent hover:bg-accent/80 text-white"
                        onClick={addProblem}
                    >
                        <span className="mr-2 text-lg">+</span> Add Problem
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProblemForm;
