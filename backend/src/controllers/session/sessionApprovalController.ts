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
  forbiddenResponse,
} from "../../utils/responseHelpers";
import { ZoomMeetingService } from "../../services/zoomMeetingService";

export const getPendingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "mentor") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFoundResponse(res, "Mentor");

    const sessions = await Session.find({
      mentorId: mentor._id,
      status: "requested",
    })
      .populate("studentId", "studentCode major")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: 1 });

    return successResponse(res, sessions);
  } catch (error) {
    return errorResponse(res, "Failed to fetch pending sessions", 500);
  }
};

export const approveSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "mentor") return forbiddenResponse(res);

    const { sessionId } = req.params;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFoundResponse(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
      status: "requested",
    });

    if (!session) return notFoundResponse(res, "Session");

    // Create Zoom meeting for the session
    try {
      const zoomMeeting = await ZoomMeetingService.createMeeting({
        topic: session.title,
        startTime: session.startTime,
        duration: 60, // 1 hour session
        timezone: "UTC"
      });

      // Store Zoom meeting details in the session
      session.zoomMeetingId = zoomMeeting.id;
      session.zoomJoinUrl = zoomMeeting.join_url;
      session.zoomStartUrl = zoomMeeting.start_url;
      session.zoomPassword = zoomMeeting.password;
    } catch (zoomError) {
      console.error("Failed to create Zoom meeting:", zoomError);
      // Continue with approval even if Zoom creation fails
      // The session can still be approved without Zoom link
    }

    session.status = "approved";
    session.approvedAt = new Date();
    await session.save();

    return successResponse(res, session, "Session approved successfully");
  } catch (error) {
    return errorResponse(res, "Failed to approve session", 500);
  }
};

export const rejectSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "mentor") return forbiddenResponse(res);

    const { sessionId } = req.params;
    const { rejectionReason } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFoundResponse(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
      status: "requested",
    });

    if (!session) return notFoundResponse(res, "Session");

    session.status = "rejected";
    session.rejectionReason = rejectionReason;
    await session.save();

    return successResponse(res, session, "Session rejected successfully");
  } catch (error) {
    return errorResponse(res, "Failed to reject session", 500);
  }
};

export const getMentorSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "mentor") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFoundResponse(res, "Mentor");

    const { status } = req.query;
    const filter: any = { mentorId: mentor._id };
    if (status) filter.status = status;

    const sessions = await Session.find(filter)
      .populate("studentId", "studentCode major")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: -1 });

    return successResponse(res, sessions);
  } catch (error) {
    return errorResponse(res, "Failed to fetch mentor sessions", 500);
  }
};
