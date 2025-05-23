"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreaterHeader from '@/components/CreaterHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getContestById, updateContest } from '@/actions/actionNeonDb';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Users } from 'lucide-react';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

export default function EditContestPage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.contestId as string;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        duration: '',
        maxParticipants: '',
    });

    useEffect(() => {
        if (!contestId) return;

        // Fetch contest data
        const fetchContest = async () => {
            try {
                const response = await getContestById(contestId);
                if (response?.success && response.data) {
                    const contest = response.data;
                    // Format the date for the datetime-local input
                    const startTime = new Date(contest.startTime);
                    const formattedStartTime = startTime.toISOString().slice(0, 16);

                    setFormData({
                        name: contest.name,
                        startTime: formattedStartTime,
                        duration: contest.duration.toString(),
                        maxParticipants: contest.maxParticipants.toString(),
                    });
                } else {
                    toast.error('Failed to load contest');
                    router.push('/creater/dashboard');
                }
            } catch (error) {
                console.error('Error fetching contest:', error);
                toast.error('Failed to load contest');
                router.push('/creater/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [contestId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Validate form data
            if (!formData.name || !formData.startTime || !formData.duration || !formData.maxParticipants) {
                toast.error('Please fill all required fields');
                setSubmitting(false);
                return;
            }

            // Convert to appropriate types
            const updateData = {
                id: contestId,
                name: formData.name,
                startTime: new Date(formData.startTime),
                duration: parseInt(formData.duration),
                maxParticipants: parseInt(formData.maxParticipants),
            };

            // Update contest
            const response = await updateContest(updateData);
            if (response?.success) {
                toast.success('Contest updated successfully');
                router.push('/creater/dashboard');
            } else {
                toast.error(response?.error || 'Failed to update contest');
            }
        } catch (error) {
            console.error('Error updating contest:', error);
            toast.error('Failed to update contest');
        } finally {
            setSubmitting(false);
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
            <div className="flex justify-start items-center gap-8 mb-6 mt-6">
                <h1 className="text-4xl font-bold">Edit Contest</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Contest Details</CardTitle>
                    <CardDescription>Update your contest information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Contest Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter contest name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants">Maximum Participants</Label>
                            <Input
                                id="maxParticipants"
                                name="maxParticipants"
                                type="number"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.push('/creater/dashboard')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <div className="flex items-center">
                                        <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                        <span className="ml-2">Updating...</span>
                                    </div>
                                ) : 'Update Contest'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
