"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Header from '@/components/UserHeader';
import Loading from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Save } from 'lucide-react';
import { updateUserProfile } from '@/actions/actionUpdateUser';
import { Ring2 } from 'ldrs/react';
import { toast } from 'react-hot-toast';
import { getUserLeetCodeUsername } from '@/actions/actionNeonDb';
import { getLeetCodeUserProfile } from '@/actions/actionLeetQuery';

interface FormData {
    name: string;
    image: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        image: '',
    });
    const [leetcodeUsername, setLeetcodeUsername] = useState<string>('');
    const [leetcodeProfile, setLeetcodeProfile] = useState<any>(null);
    const [fetchingLeetcode, setFetchingLeetcode] = useState(false);

    useEffect(() => {
        if (!isPending) {
            if (!session?.user) {
                // Redirect to auth page if not logged in
                router.push('/auth');
            } else {
                // Initialize form with user data
                setFormData({
                    name: session.user.name || '',
                    image: session.user.image || '',
                });
                setLoading(false);

                // Try to get LeetCode username from localStorage
                const storedUsername = localStorage.getItem('LeetcodeUsername');
                if (storedUsername) {
                    setLeetcodeUsername(storedUsername);
                    fetchLeetCodeProfile(storedUsername);
                } else {
                    // Try to get from database
                    fetchLeetCodeUsernameFromDB(session.user.email);
                }
            }
        }
    }, [session, isPending, router]);

    const fetchLeetCodeUsernameFromDB = async (email: string) => {
        try {
            const result = await getUserLeetCodeUsername(email);
            if (result.success && result.username) {
                setLeetcodeUsername(result.username);
                localStorage.setItem('LeetcodeUsername', result.username);
                fetchLeetCodeProfile(result.username);
            }
        } catch (error) {
            console.error("Error fetching LeetCode username:", error);
        }
    };

    const fetchLeetCodeProfile = async (username: string) => {
        setFetchingLeetcode(true);
        try {
            const profile = await getLeetCodeUserProfile(username);
            setLeetcodeProfile(profile);
            
            // If user has no image but LeetCode has one, suggest it
            if (!formData.image && profile.userAvatar) {
                setFormData(prev => ({
                    ...prev,
                    image: profile.userAvatar
                }));
            }
            
            // If user has no name but LeetCode has one, suggest it
            if ((!formData.name || formData.name === session?.user?.email?.split('@')[0]) && profile.realName) {
                setFormData(prev => ({
                    ...prev,
                    name: profile.realName
                }));
            }
        } catch (error) {
            console.error("Error fetching LeetCode profile:", error);
        } finally {
            setFetchingLeetcode(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        setSaving(true);
        try {
            const result = await updateUserProfile(session.user.id, {
                name: formData.name,
                image: formData.image,
            });

            if (result.success) {
                toast.success("Profile updated successfully");
                // Refresh the session to get updated user data
                await authClient.refreshSession();
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating your profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading || isPending) {
        return <Loading />;
    }

    return (
        <div className="px-24 pt-4">
            <Header />
            <main className="mt-8">
                <h1 className="text-4xl font-semibold mb-8">Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Settings Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your display name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Profile Image URL</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/your-image.jpg"
                                    />
                                    {formData.image && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                                                <img
                                                    src={formData.image}
                                                    alt="Profile preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">Preview</span>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" disabled={saving} className="w-full">
                                    {saving ? (
                                        <div className="flex items-center justify-center">
                                            <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                            <span className="ml-2">Saving...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* LeetCode Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>LeetCode Profile</CardTitle>
                            <CardDescription>Your linked LeetCode account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {fetchingLeetcode ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Ring2 size="40" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="var(--primary)" />
                                    <p className="mt-4 text-muted-foreground">Loading LeetCode profile...</p>
                                </div>
                            ) : leetcodeProfile ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
                                            {leetcodeProfile.userAvatar ? (
                                                <img
                                                    src={leetcodeProfile.userAvatar}
                                                    alt={leetcodeProfile.realName || leetcodeUsername}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-accent flex items-center justify-center">
                                                    <User className="text-primary" size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{leetcodeProfile.realName || leetcodeUsername}</h3>
                                            <p className="text-sm text-muted-foreground">@{leetcodeUsername}</p>
                                            {leetcodeProfile.ranking && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Ranking: {leetcodeProfile.ranking.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : leetcodeUsername ? (
                                <div className="text-center py-6">
                                    <p>Unable to load LeetCode profile for @{leetcodeUsername}</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={() => fetchLeetCodeProfile(leetcodeUsername)}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground">No LeetCode account linked</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
