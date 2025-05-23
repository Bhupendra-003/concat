"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/UserHeader';
import Contest from '@/components/tabs/Contest';
import GlobalLeaderboard from '@/components/tabs/GlobalLeaderboard';
import Announcements from '@/components/tabs/Announcements';
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

interface TabData {
  id: number;
  label: string;
  width: string;
}

function Page() {
  const tabs: TabData[] = [
    { id: 1, label: "Contest", width: "w-6" },
    { id: 2, label: "Leaderboard", width: "w-12" },
    { id: 3, label: "Announcements", width: "w-12" },
  ];

  const [selectedTab, setSelectedTab] = useState<TabData>(tabs[0]);
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true); // State for loading

  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        // Redirect to auth page if not logged in
        router.push('/auth');
      } else {
        // Once session is checked, stop the loading
        setLoading(false);
      }
    }
  }, [session, isPending, router]);

  const handleTabClick = (tab: TabData) => {
    setSelectedTab(tab);
  };

  if (loading || isPending) return <Loading />; // Show loading while checking session

  return (
    <div className='px-24 pt-4'>
      <Header />
      <main className='mt-2'>
        <h1 className="text-4xl font-semibold py-6">
          Welcome <span className='text-primary ml-1'>{session?.user?.name || 'User'}</span>
        </h1>

        <nav className='flex space-x-12 text-sm'>
          {tabs.map((tab) => (
            <div key={tab.id} className="relative flex flex-col items-center">
              <p
                className={`text-lg cursor-pointer transition-colors duration-300 ${
                  selectedTab.id === tab.id
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground font-semibold'
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.label}
              </p>
              <span
                className={`${
                  selectedTab.id === tab.id ? tab.width : "w-0"
                } mt-2 h-1 ease-out transition-all duration-300 bg-primary rounded-full`}
              />
            </div>
          ))}
        </nav>

        <div className="mt-8">
          {selectedTab.id === 1 && <Contest />}
          {selectedTab.id === 2 && <GlobalLeaderboard />}
          {selectedTab.id === 3 && <Announcements />}
        </div>
      </main>
    </div>
  );
}

export default Page;
