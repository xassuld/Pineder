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

export const getStudentStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFoundResponse(res, "Student");

    const stats = {
      grade: student.grade,
      subjects: student.subjects,
      goals: student.goals,
      studentCode: student.studentCode,
      major: student.major,
    };

    return successResponse(res, stats);
  } catch (error) {
    return errorResponse(res, "Failed to fetch student stats", 500);
  }
};

export const updateStudentLinks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFoundResponse(res, "User");

    const { links } = req.body;

    return successResponse(
      res,
      { links },
      "Student links updated successfully"
    );
  } catch (error) {
    return errorResponse(res, "Failed to update student links", 500);
  }
};
