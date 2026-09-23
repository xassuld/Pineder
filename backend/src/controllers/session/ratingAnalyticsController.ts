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

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
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

export const getMentorRatingStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res.status(403).json({ success: false, error: "Only mentors can view rating stats" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const mentor = await Mentor.findOne({ userId: user._id });
    if (!mentor) return notFound(res, "Mentor");

    const stats = await Rating.aggregate([
      { $match: { mentorId: new mongoose.Types.ObjectId((mentor._id as any).toString()) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return success(res, {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach((rating: number) => {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    });

    success(res, {
      averageRating: Math.round(stats[0].averageRating * 100) / 100,
      totalRatings: stats[0].totalRatings,
      ratingDistribution
    });
  } catch (error) {
    handleError(res, error, "fetch mentor rating stats");
  }
};

export const getStudentRatingHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Only students can view rating history" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const ratings = await Rating.find({ studentId: student._id })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" }
      })
      .populate("sessionId", "title startTime endTime")
      .sort({ createdAt: -1 });

    success(res, { ratings });
  } catch (error) {
    handleError(res, error, "fetch student rating history");
  }
};
