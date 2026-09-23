import express from "express";
import { authMiddleware, requireStudent } from "../middleware/auth";
import {
  rateMentor,
  getMentorRatings,
} from "../controllers/session/ratingController";
import {
  getSessionRating,
  updateRating,
  getStudentRatingHistory,
} from "../controllers/session/ratingManagementController";

const router = express.Router();

router.use(authMiddleware);

router.post("/:sessionId", requireStudent, rateMentor);
router.get("/:sessionId", getSessionRating);
router.put("/:sessionId", requireStudent, updateRating);
router.get("/mentor/:mentorId", getMentorRatings);
router.get("/student/history", requireStudent, getStudentRatingHistory);

export default router;
