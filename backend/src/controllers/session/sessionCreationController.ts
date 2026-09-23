import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import { ZoomMeetingService } from "../../services/zoomMeetingService";
import {
  createSessionTime,
  isValidTimezone,
  convertFromUTC,
} from "../../utils/timezone";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// POST - Book a session with mentor
export const bookSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can book sessions" });
    }

    const {
      mentorId,
      date,
      time,
      topic,
      studentChoice,
      requestNotes,
      userTimezone,
    } = req.body;

    // Validate required fields
    if (!mentorId || !date || !time || !topic || !studentChoice) {
      return badRequest(
        res,
        "Mentor ID, date, time, topic, and student choice are required"
      );
    }

    // Validate student choice
    if (!["free", "coffee", "ice-cream"].includes(studentChoice)) {
      return badRequest(
        res,
        "Invalid student choice. Must be 'free', 'coffee', or 'ice-cream'"
      );
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return notFound(res, "Mentor");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return badRequest(
        res,
        "Student profile not found. Please complete your profile first"
      );
    }

    // Set UB (Ulaanbaatar) as the standard timezone for all meetings
    const UB_TIMEZONE = "Asia/Ulaanbaatar";
    const effectiveUserTimezone = UB_TIMEZONE;
    const mentorTimezone = UB_TIMEZONE;

    console.log("Using UB timezone for all meetings:", UB_TIMEZONE);

    // Parse the date and create session time with timezone conversion
    const sessionDate = new Date(date);
    const sessionTimeData = createSessionTime(
      sessionDate,
      time,
      effectiveUserTimezone,
      mentorTimezone
    );

    const { startTimeUTC, endTimeUTC, timezoneInfo } = sessionTimeData;

    // Validate that dates are valid
    if (isNaN(startTimeUTC.getTime()) || isNaN(endTimeUTC.getTime())) {
      return badRequest(res, "Invalid date or time format");
    }

    // Validate session time (must be in the future with some buffer)
    const now = new Date();
    const bufferMinutes = 30; // Allow booking 30 minutes in advance
    const minimumTime = new Date(now.getTime() + bufferMinutes * 60 * 1000);

    console.log("Date validation debug:");
    console.log("- startTimeUTC:", startTimeUTC.toISOString());
    console.log("- now (UTC):", now.toISOString());
    console.log("- minimumTime (UTC):", minimumTime.toISOString());
    console.log("- startTimeUTC <= minimumTime:", startTimeUTC <= minimumTime);
    console.log(
      "- difference (minutes):",
      (startTimeUTC.getTime() - now.getTime()) / (1000 * 60)
    );

    if (startTimeUTC <= minimumTime) {
      return badRequest(
        res,
        `Session must be scheduled at least ${bufferMinutes} minutes in advance`
      );
    }

    // Check if time slot is available
    const conflictingSession = await Session.findOne({
      mentorId,
      startTime: { $lt: endTimeUTC },
      endTime: { $gt: startTimeUTC },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
    });

    if (conflictingSession) {
      return badRequest(res, "This time slot is not available");
    }

    // Check mentor availability for this day and time (in mentor's timezone)
    // Since we're using UB timezone for all meetings, we can simplify this
    let mentorLocalTime;
    try {
      // For UB timezone, we can use the UTC time directly since UB is UTC+8
      // and we've already adjusted for this in createSessionTime
      mentorLocalTime = new Date(startTimeUTC.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for UB

      console.log("Mentor local time calculation:");
      console.log("- startTimeUTC:", startTimeUTC.toISOString());
      console.log("- mentorLocalTime:", mentorLocalTime.toISOString());

      // Fallback to standard timezone conversion if needed
      if (isNaN(mentorLocalTime.getTime())) {
        console.log("Fallback: Using standard timezone conversion");
        mentorLocalTime = new Date(
          startTimeUTC.toLocaleString("en-US", {
            timeZone: mentorTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (error) {
      console.error("Timezone conversion error:", error);
      return badRequest(
        res,
        `Invalid timezone: ${mentorTimezone}. Please use a valid IANA timezone.`
      );
    }
    // Convert the request date to YYYY-MM-DD format for matching
    const requestDate = new Date(date).toISOString().split("T")[0];
    console.log(`Debug: Original time from request: ${time}`);
    console.log(`Debug: Date from request: ${date}`);
    console.log(`Debug: Request date formatted: ${requestDate}`);
    console.log(`Debug: UTC time: ${startTimeUTC.toISOString()}`);
    console.log(`Debug: Mentor timezone: ${mentorTimezone}`);
    console.log(`Debug: Mentor local time: ${mentorLocalTime.toISOString()}`);
    console.log(
      `Debug: Mentor availability:`,
      JSON.stringify(mentor.availability, null, 2)
    );
    console.log(`Debug: User timezone: ${effectiveUserTimezone}`);

    // Check mentor availability for this specific date
    const mentorAvailability = mentor.availability?.find(
      (a) => a.date === requestDate && a.isAvailable
    );

    if (!mentorAvailability) {
      // Try to find any availability for this mentor to provide better error message
      const hasAnyAvailability = mentor.availability?.some(
        (a) => a.isAvailable
      );

      if (!hasAnyAvailability) {
        return badRequest(
          res,
          "Mentor has not set any availability. Please contact the mentor to set their available times."
        );
      }

      const studentLocalTime = convertFromUTC(
        startTimeUTC,
        effectiveUserTimezone
      );
      const dayName = studentLocalTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: effectiveUserTimezone,
      });
      console.log(`Debug: Request date: ${requestDate}, Day name: ${dayName}`);
      console.log(
        `Debug: Available dates:`,
        mentor.availability?.filter((a) => a.isAvailable).map((a) => a.date)
      );

      return badRequest(
        res,
        `Mentor is not available on ${dayName}. Available dates: ${
          mentor.availability
            ?.filter((a) => a.isAvailable)
            .map((a) => a.date)
            .join(", ") || "None"
        }`
      );
    }

    // Get the hour in mentor's timezone
    const mentorHour = mentorLocalTime.getHours();
    console.log(`Debug: Mentor hour: ${mentorHour}`);

    // Parse availability times (they are stored as strings like "09:00")
    const [availabilityStartHour] = mentorAvailability.startTime
      .split(":")
      .map(Number);
    const [availabilityEndHour] = mentorAvailability.endTime
      .split(":")
      .map(Number);

    console.log(
      `Debug: Mentor availability start time: ${mentorAvailability.startTime} (${availabilityStartHour})`
    );
    console.log(
      `Debug: Mentor availability end time: ${mentorAvailability.endTime} (${availabilityEndHour})`
    );
    console.log(
      `Debug: Requested hour: ${mentorHour}, Available range: ${availabilityStartHour}-${availabilityEndHour}`
    );

    // Allow booking if the requested time is within the availability window
    // Use <= for end time to allow booking at the exact end time
    if (
      mentorHour < availabilityStartHour ||
      mentorHour > availabilityEndHour
    ) {
      // Format the availability times for display
      const formatTimeForDisplay = (hour: number) => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:00 ${ampm}`;
      };

      const startTimeDisplay = formatTimeForDisplay(availabilityStartHour);
      const endTimeDisplay = formatTimeForDisplay(availabilityEndHour);
      const mentorHourDisplay = formatTimeForDisplay(mentorHour);

      // Also show the student's time for clarity
      let studentLocalTime;
      try {
        studentLocalTime = new Date(
          startTimeUTC.toLocaleString("sv-SE", {
            timeZone: effectiveUserTimezone,
          })
        );

        // Fallback if conversion fails
        if (isNaN(studentLocalTime.getTime())) {
          studentLocalTime = new Date(
            startTimeUTC.toLocaleString("en-US", {
              timeZone: effectiveUserTimezone,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      } catch (error) {
        console.error("Student timezone conversion error:", error);
        studentLocalTime = startTimeUTC; // Fallback to UTC
      }
      const studentHourDisplay = formatTimeForDisplay(
        studentLocalTime.getHours()
      );

      return badRequest(
        res,
        `Session time is outside mentor's available hours.\n` +
          `Student time: ${studentHourDisplay} (${effectiveUserTimezone})\n` +
          `Mentor time: ${mentorHourDisplay} (${mentorTimezone})\n` +
          `Mentor is available: ${startTimeDisplay} - ${endTimeDisplay} (${mentorTimezone})`
      );
    }

    // Create session with UTC times and timezone info
    const session = await Session.create({
      title: `${topic} Session`,
      description: requestNotes || `Session on ${topic}`,
      mentorId,
      studentId: student._id,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      subject: topic,
      studentChoice,
      requestNotes: requestNotes || `Session on ${topic}`,
      status: "requested",
    });

    // Populate mentor and student details for response
    const populatedSession = await Session.findById(session._id)
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "grade subjects")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    success(
      res,
      populatedSession,
      "Session booking request created successfully",
      201
    );
  } catch (error) {
    handleError(res, error, "book session");
  }
};
