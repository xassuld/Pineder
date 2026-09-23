import { Request, Response } from "express";
import Mentor from "../../models/Mentor";
import { logger } from "../../utils/logger";
import { sendSuccess, sendError } from "../../utils/helpers";

/**
 * Get mentor by ID (public profile)
 * GET /api/mentors/:id
 */
export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findById(id).populate(
      "userId",
      "firstName lastName email avatar bio location"
    );

    if (!mentor) {
      return sendError(res, "Mentor not found", 404);
    }

    // Return public profile data only
    const publicProfile = {
      _id: mentor._id,
      user: mentor.userId,
      specialties: mentor.specialties,
      bio: mentor.bio,
      experience: mentor.experience,
      hourlyRate: mentor.hourlyRate,
      subjects: mentor.subjects,
      education: mentor.education,
      certifications: mentor.certifications,
      languages: mentor.languages,
      rating: mentor.rating,
      totalSessions: mentor.totalSessions,
      totalStudents: mentor.totalStudents,
      isVerified: mentor.isVerified,
      createdAt: mentor.createdAt,
    };

    return sendSuccess(
      res,
      publicProfile,
      "Mentor profile retrieved successfully"
    );
  } catch (error) {
    logger.error("Get mentor by ID failed", { error });
    return sendError(res, "Failed to get mentor profile", 500);
  }
};

/**
 * Get all mentors (for browsing)
 * GET /api/mentors
 */
export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialty,
      subject,
      minRating,
      maxRate,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {}; // Show all mentors, not just verified ones

    if (specialty) filter.specialties = { $in: [specialty] };
    if (subject) filter.subjects = { $in: [subject] };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxRate) filter.hourlyRate = { $lte: Number(maxRate) };

    const mentors = await Mentor.find(filter)
      .populate("userId", "firstName lastName email avatar bio location")
      .select(
        "userId specialties bio experience hourlyRate subjects education certifications languages rating totalSessions totalStudents isVerified availability mentorType"
      )
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1, totalSessions: -1 });

    const total = await Mentor.countDocuments(filter);

    return sendSuccess(
      res,
      {
        mentors,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Mentors retrieved successfully"
    );
  } catch (error) {
    logger.error("Get all mentors failed", { error });
    return sendError(res, "Failed to get mentors", 500);
  }
};
