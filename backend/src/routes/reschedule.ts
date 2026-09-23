import express from "express";
import {
  authMiddleware,
  requireMentor,
  requireStudent,
} from "../middleware/auth";
import { getMentorAvailabilityForReschedule } from "../controllers/session/sessionRescheduleAvailabilityController";
import { requestReschedule } from "../controllers/session/rescheduleRequestController";
import { getRescheduleRequests } from "../controllers/session/rescheduleListingController";
import { approveReschedule } from "../controllers/session/sessionRescheduleApprovalController";
import { rejectReschedule } from "../controllers/session/sessionRescheduleRejectionController";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/:sessionId/availability",
  requireStudent,
  getMentorAvailabilityForReschedule
);
router.post("/:sessionId/request", requireStudent, requestReschedule);

router.get("/requests", requireMentor, getRescheduleRequests);
router.post("/:sessionId/approve", requireMentor, approveReschedule);
router.post("/:sessionId/reject", requireMentor, rejectReschedule);

export default router;
