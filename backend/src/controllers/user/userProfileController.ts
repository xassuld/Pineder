import { Response } from "express";
import User from "../../models/User";
import Student from "../../models/Student";
import Mentor from "../../models/Mentor";
import { AuthRequest } from "../../middleware/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../utils/responseHelpers";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// Simple file upload handling (no Cloudinary)

export const uploadProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { imageData } = req.body; // Base64 image data

    if (!imageData) {
      return badRequest(res, "Image data is required");
    }

    // For now, just store the base64 data or a placeholder
    // In production, you'd want to implement proper file storage
    const avatarUrl = imageData.startsWith("data:")
      ? imageData
      : `data:image/jpeg;base64,${imageData}`;

    // Update user profile with new photo URL
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) return notFound(res, "User");

    success(res, { avatar: avatarUrl }, "Profile photo uploaded successfully");
  } catch (error) {
    handleError(res, error, "upload profile photo");
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { firstName, lastName, bio, location, phone, dateOfBirth, links } =
      req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (links) updateData.links = links;

    // Mark profile as completed if required fields are present
    if (firstName && lastName && bio) {
      updateData.profileCompleted = true;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return notFound(res, "User");

    success(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    handleError(res, error, "update profile");
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    success(res, user);
  } catch (error) {
    handleError(res, error, "fetch profile");
  }
};

export const deleteProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    // No external storage cleanup needed for now

    // Remove avatar from user profile
    user.avatar = "";
    await user.save();

    success(res, null, "Profile photo deleted successfully");
  } catch (error) {
    handleError(res, error, "delete profile photo");
  }
};

export const checkProfileStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return unauthorizedResponse(res);
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return notFoundResponse(res, "User");
    }

    let profileData = null;

    if (req.user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        profileData = {
          type: "student",
          grade: student.grade,
          subjects: student.subjects,
          goals: student.goals,
          studentCode: student.studentCode,
          major: student.major,
        };
      }
    } else if (req.user.role === "mentor") {
      const mentor = await Mentor.findOne({ userId: user._id });
      if (mentor) {
        profileData = {
          type: "mentor",
          specialties: mentor.specialties,
          bio: mentor.bio,
          experience: mentor.experience,
          hourlyRate: mentor.hourlyRate,
          mentorType: mentor.mentorType,
        };
      }
    }

    const status = {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileCompleted: user.profileCompleted,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        bio: user.bio,
        title: user.title,
        studentCode: user.studentCode,
        major: user.major,
      },
      profile: profileData,
      hasProfile: !!profileData,
    };

    return successResponse(
      res,
      status,
      "Profile status retrieved successfully"
    );
  } catch (error) {
    console.error("Error checking profile status:", error);
    return errorResponse(res, "Failed to check profile status", 500);
  }
};
