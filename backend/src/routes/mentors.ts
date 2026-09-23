import express from "express";
import { validateBody, validateQuery } from "../middleware/zodValidation";
import {
  createMentorSchema,
  updateMentorSchema,
  mentorQuerySchema,
} from "../schemas/validation";
import { getMentorProfile } from "../controllers/mentor/mentorProfileController";
import {
  createMentorProfile,
  updateMentorProfile,
} from "../controllers/mentor/mentorProfileUpdateController";
import {
  updateMentorAvailability,
  getMentorById,
  getAllMentors,
} from "../controllers/mentor/mentorController";
import {
  getMentorAvailability,
  updateMentorAvailability as updateMentorAvailabilityFromController,
  getMentorBookedSlots,
  debugTimezone,
  debugMentorAvailability,
} from "../controllers/mentor/mentorAvailabilityController";
import {
  getAllMentorsWithAvailability,
  getMentorForBooking,
} from "../controllers/mentor/mentorBookingController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", validateQuery(mentorQuerySchema), getAllMentors);

router.post(
  "/",
  authMiddleware,
  validateBody(createMentorSchema),
  createMentorProfile
);
router.get("/profile", authMiddleware, getMentorProfile);
router.put(
  "/profile",
  authMiddleware,
  validateBody(updateMentorSchema),
  updateMentorProfile
);

router.get("/availability", authMiddleware, getMentorAvailability);
router.put(
  "/availability",
  authMiddleware,
  updateMentorAvailabilityFromController
);

router.get(
  "/search",
  validateQuery(mentorQuerySchema),
  getAllMentorsWithAvailability
);

router.get("/:id", getMentorById);
router.get("/:id/availability", getMentorForBooking);
router.get("/:mentorId/booked-slots", getMentorBookedSlots);
router.get("/availability/debug-timezone", authMiddleware, debugTimezone);
router.get("/availability/debug", authMiddleware, debugMentorAvailability);
router.get("/:id/reviews", (req, res) => {
  res
    .status(501)
    .json({ success: false, error: "Reviews not implemented yet" });
});
router.get("/:id/sessions", (req, res) => {
  res
    .status(501)
    .json({ success: false, error: "Sessions not implemented yet" });
});

export default router;
