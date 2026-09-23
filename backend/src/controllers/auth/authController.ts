import { Request, Response } from "express";
import User from "../../models/User";
import Student from "../../models/Student";
import Mentor from "../../models/Mentor";
import { logger } from "../../utils/logger";
import { sendSuccess, sendError } from "../../utils/helpers";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, role, password } = req.body;

    // Validate email domain for role
    const emailLower = email.toLowerCase();
    let expectedRole = "other";
    
    if (emailLower.endsWith("@nest.edu.mn")) {
      expectedRole = "student";
    } else if (emailLower.endsWith("@gmail.com")) {
      expectedRole = "mentor";
    }

    if (role !== expectedRole) {
      return sendError(res, `Invalid role for email domain. Expected: ${expectedRole}`, 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "User already exists", 409);
    }

    // Create user
    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      profileCompleted: false,
    });

    // Create role-specific profile
    if (role === "student") {
      await Student.create({
        userId: user._id,
        studentCode: email.split("@")[0] || "student",
        major: "Computer Science",
        grade: "Beginner",
        subjects: [],
        goals: [],
      });
    } else if (role === "mentor") {
      await Mentor.create({
        userId: user._id,
        specialization: "General",
        experience: 0,
        rating: 0,
        totalSessions: 0,
        totalHours: 0,
      });
    }

    logger.info("User registered", { userId: user._id?.toString(), email, role });

    return sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    }, "User registered successfully");
  } catch (error) {
    logger.error("Registration failed", { error });
    return sendError(res, "Registration failed", 500);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid credentials", 401);
    }

    // In a real app, you would verify the password here
    // For now, we'll just return the user info

    logger.info("User logged in", { userId: user._id?.toString(), email });

    return sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
      // In a real app, you would generate a JWT token here
      token: "mock-token-" + user._id,
    }, "Login successful");
  } catch (error) {
    logger.error("Login failed", { error });
    return sendError(res, "Login failed", 500);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;

    if (!user) {
      return sendError(res, "Not authenticated", 401);
    }

    const dbUser = await User.findById(user.dbId);
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, {
      user: {
        id: dbUser._id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        profileCompleted: dbUser.profileCompleted,
        avatar: dbUser.avatar,
        bio: dbUser.bio,
        title: dbUser.title,
      },
    }, "User profile retrieved");
  } catch (error) {
    logger.error("Get profile failed", { error });
    return sendError(res, "Failed to get profile", 500);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // In a real app, you would invalidate the JWT token here
    logger.info("User logged out");
    
    return sendSuccess(res, {}, "Logout successful");
  } catch (error) {
    logger.error("Logout failed", { error });
    return sendError(res, "Logout failed", 500);
  }
};
