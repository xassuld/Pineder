import { Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import Session from "../../models/Session";
import { logger } from "../../utils/logger";
import { sendSuccess, sendError } from "../../utils/helpers";
import { AuthRequest } from "../../middleware/auth";
import {
  getWeekStart,
  getWeekKey,
  formatWeekRange,
} from "../../utils/weekUtils";

// Helper function to normalize time format
const normalizeTimeFormat = (time: string): string => {
  // If already in 24-hour format (HH:MM), return as is
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time;
  }

  // Convert from 12-hour format (H:MM AM/PM) to 24-hour format
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2];
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === "PM" && hour !== 12) {
      hour += 12;
    } else if (ampm === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  return time; // Return as is if format is unrecognized
};

export const getMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can view availability", 403);
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    console.log("Debug: Loading mentor availability:", mentor.availability);
    return sendSuccess(res, {
      availability: mentor.availability || [],
    });
  } catch (error) {
    console.error("Error getting mentor availability:", error);
    return sendError(res, "Failed to get mentor profile", 500);
  }
};

export const getMentorBookedSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId } = req.params;

    if (!mentorId) {
      return sendError(res, "Mentor ID is required", 400);
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return sendError(res, "Mentor not found", 404);
    }

    const bookedSessions = await Session.find({
      mentorId: mentor._id,
      status: { $in: ["approved", "requested", "scheduled", "active"] },
    }).select("startTime endTime status");

    const bookedSlots = bookedSessions.map((session) => {
      const startDate = new Date(session.startTime);
      return {
        date: startDate.toISOString().split("T")[0],
        time: startDate.toTimeString().slice(0, 5),
        status: session.status,
      };
    });

    return sendSuccess(res, {
      bookedSlots,
    });
  } catch (error) {
    console.error("Error getting mentor booked slots:", error);
    return sendError(res, "Failed to get booked slots", 500);
  }
};

/**
 * Update mentor availability
 * PUT /api/mentors/availability
 */
export const updateMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can update availability", 403);
    }

    const { availability } = req.body;

    if (!availability || !Array.isArray(availability)) {
      return sendError(res, "Availability data is required", 400);
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    // Normalize time formats in availability data
    const normalizedAvailability = availability.map((slot: any) => ({
      ...slot,
      startTime: normalizeTimeFormat(slot.startTime),
      endTime: normalizeTimeFormat(slot.endTime),
    }));

    console.log("Debug: Saving mentor availability:", normalizedAvailability);

    // Debug: Check for past dates
    const today = new Date().toISOString().split("T")[0];
    const pastDates = normalizedAvailability.filter(
      (slot: any) => slot.date && slot.date < today
    );
    if (pastDates.length > 0) {
      console.log("DEBUG: Backend received past dates:", pastDates);
      console.log("Today's date:", today);
    }
    mentor.availability = normalizedAvailability;
    await mentor.save();
    console.log("Debug: Mentor availability saved successfully");

    return sendSuccess(
      res,
      { availability: mentor.availability },
      "Availability updated successfully"
    );
  } catch (error) {
    console.error("Error updating mentor availability:", error);
    return sendError(res, "Failed to update availability", 500);
  }
};

/**
 * Update mentor availability for a specific week
 * PUT /api/mentors/availability/week
 */
export const updateMentorWeeklyAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can update availability", 403);
    }

    const { weekStart, availability } = req.body;

    if (!weekStart || !availability || !Array.isArray(availability)) {
      return sendError(
        res,
        "Week start date and availability data are required",
        400
      );
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    const weekStartDate = new Date(weekStart);
    const weekKey = getWeekKey(weekStartDate);

    // Initialize weeklyAvailability if it doesn't exist
    if (!mentor.weeklyAvailability) {
      mentor.weeklyAvailability = [];
    }

    // Find existing week or create new one
    const existingWeekIndex = mentor.weeklyAvailability.findIndex(
      (week) => getWeekKey(week.weekStart) === weekKey
    );

    if (existingWeekIndex >= 0) {
      // Update existing week
      mentor.weeklyAvailability[existingWeekIndex].availability = availability;
    } else {
      // Add new week
      mentor.weeklyAvailability.push({
        weekStart: weekStartDate,
        availability: availability,
      });
    }

    await mentor.save();

    return sendSuccess(
      res,
      {
        weekStart: weekStartDate,
        weekRange: formatWeekRange(weekStartDate),
        availability: availability,
      },
      "Weekly availability updated successfully"
    );
  } catch (error) {
    console.error("Error updating mentor weekly availability:", error);
    return sendError(res, "Failed to update weekly availability", 500);
  }
};

/**
 * Get mentor availability for a specific week
 * GET /api/mentors/availability/week?weekStart=YYYY-MM-DD
 */
export const getMentorWeeklyAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { user: authUser } = req;
    const { weekStart } = req.query;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can view availability", 403);
    }

    if (!weekStart) {
      return sendError(res, "Week start date is required", 400);
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    const weekStartDate = new Date(weekStart as string);
    const weekKey = getWeekKey(weekStartDate);

    // Find the specific week
    const weeklyData = mentor.weeklyAvailability?.find(
      (week) => getWeekKey(week.weekStart) === weekKey
    );

    // If no specific week found, return default availability
    const availability = weeklyData?.availability || mentor.availability;

    return sendSuccess(
      res,
      {
        weekStart: weekStartDate,
        weekRange: formatWeekRange(weekStartDate),
        availability: availability,
        isDefaultAvailability: !weeklyData,
      },
      "Weekly availability retrieved successfully"
    );
  } catch (error) {
    console.error("Error getting mentor weekly availability:", error);
    return sendError(res, "Failed to get weekly availability", 500);
  }
};

/**
 * Debug endpoint to test timezone conversion
 * GET /api/mentors/availability/debug-timezone
 */
export const debugTimezone = async (req: AuthRequest, res: Response) => {
  try {
    const { user: authUser } = req;
    const { utcTime, mentorTimezone, userTimezone } = req.query;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (!utcTime || !mentorTimezone || !userTimezone) {
      return sendError(
        res,
        "utcTime, mentorTimezone, and userTimezone are required",
        400
      );
    }

    const utcDate = new Date(utcTime as string);

    // Convert to mentor's timezone
    const mentorLocalTime = new Date(
      utcDate.toLocaleString("sv-SE", {
        timeZone: mentorTimezone as string,
      })
    );

    // Convert to user's timezone
    const userLocalTime = new Date(
      utcDate.toLocaleString("sv-SE", {
        timeZone: userTimezone as string,
      })
    );

    return sendSuccess(
      res,
      {
        utcTime: utcDate.toISOString(),
        mentorTime: {
          timezone: mentorTimezone,
          localTime: mentorLocalTime.toISOString(),
          hour: mentorLocalTime.getHours(),
          dayOfWeek: mentorLocalTime.getDay(),
        },
        userTime: {
          timezone: userTimezone,
          localTime: userLocalTime.toISOString(),
          hour: userLocalTime.getHours(),
          dayOfWeek: userLocalTime.getDay(),
        },
      },
      "Timezone conversion debug info"
    );
  } catch (error) {
    console.error("Error in timezone debug:", error);
    return sendError(res, "Failed to debug timezone", 500);
  }
};

/**
 * Debug endpoint to check mentor availability
 * GET /api/mentors/availability/debug
 */
export const debugMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    return sendSuccess(
      res,
      {
        mentorId: mentor._id,
        userId: mentor.userId,
        availability: mentor.availability || [],
        weeklyAvailability: mentor.weeklyAvailability || [],
        timezone: dbUser.timezone || "UTC",
      },
      "Mentor availability debug info"
    );
  } catch (error) {
    console.error("Error in mentor availability debug:", error);
    return sendError(res, "Failed to debug mentor availability", 500);
  }
};
