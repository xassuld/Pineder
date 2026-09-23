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

export const createStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    let dbUser = await User.findOne({ email: req.user.email });

    if (!dbUser) {
      try {
        const firstName = req.headers["x-user-firstname"] as string || "Student";
        const lastName = req.headers["x-user-lastname"] as string || "User";
        
        dbUser = await User.create({
          email: req.user.email,
          firstName: firstName,
          lastName: lastName,
          role: "student",
          bio: req.body.bio,
          studentCode: req.user.email?.split("@")[0] || "", // Always generate from email
          major: req.body.className, // Frontend sends className, map to major
          avatar: req.body.avatar,
          backgroundImage: req.body.backgroundImage,
          profileCompleted: true,
        });
      } catch (userError) {
        console.error("Failed to create user:", userError);
        throw userError;
      }
    } else {
      const firstName = req.headers["x-user-firstname"] as string || "Student";
      const lastName = req.headers["x-user-lastname"] as string || "User";
      
      const userUpdates: any = {
        firstName: firstName,
        lastName: lastName,
        bio: req.body.bio,
        studentCode: req.user.email?.split("@")[0] || "", // Always generate from email
        major: req.body.className, // Frontend sends className, map to major
        avatar: req.body.avatar,
        backgroundImage: req.body.backgroundImage,
        profileCompleted: true,
      };
      dbUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
        new: true,
        runValidators: true,
      });
    }

    const existingStudent = await Student.findOne({ userId: dbUser!._id });
    if (existingStudent) {
      const studentUpdates = {
        grade: req.body.grade || "Beginner",
        subjects: req.body.subjects || [],
        goals: req.body.goals || [],
      };
      const updatedStudent = await Student.findByIdAndUpdate(
        existingStudent._id,
        studentUpdates,
        { new: true, runValidators: true }
      );
      return successResponse(
        res,
        { user: dbUser, student: updatedStudent },
        "Student profile updated successfully"
      );
    }

    const { grade, subjects, goals } = req.body;

    // Create student profile
    const studentData = {
      userId: dbUser!._id,
      grade: grade || "Beginner",
      subjects: subjects || [],
      goals: goals || [],
      studentCode: req.body.studentCode || "",
      major: req.body.className || "Computer Science", // Frontend sends className, map to major
    };

    const student = await Student.create(studentData);

    return successResponse(
      res,
      { user: dbUser, student },
      "Student profile created successfully",
      201
    );
  } catch (error) {
    console.error("Create student profile error:", error);
    return errorResponse(res, "Failed to create student profile", 500);
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorizedResponse(res);
    if (req.user.role !== "student") return forbiddenResponse(res);

    const dbUser = await User.findOne({ email: req.user.email });
    if (!dbUser) {
      return notFoundResponse(res, "User");
    }

    let student = await Student.findOne({ userId: dbUser._id });

    // If no student profile exists, create one
    if (!student) {
      const studentData = {
        userId: dbUser._id,
        grade: req.body.grade || "Beginner",
        subjects: req.body.subjects || [],
        goals: req.body.goals || [],
        studentCode: req.body.studentCode || "",
        major: req.body.className || "Computer Science", // Frontend sends className, map to major
      };
      student = await Student.create(studentData);
    }

    const {
      bio,
      avatar,
      backgroundImage,
      studentCode,
      className, // Frontend sends className
      grade,
      subjects,
      goals,
    } = req.body;

    const userUpdates: any = {};
    if (bio !== undefined) userUpdates.bio = bio;
    if (avatar !== undefined) userUpdates.avatar = avatar;
    if (backgroundImage !== undefined)
      userUpdates.backgroundImage = backgroundImage;
    // Always use email-based Student ID, don't allow manual override
    userUpdates.studentCode = req.user.email?.split("@")[0] || "";
    if (className !== undefined) userUpdates.major = className; // Map className to major

    const studentUpdates: any = {};
    if (grade !== undefined) studentUpdates.grade = grade;
    if (subjects !== undefined) studentUpdates.subjects = subjects;
    if (goals !== undefined) studentUpdates.goals = goals;

    const updatedUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
      new: true,
      runValidators: true,
    });

    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      studentUpdates,
      { new: true, runValidators: true }
    );

    return successResponse(
      res,
      { user: updatedUser, student: updatedStudent },
      "Student profile updated successfully"
    );
  } catch (error) {
    console.error("Update student profile error:", error);
    return errorResponse(res, "Failed to update student profile", 500);
  }
};
