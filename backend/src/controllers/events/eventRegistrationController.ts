import { Response } from "express";
import Event from "../../models/Event";
import Student from "../../models/Student";
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

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

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

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can register for events",
      });
    }

    const { eventId } = req.params;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const event = await Event.findById(eventId);
    if (!event) return notFound(res, "Event");

    if (event.status !== "published") {
      return badRequest(res, "Event is not available for registration");
    }

    if (event.registeredStudents.includes(student._id as any)) {
      return badRequest(res, "Already registered for this event");
    }

    if (
      event.maxParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      return badRequest(res, "Event is full");
    }

    event.registeredStudents.push(student._id as any);
    event.currentParticipants += 1;
    await event.save();

    success(res, event, "Successfully registered for event");
  } catch (error) {
    handleError(res, error, "register for event");
  }
};

export const unregisterFromEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can unregister from events",
      });
    }

    const { eventId } = req.params;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const event = await Event.findById(eventId);
    if (!event) return notFound(res, "Event");

    if (!event.registeredStudents.includes(student._id as any)) {
      return badRequest(res, "Not registered for this event");
    }

    event.registeredStudents = event.registeredStudents.filter(
      (id) => id.toString() !== (student._id as any).toString()
    );
    event.currentParticipants = Math.max(0, event.currentParticipants - 1);
    await event.save();

    success(res, event, "Successfully unregistered from event");
  } catch (error) {
    handleError(res, error, "unregister from event");
  }
};

export const getStudentEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can view their events" });
    }

    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const skip = (Number(page) - 1) * Number(limit);

    const events = await Event.find({
      registeredStudents: student._id,
      status: "published",
    })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments({
      registeredStudents: student._id,
      status: "published",
    });

    success(res, {
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    handleError(res, error, "fetch student events");
  }
};
