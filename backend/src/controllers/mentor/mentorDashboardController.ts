import { Request, Response } from "express";
import Mentor from "../../models/Mentor";
import Session from "../../models/Session";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../../utils/responseHelpers";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return notFoundResponse(res, "User");
    }

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) {
      return notFoundResponse(res, "Mentor");
    }

    // Get current date for today's calculations
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    // Fetch all sessions for this mentor
    const allSessions = await Session.find({ mentorId: mentor._id })
      .populate("studentId", "userId")
      .populate("studentId.userId", "firstName lastName email");

    // Calculate statistics
    const pendingRequests = allSessions.filter(
      (session) => session.status === "requested"
    ).length;
    const todaysSessions = allSessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return (
        sessionDate >= startOfDay &&
        sessionDate <= endOfDay &&
        session.status === "approved"
      );
    }).length;

    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(
      (session) => session.status === "completed"
    ).length;

    // Calculate average rating
    const ratedSessions = allSessions.filter(
      (session) => session.rating && session.rating > 0
    );
    const averageRating =
      ratedSessions.length > 0
        ? ratedSessions.reduce(
            (sum, session) => sum + (session.rating || 0),
            0
          ) / ratedSessions.length
        : 0;

    // Calculate total hours
    const totalHours = allSessions
      .filter((session) => session.status === "completed")
      .reduce((sum, session) => {
        const durationMs =
          new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime();
        const durationHours = durationMs / (1000 * 60 * 60); // Convert ms to hours
        return sum + durationHours;
      }, 0);

    // Get unique students
    const uniqueStudentIds = [
      ...new Set(
        allSessions.map((session) => session.studentId?.toString() || "")
      ),
    ];
    const totalStudents = uniqueStudentIds.filter((id) => id !== "").length;

    // Get recent activity (last 5 sessions)
    const recentActivity = allSessions
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((session) => {
        const studentData = session.studentId as any;
        const userData = studentData?.userId as any;

        return {
          studentName:
            userData?.firstName && userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.email?.split("@")[0] || "Student",
          topic: session.title || session.subject || "General Session",
          status: session.status,
          timestamp: session.createdAt,
        };
      });

    // Get upcoming sessions with Zoom links
    const upcomingSessions = allSessions
      .filter(
        (session) =>
          session.status === "approved" &&
          new Date(session.startTime) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 10)
      .map((session) => {
        const studentData = session.studentId as any;
        const userData = studentData?.userId as any;

        return {
          id: (session as any)._id?.toString() || "",
          studentName:
            userData?.firstName && userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.email?.split("@")[0] || "Student",
          topic: session.title || session.subject || "General Session",
          date: new Date(session.startTime).toLocaleDateString(),
          time: new Date(session.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          zoomJoinUrl: session.zoomJoinUrl,
          zoomStartUrl: session.zoomStartUrl,
        };
      });

    const dashboardData = {
      pendingRequests,
      todaysSessions,
      totalStudents,
      totalSessions,
      completedSessions,
      averageRating,
      totalHours,
      recentActivity,
      upcomingSessions,
    };

    return successResponse(
      res,
      dashboardData,
      "Dashboard stats retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return errorResponse(res, "Failed to fetch dashboard stats", 500);
  }
};
