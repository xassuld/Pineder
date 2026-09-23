import { Response } from "express";
import GroupSession from "../../models/GroupSession";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: { success: true; data?: T; message?: string } = {
    success: true,
  };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const updateTopic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can update topics" });
    }

    const { groupSessionId, topicId } = req.params;
    const { title, description, category } = req.body;

    const student = await Student.findOne({ userId: req.user.dbId });
    if (!student) return notFound(res, "Student");

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topic = groupSession.topics.find((t) => t.id === topicId);
    if (!topic) return notFound(res, "Topic");

    // Only the submitter can update the topic
    if (topic.submittedBy.toString() !== (student._id as string).toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Can only update your own topics" });
    }

    if (topic.status !== "pending") {
      return badRequest(res, "Can only update pending topics");
    }

    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (category) topic.category = category;
    topic.updatedAt = new Date();

    await groupSession.save();

    success(res, topic, "Topic updated successfully");
  } catch (error) {
    handleError(res, error, "update topic");
  }
};

export const deleteTopic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can delete topics" });
    }

    const { groupSessionId, topicId } = req.params;

    const student = await Student.findOne({ userId: req.user.dbId });
    if (!student) return notFound(res, "Student");

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topicIndex = groupSession.topics.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) return notFound(res, "Topic");

    const topic = groupSession.topics[topicIndex];

    // Only the submitter can delete the topic
    if (topic.submittedBy.toString() !== (student._id as string).toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Can only delete your own topics" });
    }

    if (topic.status !== "pending") {
      return badRequest(res, "Can only delete pending topics");
    }

    groupSession.topics.splice(topicIndex, 1);
    await groupSession.save();

    success(res, null, "Topic deleted successfully");
  } catch (error) {
    handleError(res, error, "delete topic");
  }
};

export const editTopic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can edit topics" });
    }

    const { groupSessionId, topicId } = req.params;
    const { title, description, category } = req.body;

    const student = await Student.findOne({ userId: req.user.dbId });
    if (!student) return notFound(res, "Student");

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topic = groupSession.topics.find((t) => t.id === topicId);
    if (!topic) return notFound(res, "Topic");

    if (topic.submittedBy.toString() !== (student._id as string).toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Can only edit your own topics" });
    }

    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (category) topic.category = category;
    topic.updatedAt = new Date();

    await groupSession.save();

    success(res, topic, "Topic updated successfully");
  } catch (error) {
    handleError(res, error, "edit topic");
  }
};

export const selectTopicForTeaching = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          error: "Only mentors can select topics for teaching",
        });
    }

    const { groupSessionId, topicId } = req.params;

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topic = groupSession.topics.find((t) => t.id === topicId);
    if (!topic) return notFound(res, "Topic");

    if (topic.status !== "pending") {
      return badRequest(res, "Can only select pending topics");
    }

    topic.status = "selected";
    topic.updatedAt = new Date();

    await groupSession.save();

    success(res, topic, "Topic selected for teaching");
  } catch (error) {
    handleError(res, error, "select topic for teaching");
  }
};
