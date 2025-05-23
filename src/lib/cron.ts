import { updateContestStatuses } from "@/actions/actionContestStatus";

/**
 * Sets up a cron job to update contest statuses every minute
 * This function should be called when the application starts
 */
export function setupContestStatusCron() {
    // Run immediately on startup
    updateContestStatuses().then(result => {
        console.log("Initial contest status update:", result);
    });

    // Then run every minute
    const intervalId = setInterval(async () => {
        try {
            const result = await updateContestStatuses();
            console.log("Cron job: Contest status update:", result);
        } catch (error) {
            console.error("Cron job error:", error);
        }
    }, 60000); // 60000 ms = 1 minute

    // Return the interval ID so it can be cleared if needed
    return intervalId;
}
