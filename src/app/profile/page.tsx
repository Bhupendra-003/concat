"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Header from '@/components/UserHeader';
import Loading from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Star, Award, Clock } from 'lucide-react';
import { getLeetCodeUserProfile } from '@/actions/actionLeetQuery';
import { Ring2 } from 'ldrs/react';

interface LeetCodeProfile {
  username: string;
  realName: string;
  userAvatar: string;
  ranking?: number;
  recentSubmissions?: any[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [leetcodeProfile, setLeetcodeProfile] = useState<LeetCodeProfile | null>(null);
  const [fetchingLeetcode, setFetchingLeetcode] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        // Redirect to auth page if not logged in
        router.push('/auth');
      } else {
        setLoading(false);
        
        // Try to get LeetCode username from localStorage
        const leetcodeUsername = localStorage.getItem('LeetcodeUsername');
        if (leetcodeUsername) {
          fetchLeetCodeProfile(leetcodeUsername);
        }
      }
    }
  }, [session, isPending, router]);

  const fetchLeetCodeProfile = async (username: string) => {
    try {
      setFetchingLeetcode(true);
      const profileData = await getLeetCodeUserProfile(username);
      setLeetcodeProfile(profileData);
    } catch (error) {
      console.error('Error fetching LeetCode profile:', error);
    } finally {
      setFetchingLeetcode(false);
    }
  };

  if (loading || isPending) return <Loading />;

  return (
    <div className='px-24 pt-4'>
      <Header />
      <main className='mt-8'>
        <h1 className="text-4xl font-semibold mb-8">
          Your Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center overflow-hidden mb-4">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-primary" size={64} />
                )}
              </div>
              <h2 className="text-2xl font-semibold">{session.user.name}</h2>
              <p className="text-muted-foreground">{session.user.email}</p>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className="capitalize">{session.user.role || 'User'}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-medium">{session.user.points || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-muted">
                  <span className="text-muted-foreground">Rank</span>
                  <span className="font-medium">{session.user.rank > 0 ? `#${session.user.rank}` : 'Not ranked'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {session.user.createdAt 
                      ? new Date(session.user.createdAt).toLocaleDateString() 
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LeetCode Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>LeetCode Profile</CardTitle>
              <CardDescription>Your connected LeetCode account information</CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingLeetcode ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Ring2 size="40" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="var(--primary)" />
                  <p className="mt-4 text-muted-foreground">Loading LeetCode profile...</p>
                </div>
              ) : leetcodeProfile ? (
                <div className="flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center overflow-hidden mr-4">
                      {leetcodeProfile.userAvatar ? (
                        <img 
                          src={leetcodeProfile.userAvatar} 
                          alt={leetcodeProfile.realName || leetcodeProfile.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-primary" size={40} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {leetcodeProfile.realName || leetcodeProfile.username}
                      </h3>
                      <p className="text-muted-foreground">@{leetcodeProfile.username}</p>
                      {leetcodeProfile.ranking && (
                        <Badge variant="secondary" className="mt-1">
                          Ranking: {leetcodeProfile.ranking}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h4 className="text-lg font-medium mb-3">Recent Submissions</h4>
                  {leetcodeProfile.recentSubmissions && leetcodeProfile.recentSubmissions.length > 0 ? (
                    <div className="space-y-3">
                      {leetcodeProfile.recentSubmissions.slice(0, 5).map((submission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent/10 rounded-md">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              submission.statusDisplay === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span>{submission.title}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock size={14} className="mr-1" />
                            {new Date(parseInt(submission.timestamp) * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent submissions found.</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No LeetCode profile connected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
