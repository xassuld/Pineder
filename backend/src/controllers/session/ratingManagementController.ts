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

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Only students can update ratings" });
    }

    const { sessionId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return badRequest(res, "Rating must be between 1 and 5");
    }

    const session = await Session.findById(sessionId);
    if (!session) return notFound(res, "Session");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    if (student._id?.toString() !== session.studentId?.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized to update this rating" });
    }

    if (!session.rating) {
      return badRequest(res, "Session has not been rated yet");
    }

    const ratingRecord = await Rating.findOne({ sessionId: session._id });
    if (!ratingRecord) {
      return notFound(res, "Rating");
    }

    ratingRecord.rating = rating;
    ratingRecord.comment = comment || "";
    ratingRecord.updatedAt = new Date();
    await ratingRecord.save();

    session.rating = rating;
    session.feedback = comment;
    await session.save();

    await updateMentorRating(session.mentorId);

    const updatedRating = await Rating.findById(ratingRecord._id)
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

    success(res, updatedRating, "Rating updated successfully");
  } catch (error) {
    handleError(res, error, "update rating");
  }
};

export const getSessionRating = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return notFound(res, "Session");

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized = 
      (student && student._id?.toString() === session.studentId?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId?.toString());

    if (!isAuthorized) {
      return res.status(403).json({ success: false, error: "Not authorized to view this rating" });
    }

    const rating = await Rating.findOne({ sessionId: session._id })
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

    if (!rating) {
      return success(res, { rating: null, message: "No rating found for this session" });
    }

    success(res, rating);
  } catch (error) {
    handleError(res, error, "fetch session rating");
  }
};

export const getStudentRatingHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Only students can view their rating history" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const ratings = await Rating.find({ studentId: student._id })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .sort({ ratedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Rating.countDocuments({ studentId: student._id });

    success(res, {
      ratings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    handleError(res, error, "fetch student rating history");
  }
};

const updateMentorRating = async (mentorId: mongoose.Types.ObjectId) => {
  try {
    const ratings = await Rating.find({ mentorId });
    
    if (ratings.length === 0) return;

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    await Mentor.findByIdAndUpdate(mentorId, {
      rating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error("Error updating mentor rating:", error);
  }
};
