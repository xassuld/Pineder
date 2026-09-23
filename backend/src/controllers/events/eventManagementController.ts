import { Response } from "express";
import Event from "../../models/Event";
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

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can update events" });
    }

    const { eventId } = req.params;
    const updateData = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const event = await Event.findById(eventId);
    if (!event) return notFound(res, "Event");

    if (event.mentorId.toString() !== (mentor._id as string).toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Can only update your own events" });
    }

    if (updateData.startTime && updateData.endTime) {
      const start = new Date(updateData.startTime);
      const end = new Date(updateData.endTime);

      if (start >= end) {
        return badRequest(res, "End time must be after start time");
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    success(res, updatedEvent, "Event updated successfully");
  } catch (error) {
    handleError(res, error, "update event");
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can delete events" });
    }

    const { eventId } = req.params;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const event = await Event.findById(eventId);
    if (!event) return notFound(res, "Event");

    if (event.mentorId.toString() !== (mentor._id as string).toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Can only delete your own events" });
    }

    if (event.registeredStudents.length > 0) {
      return badRequest(
        res,
        "Cannot delete event with registered participants"
      );
    }

    await Event.findByIdAndDelete(eventId);

    success(res, null, "Event deleted successfully");
  } catch (error) {
    handleError(res, error, "delete event");
  }
};

export const getMentorEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can view their events" });
    }

    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const skip = (Number(page) - 1) * Number(limit);

    const events = await Event.find({ mentorId: mentor._id })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "registeredStudents",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments({ mentorId: mentor._id });

    const upcomingEvents = await Event.countDocuments({
      mentorId: mentor._id,
      status: "published",
      startTime: { $gt: new Date() },
    });

    const totalParticipants = await Event.aggregate([
      { $match: { mentorId: mentor._id } },
      { $group: { _id: null, total: { $sum: "$currentParticipants" } } },
    ]);

    const totalParticipantsCount =
      totalParticipants.length > 0 ? totalParticipants[0].total : 0;

    success(res, {
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
      statistics: {
        upcomingEvents,
        totalParticipants: totalParticipantsCount,
      },
    });
  } catch (error) {
    handleError(res, error, "fetch mentor events");
  }
};
