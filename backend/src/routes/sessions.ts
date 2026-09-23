import express from "express";
import { validateBody } from "../middleware/zodValidation";
import { createSessionSchema, updateSessionSchema } from "../schemas/validation";
import {
  authMiddleware,
  requireMentor,
  requireStudent,
} from "../middleware/auth";
import {
  getAllSessions,
  getUpcomingSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getTeamsChatUrl,
} from "../controllers/session/sessionController";
import { getAvailableMentors } from "../controllers/session/mentorSelectionController";
import { bookSession } from "../controllers/session/sessionCreationController";
import {
  getStudentBookings,
  cancelBooking,
  getSessionDetails,
} from "../controllers/session/sessionBookingController";
import {
  getPendingSessions,
  approveSession,
  rejectSession,
  getMentorSessions,
} from "../controllers/session/sessionApprovalController";
import { getSessionJoinInfo } from "../controllers/session/sessionJoinController";
import {
  startSession,
  endSession,
  getActiveSessions,
} from "../controllers/session/sessionManagementController";
import { rateMentor } from "../controllers/session/ratingController";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllSessions);
router.get("/upcoming", getUpcomingSessions);
router.get("/active", getActiveSessions);
router.get("/:id", getSessionById);

router.post("/", requireStudent, validateBody(createSessionSchema), bookSession);
router.put("/:id", validateBody(updateSessionSchema), updateSession);
router.delete("/:id", deleteSession);

router.post("/:id/cancel", requireStudent, cancelBooking);
router.post("/:id/reschedule", requireStudent, (req, res) => {
  res.status(501).json({ success: false, error: "Reschedule not implemented yet" });
});
router.post("/:id/complete", requireMentor, (req, res) => {
  res.status(501).json({ success: false, error: "Complete not implemented yet" });
});
router.post("/:id/feedback", requireStudent, (req, res) => {
  res.status(501).json({ success: false, error: "Feedback not implemented yet" });
});

router.get("/mentors/available", requireStudent, getAvailableMentors);
router.get("/bookings/student", requireStudent, getStudentBookings);
router.get("/bookings/:sessionId/details", getSessionDetails);

router.get("/pending", requireMentor, getPendingSessions);
router.post("/:sessionId/approve", requireMentor, approveSession);
router.post("/:sessionId/reject", requireMentor, rejectSession);
router.get("/mentor/all", requireMentor, getMentorSessions);

router.get("/:sessionId/join", getSessionJoinInfo);
router.get("/:sessionId/teams-chat", getTeamsChatUrl);
router.post("/:sessionId/start", requireMentor, startSession);
router.post("/:sessionId/end", requireMentor, endSession);

router.post("/:sessionId/rate", requireStudent, rateMentor);

export default router;
