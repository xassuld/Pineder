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

export const approveReschedule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can approve reschedule requests",
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
          error: "Can only approve reschedule for your own sessions",
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
      return badRequest(
        res,
        "Mentor has another session at the requested time"
      );
    }

    const oldStartTime = session.startTime;
    const oldEndTime = session.endTime;

    session.startTime = rescheduleRequest.newStartTime;
    session.endTime = rescheduleRequest.newEndTime;
    session.status = "scheduled";

    if (!session.rescheduleHistory) {
      session.rescheduleHistory = [];
    }

    session.rescheduleHistory.push({
      requestedBy: rescheduleRequest.requestedBy,
      requestedAt: rescheduleRequest.requestedAt,
      oldStartTime,
      oldEndTime,
      newStartTime: rescheduleRequest.newStartTime,
      newEndTime: rescheduleRequest.newEndTime,
      reason: rescheduleRequest.reason,
      status: "approved",
      approvedAt: new Date(),
    });

    session.rescheduleRequest = undefined;
    await session.save();

    success(res, session, "Reschedule request approved successfully");
  } catch (error) {
    handleError(res, error, "approve reschedule");
  }
};


