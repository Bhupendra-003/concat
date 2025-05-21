import React from 'react'
import { CheckCircle, Circle, ExternalLink } from "lucide-react";
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Problem {
    id: number;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    status: 'solved' | 'unsolved';
}

function Problems({ problems }: { problems: Problem[] }) {
    // Function to get difficulty badge color
    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case 'Easy':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Medium':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Hard':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-border">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-card/50 p-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Problem</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2">Points</div>
                <div className="col-span-2 text-right">Action</div>
            </div>

            {/* Problem Rows */}
            {problems.map((problem, index) => (
                <div
                    key={problem.id}
                    className={`grid grid-cols-12 items-center p-4 ${
                        index % 2 === 0 ? 'bg-background' : 'bg-card/30'
                    } hover:bg-card/50 transition-colors duration-150`}
                >
                    {/* Problem Number */}
                    <div className="col-span-1 text-center font-mono text-muted-foreground">
                        {problem.status === 'solved' ?
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> :
                            <Circle className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                        }
                    </div>

                    {/* Problem Name */}
                    <div className="col-span-5">
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors duration-150 cursor-pointer">
                            {problem.name}
                        </h3>
                    </div>

                    {/* Difficulty */}
                    <div className="col-span-2">
                        <Badge className={`px-2 py-0.5 ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                        </Badge>
                    </div>

                    {/* Points */}
                    <div className="col-span-2 font-medium text-foreground">
                        {problem.points} pts
                    </div>

                    {/* Action Button */}
                    <div className="col-span-2 text-right">
                        <Button
                            size="sm"
                            variant={problem.status === 'solved' ? "outline" : "default"}
                            className={`${
                                problem.status === 'solved'
                                    ? 'border-green-500/20 text-green-500 hover:text-green-400'
                                    : ''
                            }`}
                        >
                            {problem.status === 'solved' ? (
                                <span className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Solved
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-1" /> Solve
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {problems.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No problems available for this contest.
                </div>
            )}
        </div>
    )
}

export default Problems
