import { Response } from "express";
import Event from "../../models/Event";
import User from "../../models/User";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const success = <T>(res: Response, data?: T, message?: string, status = 200) => {
  const response: { success: true; data?: T; message?: string } = { success: true };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "registeredStudents",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    if (!event) return notFound(res, "Event");

    if (!event.isPublic && event.status !== "published") {
      return res
        .status(403)
        .json({ success: false, error: "Event not available" });
    }

    let isRegistered = false;

    if (req.user && req.user.role === "student") {
      const user = await User.findOne({ email: req.user.email });
      if (user) {
        const student = await Student.findOne({ userId: user._id });
        if (student) {
          isRegistered = event.registeredStudents.some(
            (s) => s._id.toString() === (student._id as any).toString()
          );
        }
      }
    }

    success(res, {
      ...event.toObject(),
      isRegistered,
    });
  } catch (error) {
    handleError(res, error, "fetch event");
  }
};
