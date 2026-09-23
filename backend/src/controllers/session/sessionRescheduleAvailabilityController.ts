import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import { MentorAvailability } from "../../types/common";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: { success: true; data?: T; message?: string } = {
    success: true,
  };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getMentorAvailabilityForReschedule = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can request reschedule",
      });
    }

    const { sessionId } = req.params;
    const { date } = req.query;

    const session = await Session.findById(sessionId)
      .populate("mentorId", "availability")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    if (!session) return notFound(res, "Session");

    if (session.status !== "approved" && session.status !== "scheduled") {
      return badRequest(
        res,
        "Can only reschedule approved or scheduled sessions"
      );
    }

    const mentor = session.mentorId as any;
    const availability = mentor.availability || [];

    if (availability.length === 0) {
      return success(res, { timeSlots: [] });
    }

    const timeSlots = [];
    const startDate = date ? new Date(date as string) : new Date();

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      const dayOfWeek = currentDate.getDay();

      const dayAvailability = availability.find(
        (a: MentorAvailability) => a.dayOfWeek === dayOfWeek
      );

      if (dayAvailability && dayAvailability.isAvailable) {
        const startTime = new Date(dayAvailability.startTime);
        const endTime = new Date(dayAvailability.endTime);

        for (
          let hour = startTime.getHours();
          hour < endTime.getHours();
          hour++
        ) {
          const slotTime = new Date(currentDate);
          slotTime.setHours(hour, 0, 0, 0);

          const existingSession = await Session.findOne({
            mentorId: mentor._id,
            startTime: { $lt: new Date(slotTime.getTime() + 60 * 60 * 1000) },
            endTime: { $gt: slotTime },
            status: { $in: ["requested", "approved", "scheduled", "active"] },
            _id: { $ne: sessionId },
          });

          const isAvailable = !existingSession;

          timeSlots.push({
            date: currentDate.toISOString().split("T")[0],
            dayOfWeek: dayOfWeek,
            dayName: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ][dayOfWeek],
            time: `${hour.toString().padStart(2, "0")}:00`,
            isAvailable: isAvailable,
          });
        }
      }
    }

    success(res, {
      timeSlots,
      session: {
        _id: session._id,
        title: session.title,
        subject: session.subject,
        startTime: session.startTime,
        endTime: session.endTime,
        mentorName: `${mentor.userId?.firstName} ${mentor.userId?.lastName}`,
      },
    });
  } catch (error) {
    handleError(res, error, "fetch mentor availability for reschedule");
  }
};
