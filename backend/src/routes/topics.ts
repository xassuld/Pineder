import express from "express";
import { validateBody, validateQuery } from "../middleware/zodValidation";
import { createTopicSchema, updateTopicSchema, topicQuerySchema } from "../schemas/validation";
import { authMiddleware, requireStudent } from "../middleware/auth";
import {
  submitTopic,
  getTopics,
  voteTopic,
  getTopTopics,
} from "../controllers/groupSession/groupSessionTopicController";
import {
  updateTopic,
  deleteTopic,
  editTopic,
  selectTopicForTeaching,
} from "../controllers/groupSession/topicManagementController";

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireStudent, submitTopic);
router.get("/", getTopics);
router.get("/top", getTopTopics);
router.put("/:topicId", requireStudent, updateTopic);
router.delete("/:topicId", requireStudent, deleteTopic);

router.post("/:topicId/vote", requireStudent, voteTopic);

export default router;
