import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  unauthorizedResponse, 
  forbiddenResponse 
} from "../../utils/responseHelpers";

export const getStudentBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFoundResponse(res, "Student");

    const { status } = req.query;
    const filter: any = { studentId: student._id };
    if (status) filter.status = status;

    const sessions = await Session.find(filter)
      .populate({
        path: "mentorId",
        select: "specialties bio rating",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .sort({ startTime: -1 });

    return successResponse(res, sessions);
  } catch (error) {
    return errorResponse(res, "Failed to fetch student bookings", 500);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const { id: sessionId } = req.params;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFoundResponse(res, "Student");

    const session = await Session.findOne({
      _id: sessionId,
      studentId: student._id,
    });

    if (!session) return notFoundResponse(res, "Session");

    if (session.status !== "requested" && session.status !== "approved") {
      return errorResponse(res, "Can only cancel requested or approved sessions", 400);
    }

    session.status = "cancelled";
    await session.save();

    return successResponse(res, session, "Session cancelled successfully");
  } catch (error) {
    return errorResponse(res, "Failed to cancel booking", 500);
  }
};

export const getSessionDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);

    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "studentCode major")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      });

    if (!session) return notFoundResponse(res, "Session");

    return successResponse(res, session);
  } catch (error) {
    return errorResponse(res, "Failed to get session details", 500);
  }
};
