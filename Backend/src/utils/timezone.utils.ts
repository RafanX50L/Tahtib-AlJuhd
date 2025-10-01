import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { startOfDay, endOfDay } from 'date-fns';

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
 * @param utcDate - UTC Date object
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Time string in HH:mm format
 */
export function utcToLocalTime(utcDate: Date, timezone: string): string {
  const localDate = toZonedTime(utcDate, timezone);
  return format(localDate, 'HH:mm');
}

/**
 * Converts a UTC Date to local time string with date for a specific timezone
 * @param utcDate - UTC Date object
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Object with date and time strings
 */
export function utcToLocalDateTime(utcDate: Date, timezone: string): { date: string; time: string } {
  const localDate = toZonedTime(utcDate, timezone);
  return {
    date: format(localDate, 'yyyy-MM-dd'),
    time: format(localDate, 'HH:mm')
  };
}

/**
 * Creates time windows from weekly rules for a specific date and timezone
 * @param weeklyRules - Weekly rules object
 * @param date - The date to create windows for
 * @param timezone - The timezone
 * @returns Array of time windows in UTC
 */
export function createTimeWindowsFromRules(
  weeklyRules: Record<string, { startTime: string; endTime: string }[]>,
  date: Date,
  timezone: string
): Array<{ start: Date; end: Date }> {
  const weekday = format(date, 'EEEE');
  const rules = weeklyRules[weekday];
  
  if (!rules || !Array.isArray(rules)) {
    return [];
  }
  
  return rules.map(rule => ({
    start: localTimeToUTC(rule.startTime, date, timezone),
    end: localTimeToUTC(rule.endTime, date, timezone)
  }));
}

/**
 * Converts a time slot to local time for display
 * @param utcDate - UTC Date object
 * @param timezone - The timezone
 * @returns Formatted time string for display
 */
export function formatTimeForDisplay(utcDate: Date, timezone: string): string {
  const localDate = toZonedTime(utcDate, timezone);
  return format(localDate, 'h:mm a');
}

/**
 * Gets the start and end of day in UTC for a given date and timezone
 * @param date - The date
 * @param timezone - The timezone
 * @returns Object with start and end of day in UTC
 */
export function getDayBoundsInUTC(date: Date, timezone: string): { start: Date; end: Date } {
  const localStart = startOfDay(date);
  const localEnd = endOfDay(date);
  
  return {
    start: fromZonedTime(localStart, timezone),
    end: fromZonedTime(localEnd, timezone)
  };
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
  return Intl.supportedValuesOf('timeZone');
}
