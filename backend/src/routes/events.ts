import express from "express";
import {
  authMiddleware,
  requireMentor,
  requireStudent,
} from "../middleware/auth";
import { createEvent } from "../controllers/events/eventCreationController";
import { getEventById } from "../controllers/events/eventListingController";
import {
  getEvents,
  getWeeklyEvents,
} from "../controllers/events/eventFilterController";
import {
  registerForEvent,
  unregisterFromEvent,
  getStudentEvents,
} from "../controllers/events/eventRegistrationController";
import {
  updateEvent,
  deleteEvent,
  getMentorEvents,
} from "../controllers/events/eventManagementController";

const router = express.Router();

router.get("/", getEvents);
router.get("/weekly", getWeeklyEvents);
router.get("/:eventId", getEventById);

router.post("/", authMiddleware, requireMentor, createEvent);
router.get("/mentor/my-events", authMiddleware, requireMentor, getMentorEvents);
router.put("/:eventId", authMiddleware, requireMentor, updateEvent);
router.delete("/:eventId", authMiddleware, requireMentor, deleteEvent);

router.post("/:eventId/register", authMiddleware, requireStudent, registerForEvent);
router.delete("/:eventId/unregister", authMiddleware, requireStudent, unregisterFromEvent);
router.get("/student/registered", authMiddleware, requireStudent, getStudentEvents);

export default router;
