import { Response } from "express";
import Session from "../../models/Session";
import Student from "../../models/Student";
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

export const requestReschedule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can request reschedule",
      });
    }

    const { sessionId } = req.params;
    const { newStartTime, newEndTime, reason } = req.body;

    if (!newStartTime || !newEndTime || !reason) {
      return badRequest(
        res,
        "New start time, end time, and reason are required"
      );
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

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

    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);

    if (newStart <= new Date()) {
      return badRequest(res, "New start time must be in the future");
    }

    if (newEnd <= newStart) {
      return badRequest(res, "New end time must be after start time");
    }

    const mentor = session.mentorId as any;
    const dayOfWeek = newStart.getDay();
    const mentorAvailability = mentor.availability?.find(
      (a: MentorAvailability) => a.dayOfWeek === dayOfWeek
    );

    if (!mentorAvailability || !mentorAvailability.isAvailable) {
      return badRequest(res, "Mentor is not available at the requested time");
    }

    const startHour = newStart.getHours();
    const endHour = newEnd.getHours();
    const mentorStartHour = new Date(mentorAvailability.startTime).getHours();
    const mentorEndHour = new Date(mentorAvailability.endTime).getHours();

    if (startHour < mentorStartHour || endHour > mentorEndHour) {
      return badRequest(res, "Requested time is outside mentor's availability");
    }

    const existingSession = await Session.findOne({
      mentorId: mentor._id,
      startTime: { $lt: newEnd },
      endTime: { $gt: newStart },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
      _id: { $ne: sessionId },
    });

    if (existingSession) {
      return badRequest(
        res,
        "Mentor has another session at the requested time"
      );
    }

    const rescheduleRequest = {
      requestedBy: student._id as any,
      requestedAt: new Date(),
      newStartTime: newStart,
      newEndTime: newEnd,
      reason,
      status: "pending" as const,
    };

    session.rescheduleRequest = rescheduleRequest;
    session.status = "reschedule_requested";
    await session.save();

    success(
      res,
      {
        session,
        rescheduleRequest,
        mentorName: `${mentor.userId?.firstName} ${mentor.userId?.lastName}`,
      },
      "Reschedule request submitted successfully"
    );
  } catch (error) {
    handleError(res, error, "request reschedule");
  }
};
