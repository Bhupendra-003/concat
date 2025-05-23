"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/auth');
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-white"></div>
                    <span className="font-bold text-4xl">Con<span className="text-red-500">Cat</span></span>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="text-zinc-300 hover:text-white">Features</button>
                    <button className="text-zinc-300 hover:text-white">Pricing</button>
                    <button className="text-zinc-300 hover:text-white">Community</button>
                    <button className="text-zinc-300 hover:text-white">Help</button>
                    <button
                        onClick={handleGetStarted}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={()=>{
                            router.push('/creater/dashboard');
                        }}
                        className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        For Creaters
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center text-center px-4 mt-16">
                <h1 className="text-6xl font-bold mb-6">
                    Master Your <span className="text-red-500">Coding Skills</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mb-10">
                    Join thousands of developers solving challenges, building projects,
                    and improving their coding skills in a fun, competitive environment.
                </p>

                <button
                    onClick={handleGetStarted}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                >
                    Get Started
                </button>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
                    {/* Feature Cards */}
                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Weekly Challenges</h3>
                        <p className="text-zinc-400">Solve algorithm challenges and compete with others in weekly contests.</p>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
                        <p className="text-zinc-400">Level up your programming skills with our curated learning paths.</p>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Community</h3>
                        <p className="text-zinc-400">Connect with other developers and share knowledge.</p>
                    </div>
                </div>
            </main>

            {/* Stats Section */}
            <div className="mt-20 py-12 bg-zinc-800">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-5xl font-bold text-red-500">10K+</h3>
                        <p className="text-zinc-400 mt-2">Active Users</p>
                    </div>
                    <div>
                        <h3 className="text-5xl font-bold text-red-500">500+</h3>
                        <p className="text-zinc-400 mt-2">Challenges</p>
                    </div>
                    <div>
                        <h3 className="text-5xl font-bold text-red-500">50+</h3>
                        <p className="text-zinc-400 mt-2">Weekly Contests</p>
                    </div>
                </div>
            </div>
        </div>
    );
}