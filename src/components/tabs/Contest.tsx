"use client";
import React, { useState } from 'react';
import { Clock, Users, Award, Calendar } from 'lucide-react';
import Button from '../Button';
import Link from 'next/link';
interface Contest {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    participants: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Active' | 'Upcoming' | 'Ended';
}

function Contest() {
    const [activeTab, setActiveTab] = useState<'Active' | 'Upcoming' | 'Ended'>('Active');
    const contests: Contest[] = [
        {
            id: "c1",
            name: "Weekly Algorithm Challenge",
            startTime: "2025-04-20T10:00:00",
            endTime: "2025-04-23T10:00:00",
            participants: 358,
            difficulty: "Medium",
            status: "Active"
        },
        {
            id: "c2",
            name: "Data Structures Sprint",
            startTime: "2025-04-22T14:00:00",
            endTime: "2025-04-24T14:00:00",
            participants: 124,
            difficulty: "Easy",
            status: "Upcoming"
        },
        {
            id: "c3",
            name: "Frontend Masters Challenge",
            startTime: "2025-04-18T09:00:00",
            endTime: "2025-04-25T23:59:00",
            participants: 521,
            difficulty: "Hard",
            status: "Ended"
        }
    ];

    // Filter contests based on active tab
    const filteredContests = contests.filter(contest => contest.status === activeTab);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get time remaining for active contests
    const getTimeRemaining = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) return "Ended";

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        return `${hours}h ${minutes}m remaining`;
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Hard': return 'bg-red-500';
            default: return '';
        }
    };

    //get badge color
    const getBadgeColor = (status: 'Active' | 'Upcoming' | 'Ended') => {
        switch (status) {
            case 'Active': return 'bg-chart-4';
            case 'Upcoming': return 'bg-primary-alt';
            case 'Ended': return 'bg-chart-1';
            default: return '';
        }
    };

    return (
        <div className="mt-6">

            {/* Contest Cards */}
            <div className="space-y-4">
                {contests.map((contest) => (
                    <div key={contest.id} className="bg-card rounded-4xl p-6 ">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex gap-4 items-center mb-2">
                                    <h3 className="text-xl font-bold text-white">{contest.name}</h3>
                                    <div className={`text-background px-2 py-1 text-sm font-semibold rounded-full ${getBadgeColor(contest.status)}`}>{contest.status}</div>
                                </div>

                                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <div className='flex gap-4'>
                                            <div>Starts: {formatDate(contest.startTime)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{getTimeRemaining(contest.endTime)}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{contest.participants} participants</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {contest.status === "Active" && <Link href={`/contest/${contest.id}`}><Button>View</Button></Link>}
                                {contest.status === "Upcoming" && <Link href={`/contest/${contest.id}`}><Button>Register</Button></Link>}
                                {contest.status === "Ended" && <Button className="opacity-50">Ended</Button>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredContests.length === 0 && (
                <div className="text-center py-16">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No {activeTab.toLowerCase()} contests</h3>
                    <p className="text-gray-500 mt-1">Check back later for new contests</p>
                </div>
            )}
        </div>
    );
}

export default Contest;