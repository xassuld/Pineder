import express from "express";
import { authMiddleware, requireStudent } from "../middleware/auth";
import { getStudentProfile } from "../controllers/student/studentProfileController";
import {
  createStudentProfile,
  updateStudentProfile,
} from "../controllers/student/studentProfileUpdateController";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../controllers/student/studentPhotoController";
import {
  getStudentStats,
  updateStudentLinks,
} from "../controllers/student/studentStatsController";

const router = express.Router();

router.use(authMiddleware);
router.use(requireStudent);

router.get("/", getStudentProfile);
router.post("/", createStudentProfile);
router.put("/", updateStudentProfile);

router.post("/photo", uploadProfilePhoto);
router.delete("/photo", deleteProfilePhoto);

router.get("/stats", getStudentStats);

router.put("/links", updateStudentLinks);

export default router;
