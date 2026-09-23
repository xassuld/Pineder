import express from "express";
import { authMiddleware } from "../middleware/auth";

import {
  getAllGroupSessions,
  getGroupSessionById,
  createGroupSession,
  updateGroupSession,
  deleteGroupSession,
} from "../controllers/groupSession/groupSessionController";

import {
  joinGroupSession,
  leaveGroupSession,
} from "../controllers/groupSession/groupSessionMembershipController";

import {
  getTopics,
  submitTopic,
  voteTopic,
  getTopTopics,
} from "../controllers/groupSession/groupSessionTopicController";
import {
  editTopic,
  deleteTopic,
  selectTopicForTeaching,
} from "../controllers/groupSession/topicManagementController";

const router = express.Router();

// Apply auth middleware to all group session routes
router.use(authMiddleware);

router.get("/", getAllGroupSessions);
router.get("/:id", getGroupSessionById);
router.post("/", createGroupSession);
router.put("/:id", updateGroupSession);
router.delete("/:id", deleteGroupSession);
router.post("/:id/join", joinGroupSession);
router.post("/:id/leave", leaveGroupSession);
router.get("/:id/topics", getTopics);
router.post("/:id/topics", submitTopic);
router.post("/:id/topics/:topicId/vote", voteTopic);
router.put("/:id/topics/:topicId", editTopic);
router.delete("/:id/topics/:topicId", deleteTopic);
router.get("/:id/topics/top-voted", getTopTopics);
router.post("/:id/topics/:topicId/select", selectTopicForTeaching);

export default router;
