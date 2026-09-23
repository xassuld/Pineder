/**
 * Frontend timezone utilities for handling timezone conversions
 * and displaying times in user's local timezone
 */

/**
 * Get user's timezone from browser
 */
export function getUserTimezone(): string {
  // All meetings are in UB (Ulaanbaatar) timezone
  return "Asia/Ulaanbaatar";
}

/**
 * Get common timezone options for dropdowns
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
 * Format a date for display in a specific timezone
 */
export function formatDateInTimezone(
  date: Date | string,
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
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validate that the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date provided to formatDateInTimezone:", date);
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: timezone,
  }).format(dateObj);
}

/**
 * Convert a UTC date to user's timezone
 */
export function convertUTCToUserTimezone(
  utcDate: Date | string,
  userTimezone: string
): Date {
  const dateObj = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  return new Date(dateObj.toLocaleString("en-US", { timeZone: userTimezone }));
}

/**
 * Get the current time in a specific timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: timezone }));
}

/**
 * Check if a time is within business hours for a timezone
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
 * Get timezone offset in hours
 */
export function getTimezoneOffsetHours(timezone: string): number {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
  return (utc.getTime() - target.getTime()) / (1000 * 60 * 60);
}

/**
 * Format timezone offset for display
 */
export function formatTimezoneOffset(timezone: string): string {
  const offset = getTimezoneOffsetHours(timezone);
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  } else {
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
  }
}

/**
 * Validate if a timezone string is valid
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
 * Get timezone display name
 */
export function getTimezoneDisplayName(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "long",
    });
    return (
      formatter.formatToParts(now).find((part) => part.type === "timeZoneName")
        ?.value || timezone
    );
  } catch (e) {
    return timezone;
  }
}

/**
 * Create a session time object with timezone conversion
 */
export function createSessionTimeData(
  date: Date,
  time: string,
  userTimezone: string,
  mentorTimezone: string
): {
  userLocalTime: Date;
  mentorLocalTime: Date;
  utcTime: Date;
  timezoneInfo: {
    user: string;
    mentor: string;
    userOffset: string;
    mentorOffset: string;
  };
} {
  // Parse the time
  const [hours, minutes] = time.split(":").map(Number);

  // Create the date in user's timezone
  const userLocalDate = new Date(date);
  userLocalDate.setHours(hours, minutes, 0, 0);

  // Convert to UTC
  const utcTime = new Date(
    userLocalDate.getTime() - userLocalDate.getTimezoneOffset() * 60000
  );

  // Convert to mentor's timezone
  const mentorLocalTime = new Date(
    utcTime.toLocaleString("en-US", { timeZone: mentorTimezone })
  );

  return {
    userLocalTime: userLocalDate,
    mentorLocalTime,
    utcTime,
    timezoneInfo: {
      user: userTimezone,
      mentor: mentorTimezone,
      userOffset: formatTimezoneOffset(userTimezone),
      mentorOffset: formatTimezoneOffset(mentorTimezone),
    },
  };
}

/**
 * Get available time slots for a date considering timezone differences
 */
export function getAvailableTimeSlots(
  date: Date,
  mentorTimezone: string,
  userTimezone: string,
  mentorAvailability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[]
): string[] {
  const dayOfWeek = date.getDay();
  const availability = mentorAvailability.find(
    (a) => a.dayOfWeek === dayOfWeek && a.isAvailable
  );

  if (!availability) return [];

  const slots: string[] = [];
  const [startHour] = availability.startTime.split(":").map(Number);
  const [endHour] = availability.endTime.split(":").map(Number);

  // Generate time slots in mentor's timezone
  for (let hour = startHour; hour < endHour; hour++) {
    const mentorTime = new Date(date);
    mentorTime.setHours(hour, 0, 0, 0);

    // Convert to user's timezone for display
    const userTime = new Date(
      mentorTime.toLocaleString("en-US", { timeZone: userTimezone })
    );
    const timeString = userTime.toTimeString().slice(0, 5); // HH:MM format

    slots.push(timeString);
  }

  return Array.from(new Set(slots)); // Remove duplicates
}
