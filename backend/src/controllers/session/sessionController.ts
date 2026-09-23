import { Request, Response } from "express";
import Session from "../../models/Session";
import { AuthRequest } from "../../middleware/auth";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  paginatedResponse 
} from "../../utils/responseHelpers";

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, mentorId, studentId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter: any = {};
    if (status) filter.status = status;
    if (mentorId) filter.mentorId = mentorId;
    if (studentId) filter.studentId = studentId;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .populate("mentorId", "specialties bio rating")
        .populate("studentId", "studentCode major")
        .populate({
          path: "mentorId",
          populate: { path: "userId", select: "firstName lastName email avatar" }
        })
        .populate({
          path: "studentId", 
          populate: { path: "userId", select: "firstName lastName email avatar" }
        })
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Session.countDocuments(filter)
    ]);

    return paginatedResponse(res, sessions, Number(page), Number(limit), total);
  } catch (error) {
    return errorResponse(res, "Failed to fetch sessions", 500);
  }
};

export const getUpcomingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Authentication required" });

    const now = new Date();
    const sessions = await Session.find({
      startTime: { $gt: now },
      status: { $in: ["requested", "approved", "scheduled"] }
    })
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "studentCode major")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .sort({ startTime: 1 })
      .limit(10);

    return successResponse(res, sessions);
  } catch (error) {
    return errorResponse(res, "Failed to fetch upcoming sessions", 500);
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
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
    return errorResponse(res, "Failed to fetch session", 500);
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndUpdate(id, req.body, { new: true })
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "studentCode major");

    if (!session) return notFoundResponse(res, "Session");

    return successResponse(res, session, "Session updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update session", 500);
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);

    if (!session) return notFoundResponse(res, "Session");

    return successResponse(res, null, "Session deleted successfully");
  } catch (error) {
    return errorResponse(res, "Failed to delete session", 500);
  }
};

export const getTeamsChatUrl = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) return notFoundResponse(res, "Session");

    const teamsUrl = `https://teams.microsoft.com/l/meetup-join/19:meeting_${sessionId}@thread.v2/0?context={"Tid":"tenant-id"}`;

    return successResponse(res, { teamsUrl });
  } catch (error) {
    return errorResponse(res, "Failed to generate Teams URL", 500);
  }
};
