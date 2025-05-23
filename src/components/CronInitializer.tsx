"use client";

import { useEffect } from "react";
import { setupContestStatusCron } from "@/lib/cron";

/**
 * Component that initializes cron jobs when the app starts
 * This is a client component because cron jobs need to run in the browser
 */
export default function CronInitializer() {
    useEffect(() => {
        // Set up the contest status cron job
        const intervalId = setupContestStatusCron();
        
        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    
    // This component doesn't render anything
    return null;
}
