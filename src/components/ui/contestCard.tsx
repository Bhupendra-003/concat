import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Clock3, Settings } from "lucide-react";

const ContestCard = () => {
    return (
        <Card className="w-full max-w-3xl p-6 shadow-xl border border-gray-200 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Weekly DSA Challenge
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Contest Code: WDSA2025
                        </p>
                    </div>
                    <Badge variant="outline" className="text-sm text-blue-600 border-blue-600">
                        Live
                    </Badge>
                </div>

                {/* Time Info */}
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} /> Start: May 10, 2025 - 6:00 PM
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock3 size={16} /> Duration: 90 mins
                    </div>
                </div>

                <Separator />

                {/* Content Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Questions</p>
                        <p className="font-medium text-gray-800 dark:text-white">5 (2 Easy, 2 Medium, 1 Hard)</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Topics</p>
                        <p className="font-medium text-gray-800 dark:text-white">Arrays, Trees, DP</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Visibility</p>
                        <p className="font-medium text-gray-800 dark:text-white">Public</p>
                    </div>
                </div>

                <Separator />

                {/* Performance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Registered</p>
                        <p className="font-semibold text-gray-800 dark:text-white">124</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Participated</p>
                        <p className="font-semibold text-gray-800 dark:text-white">87</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Avg. Score</p>
                        <p className="font-semibold text-gray-800 dark:text-white">62%</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Top Performer</p>
                        <p className="font-semibold text-gray-800 dark:text-white">@codeMaster</p>
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-2">
                    <Button variant="outline" className="text-sm">
                        View Submissions
                    </Button>
                    <Button variant="outline" className="text-sm">
                        Export Results
                    </Button>
                    <Button variant="outline" className="text-sm">
                        Manage Participants
                    </Button>
                    <Button variant="ghost" className="text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900">
                        Delete Contest
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ContestCard;
