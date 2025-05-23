"use client";
import React, { useEffect, useState } from 'react';
import { Clock, Users, Award, Calendar } from 'lucide-react';
import Button from '../Button';
import Link from 'next/link';
import { getContest } from '@/actions/actionNeonDb';
import { formatDateTime, getTimeDisplay } from '@/lib/utils';
interface Contest {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    participants: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Not Started' | 'Active' | 'Ended';
}

function Contest() {
    const [activeTab] = useState<'Active' | 'Upcoming' | 'Ended'>('Active');
    const [contests, setContests] = useState<Contest[]>([]);
    useEffect(() => {
        getContest().then(res => {
            if (res?.success) {
                setContests(res.data?.map(contest => {
                    try {
                        // Ensure startTime is a valid Date object
                        const startTime = new Date(contest.startTime);

                        // Calculate endTime based on startTime and duration
                        const endTime = new Date(startTime.getTime() + contest.duration * 60000);

                        // Check if dates are valid
                        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                            console.error("Invalid date calculation for contest:", contest.id);
                        }

                        // Ensure status is one of the allowed values
                        let status: 'Not Started' | 'Active' | 'Ended';
                        if (contest.status === 'Not Started') {
                            status = 'Not Started';
                        } else if (contest.status === 'Active') {
                            status = 'Active';
                        } else {
                            status = 'Ended';
                        }

                        return {
                            id: contest.id,
                            name: contest.name,
                            startTime: startTime.toISOString(),
                            endTime: endTime.toISOString(),
                            participants: contest.participants,
                            difficulty: 'Medium', // Default since it's not in the DB schema
                            status: status
                        };
                    } catch (error) {
                        console.error("Error processing contest data:", error, contest);
                        // Return a fallback object with safe values
                        // Ensure status is one of the allowed values
                        let safeStatus: 'Not Started' | 'Active' | 'Ended' = 'Active';
                        if (contest.status === 'Not Started' || contest.status === 'Active' || contest.status === 'Ended') {
                            safeStatus = contest.status as 'Not Started' | 'Active' | 'Ended';
                        }

                        return {
                            id: contest.id || 'unknown',
                            name: contest.name || 'Unknown Contest',
                            startTime: new Date().toISOString(),
                            endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now as fallback
                            participants: contest.participants || 0,
                            difficulty: 'Medium',
                            status: safeStatus
                        };
                    }
                }) || []);
            }
        }).catch(error => {
            console.error("Failed to fetch contests:", error);
        });
    }, []);

    // Filter contests based on active tab
    const filteredContests = contests.filter(contest => contest.status === activeTab);

    // Format date for display using our utility function
    const formatDate = (dateString: string) => {
        return formatDateTime(dateString);
    };

    // Get time remaining for contests using our utility function
    const getTimeRemaining = (contest: Contest) => {
        try {
            const startTime = new Date(contest.startTime);
            const endTime = new Date(contest.endTime);
            const now = new Date();

            // If contest hasn't started yet, show time until start
            if (now < startTime) {
                // Enable debug to see what's happening with the dates
                return getTimeDisplay(startTime, now, true);
            }

            // If contest is active, show time until end
            if (now >= startTime && now < endTime) {
                // Enable debug to see what's happening with the dates
                const timeLeft = getTimeDisplay(endTime, now, true);
                // Replace "Starts in" with "remaining" for active contests
                return timeLeft.replace("Starts in", "") + " remaining";
            }

            // If contest has ended
            return "Ended";
        } catch (error) {
            console.error("Error calculating time remaining:", error);
            return "Time unavailable";
        }
    };



    //get badge color
    const getBadgeColor = (status: 'Not Started' | 'Active' | 'Ended') => {
        switch (status) {
            case 'Not Started': return 'bg-chart-4';
            case 'Active': return 'bg-primary-alt';
            case 'Ended': return 'bg-chart-1';
            default: return '';
        }
    };

    return (
        <div className="mt-6">
            {contests.length === 0 ? (
                // Show when there are no contests at all
                <div className="text-center py-16">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No contests available</h3>
                    <p className="text-gray-500 mt-1">There are currently no contests. Check back later!</p>
                </div>
            ) : (
                <>
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
                                                <span>{getTimeRemaining(contest)}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{contest.participants} participants</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {contest.status === "Active" && <Link href={`/contest/${contest.id}`}><Button>View</Button></Link>}
                                        {contest.status === "Not Started" && <Button className="opacity-50">Coming Soon</Button>}
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
                </>
            )}
        </div>
    );
}

export default Contest;
