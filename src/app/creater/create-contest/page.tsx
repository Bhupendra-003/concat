"use client"
import React, { useEffect, useState } from 'react'
import CreaterHeader from '@/components/CreaterHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from 'react-hot-toast'
import {
    ContestDetailsForm,
    ProblemForm,
    VisibilitySettings,
    ContestPreview
} from './components'
import {
    ContestDetails,
    Problem,
    ValidationErrors,
    validateContestDetails,
    validateNewProblem
} from './validation'
import { addContestToDB, addProblemToContestJunctionTable } from '@/actions/actionNeonDb'
import { addProblemToDB } from '@/actions/actionNeonDb'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter();
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

    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editingProblemId, setEditingProblemId] = useState<number>(-1);

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
            const isValid = await validateNewProblem(newProblem, setValidationErrors);
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
            const isValid = await validateNewProblem(newProblem, setValidationErrors);
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
    const handleCreateContest = async () => {
        try {
            // 1. Add problems (toast-tracked)
            const problemRes = await addProblemToDB(contestDetails.problems);
            if (!problemRes?.success) {
                throw new Error("Failed to add problems");
            } else {
                //2. Add contest
                const contestRes = await addContestToDB(contestDetails);
                if (!contestRes?.success) {
                    throw new Error(contestRes?.error);
                }else{
                    // Add problem in and contest in junction table
                    console.info("adding problem in and contest in junction table");
                    console.log("contestRes",contestRes?.res?.[0].id);
                    console.log("problemRes",problemRes?.res?.[0].id);

                    const formatted = contestDetails.problems.map((problem: any, index: number) => ({
                        contestId: contestRes?.res?.[0].id,
                        problemId: problemRes?.res?.[index].id,
                        points: problem.points,
                    }));
                    const problemJunctionRes = await addProblemToContestJunctionTable(formatted);
                    if (!problemJunctionRes?.success) {
                        throw new Error("Failed to add problem to contest junction table");
                    }
                }
            }

        } catch (err: any) {
            console.error("Unexpected error in contest creation:", err);
            throw new Error(err);
        }
    };


    const handleSubmit = async () => {
        try {
            const isValid = await validateContestDetails(contestDetails, setValidationErrors);
            if (!isValid) {
                toast.error("Please fix all validation errors");
                return;
            }

            console.log("Contest details:", contestDetails);

            toast.promise(
                // 👇 wrap the call in an async function to delay execution
                (async () => await handleCreateContest())(),
                {
                    loading: 'Creating contest...',
                    success: 'Contest created successfully',
                    error: (err) => (`${err.message.split(":")[1]}`),
                }
            );
            router.push('/creater/dashboard');
            localStorage.removeItem('contestDetails');
            setContestDetails({
                name: '',
                startTime: '',
                duration: '',
                maxParticipants: '',
                problems: [],
                visibility: true
            });
            // setValidationErrors({});

        } catch (error: any) {
            toast.error(error.message);
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
                            <ContestDetailsForm
                                contestDetails={contestDetails}
                                setContestDetails={setContestDetails}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                            />
                        </TabsContent>

                        {/* Problems Tab */}
                        <TabsContent className="w-full py-8" value="Problems">
                            <ProblemForm
                                newProblem={newProblem}
                                setNewProblem={setNewProblem}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                                addProblem={addProblem}
                                updateProblem={updateProblem}
                                cancelEdit={cancelEdit}
                                editMode={editMode}
                                contestProblems={contestDetails.problems}
                            />
                        </TabsContent>

                        {/* Visibility Tab */}
                        <TabsContent className="relative w-fit py-8 px-15" value="Visibility">
                            <VisibilitySettings
                                contestDetails={contestDetails}
                                setContestDetails={setContestDetails}
                                handleSubmit={handleSubmit}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side - Live Preview */}
                <ContestPreview
                    contestDetails={contestDetails}
                    onEditProblem={startEditProblem}
                    onDeleteProblem={deleteProblem}
                    handleSubmit={handleSubmit}
                />
            </main>
        </div>
    )
}
