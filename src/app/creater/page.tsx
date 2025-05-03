"use client";
import React, { useEffect, useState } from 'react';
import CreaterHeader from '@/components/CreaterHeader';
import { Button } from '@/components/ui/button';
import { MdAdd } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { getContest } from '@/actions/actionContest';
import { toast } from 'react-hot-toast';
import { Contest } from '@/db/types';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock3 } from "lucide-react";

function Page() {
    const router = useRouter();
    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        toast.promise(getContest(), {
            loading: 'Loading contests...',
            success: 'Contests loaded successfully',
            error: 'Failed to load contests'
        }).then(res => {
            const loadedContests = res?.data || [];
            setContests(loadedContests);
        });
    }, []);

    return (
        <div className="bg-background px-10 sm:px-16 pt-6">
            <CreaterHeader />
            <div className="flex justify-between items-center mb-6 mt-6">
                <h1 className="text-4xl font-bold">Contests</h1>
                <Button onClick={() => router.push('creater/create-contest')} className="flex items-center gap-2">
                    <MdAdd fontWeight="bold" className="text-lg" />
                    Create Contest
                </Button>
            </div>

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
                                <Badge variant="outline" className={`text-sm border px-2 ${c.status === 'Not Started' ? 'text-yellow-600 border-yellow-600' : c.status === 'Ongoing' ? 'text-green-600 border-green-600' : 'text-zinc-500 border-zinc-500'}`}>
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
                                <Button variant="outline" className="text-sm">
                                    View Submissions
                                </Button>
                                <Button variant="outline" className="text-sm">
                                    Manage Participants
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Page;
