"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Problems from '@/components/tabs/Problems';
import Leaderboard from '@/components/tabs/Leaderboard';
import Header from '@/components/UserHeader';
import { getContestById, getContestProblemsWithDetails } from '@/actions/actionNeonDb';
import { useParams } from 'next/navigation';
import { Contest as ContestType, RecentSubmission } from '@/db/types';
import toast from 'react-hot-toast';
import { Clock, Users, Calendar, Trophy, AlertTriangle, CheckCircle2, Play, RotateCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getRecentSubmissions } from '@/actions/actionLeetQuery';
import {
    participateInContest,
    getContestLeaderboard,
    updateUserContestPoints,
    hasUserParticipatedInContest
} from '@/actions/actionLeaderboard';
import { updateContestStatus } from '@/actions/actionContestStatus';
import { authClient } from "@/lib/auth-client";
import { formatDateTime, getTimeDisplay } from '@/lib/utils';

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
    link?: string; // Link to the LeetCode problem
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
    const [ hasJoined, setHasJoined] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const { data: session } = authClient.useSession();
    const [timeRemaining, setTimeRemaining] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
        totalSeconds: number;
        percentComplete: number;
    }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        percentComplete: 0
    });

    // Check if user has participated in the contest
    useEffect(() => {
        const checkParticipation = async () => {
            if (contestId && session?.user?.id) {
                // First check localStorage for quick loading
                const hasJoinedKey = `contest_${contestId}_joined`;
                const savedHasJoined = safeLocalStorage.getItem(hasJoinedKey);

                if (savedHasJoined === 'true') {
                    setHasJoined(true);
                    return;
                }

                // If not in localStorage, check the database
                try {
                    const result = await hasUserParticipatedInContest(contestId, session.user.id);
                    if (result.success && result.hasParticipated) {
                        setHasJoined(true);
                        // Save to localStorage for future quick access
                        safeLocalStorage.setItem(hasJoinedKey, 'true');
                    }
                } catch (error) {
                    console.error('Error checking participation:', error);
                }
            }
        };

        checkParticipation();
    }, [contestId, session?.user?.id]);

    // Function to update participant count and add user to leaderboard
    const handleParticipate = useCallback(async () => {
        if (!contest || !session?.user?.id) return;

        try {
            // Show loading toast
            toast.loading('Joining contest...', { id: 'joining-contest' });

            // Call server action to update participant count and add user to leaderboard
            const result = await participateInContest(contestId, session.user.id);

            if (result.success) {
                // Update local state
                setHasJoined(true);

                // Save participation status to localStorage
                safeLocalStorage.setItem(`contest_${contestId}_joined`, 'true');

                // Update contest state with new participant count
                setContest(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        participants: prev.participants + 1
                    };
                });

                // Fetch updated leaderboard
                fetchLeaderboard();

                toast.success('You have joined the contest!', { id: 'joining-contest' });
            } else {
                // Type assertion to handle the error property
                const errorMessage = 'error' in result ? result.error : 'Failed to join the contest';
                toast.error(errorMessage!, { id: 'joining-contest' });
            }
        } catch (error) {
            toast.error('Failed to join the contest', { id: 'joining-contest' });
            console.error('Error joining contest:', error);
        }
    }, [contest, contestId, session?.user?.id]);

    // Timer effect to update remaining time
    useEffect(() => {
        if (!contest || contest.status !== 'Active' && contest.status !== 'Ongoing') return;

        const calculateTimeRemaining = () => {
            const startTime = new Date(contest.startTime).getTime();
            const durationMs = contest.duration * 60 * 1000; // Convert minutes to milliseconds
            const endTime = startTime + durationMs;
            const now = new Date().getTime();
            const distance = endTime - now;

            // Calculate total duration and elapsed time for progress bar
            const totalDuration = durationMs;
            const elapsedTime = now - startTime;
            const percentComplete = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));

            if (distance <= 0) {
                // Contest has ended
                setTimeRemaining({
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    totalSeconds: 0,
                    percentComplete: 100
                });
                return;
            }

            // Calculate hours, minutes, seconds
            const totalSeconds = Math.floor(distance / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTimeRemaining({
                hours,
                minutes,
                seconds,
                totalSeconds,
                percentComplete
            });
        };

        // Calculate immediately
        calculateTimeRemaining();

        // Update every second
        const timer = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(timer);
    }, [contest]);

    // Helper function to safely access localStorage
    const safeLocalStorage = {
        getItem: (key: string): string | null => {
            try {
                return localStorage.getItem(key);
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                return null;
            }
        },
        setItem: (key: string, value: string): void => {
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.error('Error writing to localStorage:', error);
            }
        }
    };

    // Load problem statuses from local storage when component mounts
    useEffect(() => {
        if (contestId && problems.length > 0) {
            const storageKey = `contest_${contestId}_problems`;
            const savedProblems = safeLocalStorage.getItem(storageKey);

            if (savedProblems) {
                try {
                    const parsedProblems = JSON.parse(savedProblems);

                    // Only update if we have the same number of problems
                    if (parsedProblems.length === problems.length) {
                        // Merge saved statuses with current problems
                        const updatedProblems = problems.map((problem, index) => ({
                            ...problem,
                            status: parsedProblems[index].status
                        }));

                        setProblems(updatedProblems);
                    }
                } catch (error) {
                    console.error('Error parsing saved problems:', error);
                }
            }
        }
    }, [contestId, problems.length]);

    // Save problem statuses to local storage whenever they change
    useEffect(() => {
        if (contestId && problems.length > 0) {
            const storageKey = `contest_${contestId}_problems`;
            safeLocalStorage.setItem(storageKey, JSON.stringify(problems));
        }
    }, [contestId, problems]);

    // Function to fetch leaderboard data
    const fetchLeaderboard = useCallback(async () => {
        if (!contestId) return;

        setLeaderboardLoading(true);
        try {
            const result = await getContestLeaderboard(contestId);
            if (result.success) {
                setLeaderboardData(result.data || []);
            } else {
                console.error('Error fetching leaderboard:', result.error);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLeaderboardLoading(false);
        }
    }, [contestId]);

    // Use useCallback to memoize the function and avoid dependency cycles
    const checkSubmission = useCallback(async () => {
        // Check if contest is running and user has participated
        if (!contest) {
            toast.error('Contest information not available');
            return;
        }

        if (contest.status !== 'Active' && contest.status !== 'Ongoing') {
            toast.error('Submissions can only be checked for active contests');
            return;
        }

        if (!hasJoined) {
            toast.error('You must participate in the contest to check submissions');
            return;
        }

        if (!session?.user?.id) {
            toast.error('You must be logged in to check submissions');
            return;
        }

        // Get the LeetCode username from localStorage or use a default
        const leetcodeUsername = localStorage.getItem('LeetcodeUsername') || '';
        console.log("LeetCode username for contest", leetcodeUsername);
        toast.promise(getRecentSubmissions(leetcodeUsername), {
            loading: 'Checking Submissions...',
            success: 'Submissions Checked',
            error: 'Failed to check submissions'
        }).then(async (res) => {
            console.log("Submissions", res);
            // Filter for accepted submissions
            const acceptedSubmissions = res.filter((submission: RecentSubmission) => {
                return submission.statusDisplay === 'Accepted';
            });
            console.log("Accepted Submissions", acceptedSubmissions);

            // Check if any of the accepted submissions match our contest problems
            if (acceptedSubmissions.length > 0 && problems.length > 0 && contest) {
                // Get contest start time
                const contestStartTime = new Date(contest.startTime).getTime();
                console.log("Contest start time:", new Date(contestStartTime).toISOString());

                // Create a new array of problems with updated status
                const updatedProblems = problems.map(problem => {
                    // Extract the slug from the problem link
                    const problemLink = problem.link || '';
                    const slugMatch = problemLink.match(/\/problems\/([^/]+)\//);
                    const problemSlug = slugMatch ? slugMatch[1] : '';
                    console.log(`Checking problem: ${problem.name}, slug: ${problemSlug}`);

                    // Check if this problem has been solved after contest started
                    const isSolved = acceptedSubmissions.some(submission => {
                        // Convert submission timestamp to milliseconds
                        const submissionTime = parseInt(submission.timestamp) * 1000;
                        const submissionDate = new Date(submissionTime).toISOString();

                        // Check if submission was after contest start
                        const isAfterContestStart = submissionTime >= contestStartTime;

                        // Check if the submission matches this problem's slug
                        const isMatch = submission.titleSlug === problemSlug;

                        if (isMatch) {
                            console.log(`Found matching submission for ${problemSlug}:`);
                            console.log(`  Submission time: ${submissionDate}`);
                            console.log(`  After contest start: ${isAfterContestStart}`);
                        }

                        return isAfterContestStart && isMatch;
                    });

                    console.log(`Problem ${problem.name} is solved: ${isSolved}`);

                    // Return updated problem with solved status if found
                    return {
                        ...problem,
                        status: isSolved ? 'solved' : problem.status
                    };
                });

                // Check if any problem status has changed
                const hasChanges = updatedProblems.some((problem, index) =>
                    problem.status !== problems[index].status
                );
                console.log("Problem statuses changed:", hasChanges);

                // Only update state if there are changes
                if (hasChanges) {
                    // Update the problems state with the new statuses
                    setProblems(updatedProblems);

                    // Update points in the database for newly solved problems
                    const newlySolvedProblems = updatedProblems.filter((problem, index) =>
                        problem.status === 'solved' && problems[index].status === 'unsolved'
                    );
                    console.log("Newly solved problems:", newlySolvedProblems.length);

                    // If there are newly solved problems, update points in the database
                    if (newlySolvedProblems.length > 0) {
                        for (const problem of newlySolvedProblems) {
                            // Extract problem ID from the link
                            const problemLink = problem.link || '';
                            const idMatch = problemLink.match(/\/problems\/([^/]+)\//);
                            const problemSlug = idMatch ? idMatch[1] : '';
                            console.log(`Updating points for problem: ${problem.name}, slug: ${problemSlug}`);

                            // Find the problem in the original data to get the actual ID
                            const originalProblemData = await getContestProblemsWithDetails(contestId);
                            if (originalProblemData?.success && originalProblemData.data) {
                                const matchedProblem = originalProblemData.data.find(
                                    (p: any) => p.problem?.slug === problemSlug
                                );

                                if (matchedProblem) {
                                    // Make sure we're passing a number for points
                                    const pointsValue = typeof problem.points === 'string'
                                        ? parseInt(problem.points)
                                        : problem.points;

                                    console.log(`Found matching problem in DB. ID: ${matchedProblem.problemId}, Points: ${pointsValue}`);

                                    // Update points in the database
                                    const updateResult = await updateUserContestPoints(
                                        contestId,
                                        session.user.id,
                                        matchedProblem.problemId,
                                        pointsValue
                                    );

                                    console.log("Points update result:", updateResult);
                                } else {
                                    console.error(`Could not find problem with slug ${problemSlug} in contest problems`);
                                }
                            } else {
                                console.error("Failed to fetch original problem data");
                            }
                        }

                        // Refresh the leaderboard after updating points
                        fetchLeaderboard();

                        // Show success message
                        toast.success(`You earned points for solving ${newlySolvedProblems.length} problem(s)!`);
                    }
                }
            }
        });
    }, [problems, contest, hasJoined, contestId, session?.user?.id, fetchLeaderboard]);

    // Fetch contest data
    useEffect(() => {
        if (!contestId) return;

        setLoading(true);

        // First update the contest status to ensure it's current
        updateContestStatus(contestId)
            .then(() => {
                // Then fetch contest details
                return getContestById(contestId);
            })
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
                        status: 'unsolved' as 'solved' | 'unsolved',
                        link: item.problem?.link || `https://leetcode.com/problems/${item.problem?.slug}/` // Add link to LeetCode
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

    // Check for solved problems only when component mounts
    useEffect(() => {
        // Only check submissions if:
        // 1. Problems are loaded
        // 2. We're not in a loading state
        // 3. Contest is active/ongoing
        // 4. User has joined the contest
        if (
            problems.length > 0 &&
            !loading &&
            contest &&
            (contest.status === 'Active' || contest.status === 'Ongoing') &&
            hasJoined
        ) {
            // Automatically check submissions when component mounts
            checkSubmission();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]); // Only depend on loading state to avoid infinite loops

    // Handle tab click
    const handleTabClick = (tab: TabData) => {
        setSelectedTab(tab);

        // If switching to leaderboard tab, fetch leaderboard data
        if (tab.id === 2) {
            fetchLeaderboard();
        }
    };

    // Fetch leaderboard when component mounts
    useEffect(() => {
        if (contestId && !loading) {
            fetchLeaderboard();
        }
    }, [contestId, loading, fetchLeaderboard]);

    // Function to get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
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
        switch (status) {
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

    // Format date for display using our utility function
    const formatDate = (date: Date) => {
        // Add debug=true to log date information to the console
        return formatDateTime(date, {
            weekday: 'short' // Add weekday to the default format
        }, true); // Enable debug mode to see what's happening with the dates
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
                                {(contest.status === 'Active') && (
                                    <Card className="bg-card p-4 rounded-xl shadow-md border border-border min-w-[300px]">
                                        <div className="text-center flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                                            <p className="text-2xl font-mono font-bold text-primary">
                                                {timeRemaining.hours.toString().padStart(2, '0')}:
                                                {timeRemaining.minutes.toString().padStart(2, '0')}:
                                                {timeRemaining.seconds.toString().padStart(2, '0')}
                                            </p>
                                        </div>
                                    </Card>
                                )}

                                {/* Participate Button - only for active contests */}
                                {!hasJoined && contest.status === 'Active' && (
                                    <Button
                                        onClick={handleParticipate}
                                        className="bg-primary hover:bg-primary/90 text-white font-medium"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Participate
                                    </Button>
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
                                        <div className="w-full">
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">{contest.duration} minutes</p>

                                            {/* Only show progress bar for active contests */}
                                            {(contest.status === 'Active' || contest.status === 'Ongoing') && (
                                                <div className="mt-2">
                                                    <Progress
                                                        value={timeRemaining.percentComplete}
                                                        className="h-2 bg-primary/10"
                                                    />
                                                </div>
                                            )}
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
                                contest.status === 'Not Started' || contest.status === 'upcoming' ? (
                                    // Show message if contest hasn't started yet
                                    <div className="text-center py-12 text-muted-foreground">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-medium">Contest hasn't started yet</h3>
                                        <p className="mt-2">Problems will be available once the contest begins.</p>
                                    </div>
                                ) : problems.length > 0 ? (
                                    // Show problems if contest has started and problems exist
                                    <div className="space-y-2">
                                        <div className='flex justify-between items-center'>
                                            <h2 className="text-xl font-semibold mb-4 text-foreground">Contest Problems</h2>
                                            <div
                                                className="p-2 rounded-full hover:bg-primary/10 cursor-pointer transition-colors duration-200"
                                                title="Check LeetCode submissions"
                                                onClick={checkSubmission}
                                            >
                                                <RotateCw size={20} className="text-primary" />
                                            </div>
                                        </div>
                                        <Problems problems={problems} />
                                    </div>
                                ) : (
                                    // Show message if no problems found
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
                                    {!hasJoined ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-medium">You must participate to view the leaderboard</h3>
                                            <p className="mt-2">Click the "Participate" button to join the contest and view the leaderboard.</p>
                                        </div>
                                    ) : (
                                        <Leaderboard
                                            entries={leaderboardData}
                                            loading={leaderboardLoading}
                                            currentUserId={session?.user?.id}
                                        />
                                    )}
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
