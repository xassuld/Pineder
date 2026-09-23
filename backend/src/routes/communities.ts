import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
} from "../controllers/community/communityController";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);

// Protected routes (auth required)
router.use(authMiddleware);

router.post("/", createCommunity);
router.put("/:id", updateCommunity);
router.delete("/:id", deleteCommunity);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);

export default router;
