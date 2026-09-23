import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
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

export const getAllMentorsWithAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);

    const mentors = await Mentor.find()
      .populate({
        path: "userId",
        select: "firstName lastName email avatar",
      })
      .select("specialties bio rating hourlyRate availability subjects");

    const mentorsData = mentors.map((mentor) => ({
      _id: mentor._id,
      firstName: (mentor.userId as any).firstName,
      lastName: (mentor.userId as any).lastName,
      email: (mentor.userId as any).email,
      avatar: (mentor.userId as any).avatar,
      specialties: mentor.specialties,
      bio: mentor.bio,
      rating: mentor.rating,
      hourlyRate: mentor.hourlyRate,
      subjects: mentor.subjects,
    }));

    success(res, { mentors: mentorsData });
  } catch (error) {
    handleError(res, error, "fetch mentors with availability");
  }
};

export const getMentorForBooking = async (req: AuthRequest, res: Response) => {
  try {
    // Remove authentication requirement for public availability access
    // if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const mentor = await Mentor.findById(id)
      .populate({
        path: "userId",
        select: "firstName lastName email avatar",
      })
      .select("specialties bio rating hourlyRate availability subjects");

    if (!mentor) return notFound(res, "Mentor");

    const mentorData = {
      _id: mentor._id,
      firstName: (mentor.userId as any).firstName,
      lastName: (mentor.userId as any).lastName,
      email: (mentor.userId as any).email,
      avatar: (mentor.userId as any).avatar,
      specialties: mentor.specialties,
      bio: mentor.bio,
      rating: mentor.rating,
      hourlyRate: mentor.hourlyRate,
      subjects: mentor.subjects,
      availability: mentor.availability || [],
    };

    success(res, mentorData);
  } catch (error) {
    handleError(res, error, "fetch mentor for booking");
  }
};
