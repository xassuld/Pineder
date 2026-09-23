import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
import Rating from "../../models/Rating";
import { AuthRequest } from "../../middleware/auth";
import mongoose from "mongoose";

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

// POST - Rate a mentor after session
export const rateMentor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Only students can rate mentors" });
    }

    const { sessionId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return badRequest(res, "Rating must be between 1 and 5");
    }

    // Get the session
    const session = await Session.findById(sessionId)
      .populate("mentorId", "rating totalSessions totalRatings")
      .populate("studentId", "grade subjects");

    if (!session) return notFound(res, "Session");

    // Check if user is authorized to rate this session
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    if (student._id?.toString() !== session.studentId._id?.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized to rate this session" });
    }

    // Check if session is completed
    if (session.status !== "completed") {
      return badRequest(res, "Can only rate completed sessions");
    }

    // Check if session already has a rating
    if (session.rating) {
      return badRequest(res, "Session has already been rated");
    }

    // Check if session was completed recently (within last 30 days)
    const now = new Date();
    const sessionCompletedAt = session.completedAt || session.endTime;
    const daysSinceCompletion = (now.getTime() - sessionCompletedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCompletion > 30) {
      return badRequest(res, "Can only rate sessions completed within the last 30 days");
    }

    // Create rating record
    const ratingRecord = await Rating.create({
      sessionId: session._id,
      mentorId: session.mentorId._id,
      studentId: student._id,
      rating: rating,
      comment: comment || "",
      ratedAt: new Date()
    });

    // Update session with rating
    session.rating = rating;
    session.feedback = comment;
    await session.save();

    // Update mentor's average rating
    await updateMentorRating(session.mentorId._id);

    // Populate rating with user details
    const populatedRating = await Rating.findById(ratingRecord._id)
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "grade subjects")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      });

    success(res, populatedRating, "Rating submitted successfully", 201);
  } catch (error) {
    handleError(res, error, "submit rating");
  }
};

// GET - Get all ratings for a mentor
export const getMentorRatings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { mentorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return notFound(res, "Mentor");

    const skip = (Number(page) - 1) * Number(limit);

    const ratings = await Rating.find({ mentorId: mentor._id })
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .sort({ ratedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Rating.countDocuments({ mentorId: mentor._id });

    const averageRating = await Rating.aggregate([
      { $match: { mentorId: mentor._id } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    success(res, {
      ratings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      },
      averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0
    });
  } catch (error) {
    handleError(res, error, "fetch mentor ratings");
  }
};

// Helper function to update mentor's average rating
const updateMentorRating = async (mentorId: mongoose.Types.ObjectId) => {
  try {
    const ratings = await Rating.find({ mentorId });
    
    if (ratings.length === 0) return;

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    await Mentor.findByIdAndUpdate(mentorId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error("Error updating mentor rating:", error);
  }
};
