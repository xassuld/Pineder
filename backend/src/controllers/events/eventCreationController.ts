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

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, error: "Only mentors can create events" });
    }

    const {
      title,
      description,
      eventType,
      eventDate,
      startTime,
      duration,
      maxParticipants,
      location,
      category,
      tags,
      isPublic,
    } = req.body;

    if (
      !title ||
      !description ||
      !eventType ||
      !eventDate ||
      !startTime ||
      !duration ||
      !maxParticipants
    ) {
      return badRequest(
        res,
        "Title, description, event type, date, start time, duration, and max participants are required"
      );
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    let year, month, day;
    if (eventDate.includes("-")) {
      [year, month, day] = eventDate.split("-").map(Number);
    } else {
      [year, month, day] = eventDate.split(".").map(Number);
    }
    const [hours, minutes] = startTime.split(":").map(Number);

    const startDateTime = new Date(year, month - 1, day, hours, minutes, 0);
    const endDateTime = new Date(
      startDateTime.getTime() + duration * 60 * 1000
    );

    if (startDateTime <= new Date()) {
      return badRequest(res, "Event start time must be in the future");
    }

    if (endDateTime <= startDateTime) {
      return badRequest(res, "Event end time must be after start time");
    }

    const eventData = {
      title,
      description,
      mentorId: mentor._id,
      startTime: startDateTime,
      endTime: endDateTime,
      location: location || "Online",
      locationType:
        location && location.toLowerCase().includes("online")
          ? "online"
          : "in-person",
      maxParticipants: maxParticipants,
      price: 0,
      currency: "USD",
      category,
      eventType,
      tags: tags || [],
      isPublic: isPublic !== false,
      status: "published",
    };

    const event = await Event.create(eventData);

    const populatedEvent = await Event.findById(event._id)
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    success(res, populatedEvent, "Event created successfully", 201);
  } catch (error) {
    handleError(res, error, "create event");
  }
};
