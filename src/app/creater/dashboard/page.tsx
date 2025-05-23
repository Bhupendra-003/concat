"use client";
import React, { useEffect, useState } from 'react';
import CreaterHeader from '@/components/CreaterHeader';
import { Button } from '@/components/ui/button';
import { MdAdd } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { getContest, deleteContest } from '@/actions/actionNeonDb';
import { toast } from 'react-hot-toast';
import { Contest } from '@/db/types';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock3, EllipsisVertical, Trash2, Award } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


function Page() {
    const router = useRouter();
    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        toast.promise(getContest(), {
            loading: 'Loading contests...',
            success: 'Contests loaded successfully',
            error: 'Failed to load contests'
        }, {id: 'contestList'}).then(res => {
            if (res?.success && res.data) {
                // Ensure the status is one of the allowed values
                const processedContests = res.data.map(contest => {
                    let validStatus: 'Not Started' | 'Active' | 'Ended' | 'upcoming' | 'Ongoing';

                    // Map the status to one of the allowed values
                    if (contest.status === 'Not Started' || contest.status === 'Active' ||
                        contest.status === 'Ended' || contest.status === 'upcoming' ||
                        contest.status === 'Ongoing') {
                        validStatus = contest.status as 'Not Started' | 'Active' | 'Ended' | 'upcoming' | 'Ongoing';
                    } else {
                        // Default to 'Not Started' if status is not recognized
                        validStatus = 'Not Started';
                    }

                    return {
                        ...contest,
                        status: validStatus
                    };
                });

                setContests(processedContests);
            } else {
                setContests([]);
            }
        });
    }, []);

    const handleDeleteContest = (contestId: string) => {
        console.log('Deleting contest...', contestId);
        toast.promise(deleteContest(contestId), {
            loading: 'Deleting contest...',
            success: 'Contest deleted successfully',
            error: 'Failed to delete contest'
        }).then(res => {
            if (res?.success) {
                const updatedContests = contests.filter(c => c.id !== contestId);
                setContests(updatedContests);
            }
        });
    };

    return (
        <div className="bg-background px-10 sm:px-16 pt-6">
            <CreaterHeader />
            <div className="flex justify-start items-center gap-8 mb-6 mt-6">
                <h1 className="text-4xl font-bold">Contests</h1>
                <Button onClick={() => router.push('/creater/create-contest')} className="flex ring-1 ring-white font-mono bg-transparent text-white hover:bg-white/10 items-center gap-2">
                    <MdAdd fontWeight="bold" className="text-lg" />
                    Create new Contest
                </Button>
            </div>

            {contests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                        <MdAdd className="text-4xl text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No Contests Yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        You haven't created any contests yet. Get started by creating your first contest.
                    </p>
                    <Button
                        onClick={() => router.push('/creater/create-contest')}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                        <MdAdd className="text-lg" />
                        Create Your First Contest
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map(c => (
                        <Card key={c.id} className="w-full p-6 shadow-xl rounded-2xl bg-popover">
                            <div className="flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
                                            {c.name}
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Contest ID: {c.id}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`text-sm border px-2 ${
                                        c.status === 'Not Started' || c.status === 'upcoming' ? 'text-yellow-600 border-yellow-600' :
                                        c.status === 'Active' || c.status === 'Ongoing' ? 'text-green-600 border-green-600' :
                                        'text-zinc-500 border-zinc-500'
                                    }`}>
                                        {c.status}
                                    </Badge>
                                </div>

                                {/* Time Info */}
                                <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} /> Start: {new Date(c.startTime).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={16} /> Duration: {c.duration} min
                                    </div>
                                </div>

                                {/* Content Summary */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-zinc-500 dark:text-zinc-400">Questions</p>
                                        <p className="font-medium text-zinc-800 dark:text-white">{c.questions}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 dark:text-zinc-400">Visibility</p>
                                        <p className="font-medium text-zinc-800 dark:text-white">{'Public'}</p>
                                    </div>
                                </div>

                                {/* Performance Overview */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-zinc-500 dark:text-zinc-400">Participants</p>
                                        <p className="font-semibold text-zinc-800 dark:text-white">{c.participants}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 dark:text-zinc-400">Created</p>
                                        <p className="font-semibold text-zinc-800 dark:text-white">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.push(`/creater/view-submissions/${c.id}`)}
                                    >
                                        View Submissions
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.push(`/creater/manage-participants/${c.id}`)}
                                    >
                                        Manage Participants
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.push(`/creater/edit-contest/${c.id}`)}
                                    >
                                        Edit Contest
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="text-sm">
                                                <EllipsisVertical />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-fit p-2 mt-7">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-2 text-sm text-red-500 cursor-pointer hover:text-red-600">
                                                        <Trash2 size={16} />
                                                        <span>Delete Contest</span>
                                                    </div>
                                                </DialogTrigger>

                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot be undone. This will permanently delete the contest and remove contest data from our servers.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose onClick={() => handleDeleteContest(c.id)} className="text-red-500 px-2">Delete</DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Page;


