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

export const rejectReschedule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can reject reschedule requests",
        });
    }

    const { sessionId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return badRequest(res, "Rejection reason is required");
    }

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
          error: "Can only reject reschedule for your own sessions",
        });
    }

    if (session.status !== "reschedule_requested") {
      return badRequest(res, "Session is not pending reschedule approval");
    }

    if (!session.rescheduleRequest) {
      return badRequest(res, "No reschedule request found");
    }

    const rescheduleRequest = session.rescheduleRequest;

    if (!session.rescheduleHistory) {
      session.rescheduleHistory = [];
    }

    session.rescheduleHistory.push({
      requestedBy: rescheduleRequest.requestedBy,
      requestedAt: rescheduleRequest.requestedAt,
      oldStartTime: session.startTime,
      oldEndTime: session.endTime,
      newStartTime: rescheduleRequest.newStartTime,
      newEndTime: rescheduleRequest.newEndTime,
      reason: rescheduleRequest.reason,
      status: "rejected",
      rejectedAt: new Date(),
      rejectionReason,
    });

    session.rescheduleRequest = undefined;
    session.status = "scheduled";
    await session.save();

    success(res, session, "Reschedule request rejected successfully");
  } catch (error) {
    handleError(res, error, "reject reschedule");
  }
};
