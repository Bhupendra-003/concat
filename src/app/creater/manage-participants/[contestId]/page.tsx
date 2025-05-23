"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreaterHeader from '@/components/CreaterHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestById, getContestParticipants, removeParticipant } from '@/actions/actionNeonDb';
import { toast } from 'react-hot-toast';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Input } from '@/components/ui/input';
import { Search, UserX, ArrowLeft } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Participant {
    userId: string;
    name: string;
    email: string;
    username: string;
    image: string | null;
    joinedAt: string;
    totalPoints: number;
    rank: number;
}

export default function ManageParticipantsPage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.contestId as string;
    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState<any>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [removingUser, setRemovingUser] = useState<string | null>(null);

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

                // Fetch participants
                const participantsResponse = await getContestParticipants(contestId);
                if (participantsResponse?.success && participantsResponse.data) {
                    setParticipants(participantsResponse.data);
                    setFilteredParticipants(participantsResponse.data);
                } else {
                    toast.error('Failed to load participants');
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
        // Filter participants based on search query
        if (searchQuery.trim() === '') {
            setFilteredParticipants(participants);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = participants.filter(
                p => 
                    p.name.toLowerCase().includes(query) || 
                    p.email.toLowerCase().includes(query) ||
                    p.username.toLowerCase().includes(query)
            );
            setFilteredParticipants(filtered);
        }
    }, [searchQuery, participants]);

    const handleRemoveParticipant = async (userId: string) => {
        setRemovingUser(userId);
        try {
            const response = await removeParticipant(contestId, userId);
            if (response?.success) {
                toast.success('Participant removed successfully');
                // Update the participants list
                setParticipants(prev => prev.filter(p => p.userId !== userId));
            } else {
                toast.error(response?.error || 'Failed to remove participant');
            }
        } catch (error) {
            console.error('Error removing participant:', error);
            toast.error('Failed to remove participant');
        } finally {
            setRemovingUser(null);
        }
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
                    <h1 className="text-3xl font-bold">Manage Participants</h1>
                </div>
                <div className="text-sm text-muted-foreground">
                    Contest: <span className="font-medium text-foreground">{contest?.name}</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Participants ({participants.length})</CardTitle>
                    <CardDescription>
                        View and manage participants for this contest
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by name, email, or username"
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredParticipants.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No participants found</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Points</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParticipants.map((participant) => (
                                        <TableRow key={participant.userId}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                                                        {participant.image ? (
                                                            <img 
                                                                src={participant.image} 
                                                                alt={participant.name} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{participant.name.charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{participant.name}</div>
                                                        <div className="text-xs text-muted-foreground">{participant.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{participant.username || 'N/A'}</TableCell>
                                            <TableCell>{participant.rank || 'N/A'}</TableCell>
                                            <TableCell>{participant.totalPoints}</TableCell>
                                            <TableCell>{new Date(participant.joinedAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                                            <UserX className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Remove Participant</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to remove {participant.name} from this contest? 
                                                                This will delete all their progress and submissions for this contest.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button 
                                                                variant="destructive" 
                                                                onClick={() => handleRemoveParticipant(participant.userId)}
                                                                disabled={removingUser === participant.userId}
                                                            >
                                                                {removingUser === participant.userId ? (
                                                                    <div className="flex items-center">
                                                                        <Ring2 size="16" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                                                        <span className="ml-2">Removing...</span>
                                                                    </div>
                                                                ) : 'Remove'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
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
