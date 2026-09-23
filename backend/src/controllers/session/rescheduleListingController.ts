import { Response } from "express";
import Session from "../../models/Session";
import Student from "../../models/Student";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: { success: true; data?: T; message?: string } = {
    success: true,
  };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getRescheduleRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);

    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const skip = (Number(page) - 1) * Number(limit);

    let sessions;
    let total;

    if (req.user.role === "mentor") {
      const mentor = await Mentor.findOne({ userId: user._id });
      if (!mentor) return notFound(res, "Mentor");

      sessions = await Session.find({
        mentorId: mentor._id,
        status: "reschedule_requested",
      })
        .populate("studentId", "grade subjects")
        .populate({
          path: "studentId",
          populate: {
            path: "userId",
            select: "firstName lastName email avatar",
          },
        })
        .sort({ "rescheduleRequest.requestedAt": -1 })
        .skip(skip)
        .limit(Number(limit));

      total = await Session.countDocuments({
        mentorId: mentor._id,
        status: "reschedule_requested",
      });
    } else {
      const student = await Student.findOne({ userId: user._id });
      if (!student) return notFound(res, "Student");

      sessions = await Session.find({
        studentId: student._id,
        status: "reschedule_requested",
      })
        .populate("mentorId", "specialties bio rating")
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "firstName lastName email avatar",
          },
        })
        .sort({ "rescheduleRequest.requestedAt": -1 })
        .skip(skip)
        .limit(Number(limit));

      total = await Session.countDocuments({
        studentId: student._id,
        status: "reschedule_requested",
      });
    }

    success(res, {
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    handleError(res, error, "fetch reschedule requests");
  }
};
