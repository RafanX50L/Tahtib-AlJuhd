"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localTimeToUTC = localTimeToUTC;
exports.utcToLocalTime = utcToLocalTime;
exports.utcToLocalDateTime = utcToLocalDateTime;
exports.createTimeWindowsFromRules = createTimeWindowsFromRules;
exports.formatTimeForDisplay = formatTimeForDisplay;
exports.getDayBoundsInUTC = getDayBoundsInUTC;
exports.isValidTimezone = isValidTimezone;
exports.getAvailableTimezones = getAvailableTimezones;
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
/**
 * Converts a local time string (HH:mm) to UTC Date for a specific timezone and date
 * @param timeString - Time in HH:mm format (e.g., "09:00")
 * @param date - The date to apply the time to
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns UTC Date object
 */
function localTimeToUTC(timeString, date, timezone) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const localDate = new Date(date);
    localDate.setHours(hours, minutes, 0, 0);
    return (0, date_fns_tz_1.fromZonedTime)(localDate, timezone);
}
/**
 * Converts a UTC Date to local time string (HH:mm) for a specific timezone
 * @param utcDate - UTC Date object
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Time string in HH:mm format
 */
function utcToLocalTime(utcDate, timezone) {
    const localDate = (0, date_fns_tz_1.toZonedTime)(utcDate, timezone);
    return (0, date_fns_tz_1.format)(localDate, 'HH:mm');
}
/**
 * Converts a UTC Date to local time string with date for a specific timezone
 * @param utcDate - UTC Date object
 * @param timezone - The timezone (e.g., "America/New_York")
 * @returns Object with date and time strings
 */
function utcToLocalDateTime(utcDate, timezone) {
    const localDate = (0, date_fns_tz_1.toZonedTime)(utcDate, timezone);
    return {
        date: (0, date_fns_tz_1.format)(localDate, 'yyyy-MM-dd'),
        time: (0, date_fns_tz_1.format)(localDate, 'HH:mm')
    };
}
/**
 * Creates time windows from weekly rules for a specific date and timezone
 * @param weeklyRules - Weekly rules object
 * @param date - The date to create windows for
 * @param timezone - The timezone
 * @returns Array of time windows in UTC
 */
function createTimeWindowsFromRules(weeklyRules, date, timezone) {
    const weekday = (0, date_fns_tz_1.format)(date, 'EEEE');
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
function formatTimeForDisplay(utcDate, timezone) {
    const localDate = (0, date_fns_tz_1.toZonedTime)(utcDate, timezone);
    return (0, date_fns_tz_1.format)(localDate, 'h:mm a');
}
/**
 * Gets the start and end of day in UTC for a given date and timezone
 * @param date - The date
 * @param timezone - The timezone
 * @returns Object with start and end of day in UTC
 */
function getDayBoundsInUTC(date, timezone) {
    const localStart = (0, date_fns_1.startOfDay)(date);
    const localEnd = (0, date_fns_1.endOfDay)(date);
    return {
        start: (0, date_fns_tz_1.fromZonedTime)(localStart, timezone),
        end: (0, date_fns_tz_1.fromZonedTime)(localEnd, timezone)
    };
}
/**
 * Validates if a timezone string is valid
 * @param timezone - Timezone string to validate
 * @returns boolean
 */
function isValidTimezone(timezone) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Gets all available timezones
 * @returns Array of timezone strings
 */
function getAvailableTimezones() {
    return Intl.supportedValuesOf('timeZone');
}
//# sourceMappingURL=timezone.utils.js.map