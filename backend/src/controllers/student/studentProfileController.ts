import { Response } from "express";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "../../utils/responseHelpers";

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return unauthorizedResponse(res);
    }

    // Use a single aggregation query to get both user and student data efficiently
    const result = await User.aggregate([
      { $match: { email: user.email } },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "userId",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
    ]);

    if (result.length === 0) {
      return notFoundResponse(res, "User");
    }

    const dbUser = result[0];
    const student = dbUser.student;

    if (!student) {
      // Return user data only, without student-specific data
      const profileData = {
        // User data
        firstName: dbUser.firstName || "",
        lastName: dbUser.lastName || "",
        email: dbUser.email || "",
        avatar: dbUser.avatar || "",
        backgroundImage: dbUser.backgroundImage || "",
        bio: dbUser.bio || "",
        studentCode: dbUser.email?.split("@")[0] || "", // Always generate from email
        className: dbUser.major || "",

        // Default student-specific data (empty since no student profile exists)
        grade: "Beginner",
        subjects: [],
        goals: [],

        // Metadata
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };

      return successResponse(
        res,
        profileData,
        "User profile retrieved successfully (no student profile found)"
      );
    }

    // Structure the response to include both user and student data
    const profileData = {
      // User data
      firstName: dbUser.firstName || "",
      lastName: dbUser.lastName || "",
      email: dbUser.email || "",
      avatar: dbUser.avatar || "",
      backgroundImage: dbUser.backgroundImage || "",
      bio: dbUser.bio || "",
      studentCode: dbUser.email?.split("@")[0] || "", // Always generate from email
      className: dbUser.major || "",

      // Student-specific data
      grade: student.grade || "Beginner",
      subjects: student.subjects || [],
      goals: student.goals || [],

      // Metadata
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    return successResponse(
      res,
      profileData,
      "Student profile retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return errorResponse(res, "Failed to fetch student", 500);
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFoundResponse(res, "Student");

    const { grade, subjects, goals } = req.body;

    if (grade) student.grade = grade;
    if (subjects) student.subjects = subjects;
    if (goals) student.goals = goals;

    await student.save();

    return successResponse(
      res,
      student,
      "Student profile updated successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to update student profile", 500);
  }
};
