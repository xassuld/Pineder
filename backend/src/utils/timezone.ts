/**
 * Timezone utility functions for handling timezone conversions
 * in session booking and scheduling
 */

/**
 * Convert a date/time from one timezone to another
 * @param date - The date to convert
 * @param fromTimezone - Source timezone (e.g., "America/New_York")
 * @param toTimezone - Target timezone (e.g., "Europe/London")
 * @returns Date object in the target timezone
 */
export function convertTimezone(
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date {
  // Create a new date object to avoid mutating the original
  const utcDate = new Date(
    date.toLocaleString("en-US", { timeZone: fromTimezone })
  );
  return new Date(utcDate.toLocaleString("en-US", { timeZone: toTimezone }));
}

/**
 * Convert a date to UTC for storage
 * @param date - The date to convert
 * @param timezone - The timezone of the input date
 * @returns UTC Date object
 */
export function convertToUTC(date: Date, timezone: string): Date {
  try {
    // Simple approach: treat the input date as if it's already in the user's timezone
    // and convert it to UTC by accounting for the timezone offset

    // Get the timezone offset in minutes
    const offsetMinutes = getTimezoneOffset(timezone);

    // Create a new date by adjusting for the timezone offset
    // If offset is positive (e.g., UTC+5), we subtract it to get UTC
    // If offset is negative (e.g., UTC-5), we add it to get UTC
    const utcTime = date.getTime() - offsetMinutes * 60 * 1000;

    return new Date(utcTime);
  } catch (error) {
    console.error("convertToUTC error:", error);
    return date; // Fallback to original date
  }
}

/**
 * Convert a UTC date to a specific timezone for display
 * @param utcDate - The UTC date
 * @param timezone - The target timezone
 * @returns Date object in the target timezone
 */
export function convertFromUTC(utcDate: Date, timezone: string): Date {
  try {
    // Simple approach: add the timezone offset to the UTC date
    const offsetMinutes = getTimezoneOffset(timezone);
    const localTime = utcDate.getTime() + offsetMinutes * 60 * 1000;
    return new Date(localTime);
  } catch (error) {
    console.error("convertFromUTC error:", error);
    return utcDate; // Fallback to original date
  }
}

/**
 * Get timezone offset in minutes for a given timezone
 * @param timezone - The timezone identifier
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
  return (utc.getTime() - target.getTime()) / 60000;
}

/**
 * Format a date for display in a specific timezone
 * @param date - The date to format
 * @param timezone - The target timezone
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateInTimezone(
  date: Date,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }
): string {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: timezone,
  }).format(date);
}

/**
 * Get the current time in a specific timezone
 * @param timezone - The target timezone
 * @returns Date object representing current time in the timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: timezone }));
}

/**
 * Check if a time is within business hours for a timezone
 * @param date - The date to check
 * @param timezone - The timezone
 * @param startHour - Start hour (24-hour format)
 * @param endHour - End hour (24-hour format)
 * @returns boolean indicating if time is within business hours
 */
export function isWithinBusinessHours(
  date: Date,
  timezone: string,
  startHour: number = 9,
  endHour: number = 17
): boolean {
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  const hour = localDate.getHours();
  return hour >= startHour && hour < endHour;
}

/**
 * Get common timezone options for dropdowns
 * @returns Array of timezone objects with label and value
 */
export function getCommonTimezones(): Array<{ label: string; value: string }> {
  return [
    { label: "Ulaanbaatar (UB)", value: "Asia/Ulaanbaatar" },
    { label: "UTC", value: "UTC" },
    { label: "Eastern Time (US)", value: "America/New_York" },
    { label: "Central Time (US)", value: "America/Chicago" },
    { label: "Mountain Time (US)", value: "America/Denver" },
    { label: "Pacific Time (US)", value: "America/Los_Angeles" },
    { label: "London", value: "Europe/London" },
    { label: "Paris", value: "Europe/Paris" },
    { label: "Berlin", value: "Europe/Berlin" },
    { label: "Moscow", value: "Europe/Moscow" },
    { label: "Tokyo", value: "Asia/Tokyo" },
    { label: "Beijing", value: "Asia/Shanghai" },
    { label: "Sydney", value: "Australia/Sydney" },
    { label: "Melbourne", value: "Australia/Melbourne" },
    { label: "Mumbai", value: "Asia/Kolkata" },
    { label: "Dubai", value: "Asia/Dubai" },
    { label: "Singapore", value: "Asia/Singapore" },
    { label: "Hong Kong", value: "Asia/Hong_Kong" },
    { label: "Seoul", value: "Asia/Seoul" },
    { label: "Bangkok", value: "Asia/Bangkok" },
    { label: "Jakarta", value: "Asia/Jakarta" },
  ];
}

/**
 * Validate if a timezone string is valid
 * @param timezone - The timezone string to validate
 * @returns boolean indicating if timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Create a session time with timezone conversion
 * @param date - The date
 * @param time - The time string (HH:MM)
 * @param userTimezone - User's timezone
 * @param mentorTimezone - Mentor's timezone
 * @returns Object with UTC times and timezone info
 */
export function createSessionTime(
  date: Date,
  time: string,
  userTimezone: string,
  mentorTimezone: string
): {
  startTimeUTC: Date;
  endTimeUTC: Date;
  userLocalTime: Date;
  mentorLocalTime: Date;
  timezoneInfo: {
    user: string;
    mentor: string;
    userOffset: number;
    mentorOffset: number;
  };
} {
  console.log(
    `createSessionTime: Input date: ${date.toISOString()}, time: ${time}, userTimezone: ${userTimezone}, mentorTimezone: ${mentorTimezone}`
  );

  // Parse the time
  const [hours, minutes] = time.split(":").map(Number);
  console.log(`createSessionTime: Parsed hours: ${hours}, minutes: ${minutes}`);

  // Create a proper date object in the user's timezone
  // Use a more reliable method to create the date
  const dateStr = date.toISOString().split("T")[0]; // Get YYYY-MM-DD
  const userLocalDate = new Date(`${dateStr}T${time.padStart(5, "0")}:00`);

  // If timezone is UB, we need to handle it properly
  if (userTimezone === "Asia/Ulaanbaatar") {
    // UB is UTC+8, so we need to adjust the date accordingly
    // Create the date as if it's in UB timezone
    const ubOffset = 8 * 60; // UB is UTC+8 (8 hours = 480 minutes)
    const utcTime = userLocalDate.getTime() - ubOffset * 60 * 1000;
    userLocalDate.setTime(utcTime);
  }

  console.log(
    `createSessionTime: User local date: ${userLocalDate.toISOString()}`
  );

  // For UB timezone, we can use the date directly as UTC since we've already adjusted it
  const startTimeUTC = userLocalDate;
  const endTimeUTC = new Date(startTimeUTC.getTime() + 60 * 60 * 1000); // Add 1 hour
  console.log(`createSessionTime: startTimeUTC: ${startTimeUTC.toISOString()}`);

  // Convert to mentor's timezone for display
  const mentorLocalTime = convertFromUTC(startTimeUTC, mentorTimezone);
  console.log(
    `createSessionTime: mentorLocalTime: ${mentorLocalTime.toISOString()}`
  );

  return {
    startTimeUTC,
    endTimeUTC,
    userLocalTime: userLocalDate,
    mentorLocalTime,
    timezoneInfo: {
      user: userTimezone,
      mentor: mentorTimezone,
      userOffset: getTimezoneOffset(userTimezone),
      mentorOffset: getTimezoneOffset(mentorTimezone),
    },
  };
}
