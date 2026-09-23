import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

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

const success = <T>(res: Response, data?: T, message?: string, status = 200) => {
  const response: { success: true; data?: T; message?: string } = { success: true };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const validateRescheduleRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can validate reschedule requests",
        });
    }

    const { sessionId } = req.params;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findById(sessionId)
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    if (!session) return notFound(res, "Session");

    if (session.mentorId.toString() !== (mentor._id as any).toString()) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Can only validate reschedule for your own sessions",
        });
    }

    if (session.status !== "reschedule_requested") {
      return badRequest(res, "Session is not pending reschedule approval");
    }

    if (!session.rescheduleRequest) {
      return badRequest(res, "No reschedule request found");
    }

    const rescheduleRequest = session.rescheduleRequest;
    const dayOfWeek = rescheduleRequest.newStartTime.getDay();
    const mentorAvailability = mentor.availability?.find(
      (a: any) => a.dayOfWeek === dayOfWeek
    );

    if (!mentorAvailability || !mentorAvailability.isAvailable) {
      return badRequest(res, "Mentor is not available at the requested time");
    }

    const startHour = rescheduleRequest.newStartTime.getHours();
    const endHour = rescheduleRequest.newEndTime.getHours();
    const mentorStartHour = new Date(mentorAvailability.startTime).getHours();
    const mentorEndHour = new Date(mentorAvailability.endTime).getHours();

    if (startHour < mentorStartHour || endHour > mentorEndHour) {
      return badRequest(res, "Requested time is outside mentor's availability");
    }

    const existingSession = await Session.findOne({
      mentorId: mentor._id,
      startTime: { $lt: rescheduleRequest.newEndTime },
      endTime: { $gt: rescheduleRequest.newStartTime },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
      _id: { $ne: sessionId },
    });

    if (existingSession) {
      return badRequest(res, "Time slot conflicts with another session");
    }

    success(res, {
      isValid: true,
      session,
      rescheduleRequest,
      mentorAvailability,
    });
  } catch (error) {
    handleError(res, error, "validate reschedule request");
  }
};

export const checkRescheduleConflicts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can check reschedule conflicts",
        });
    }

    const { sessionId } = req.params;
    const { newStartTime, newEndTime } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findById(sessionId);
    if (!session) return notFound(res, "Session");

    if (session.mentorId.toString() !== (mentor._id as any).toString()) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Can only check conflicts for your own sessions",
        });
    }

    const conflicts = await Session.find({
      mentorId: mentor._id,
      startTime: { $lt: new Date(newEndTime) },
      endTime: { $gt: new Date(newStartTime) },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
      _id: { $ne: sessionId },
    });

    success(res, {
      hasConflicts: conflicts.length > 0,
      conflicts: conflicts.map(c => ({
        id: c._id,
        title: c.title,
        startTime: c.startTime,
        endTime: c.endTime,
        status: c.status,
      })),
    });
  } catch (error) {
    handleError(res, error, "check reschedule conflicts");
  }
};
