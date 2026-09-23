import express from "express";
import { authMiddleware, requireMentor } from "../middleware/auth";
import {
  getDashboardOverview,
  getMentorPerformance,
} from "../controllers/mentor/mentorOverviewController";
import { getDashboardStats } from "../controllers/mentor/mentorDashboardController";
import {
  getNewSessionRequests,
  getUpcomingSessions,
  getRecentStudents,
} from "../controllers/mentor/mentorSessionsController";
import {
  getMentorAvailability,
  updateMentorAvailability,
} from "../controllers/mentor/mentorAvailabilityController";

const router = express.Router();

router.use(authMiddleware);
router.use(requireMentor);

router.get("/overview", getDashboardOverview);
router.get("/stats", getDashboardStats);

router.get("/session-requests", getNewSessionRequests);

router.get("/upcoming-sessions", getUpcomingSessions);

router.get("/recent-students", getRecentStudents);

router.get("/performance", getMentorPerformance);

router.get("/availability", getMentorAvailability);
router.put("/availability", updateMentorAvailability);

export default router;
