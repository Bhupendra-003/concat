"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreaterHeader from '@/components/CreaterHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestById, getContestSubmissions } from '@/actions/actionNeonDb';
import { toast } from 'react-hot-toast';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

interface Submission {
    userId: string;
    userName: string;
    userImage: string | null;
    problemId: string;
    problemName: string;
    problemDifficulty: string;
    pointsEarned: number;
    timeTakenSeconds: number;
    submittedAt: string;
}

export default function ViewSubmissionsPage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.contestId as string;
    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState<any>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!contestId) return;

        const fetchData = async () => {
            try {
                // Fetch contest data
                const contestResponse = await getContestById(contestId);
                if (contestResponse?.success && contestResponse.data) {
                    setContest(contestResponse.data);
                } else {
                    toast.error('Failed to load contest');
                    router.push('/creater/dashboard');
                    return;
                }

                // Fetch submissions
                const submissionsResponse = await getContestSubmissions(contestId);
                if (submissionsResponse?.success && submissionsResponse.data) {
                    setSubmissions(submissionsResponse.data);
                    setFilteredSubmissions(submissionsResponse.data);
                } else {
                    toast.error('Failed to load submissions');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
                router.push('/creater/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contestId, router]);

    useEffect(() => {
        // Filter submissions based on search query and active tab
        let filtered = submissions;
        
        // Apply tab filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(s => {
                if (activeTab === 'easy') return s.problemDifficulty.toLowerCase() === 'easy';
                if (activeTab === 'medium') return s.problemDifficulty.toLowerCase() === 'medium';
                if (activeTab === 'hard') return s.problemDifficulty.toLowerCase() === 'hard';
                return true;
            });
        }
        
        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                s => 
                    s.userName.toLowerCase().includes(query) || 
                    s.problemName.toLowerCase().includes(query)
            );
        }
        
        setFilteredSubmissions(filtered);
    }, [searchQuery, activeTab, submissions]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (loading) {
        return (
            <div className="bg-background min-h-screen px-10 sm:px-16 pt-6">
                <CreaterHeader />
                <div className="flex justify-center items-center h-[70vh]">
                    <Ring2 size="60" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="var(--primary)" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen px-10 sm:px-16 pt-6">
            <CreaterHeader />
            <div className="flex justify-between items-center mb-6 mt-6">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push('/creater/dashboard')}
                        className="mr-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold">Contest Submissions</h1>
                </div>
                <div className="text-sm text-muted-foreground">
                    Contest: <span className="font-medium text-foreground">{contest?.name}</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submissions ({submissions.length})</CardTitle>
                    <CardDescription>
                        View all submissions for this contest
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by user or problem"
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="easy">Easy</TabsTrigger>
                                <TabsTrigger value="medium">Medium</TabsTrigger>
                                <TabsTrigger value="hard">Hard</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {filteredSubmissions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No submissions found</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Problem</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Points</TableHead>
                                        <TableHead>Time Taken</TableHead>
                                        <TableHead>Submitted</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubmissions.map((submission, index) => (
                                        <TableRow key={`${submission.userId}-${submission.problemId}-${index}`}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                                                        {submission.userImage ? (
                                                            <img 
                                                                src={submission.userImage} 
                                                                alt={submission.userName} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{submission.userName.charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div className="font-medium">{submission.userName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{submission.problemName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    submission.problemDifficulty.toLowerCase() === 'easy' ? 'text-green-600 border-green-600' :
                                                    submission.problemDifficulty.toLowerCase() === 'medium' ? 'text-yellow-600 border-yellow-600' :
                                                    'text-red-600 border-red-600'
                                                }>
                                                    {submission.problemDifficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{submission.pointsEarned}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    {formatTime(submission.timeTakenSeconds)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
