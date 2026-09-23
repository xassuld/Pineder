import { Response } from "express";
import Mentor from "../../models/Mentor";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// GET - Get available mentors for booking
export const getAvailableMentors = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can view mentors" });
    }

    const mentors = await Mentor.find()
      .populate({
        path: "userId",
        select: "firstName lastName email avatar",
      })
      .select(
        "specialties bio rating hourlyRate subjects totalSessions totalStudents"
      );

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
      totalSessions: mentor.totalSessions,
      totalStudents: mentor.totalStudents,
    }));

    success(res, { mentors: mentorsData });
  } catch (error) {
    handleError(res, error, "fetch available mentors");
  }
};
