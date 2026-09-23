import { Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../utils/responseHelpers";
import { AuthRequest } from "../../middleware/auth";

export const getMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return unauthorizedResponse(res);
    }

    // Use a single aggregation query to get both user and mentor data efficiently
    const result = await User.aggregate([
      { $match: { email: user.email } },
      {
        $lookup: {
          from: "mentors",
          localField: "_id",
          foreignField: "userId",
          as: "mentor",
        },
      },
      { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },
    ]);

    if (result.length === 0) {
      return notFoundResponse(res, "User");
    }

    const dbUser = result[0];
    const mentor = dbUser.mentor;

    if (!mentor) {
      // Return user data only, without mentor-specific data
      const profileData = {
        // User data
        firstName: dbUser.firstName || "",
        lastName: dbUser.lastName || "",
        email: dbUser.email || "",
        avatar: dbUser.avatar || "",
        backgroundImage: dbUser.backgroundImage || "",
        bio: dbUser.bio || "",
        title: dbUser.title || "",

        // Default mentor-specific data (empty since no mentor profile exists)
        specialties: [],
        experience: 0,
        hourlyRate: 0,
        mentorType: "Software Engineer",
        subjects: [],
        education: [],
        certifications: [],
        languages: [],
        timezone: "UTC",
        availability: [],
        rating: 0,
        totalSessions: 0,
        totalStudents: 0,
        isVerified: false,

        // Metadata
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };

      return successResponse(
        res,
        profileData,
        "User profile retrieved successfully (no mentor profile found)"
      );
    }

    // Structure the response to include both user and mentor data
    const profileData = {
      // User data
      firstName: dbUser.firstName || "",
      lastName: dbUser.lastName || "",
      email: dbUser.email || "",
      avatar: dbUser.avatar || "",
      backgroundImage: dbUser.backgroundImage || "",
      bio: dbUser.bio || mentor.bio || "",
      title: dbUser.title || "",

      // Mentor-specific data
      specialties: mentor.specialties || [],
      experience: mentor.experience || 0,
      hourlyRate: mentor.hourlyRate || 0,
      mentorType: mentor.mentorType || "Software Engineer",
      subjects: mentor.subjects || [],
      education: mentor.education || [],
      certifications: mentor.certifications || [],
      languages: mentor.languages || [],
      timezone: mentor.timezone || "UTC",
      availability: mentor.availability || [],
      rating: mentor.rating || 0,
      totalSessions: mentor.totalSessions || 0,
      totalStudents: mentor.totalStudents || 0,
      isVerified: mentor.isVerified || false,

      // Metadata
      createdAt: mentor.createdAt,
      updatedAt: mentor.updatedAt,
    };

    return successResponse(
      res,
      profileData,
      "Mentor profile retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    return errorResponse(res, "Failed to fetch mentor", 500);
  }
};
