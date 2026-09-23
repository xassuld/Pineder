import { Request, Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  paginatedResponse 
} from "../../utils/responseHelpers";

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, specialty, verified } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter: any = {};
    if (search) {
      filter.$or = [
        { "userId.firstName": { $regex: search, $options: "i" } },
        { "userId.lastName": { $regex: search, $options: "i" } },
        { specialties: { $in: [new RegExp(String(search), "i")] } }
      ];
    }
    if (specialty) filter.specialties = { $in: [specialty] };
    if (verified !== undefined) filter.isVerified = verified === "true";

    const [mentors, total] = await Promise.all([
      Mentor.find(filter)
        .populate("userId", "firstName lastName email avatar")
        .sort({ rating: -1, totalSessions: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Mentor.countDocuments(filter)
    ]);

    return paginatedResponse(res, mentors, Number(page), Number(limit), total);
  } catch (error) {
    return errorResponse(res, "Failed to fetch mentors", 500);
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findById(id)
      .populate("userId", "firstName lastName email avatar bio")
      .populate("availability");

    if (!mentor) return notFoundResponse(res, "Mentor");

    return successResponse(res, mentor);
  } catch (error) {
    return errorResponse(res, "Failed to fetch mentor", 500);
  }
};

export const updateMentorAvailability = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Authentication required" });

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFoundResponse(res, "Mentor");

    const { availability } = req.body;
    mentor.availability = availability;
    await mentor.save();

    return successResponse(res, mentor, "Availability updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update availability", 500);
  }
};
