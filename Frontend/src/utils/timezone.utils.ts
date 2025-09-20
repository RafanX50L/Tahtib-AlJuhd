import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Converts a local time string (HH:mm) to UTC Date for a specific timezone and date
 * @param timeString - Time in HH:mm format (e.g., "09:00")
 * @param date - The date to apply the time to
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns UTC Date object
 */
export function localTimeToUTC(timeString: string, date: Date, timezone: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const localDate = new Date(date);
  localDate.setHours(hours, minutes, 0, 0);
  
  return fromZonedTime(localDate, timezone);
}

/**
 * Converts a UTC Date to local time string (HH:mm) for a specific timezone
 * @param utcDate - UTC Date object or ISO string
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Time string in HH:mm format
 */
export function utcToLocalTime(utcDate: Date | string, timezone: string): string {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const localDate = toZonedTime(date, timezone);
  return format(localDate, 'HH:mm');
}

/**
 * Converts a UTC Date to local time string with date for a specific timezone
 * @param utcDate - UTC Date object or ISO string
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Object with date and time strings
 */
export function utcToLocalDateTime(utcDate: Date | string, timezone: string): { date: string; time: string } {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const localDate = toZonedTime(date, timezone);
  return {
    date: format(localDate, 'yyyy-MM-dd'),
    time: format(localDate, 'HH:mm')
  };
}

/**
 * Formats a UTC time for display in a specific timezone
 * @param utcDate - UTC Date object or ISO string
 * @param timezone - The timezone
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatTimeForDisplay(utcDate: Date | string, timezone: string): string {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const localDate = toZonedTime(date, timezone);
  return format(localDate, 'h:mm a');
}

/**
 * Formats a UTC date for display in a specific timezone
 * @param utcDate - UTC Date object or ISO string
 * @param timezone - The timezone
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateForDisplay(utcDate: Date | string, timezone: string): string {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const localDate = toZonedTime(date, timezone);
  return format(localDate, 'MMM d, yyyy');
}

/**
 * Formats a UTC datetime for display in a specific timezone
 * @param utcDate - UTC Date object or ISO string
 * @param timezone - The timezone
 * @returns Formatted datetime string (e.g., "Jan 15, 2024 at 9:00 AM")
 */
export function formatDateTimeForDisplay(utcDate: Date | string, timezone: string): string {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const localDate = toZonedTime(date, timezone);
  return format(localDate, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Converts 24-hour time (HH:mm) to 12-hour time with AM/PM
 * @param time24 - Time in HH:mm format
 * @returns Time in 12-hour format with AM/PM
 */
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Gets the user's timezone from browser
 * @returns User's timezone string
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Validates if a timezone string is valid
 * @param timezone - Timezone string to validate
 * @returns boolean
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all available timezones
 * @returns Array of timezone strings
 */
export function getAvailableTimezones(): string[] {
  // Fallback for older browsers that don't support supportedValuesOf
  if ('supportedValuesOf' in Intl) {
    return (Intl as any).supportedValuesOf('timeZone');
  }
  
  // Fallback: return common timezones
  return [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'UTC'
  ];
}
