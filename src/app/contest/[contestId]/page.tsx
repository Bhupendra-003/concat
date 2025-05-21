"use client";
import React, { useState, useEffect } from 'react';
import Problems from '@/components/tabs/Problems';
import Header from '@/components/UserHeader';
import { getContestById, getContestProblemsWithDetails } from '@/actions/actionNeonDb';
import { useParams } from 'next/navigation';
import { Contest as ContestType } from '@/db/types';
import toast from 'react-hot-toast';
import { Clock, Users, Calendar, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TabData {
    id: number;
    label: string;
    width: string;
}

interface ProblemDisplay {
    id: number; // Changed from string to number to match Problems component
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    status: 'solved' | 'unsolved';
}

function Page() {
    const params = useParams();
    const contestId = params.contestId as string;

    const tabs: TabData[] = [
        { id: 1, label: "Problems", width: "w-8" },
        { id: 2, label: "Contest Leaderboard", width: "w-16" },
    ];

    const [selectedTab, setSelectedTab] = useState<TabData>(tabs[0]);
    const [contest, setContest] = useState<ContestType | null>(null);
    const [problems, setProblems] = useState<ProblemDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch contest data
    useEffect(() => {
        if (!contestId) return;

        setLoading(true);

        // Fetch contest details
        getContestById(contestId)
            .then(res => {
                if (res?.success && res.data) {
                    // Ensure the status is one of the allowed values in the Contest type
                    const contestData = res.data;
                    let validStatus: 'Not Started' | 'Active' | 'Ended' | 'upcoming' | 'Ongoing';

                    // Map the status to one of the allowed values
                    if (contestData.status === 'Not Started' || contestData.status === 'Active' ||
                        contestData.status === 'Ended' || contestData.status === 'upcoming' ||
                        contestData.status === 'Ongoing') {
                        validStatus = contestData.status as 'Not Started' | 'Active' | 'Ended' | 'upcoming' | 'Ongoing';
                    } else {
                        // Default to 'Not Started' if status is not recognized
                        validStatus = 'Not Started';
                    }

                    // Set the contest with the validated status
                    setContest({
                        ...contestData,
                        status: validStatus
                    });

                    // After getting contest, fetch its problems with details
                    return getContestProblemsWithDetails(contestId);
                } else {
                    toast.error('Contest not found');
                    throw new Error('Contest not found');
                }
            })
            .then(res => {
                if (res?.success && res.data) {
                    // Transform the data for display with actual problem details
                    const problemsDisplay = res.data.map((item: any, index: number) => ({
                        // Use index + 1 as a numeric ID since the Problems component expects a number
                        id: index + 1,
                        name: item.problem?.name || "Unknown Problem",
                        difficulty: (item.problem?.difficulty || "Medium") as 'Easy' | 'Medium' | 'Hard',
                        points: item.points,
                        status: 'unsolved' as 'solved' | 'unsolved'
                    }));

                    setProblems(problemsDisplay);
                }
            })
            .catch(error => {
                console.error('Error fetching contest data:', error);
                toast.error('Failed to load contest data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [contestId]);

    // Handle tab click
    const handleTabClick = (tab: TabData) => {
        setSelectedTab(tab);
    };

    // Function to get status badge color
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active':
            case 'Ongoing':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Not Started':
            case 'upcoming':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Ended':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    // Function to get status icon
    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Active':
            case 'Ongoing':
                return <Clock className="w-4 h-4 mr-1" />;
            case 'Not Started':
            case 'upcoming':
                return <AlertTriangle className="w-4 h-4 mr-1" />;
            case 'Ended':
                return <CheckCircle2 className="w-4 h-4 mr-1" />;
            default:
                return <AlertTriangle className="w-4 h-4 mr-1" />;
        }
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='min-h-screen bg-background'>
            <Header />
            <main className='container mx-auto px-4 py-8'>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading contest data...</p>
                        </div>
                    </div>
                ) : contest ? (
                    <>
                        {/* Contest Header */}
                        <div className="mb-8">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-foreground">{contest.name}</h1>
                                    <div className="flex items-center mt-2">
                                        <Badge className={`px-3 py-1 ${getStatusColor(contest.status)} flex items-center`}>
                                            {getStatusIcon(contest.status)}
                                            {contest.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Contest Timer */}
                                {(contest.status === 'Active' || contest.status === 'Ongoing') && (
                                    <Card className="bg-card p-4 rounded-xl shadow-md border border-border">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                                            <p className="text-2xl font-mono font-bold text-primary">
                                                {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {/* Contest Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card className="bg-card p-4 rounded-xl shadow-md border border-border">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Start Time</p>
                                            <p className="font-medium text-foreground">{formatDate(contest.startTime)}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="bg-card p-4 rounded-xl shadow-md border border-border">
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">{contest.duration} minutes</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="bg-card p-4 rounded-xl shadow-md border border-border">
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Participants</p>
                                            <p className="font-medium text-foreground">{contest.participants} / {contest.maxParticipants}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="mb-6">
                            <div className="flex space-x-1 bg-card p-1 rounded-lg border border-border">
                                {tabs.map((tab) => (
                                    <Button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab)}
                                        variant={selectedTab.id === tab.id ? "default" : "ghost"}
                                        className={`flex-1 rounded-md ${selectedTab.id === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {tab.id === 1 ? (
                                            <div className="flex items-center">
                                                <span className="mr-2">📝</span> {tab.label}
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Trophy className="w-4 h-4 mr-2" /> {tab.label}
                                            </div>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <Card className="bg-card rounded-xl shadow-md border border-border p-6">
                            {selectedTab.id === 1 && (
                                problems.length > 0 ? (
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold mb-4 text-foreground">Contest Problems</h2>
                                        <Problems problems={problems} />
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-medium">No problems found for this contest</h3>
                                        <p className="mt-2">The contest organizer hasn't added any problems yet.</p>
                                    </div>
                                )
                            )}
                            {selectedTab.id === 2 && (
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold mb-4 text-foreground">Contest Leaderboard</h2>
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-medium">Leaderboard Coming Soon</h3>
                                        <p className="mt-2">The leaderboard will be available once participants start submitting solutions.</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </>
                ) : (
                    <Card className="bg-card rounded-xl shadow-md border border-border p-8 max-w-lg mx-auto">
                        <div className="text-center">
                            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                            <h2 className="text-2xl font-bold mb-2 text-foreground">Contest Not Found</h2>
                            <p className="text-muted-foreground mb-6">The contest you're looking for doesn't exist or has been removed.</p>
                            <Button onClick={() => window.history.back()} variant="outline" className="mx-auto">
                                Go Back
                            </Button>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
}

export default Page;