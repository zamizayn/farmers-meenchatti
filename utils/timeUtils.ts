
export interface Timings {
    openingTime: string;
    closingTime: string;
    weekendOpeningTime: string;
    weekendClosingTime: string;
}

/**
 * Parses a time string like "11:00 AM" or "10:30 PM" into minutes from midnight.
 */
const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;

    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + (minutes || 0);
};

/**
 * Checks if the shop is open now based on the provided timings and current local time.
 */
export const isOpenNow = (timings: Timings): boolean => {
    const now = new Date();
    // Use local time from system: 2026-01-20T13:00:41+05:30
    // Date.getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    const openingStr = isWeekend ? timings.weekendOpeningTime : timings.openingTime;
    const closingStr = isWeekend ? timings.weekendClosingTime : timings.closingTime;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openingMinutes = parseTimeToMinutes(openingStr);
    const closingMinutes = parseTimeToMinutes(closingStr);

    // Handle cases where closing time is after midnight (e.g., 11:00 PM to 2:00 AM)
    if (closingMinutes < openingMinutes) {
        return currentMinutes >= openingMinutes || currentMinutes <= closingMinutes;
    }

    return currentMinutes >= openingMinutes && currentMinutes <= closingMinutes;
};

/**
 * Checks if a specific product is available based on its custom time range.
 */
export const isProductAvailable = (item: { startTime?: string, endTime?: string }): boolean => {
    if (!item.startTime || !item.endTime) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // HTML5 time input strings "HH:MM"
    const [startHours, startMinutes] = item.startTime.split(':').map(Number);
    const [endHours, endMinutes] = item.endTime.split(':').map(Number);

    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    if (endTotal < startTotal) {
        // Over midnight
        return currentMinutes >= startTotal || currentMinutes <= endTotal;
    }

    return currentMinutes >= startTotal && currentMinutes <= endTotal;
};
