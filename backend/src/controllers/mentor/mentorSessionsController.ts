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

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getNewSessionRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can view session requests",
        });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const requests = await Session.find({
      mentorId: mentor._id,
      status: "requested",
    })
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ createdAt: -1 });

    const requestCount = requests.length;

    success(res, {
      requests,
      count: requestCount,
    });
  } catch (error) {
    handleError(res, error, "fetch session requests");
  }
};

export const getUpcomingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can view upcoming sessions",
        });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const { limit = 5 } = req.query;

    const upcomingSessions = await Session.find({
      mentorId: mentor._id,
      status: { $in: ["approved", "scheduled"] },
      startTime: { $gt: new Date() },
    })
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: 1 })
      .limit(Number(limit));

    success(res, {
      sessions: upcomingSessions,
      total: upcomingSessions.length,
    });
  } catch (error) {
    handleError(res, error, "fetch upcoming sessions");
  }
};

export const getRecentStudents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can view recent students",
        });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const { limit = 5 } = req.query;

    const studentsWithSessions = await Session.aggregate([
      { $match: { mentorId: mentor._id } },
      {
        $group: {
          _id: "$studentId",
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          lastSession: { $max: "$startTime" },
        },
      },
      { $sort: { lastSession: -1 } },
      { $limit: Number(limit) },
    ]);

    const recentStudents = await Promise.all(
      studentsWithSessions.map(async (studentData) => {
        const student = await Student.findById(studentData._id).populate({
          path: "userId",
          select: "firstName lastName email avatar",
        });

        if (!student) return null;

        const progressPercentage = Math.min(
          (studentData.completedSessions / 10) * 100,
          100
        );

        return {
          _id: student._id,
          firstName: (student.userId as any).firstName,
          lastName: (student.userId as any).lastName,
          avatar: (student.userId as any).avatar,
          totalSessions: studentData.totalSessions,
          completedSessions: studentData.completedSessions,
          progressPercentage: Math.round(progressPercentage),
          lastSession: studentData.lastSession,
        };
      })
    );

    const validStudents = recentStudents.filter((student) => student !== null);

    success(res, {
      students: validStudents,
      total: validStudents.length,
    });
  } catch (error) {
    handleError(res, error, "fetch recent students");
  }
};
