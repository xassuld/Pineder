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

export const getAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const sessions = await Session.find()
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "grade subjects")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: -1 });

    success(res, sessions);
  } catch (error) {
    handleError(res, error, "fetch all sessions");
  }
};

// GET - Get upcoming sessions for user (student or mentor)
export const getUpcomingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    let sessions;

    if (req.user.role === "mentor") {
      const mentor = await Mentor.findOne({ userId: user._id });
      if (!mentor) return notFound(res, "Mentor");

      sessions = await Session.find({
        mentorId: mentor._id,
        status: { $in: ["approved", "scheduled"] },
        startTime: { $gte: new Date() },
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
      const student = await Student.findOne({ userId: user._id });
      if (!student) return notFound(res, "Student");

      sessions = await Session.find({
        studentId: student._id,
        status: { $in: ["approved", "scheduled"] },
        startTime: { $gte: new Date() },
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

    const formattedSessions = sessions.map((session) => {
      const isMentor = req.user!.role === "mentor";
      const otherParty = isMentor
        ? session.studentId
        : (session.mentorId as any);

      return {
        _id: session._id,
        title: session.title,
        subject: session.subject,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        studentChoice: session.studentChoice,
        zoomJoinUrl: session.zoomJoinUrl,
        zoomStartUrl: session.zoomStartUrl,
        zoomPassword: session.zoomPassword,
        meetingProvider: session.meetingProvider,
        instructor: {
          _id: isMentor ? user._id : otherParty.userId._id,
          firstName: isMentor ? user.firstName : otherParty.userId.firstName,
          lastName: isMentor ? user.lastName : otherParty.userId.lastName,
          avatar: isMentor ? user.avatar : otherParty.userId.avatar,
          rating: isMentor
            ? (session.mentorId as any)?.rating || 0
            : (otherParty as any)?.rating || 0,
          specialties: isMentor
            ? (session.mentorId as any)?.specialties || []
            : (otherParty as any)?.specialties || [],
        },
        student: {
          _id: isMentor ? otherParty.userId._id : user._id,
          firstName: isMentor ? otherParty.userId.firstName : user.firstName,
          lastName: isMentor ? otherParty.userId.lastName : user.lastName,
          avatar: isMentor ? otherParty.userId.avatar : user.avatar,
          grade: isMentor ? otherParty.grade : null,
        },
        canJoin:
          session.status === "approved" || session.status === "scheduled",
        isHost: req.user!.role === "mentor",
      };
    });

    success(res, { sessions: formattedSessions });
  } catch (error) {
    handleError(res, error, "fetch upcoming sessions");
  }
};

export const getSessionById = async (req: AuthRequest, res: Response) => {
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
      return res
        .status(403)
        .json({ success: false, error: "Not authorized to view this session" });
    }

    success(res, session);
  } catch (error) {
    handleError(res, error, "fetch session");
  }
};
