"use client"
import React, { useEffect, useState } from 'react'
import CreaterHeader from '@/components/CreaterHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Pencil, PenOff, Timer, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { PiMedalMilitaryBold } from "react-icons/pi"
import { getQuestion } from '@/actions/actionLeetQuery'
import toast from 'react-hot-toast'
import Link from 'next/link'

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

export default function Page() {
    const [errors, setErrors] = useState<string[]>([])
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

    const addProblem = () => {
        if (!newProblem.name || !newProblem.link || !newProblem.points || !newProblem.difficulty || !newProblem.slug || newProblem.lcid === -1) {
            throw new Error("Please provide all details of problem")
        } else {
            console.info("adding new problem to Contest Details")
            console.log(newProblem)
            setContestDetails((prev) => ({
                ...prev,
                problems: [...prev.problems, newProblem],
            }))
            setNewProblem({ name: '', link: '', points: '', difficulty: '', slug: '', lcid: -1 })
        }
    }

    const fetchProblem = async () => {
        if (!newProblem.name) {
            console.log("Please provide name of problem")
            return;
        }
        try {
            toast.promise(getQuestion(newProblem.name), {
                loading: 'Getting Problem from Leetcode',
                success: 'Done',
            }).then((problem) => {
                setNewProblem({
                    ...newProblem,
                    difficulty: problem?.difficulty || 'Unknown',
                    slug: problem?.titleSlug || '',
                    name: problem?.title || '',
                    lcid: problem?.questionId ? parseInt(problem?.questionId) : -1,
                    link: `https://leetcode.com/problems/${problem?.titleSlug}/description/`
                })
            }).catch((error) => {
                toast.error(error.message)
            })
        } catch (error) {
            console.error('Error fetching problem difficulty:', error)
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
                                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                                    />
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
                                            className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                                        />
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
                                            className="bg-input outline-none w-64 pl-10 text-sm rounded-md py-2 px-4"
                                        />
                                        <Timer className="size-5 text-muted-foreground absolute top-[55%] left-2" />
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
                                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                                    />
                                </div>
                                <Button disabled className="w-fit bg-accent ring/50 hover:ring-0 mt-8">
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
                                        className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
                                    />
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
                                            className="bg-input outline-none text-sm rounded-md py-2 px-4 w-full"
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
                                            className="bg-input outline-none text-sm rounded-md py-2 px-4 w-64 pl-10"
                                        />
                                        <PiMedalMilitaryBold className="absolute left-2 top-[55%] size-5 text-primary" />
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
                                    >
                                        Get from Leetcode
                                    </Button>
                                    <Button
                                        className="w-fit mt-4 bg-accent hover:bg-accent/80 text-white"
                                        onClick={addProblem}
                                    >
                                        <span className="mr-2 text-lg">+</span> Add Problem
                                    </Button>
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
                            <Button className="w-fit bg-accent mt-8 absolute right-0">
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
                                    className="flex  mb-2 items-center group bg-accent justify-between rounded-md py-2 px-4 gap-2"
                                >
                                    <p>{p.name}</p>
                                    <div className="flex items-center gap-12 justify-between">
                                        <div className="flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-200 opacity-0">
                                            <button className='bg-accent p-2 transition-all duration-300 hover:bg-background rounded text-white'><Pencil size={16} /></button>
                                            <button className='bg-accent p-2 transition-all duration-300 hover:bg-red-900/80 rounded'><Trash2 size={16} color='red' /></button>
                                        </div>
                                        <a
                                            className=" px-3 py-1 border border-gray-600 rounded-md"
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
