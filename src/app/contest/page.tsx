"use client";
import React, { useState } from 'react';
import Problems from '@/components/tabs/Problems';
import Header from '@/components/Header';
interface TabData {
    id: number;
    label: string;
    width: string;
}

interface Problem {
    id: number;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    status: 'solved' | 'unsolved';
}

const problems: Problem[] = [
    {
        id: 1,
        name: "Two Sum",
        difficulty: "Easy",
        points: 100,
        status: "solved"
    },
    {
        id: 2,
        name: "Next Permutation",
        difficulty: "Medium",
        points: 200,
        status: "unsolved"
    },
    {
        id: 3,
        name: "Maximum Subarray",
        difficulty: "Hard",
        points: 300,
        status: "solved"
    }
];
function Page() {
    const tabs: TabData[] = [
        { id: 1, label: "Problems", width: "w-8" },
        { id: 2, label: "Contest Leaderboard", width: "w-16" },
    ];

    const [selectedTab, setSelectedTab] = useState<TabData>(tabs[0]);

    // Handle tab click
    const handleTabClick = (tab: TabData) => {
        setSelectedTab(tab);
    };

    return (
        <div className='px-24 pt-4'>
            <Header />
            <main className='mt-4'>
                <h1 className="text-4xl font-semibold py-6">Welcome to<span className='text-primary ml-1'>TicTack</span></h1>
                <nav className='flex space-x-12 text-sm'>
                    {tabs.map((tab) => (
                        <div key={tab.id} className="relative flex flex-col items-center">
                            <p
                                className={`text-lg cursor-pointer transition-colors duration-300 ${selectedTab.id === tab.id ? 'text-foreground font-semibold' : 'text-muted-foreground font-semibold'
                                    }`}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab.label}
                            </p>
                            <span className={`${selectedTab.id === tab.id ? tab.width : "w-0"} mt-2 h-1 ease-out transition-width duration-300 bg-primary rounded-full`} />
                        </div>
                    ))}
                </nav>
                <div className="mt-8">
                    {selectedTab.id === 1 && <Problems problems={problems} />}
                    {selectedTab.id === 2 && <div>Leaderboard Content</div>}
                </div>
            </main>
        </div>
    );
}

export default Page;