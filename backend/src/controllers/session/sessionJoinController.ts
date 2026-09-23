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

export const getSessionJoinInfo = async (req: AuthRequest, res: Response) => {
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

    // Check if user is authorized to join this session
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

    // Check if session is ready to join
    if (session.status !== "approved" && session.status !== "scheduled") {
      return badRequest(res, "Session is not ready to join");
    }

    // Check if it's time to join (within 10 minutes of start time)
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const timeDiff = sessionStart.getTime() - now.getTime();
    const minutesUntilStart = timeDiff / (1000 * 60);

    if (minutesUntilStart > 10) {
      return badRequest(res, "Session has not started yet");
    }

    if (minutesUntilStart < -180) { // 3 hours after start
      return badRequest(res, "Session has ended");
    }

    // Return join information
    const joinInfo = {
      sessionId: session._id,
      title: session.title,
      subject: session.subject,
      startTime: session.startTime,
      endTime: session.endTime,
      joinUrl: session.zoomJoinUrl,
      startUrl: session.zoomStartUrl,
      password: session.zoomPassword,
      meetingProvider: session.meetingProvider,
      isHost: req.user.role === "mentor"
    };

    success(res, joinInfo, "Session join information retrieved");
  } catch (error) {
    handleError(res, error, "get session join info");
  }
};

export const startSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res.status(403).json({ success: false, error: "Only mentors can start sessions" });
    }

    const { sessionId } = req.params;

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findOne({ _id: sessionId, mentorId: mentor._id });
    if (!session) return notFound(res, "Session");

    if (session.status !== "approved") {
      return badRequest(res, "Session must be approved before starting");
    }

    // Check if it's time to start (within 10 minutes of start time)
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const timeDiff = sessionStart.getTime() - now.getTime();
    const minutesUntilStart = timeDiff / (1000 * 60);

    if (minutesUntilStart > 10) {
      return badRequest(res, "Session has not started yet");
    }

    session.status = "active";
    await session.save();

    success(res, session, "Session started successfully");
  } catch (error) {
    handleError(res, error, "start session");
  }
};

export const endSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res.status(403).json({ success: false, error: "Only mentors can end sessions" });
    }

    const { sessionId } = req.params;

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findOne({ _id: sessionId, mentorId: mentor._id });
    if (!session) return notFound(res, "Session");

    if (session.status !== "active") {
      return badRequest(res, "Session is not active");
    }

    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    success(res, session, "Session ended successfully");
  } catch (error) {
    handleError(res, error, "end session");
  }
};

export const getActiveSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    let sessions;

    if (req.user.role === "mentor") {
      const mentor = await Mentor.findOne({ userId: req.user.dbId });
      if (!mentor) return notFound(res, "Mentor");

      sessions = await Session.find({
        mentorId: mentor._id,
        status: { $in: ["approved", "scheduled", "active"] }
      })
        .populate("studentId", "grade subjects")
        .populate({
          path: "studentId",
          populate: { path: "userId", select: "firstName lastName email avatar" }
        })
        .sort({ startTime: 1 });
    } else if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user.dbId });
      if (!student) return notFound(res, "Student");

      sessions = await Session.find({
        studentId: student._id,
        status: { $in: ["approved", "scheduled", "active"] }
      })
        .populate("mentorId", "specialties bio rating")
        .populate({
          path: "mentorId",
          populate: { path: "userId", select: "firstName lastName email avatar" }
        })
        .sort({ startTime: 1 });
    } else {
      return res.status(403).json({ success: false, error: "Invalid user role" });
    }

    success(res, sessions);
  } catch (error) {
    handleError(res, error, "fetch active sessions");
  }
};
