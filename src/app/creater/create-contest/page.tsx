"use client"
import React, { useEffect, useState } from 'react'
import CreaterHeader from '@/components/CreaterHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowUpRight, Pencil, PenOff, Timer, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { PiMedalMilitaryBold } from "react-icons/pi"
import { getQuestion } from '@/actions/actionLeetQuery'
import toast from 'react-hot-toast'
import Link from 'next/link'
import * as yup from 'yup'

interface Problem {
    name: string
    link: string
    points: string
    difficulty: string
    slug: string
    lcid: number
}

interface ContestDetails {
    name: string
    startTime: string
    duration: string
    maxParticipants: string
    visibility: boolean
    problems: Problem[]
}

interface ValidationErrors {
    contestDetails?: Record<string, string>
    newProblem?: Record<string, string>
}

// Validation schemas
const problemSchema = yup.object().shape({
    name: yup.string().required('Problem name is required'),
    link: yup.string().url('Must be a valid URL').required('Problem link is required'),
    points: yup.string().required('Points are required'),
    difficulty: yup.string().required('Difficulty is required'),
    slug: yup.string().required('Slug is required'),
    lcid: yup.number().min(0, 'Valid LeetCode ID is required').required('LeetCode ID is required')
});

const contestDetailsSchema = yup.object().shape({
    name: yup.string().required('Contest name is required'),
    startTime: yup.string().required('Start time is required'),
    duration: yup.string().required('Duration is required')
        .test('is-positive', 'Duration must be positive', value => parseInt(value) > 0),
    maxParticipants: yup.string().required('Max participants is required')
        .test('is-positive', 'Max participants must be positive', value => parseInt(value) > 0),
    visibility: yup.boolean(),
    problems: yup.array().of(problemSchema)
        .min(1, 'At least one problem is required')
});

export default function Page() {
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [contestDetails, setContestDetails] = useState<ContestDetails>({
        name: '',
        startTime: '',
        duration: '',
        maxParticipants: '',
        visibility: false,
        problems: [],
    })

    const [newProblem, setNewProblem] = useState<Problem>({
        name: '',
        link: '',
        points: '',
        difficulty: '',
        slug: '',
        lcid: -1
    })

    // Validate contest details
    const validateContestDetails = async () => {
        try {
            await contestDetailsSchema.validate(contestDetails, { abortEarly: false });
            setValidationErrors(prev => ({ ...prev, contestDetails: {} }));
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setValidationErrors(prev => ({ ...prev, contestDetails: errors }));
            }
            return false;
        }
    }

    // Validate new problem
    const validateNewProblem = async () => {
        try {
            await problemSchema.validate(newProblem, { abortEarly: false });
            setValidationErrors(prev => ({ ...prev, newProblem: {} }));
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setValidationErrors(prev => ({ ...prev, newProblem: errors }));
            }
            return false;
        }
    }

    // Delete a problem from the contest
    const deleteProblem = (lcid: number) => {
        try {
            setContestDetails((prev) => ({
                ...prev,
                problems: prev.problems.filter(p => p.lcid !== lcid),
            }));
            toast.success("Problem deleted successfully");
        } catch (error) {
            toast.error("Failed to delete problem");
            console.error(error);
        }
    }

    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editingProblemId, setEditingProblemId] = useState<number>(-1);

    // Start editing a problem
    const startEditProblem = (problem: Problem) => {
        setNewProblem(problem);
        setEditMode(true);
        setEditingProblemId(problem.lcid);
    }

    // Cancel editing
    const cancelEdit = () => {
        setNewProblem({ name: '', link: '', points: '', difficulty: '', slug: '', lcid: -1 });
        setEditMode(false);
        setEditingProblemId(-1);
        setValidationErrors(prev => ({ ...prev, newProblem: {} }));
    }

    // Update an existing problem
    const updateProblem = async () => {
        try {
            const isValid = await validateNewProblem();
            if (!isValid) {
                toast.error("Please fix all validation errors");
                return;
            }

            setContestDetails((prev) => ({
                ...prev,
                problems: prev.problems.map(p =>
                    p.lcid === editingProblemId ? newProblem : p
                ),
            }));

            setNewProblem({ name: '', link: '', points: '', difficulty: '', slug: '', lcid: -1 });
            setEditMode(false);
            setEditingProblemId(-1);
            setValidationErrors(prev => ({ ...prev, newProblem: {} }));
            toast.success("Problem updated successfully");
        } catch (error) {
            toast.error("Failed to update problem");
            console.error(error);
        }
    }

    // Add a new problem
    const addProblem = async () => {
        try {
            const isValid = await validateNewProblem();
            if (!isValid) {
                toast.error("Please fix all validation errors");
                return;
            }

            // Check for duplicate lcid
            const isDuplicate = contestDetails.problems.some(p => p.lcid === newProblem.lcid);
            if (isDuplicate) {
                toast.error("This problem is already added to the contest");
                return;
            }

            console.info("adding new problem to Contest Details");
            console.log(newProblem);
            setContestDetails((prev) => ({
                ...prev,
                problems: [...prev.problems, newProblem],
            }));
            setNewProblem({ name: '', link: '', points: '', difficulty: '', slug: '', lcid: -1 });
            setValidationErrors(prev => ({ ...prev, newProblem: {} }));
            toast.success("Problem added successfully");
        } catch (error) {
            toast.error("Failed to add problem");
            console.error(error);
        }
    }

    const fetchProblem = async () => {
        if (!newProblem.name) {
            toast.error("Please provide name of problem");
            return;
        }
        try {
            toast.promise(getQuestion(newProblem.name), {
                loading: 'Getting Problem from Leetcode',
            }).then((problem) => {
                // Check if the problem already exists in the contest
                const lcid = problem?.questionId ? parseInt(problem?.questionId) : -1;

                if (!editMode && contestDetails.problems.some(p => p.lcid === lcid)) {
                    toast.error("This problem is already added to the contest");
                    return;
                }else{
                    toast.success("Done")
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
    }

    const createContest = async () => {
        try {
            const isValid = await validateContestDetails();
            if (!isValid) {
                toast.error("Please fix all validation errors");
                return;
            }

            // Here you would typically submit the contest to your backend
            toast.success("Contest created successfully!");
            console.log("Contest details:", contestDetails);

            // Clear form after successful submission
            // setContestDetails({
            //     name: '',
            //     startTime: '',
            //     duration: '',
            //     maxParticipants: '',
            //     visibility: false,
            //     problems: [],
            // });
        } catch (error) {
            toast.error("Failed to create contest");
            console.error(error);
        }
    }
    //Storing contest details in localStorage
    useEffect(() => {
        console.log("Storing contest details in localStorage")
        // Check if contest details are not empty
        if (contestDetails && Object.keys(contestDetails).length > 0 &&
            contestDetails.name &&
            contestDetails.startTime &&
            contestDetails.duration) {
            localStorage.setItem('contestDetails', JSON.stringify(contestDetails))
            console.log("Contest details stored in localStorage", localStorage.getItem('contestDetails'))
        }
    }, [contestDetails])

    //Getting contest details from localStorage
    useEffect(() => {
        console.log("Getting contest details from localStorage")
        const storedContestDetails = localStorage.getItem('contestDetails')
        if (storedContestDetails) {
            console.log("Contest details found in localStorage", storedContestDetails)
            setContestDetails(JSON.parse(storedContestDetails))
        }
    }, [])
    return (
        <div className="flex px-24 pt-2 flex-col h-screen">
            <CreaterHeader />
            <main className="flex-1 grid grid-cols-2 w-full h-full gap-4">
                {/* Left Side */}
                <div className="rounded-xl p-4">
                    <Tabs defaultValue="Details" className="w-full">
                        <TabsList className="w-full justify-start bg-background border-b rounded-b-none">
                            <TabsTrigger value="Details">Details</TabsTrigger>
                            <TabsTrigger value="Problems">Problems</TabsTrigger>
                            <TabsTrigger value="Visibility">Visibility</TabsTrigger>
                        </TabsList>

                        {/* Details Tab */}
                        <TabsContent className="w-full py-8" value="Details">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-muted-foreground text-sm">
                                        Contest Name
                                    </label>
                                    <input
                                        type="text"
                                        value={contestDetails.name}
                                        onChange={(e) =>
                                            setContestDetails({
                                                ...contestDetails,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Weekly Contest 1"
                                        className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.name ? 'border border-red-500' : ''}`}
                                    />
                                    {validationErrors.contestDetails?.name && (
                                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                            <AlertCircle size={12} />
                                            {validationErrors.contestDetails.name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex flex-1 flex-col items-start gap-2">
                                        <label className="text-muted-foreground text-sm">
                                            Start Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={contestDetails.startTime}
                                            onChange={(e) =>
                                                setContestDetails({
                                                    ...contestDetails,
                                                    startTime: e.target.value,
                                                })
                                            }
                                            className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.startTime ? 'border border-red-500' : ''}`}
                                        />
                                        {validationErrors.contestDetails?.startTime && (
                                            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                <AlertCircle size={12} />
                                                {validationErrors.contestDetails.startTime}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex flex-col items-start gap-2">
                                        <label className="text-muted-foreground text-sm">
                                            Duration (in mins)
                                        </label>
                                        <input
                                            type="number"
                                            value={contestDetails.duration}
                                            onChange={(e) =>
                                                setContestDetails({
                                                    ...contestDetails,
                                                    duration: e.target.value,
                                                })
                                            }
                                            placeholder="60"
                                            className={`bg-input outline-none w-64 pl-10 text-sm rounded-md py-2 px-4 ${validationErrors.contestDetails?.duration ? 'border border-red-500' : ''}`}
                                        />
                                        <Timer className="size-5 text-muted-foreground absolute top-[55%] left-2" />
                                        {validationErrors.contestDetails?.duration && (
                                            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                <AlertCircle size={12} />
                                                {validationErrors.contestDetails.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-muted-foreground text-sm">
                                        Max Participants
                                    </label>
                                    <input
                                        type="number"
                                        value={contestDetails.maxParticipants}
                                        onChange={(e) =>
                                            setContestDetails({
                                                ...contestDetails,
                                                maxParticipants: e.target.value,
                                            })
                                        }
                                        placeholder="100"
                                        className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.maxParticipants ? 'border border-red-500' : ''}`}
                                    />
                                    {validationErrors.contestDetails?.maxParticipants && (
                                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                            <AlertCircle size={12} />
                                            {validationErrors.contestDetails.maxParticipants}
                                        </div>
                                    )}
                                </div>
                                {validationErrors.contestDetails?.problems && (
                                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} />
                                        {validationErrors.contestDetails.problems}
                                    </div>
                                )}
                                <Button
                                    onClick={() => validateContestDetails()}
                                    className="w-fit bg-accent ring/50 hover:ring-0 mt-8"
                                >
                                    Continue
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Problems Tab */}
                        <TabsContent className="w-full py-8" value="Problems">
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
                                            disabled
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
                                    <div className="flex flex-col items-start gap-2">
                                        <label className="text-muted-foreground text-sm">Points</label>
                                        <div className={`flex items-center gap-2 rounded-md py-2 px-4 bg-input ${validationErrors.newProblem?.points ? 'border border-red-500' : ''}`}>
                                            <PiMedalMilitaryBold className="size-5 text-primary" />
                                            <input
                                                type="number"
                                                value={newProblem.points}
                                                onChange={(e) =>
                                                    setNewProblem({ ...newProblem, points: e.target.value })
                                                }
                                                placeholder="0"
                                                className={`bg-input outline-none text-sm`}
                                            />

                                        </div>
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
                        </TabsContent>

                        {/* Visibility Tab */}
                        <TabsContent className="relative w-fit py-8 px-15" value="Visibility">
                            <div className="flex items-start justify-between">
                                <label className="text-foreground text-sm">Public</label>
                                <Switch
                                    checked={contestDetails.visibility}
                                    onClick={() =>
                                        setContestDetails({
                                            ...contestDetails,
                                            visibility: !contestDetails.visibility,
                                        })
                                    }
                                />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">
                                Public contests are visible to all users and can be accessed by{' '}
                                <span className="text-primary">anyone</span> with a link.
                            </p>
                            <Button
                                onClick={createContest}
                                className="w-fit bg-accent mt-8 absolute right-0"
                            >
                                Create Contest
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side - Live Preview */}
                <div className="h-[90%] mt-6 rounded-2xl border border-gray-700 bg-[#1a1a1a] p-6 text-white shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Contest Preview</h2>
                    <div className="space-y-2 text-sm">
                        <div className="bg-background w-full h-64 rounded-md border border-gray-600 flex flex-col p-4 text-gray-500">
                            <h1 className="text-lg text-white font-semibold mb-2">Details</h1>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">Name:</span>{' '}
                                    {contestDetails.name || ''}
                                </p>
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">
                                        Start Time:
                                    </span>{' '}
                                    {contestDetails.startTime || ''}
                                </p>
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">Duration:</span>{' '}
                                    {contestDetails.duration || 0} mins
                                </p>
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">
                                        Max Participants:
                                    </span>{' '}
                                    {contestDetails.maxParticipants || 0}
                                </p>
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">
                                        Number of Problems:
                                    </span>{' '}
                                    {contestDetails.problems.length || 0}
                                </p>
                                <p className="text-white">
                                    <span className="text-muted-foreground font-medium">
                                        Visibility:
                                    </span>{' '}
                                    {contestDetails.visibility ? 'Public' : 'Private'}
                                </p>
                            </div>
                        </div>
                        <h1 className="text-lg text-white font-semibold my-5">Problems</h1>
                        <ul className="list-disc">
                            {contestDetails.problems.map((p, index) => (
                                <li key={index}
                                    className="flex mb-2 items-center group bg-accent justify-between rounded-md py-2 px-4 gap-2"
                                >
                                    <p>{p.name}</p>
                                    <div className="flex items-center gap-12 justify-between">
                                        <div className="flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-200 opacity-0">
                                            <button
                                                className='bg-accent p-2 transition-all duration-300 hover:bg-background rounded text-white'
                                                onClick={() => {
                                                    // Switch to Problems tab
                                                    const problemsTab = document.querySelector('[value="Problems"]') as HTMLElement;
                                                    if (problemsTab) problemsTab.click();
                                                    // Start editing
                                                    startEditProblem(p);
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className='bg-accent p-2 transition-all duration-300 hover:bg-red-900/80 rounded'
                                                onClick={() => deleteProblem(p.lcid)}
                                            >
                                                <Trash2 size={16} color='red' />
                                            </button>
                                        </div>
                                        <a
                                            className="px-3 py-1 border border-gray-600 rounded-md"
                                            href={p.link}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Link
                                        </a>
                                        <span className="text-muted-foreground w-8">{p.difficulty}</span>
                                        <div className="flex items-center text-muted-foreground">
                                            <span className='mr-2'><PiMedalMilitaryBold /></span>
                                            <span className='w-6'>{p.points}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
