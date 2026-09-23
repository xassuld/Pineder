/**
 * Utility functions for handling week-specific availability and scheduling
 */

/**
 * Get the start of the week (Monday) for a given date
 * @param date - The date to get the week start for
 * @returns Date object representing Monday of that week
 */
export function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0); // Set to start of day
  return weekStart;
}

/**
 * Get the end of the week (Sunday) for a given date
 * @param date - The date to get the week end for
 * @returns Date object representing Sunday of that week
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999); // Set to end of day
  return weekEnd;
}

/**
 * Format week range for display
 * @param date - Any date within the week
 * @returns Formatted week range string
 */
export function formatWeekRange(date: Date): string {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);

  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

/**
 * Check if two dates are in the same week
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Boolean indicating if dates are in the same week
 */
export function isSameWeek(date1: Date, date2: Date): boolean {
  const weekStart1 = getWeekStart(date1);
  const weekStart2 = getWeekStart(date2);
  return weekStart1.getTime() === weekStart2.getTime();
}

/**
 * Get week key for storage (ISO week format)
 * @param date - The date to get week key for
 * @returns String in format "YYYY-WW" (e.g., "2024-01")
 */
export function getWeekKey(date: Date): string {
  const weekStart = getWeekStart(date);
  const year = weekStart.getFullYear();
  const month = (weekStart.getMonth() + 1).toString().padStart(2, "0");
  const day = weekStart.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get the next N weeks from a given date
 * @param startDate - The starting date
 * @param count - Number of weeks to generate
 * @returns Array of week start dates
 */
export function getNextWeeks(startDate: Date, count: number): Date[] {
  const weeks: Date[] = [];
  const currentWeekStart = getWeekStart(startDate);

  for (let i = 0; i < count; i++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() + i * 7);
    weeks.push(weekStart);
  }

  return weeks;
}

/**
 * Get the previous N weeks from a given date
 * @param startDate - The starting date
 * @param count - Number of weeks to generate
 * @returns Array of week start dates
 */
export function getPreviousWeeks(startDate: Date, count: number): Date[] {
  const weeks: Date[] = [];
  const currentWeekStart = getWeekStart(startDate);

  for (let i = 1; i <= count; i++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - i * 7);
    weeks.push(weekStart);
  }

  return weeks;
}

/**
 * Check if a date is in the current week
 * @param date - The date to check
 * @returns Boolean indicating if date is in current week
 */
export function isCurrentWeek(date: Date): boolean {
  const now = new Date();
  return isSameWeek(date, now);
}

/**
 * Get week number in the year
 * @param date - The date to get week number for
 * @returns Week number (1-53)
 */
export function getWeekNumber(date: Date): number {
  const weekStart = getWeekStart(date);
  const startOfYear = new Date(weekStart.getFullYear(), 0, 1);
  const diffTime = weekStart.getTime() - startOfYear.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
}

/**
 * Get all days in a week
 * @param weekStart - The Monday of the week
 * @returns Array of dates for each day of the week
 */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
}
