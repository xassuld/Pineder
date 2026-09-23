import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
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

export const startSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can start sessions" });
    }

    const { sessionId } = req.params;

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
    });
    if (!session) return notFound(res, "Session");

    if (session.status !== "approved") {
      return badRequest(res, "Session must be approved before starting");
    }

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
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can end sessions" });
    }

    const { sessionId } = req.params;

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return notFound(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
    });
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
        status: { $in: ["approved", "scheduled", "active"] },
      })
        .populate("studentId", "grade subjects")
        .populate({
          path: "studentId",
          populate: {
            path: "userId",
            select: "firstName lastName email avatar",
          },
        })
        .sort({ startTime: 1 });
    } else if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user.dbId });
      if (!student) return notFound(res, "Student");

      sessions = await Session.find({
        studentId: student._id,
        status: { $in: ["approved", "scheduled", "active"] },
      })
        .populate("mentorId", "specialties bio rating")
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "firstName lastName email avatar",
          },
        })
        .sort({ startTime: 1 });
    } else {
      return res
        .status(403)
        .json({ success: false, error: "Invalid user role" });
    }

    success(res, sessions);
  } catch (error) {
    handleError(res, error, "fetch active sessions");
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const updateData = req.body;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student && student._id?.toString() === session.studentId?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this session",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    success(res, updatedSession, "Session updated successfully");
  } catch (error) {
    handleError(res, error, "update session");
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student && student._id?.toString() === session.studentId?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this session",
      });
    }

    await Session.findByIdAndDelete(id);

    success(res, null, "Session deleted successfully");
  } catch (error) {
    handleError(res, error, "delete session");
  }
};

export const getTeamsChatUrl = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const session = await Session.findById(id)
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

    if (!session) return notFound(res, "Session");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student &&
        student._id?.toString() === session.studentId._id?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId._id?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this session",
      });
    }

    if (!session.teamsChatUrl) {
      const mentorEmail =
        (session.mentorId as any).userId?.email || "mentor@example.com";
      const teamsChatUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentorEmail}&topic=Session: ${session.title}`;

      await Session.findByIdAndUpdate(id, { teamsChatUrl });
      session.teamsChatUrl = teamsChatUrl;
    }

    success(res, { teamsChatUrl: session.teamsChatUrl });
  } catch (error) {
    handleError(res, error, "get teams chat url");
  }
};
