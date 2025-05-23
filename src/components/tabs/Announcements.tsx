"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, ChevronDown, ChevronUp, Megaphone, User, Star, Trophy } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock announcement data
const mockAnnouncements = [
  {
    id: 1,
    title: "New Contest: Algorithm Challenge",
    content: "Join our new algorithm challenge starting this weekend! Solve complex problems and compete with other developers.",
    type: "contest",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    author: "Admin Team",
    important: true,
    isNew: true,
  },
  {
    id: 2,
    title: "Platform Maintenance",
    content: "We'll be performing scheduled maintenance on our servers this Friday from 2 AM to 4 AM UTC. The platform may experience brief downtime during this period.",
    type: "system",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    author: "System Admin",
    important: true,
    isNew: true,
  },
  {
    id: 3,
    title: "New Feature: Improved Leaderboard",
    content: "We've updated our leaderboard system to provide more detailed statistics and performance metrics. Check it out now!",
    type: "feature",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    author: "Development Team",
    important: false,
    isNew: false,
  },
  {
    id: 4,
    title: "Community Spotlight: Top Contributors",
    content: "Congratulations to our top contributors this month! Special shoutout to @coder123, @algopro, and @devmaster for their exceptional participation.",
    type: "community",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    author: "Community Manager",
    important: false,
    isNew: false,
  },
  {
    id: 5,
    title: "Upcoming Webinar: Advanced Problem Solving",
    content: "Join us for a live webinar on advanced problem-solving techniques with our expert panel. Register now to secure your spot!",
    type: "event",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    author: "Events Team",
    important: true,
    isNew: false,
  }
];

// Helper function to get badge color based on announcement type
const getAnnouncementTypeInfo = (type: string) => {
  switch (type) {
    case 'contest':
      return { color: "bg-blue-500 hover:bg-blue-600", icon: <Trophy className="h-4 w-4 mr-1" /> };
    case 'system':
      return { color: "bg-red-500 hover:bg-red-600", icon: <Bell className="h-4 w-4 mr-1" /> };
    case 'feature':
      return { color: "bg-green-500 hover:bg-green-600", icon: <Star className="h-4 w-4 mr-1" /> };
    case 'community':
      return { color: "bg-purple-500 hover:bg-purple-600", icon: <User className="h-4 w-4 mr-1" /> };
    case 'event':
      return { color: "bg-orange-500 hover:bg-orange-600", icon: <Calendar className="h-4 w-4 mr-1" /> };
    default:
      return { color: "bg-gray-500 hover:bg-gray-600", icon: <Megaphone className="h-4 w-4 mr-1" /> };
  }
};



const AnnouncementCard: React.FC<{ announcement: any }> = ({ announcement }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      key={announcement.id}
      className={cn(
        "overflow-hidden border-border",
        expanded ? "bg-zinc-900" : "bg-zinc-950"
      )}
    >
      <div className="flex flex-col">
        <CardHeader className="pb-1 pt-2 px-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base flex items-center">
                {announcement.title}
                <div className="flex items-center ml-2 space-x-1">
                  {announcement.important && (
                    <Badge className="bg-primary hover:bg-primary/90 text-xs">Important</Badge>
                  )}
                  {announcement.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">New</Badge>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="flex items-center mt-0.5 text-xs">
                <span className="mr-2">{announcement.author}</span>
                <span className="text-xs">•</span>
                <span className="ml-2 text-xs">{formatDateTime(announcement.date)}</span>
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`uppercase text-xs font-semibold flex items-center text-white ${getAnnouncementTypeInfo(announcement.type).color}`}
            >
              {getAnnouncementTypeInfo(announcement.type).icon}
              {announcement.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-1 px-3">
          <p className={cn(
            "text-muted-foreground text-sm",
            expanded ? "" : "line-clamp-1"
          )}>
            {announcement.content}
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-1 px-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center h-6 px-2"
            onClick={toggleExpand}
          >
            {expanded ? (
              <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Read more <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

const Announcements: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Announcements</h2>
        <Badge variant="outline" className="flex items-center">
          <Bell className="h-3 w-3 mr-1" />
          {mockAnnouncements.length} Total
        </Badge>
      </div>

      <div className="space-y-2">
        {mockAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
};

export default Announcements;
