import express from "express";
import { getStudentProfile } from "../controllers/student/studentProfileController";
import {
  createStudentProfile,
  updateStudentProfile,
} from "../controllers/student/studentProfileUpdateController";
import { getStudentById, getAllStudents } from "../controllers/student/studentController";

import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/zodValidation";
import { z } from "zod";

const createStudentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required").optional(),
  className: z.string().min(1, "Class name is required").optional(),
  studentCode: z.string().min(1, "Student code is required"),
  email: z.string().email("Valid email is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters").optional(),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  grade: z.string().default("Beginner"),
  subjects: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});

const updateStudentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  className: z.string().min(1, "Class name is required").optional(),
  studentCode: z.string().min(1, "Student code is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  bio: z.string().min(10, "Bio must be at least 10 characters").optional(),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  grade: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
});

const router = express.Router();

// Public routes
router.get("/", getAllStudents);

router.post(
  "/",
  authMiddleware,
  validateBody(createStudentProfileSchema),
  createStudentProfile
);
router.get("/profile", authMiddleware, getStudentProfile);
router.put(
  "/profile",
  authMiddleware,
  validateBody(updateStudentProfileSchema),
  updateStudentProfile
);

router.get("/:id", getStudentById);

export default router;
