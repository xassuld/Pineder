import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
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

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getDashboardOverview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can access dashboard" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const totalSessions = await Session.countDocuments({
      mentorId: mentor._id,
    });

    const activeStudents = await Session.distinct("studentId", {
      mentorId: mentor._id,
    });

    const averageRating = mentor.rating || 0;

    const pendingRequests = await Session.countDocuments({
      mentorId: mentor._id,
      status: "requested",
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const thisMonthSessions = await Session.find({
      mentorId: mentor._id,
      status: "completed",
      completedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const thisMonthHours = thisMonthSessions.reduce((total, session) => {
      const duration =
        (session.endTime.getTime() - session.startTime.getTime()) /
        (1000 * 60 * 60);
      return total + duration;
    }, 0);

    const completedSessions = await Session.countDocuments({
      mentorId: mentor._id,
      status: "completed",
    });

    const uniqueStudents = activeStudents.length;

    success(res, {
      overview: {
        totalSessions,
        activeStudents: uniqueStudents,
        averageRating: Math.round(averageRating * 10) / 10,
        pendingRequests,
      },
      performance: {
        thisMonthHours: Math.round(thisMonthHours * 10) / 10,
        completedSessions,
        averageRating: Math.round(averageRating * 10) / 10,
        totalStudents: uniqueStudents,
      },
    });
  } catch (error) {
    handleError(res, error, "fetch dashboard overview");
  }
};

export const getMentorPerformance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can view performance" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const { period = "month" } = req.query;

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const sessions = await Session.find({
      mentorId: mentor._id,
      status: "completed",
      completedAt: { $gte: startDate, $lte: endDate },
    });

    const totalHours = sessions.reduce((total, session) => {
      const duration =
        (session.endTime.getTime() - session.startTime.getTime()) /
        (1000 * 60 * 60);
      return total + duration;
    }, 0);

    const completedSessions = sessions.length;
    const averageRating = mentor.rating || 0;
    const uniqueStudents = await Session.distinct("studentId", {
      mentorId: mentor._id,
      status: "completed",
      completedAt: { $gte: startDate, $lte: endDate },
    });

    success(res, {
      period,
      statistics: {
        totalHours: Math.round(totalHours * 10) / 10,
        completedSessions,
        averageRating: Math.round(averageRating * 10) / 10,
        uniqueStudents: uniqueStudents.length,
      },
    });
  } catch (error) {
    handleError(res, error, "fetch performance statistics");
  }
};
