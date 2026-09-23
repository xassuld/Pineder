import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

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

export const validateSessionJoin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "grade subjects")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      });

    if (!session) return notFound(res, "Session");

    let isAuthorized = false;
    
    if (req.user.role === "mentor") {
      const mentor = await Mentor.findOne({ userId: req.user.dbId });
      isAuthorized = !!(mentor && mentor._id?.toString() === session.mentorId._id?.toString());
    } else if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user.dbId });
      isAuthorized = !!(student && student._id?.toString() === session.studentId._id?.toString());
    }

    if (!isAuthorized) {
      return res.status(403).json({ success: false, error: "Not authorized to join this session" });
    }

    if (session.status !== "approved" && session.status !== "scheduled") {
      return badRequest(res, "Session is not ready to join");
    }

    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const timeDiff = sessionStart.getTime() - now.getTime();
    const minutesUntilStart = timeDiff / (1000 * 60);

    if (minutesUntilStart > 10) {
      return badRequest(res, "Session has not started yet");
    }

    if (minutesUntilStart < -180) {
      return badRequest(res, "Session has ended");
    }

    success(res, {
      isValid: true,
      session,
      isHost: req.user.role === "mentor"
    });
  } catch (error) {
    handleError(res, error, "validate session join");
  }
};

export const checkSessionAvailability = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return notFound(res, "Session");

    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const sessionEnd = new Date(session.endTime);

    const isActive = now >= sessionStart && now <= sessionEnd;
    const isUpcoming = now < sessionStart;
    const isPast = now > sessionEnd;

    const timeUntilStart = sessionStart.getTime() - now.getTime();
    const minutesUntilStart = timeUntilStart / (1000 * 60);

    success(res, {
      sessionId: session._id,
      isActive,
      isUpcoming,
      isPast,
      minutesUntilStart: Math.max(0, Math.floor(minutesUntilStart)),
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status
    });
  } catch (error) {
    handleError(res, error, "check session availability");
  }
};
