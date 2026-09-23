import { Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { logger } from "../../utils/logger";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "../../utils/responseHelpers";
import { AuthRequest } from "../../middleware/auth";

export const createMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user: authUser } = req;

    if (!authUser) {
      return unauthorizedResponse(res, "User not authenticated");
    }

    if (authUser.role !== "mentor") {
      return forbiddenResponse(res, "Only mentors can create mentor profiles");
    }

    let dbUser = await User.findOne({ email: authUser.email });

    if (!dbUser) {
      try {
        const firstName =
          (req.headers["x-user-firstname"] as string) || "Mentor";
        const lastName = (req.headers["x-user-lastname"] as string) || "User";

        dbUser = await User.create({
          email: authUser.email,
          firstName: firstName,
          lastName: lastName,
          role: "mentor",
          bio: req.body.bio,
          title: req.body.title,
          avatar: req.body.avatar,
          backgroundImage: req.body.backgroundImage,
          profileCompleted: true,
        });
      } catch (userError) {
        console.error("Failed to create user:", userError);
        throw userError;
      }
            } else {
          const firstName = req.headers["x-user-firstname"] as string || "Mentor";
          const lastName = req.headers["x-user-lastname"] as string || "User";
          
          const userUpdates: any = {
            firstName: firstName,
            lastName: lastName,
            title: req.body.title,
            bio: req.body.bio,
            avatar: req.body.avatar,
            backgroundImage: req.body.backgroundImage,
            profileCompleted: true,
          };
      dbUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
        new: true,
        runValidators: true,
      });
    }

    const existingMentor = await Mentor.findOne({ userId: dbUser!._id });
    if (existingMentor) {
      const mentorUpdates = {
        specialties: req.body.specialties || [],
        bio: req.body.bio || "No bio provided yet",
        mentorType: req.body.mentorType || "Software Engineer",
      };
      const updatedMentor = await Mentor.findByIdAndUpdate(
        existingMentor._id,
        mentorUpdates,
        { new: true, runValidators: true }
      );
      return successResponse(
        res,
        { user: dbUser, mentor: updatedMentor },
        "Mentor profile updated successfully"
      );
    }

    const mentorData = {
      userId: dbUser!._id,
      specialties: req.body.specialties || ["General"],
      bio: req.body.bio || "No bio provided yet",
      experience: 1,
      hourlyRate: 50,
      mentorType: req.body.mentorType || "Software Engineer",
      rating: 0,
      totalSessions: 0,
      totalStudents: 0,
      subjects: req.body.subjects || [],
      education: req.body.education || [],
      certifications: req.body.certifications || [],
      languages: req.body.languages || ["English"],
      timezone: req.body.timezone || "UTC",
      availability: req.body.availability || [],
      links: req.body.links || {},
    };

    const mentor = await Mentor.create(mentorData);

    return successResponse(
      res,
      { user: dbUser, mentor },
      "Mentor profile created successfully"
    );
  } catch (error) {
    console.error("Error creating/updating mentor profile:", error);
    return errorResponse(res, "Failed to create mentor profile", 500);
  }
};

export const updateMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user: authUser } = req;
    const userRole = req.headers["x-user-role"] as string;

    if (!authUser) {
      return unauthorizedResponse(res, "User not authenticated");
    }

    if (userRole !== "mentor") {
      return forbiddenResponse(res, "Only mentors can update mentor profiles");
    }

    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return notFoundResponse(res, "User");
    }

    let mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      // Create a new mentor record if it doesn't exist
      const mentorData = {
        userId: dbUser._id,
        specialties: req.body.specialties || [],
        bio: req.body.bio || "",
        experience: req.body.experience || 0,
        hourlyRate: req.body.hourlyRate || 0,
        mentorType: req.body.mentorType || "Software Engineer",
        availability: req.body.availability || [],
        subjects: req.body.subjects || [],
        education: req.body.education || [],
        certifications: req.body.certifications || [],
        languages: req.body.languages || [],
        timezone: req.body.timezone || "UTC",
      };

      mentor = await Mentor.create(mentorData);
    }

    const {
      title,
      bio,
      avatar,
      backgroundImage,
      specialties,
      experience,
      hourlyRate,
      mentorType,
      subjects,
      education,
      certifications,
      languages,
      timezone,
      availability,
      links,
    } = req.body;

    const firstName = req.headers["x-user-firstname"] as string || dbUser.firstName;
    const lastName = req.headers["x-user-lastname"] as string || dbUser.lastName;

    const userUpdates: any = {};
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (title) userUpdates.title = title;
    if (bio !== undefined) userUpdates.bio = bio;
    if (avatar !== undefined) userUpdates.avatar = avatar;
    if (backgroundImage !== undefined)
      userUpdates.backgroundImage = backgroundImage;

    const mentorUpdates: any = {};
    if (specialties !== undefined) mentorUpdates.specialties = specialties;
    if (experience !== undefined) mentorUpdates.experience = experience;
    if (hourlyRate !== undefined) mentorUpdates.hourlyRate = hourlyRate;
    if (mentorType !== undefined) mentorUpdates.mentorType = mentorType;
    if (subjects !== undefined) mentorUpdates.subjects = subjects;
    if (education !== undefined) mentorUpdates.education = education;
    if (certifications !== undefined)
      mentorUpdates.certifications = certifications;
    if (languages !== undefined) mentorUpdates.languages = languages;
    if (timezone !== undefined) mentorUpdates.timezone = timezone;
    if (availability !== undefined) mentorUpdates.availability = availability;

    const updatedUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
      new: true,
      runValidators: true,
    });

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentor._id,
      mentorUpdates,
      { new: true, runValidators: false }
    );

    return successResponse(
      res,
      { user: updatedUser, mentor: updatedMentor },
      "Mentor profile updated successfully"
    );
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    return errorResponse(res, "Failed to update mentor profile", 500);
  }
};
