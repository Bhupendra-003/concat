"use client";
import React, { useState } from 'react';
import Header from '../components/Header';
import Contest from '@/components/tabs/Contest';

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
  
  // Handle tab click
  const handleTabClick = (tab: TabData) => {
    setSelectedTab(tab);
  };
  
  return (
    <div className='px-24 pt-4'>
      <Header />
      <main className='mt-2'>
        <h1 className="text-4xl font-semibold py-6">Welcome <span className='text-primary ml-1'>Bhupendra</span></h1>
        <nav className='flex space-x-12 text-sm'>
          {tabs.map((tab) => (
            <div key={tab.id} className="relative flex flex-col items-center">
              <p 
                className={`text-lg cursor-pointer transition-colors duration-300 ${
                  selectedTab.id === tab.id ? 'text-foreground font-semibold' : 'text-muted-foreground font-semibold'
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
          {selectedTab.id === 0 && <Contest />}
          {selectedTab.id === 1 && <Contest />}
          {selectedTab.id === 2 && <div>Leaderboard Content</div>}
          {selectedTab.id === 3 && <div>Announcements Content</div>}
        </div>
      </main>
    </div>
  );
}

export default Page;