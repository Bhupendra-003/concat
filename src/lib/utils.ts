import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date consistently across the application
 * @param date Date object or string to format
 * @param options Additional Intl.DateTimeFormatOptions to override defaults
 * @param debug If true, will log debug information about the date
 * @returns Formatted date string
 */
export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  debug: boolean = false
) {
  // Convert string to Date if needed
  const inputDate = typeof date === 'string' ? new Date(date) : date;

  // Adjust for IST timezone
  const adjustedDate = adjustForIST(inputDate);

  if (debug) {
    console.log('Original date:', inputDate);
    console.log('Original ISO string:', inputDate.toISOString());
    console.log('Original local string:', inputDate.toString());
    console.log('Adjusted date:', adjustedDate);
    console.log('Adjusted ISO string:', adjustedDate.toISOString());
    console.log('Adjusted local string:', adjustedDate.toString());
  }

  // Default formatting options
  const formattedDate = adjustedDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    // We've already adjusted for IST timezone, so don't specify timeZone here
    ...options
  });

  if (debug) {
    console.log('Formatted date:', formattedDate);
  }

  return formattedDate;
}

/**
 * Adjusts a date for the India Standard Time (IST) timezone (GMT+5:30)
 * @param date The date to adjust
 * @returns The adjusted date
 */
export function adjustForIST(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

  // IST is UTC+5:30, which is 5.5 hours or 330 minutes
  const istOffsetMinutes = 330;

  // Get the local timezone offset in minutes
  const localOffsetMinutes = dateObj.getTimezoneOffset();

  // Calculate the difference between IST and local timezone in milliseconds
  // Note: getTimezoneOffset() returns the difference in minutes between UTC and local time,
  // with a negative sign for timezones ahead of UTC
  const offsetDiffMinutes = -localOffsetMinutes - istOffsetMinutes;
  const offsetDiffMs = offsetDiffMinutes * 60 * 1000;

  // Adjust the date
  return new Date(dateObj.getTime() + offsetDiffMs);
}

/**
 * Get the time remaining or time until a date, with IST timezone adjustment
 * @param targetDate The target date to calculate time remaining/until
 * @param referenceDate The reference date (defaults to now)
 * @param debug If true, will log debug information
 * @returns A formatted string with the time remaining or time until
 */
export function getTimeDisplay(
  targetDate: Date | string,
  referenceDate: Date | string = new Date(),
  debug: boolean = false
) {
  // Convert to Date objects if they're strings
  let target = typeof targetDate === 'string' ? new Date(targetDate) : new Date(targetDate);
  let reference = typeof referenceDate === 'string' ? new Date(referenceDate) : new Date(referenceDate);

  // Adjust for IST timezone (GMT+5:30)
  target = adjustForIST(target);
  reference = adjustForIST(reference);

  if (debug) {
    console.log('Original target date:', targetDate);
    console.log('Original reference date:', referenceDate);
    console.log('Adjusted target date:', target);
    console.log('Adjusted reference date:', reference);
    console.log('Target ISO:', target.toISOString());
    console.log('Reference ISO:', reference.toISOString());
    console.log('Target timestamp:', target.getTime());
    console.log('Reference timestamp:', reference.getTime());
  }

  // Get timestamps in milliseconds
  const now = reference.getTime();
  const targetTime = target.getTime();
  const isInFuture = targetTime > now;

  // Calculate the absolute difference
  const distance = Math.abs(targetTime - now);

  if (debug) {
    console.log('Is in future:', isInFuture);
    console.log('Distance (ms):', distance);
    console.log('Distance (min):', Math.floor(distance / (1000 * 60)));
    console.log('Distance (hours):', Math.floor(distance / (1000 * 60 * 60)));
  }

  // If less than a minute, show appropriate message
  if (distance < 60 * 1000) {
    return isInFuture ? "Starting soon" : "Just ended";
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  if (debug) {
    console.log('Days:', days);
    console.log('Hours:', hours);
    console.log('Minutes:', minutes);
  }

  // Format the output based on whether the date is in the future or past
  if (isInFuture) {
    if (days > 0) return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  } else {
    if (days > 0) return `${days}d ${hours}h ago`;
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  }
}
