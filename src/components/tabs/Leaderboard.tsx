"use client";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Trophy, User } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
    rank: number;
    score: number;
    userId: string;
    name: string;
    username: string;
    image: string | null;
    updatedAt: Date;
}

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    loading: boolean;
    currentUserId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, loading, currentUserId }) => {
    // Function to get medal icon based on rank
    const getMedalIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-amber-700" />;
            default:
                return <span className="font-mono text-sm text-muted-foreground">{rank}</span>;
        }
    };

    // Function to get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Function to format date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No participants yet</h3>
                <p className="mt-2 text-muted-foreground">
                    Be the first to join this contest and appear on the leaderboard!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 bg-card/50 p-4 text-sm font-medium text-muted-foreground rounded-t-lg">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7">Participant</div>
                <div className="col-span-2 text-center">Points</div>
                <div className="col-span-2 text-right">Last Update</div>
            </div>

            {/* Entries */}
            <div className="space-y-1">
                {entries.map((entry, index) => (
                    <div 
                        key={entry.userId}
                        className={`grid grid-cols-12 items-center p-4 rounded-md ${
                            entry.userId === currentUserId 
                                ? 'bg-background' 
                                : 'bg-background'
                        } transition-colors duration-150`}
                    >
                        {/* Rank */}
                        <div className="col-span-1 flex justify-center">
                            {getMedalIcon(entry.rank)}
                        </div>

                        {/* User */}
                        <div className="col-span-7 flex items-center space-x-3">
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src={entry.image || undefined} alt={entry.name} />
                                <AvatarFallback>
                                    {entry.name ? getInitials(entry.name) : <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">{entry.name}</p>
                                <p className="text-xs text-muted-foreground">@{entry.username}</p>
                            </div>
                        </div>

                        {/* Points */}
                        <div className="col-span-2 text-center font-mono font-medium">
                            {entry.score}
                        </div>

                        {/* Last Update */}
                        <div className="col-span-2 text-right text-xs text-muted-foreground">
                            {formatDate(entry.updatedAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
