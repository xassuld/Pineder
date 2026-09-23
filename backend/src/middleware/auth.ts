import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Student from "../models/Student";
import { logger } from "../utils/logger";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    dbId?: string;
  };
  file?: {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.headers["x-user-role"] as string;
    const userEmail = req.headers["x-user-email"] as string;
    const userId = req.headers["x-user-id"] as string;
    const authToken = req.headers.authorization?.replace("Bearer ", "");

    if (!userRole || !userEmail || !userId) {
      return res.status(401).json({
        success: false,
        error: "Auth required",
      });
    }

    const emailLower = userEmail.toLowerCase();
    let expectedRole = "other";

    if (emailLower.endsWith("@nest.edu.mn")) {
      expectedRole = "student";
    } else if (emailLower.endsWith("@gmail.com")) {
      expectedRole = "mentor";
    }

    if (userRole !== expectedRole) {
      return res.status(403).json({
        success: false,
        error: "Invalid role",
      });
    }

    // Find or create user record
    let dbUser = await User.findOne({ email: userEmail });

    if (!dbUser) {
      try {
        // Create a basic user record
        dbUser = await User.create({
          email: userEmail,
          firstName: "User", // Temporary placeholder
          lastName: "User", // Temporary placeholder
          role: userRole,
          profileCompleted: false,
        });

        // If this is a student, also create a basic student profile
        if (userRole === "student") {
          try {
            await Student.create({
              userId: dbUser._id,
              grade: "Beginner",
              subjects: [],
              goals: [],
              studentCode: userEmail.split("@")[0] || "student",
              major: "Computer Science", // Default major
            });
          } catch (studentError) {
            // Don't fail the request if student profile creation fails
          }
        }
      } catch (createError) {
        return res.status(500).json({
          success: false,
          error: "Create failed",
        });
      }
    }

    req.user = {
      id: userId,
      role: userRole,
      email: userEmail,
      dbId: dbUser._id?.toString(),
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Auth failed",
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Auth required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "No permission",
      });
    }

    next();
  };
};

export const requireStudent = requireRole(["student"]);
export const requireMentor = requireRole(["mentor"]);
export const requireAdmin = requireRole(["admin"]);
