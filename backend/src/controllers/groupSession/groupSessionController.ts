import { Request, Response } from "express";
import GroupSession from "../../models/GroupSession";
import Mentor from "../../models/Mentor";

// Get all group sessions with pagination and filters
export const getAllGroupSessions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, subject, status, mentorId } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if (subject) filter.subject = subject;
    if (status) filter.status = status;
    if (mentorId) filter.mentorId = mentorId;

    const groupSessions = await GroupSession.find(filter)
      .populate("mentorId", "userId")
      .populate("mentorId.userId", "firstName lastName email avatar")
      .populate("students", "userId")
      .populate("students.userId", "firstName lastName email avatar")
      .skip(skip)
      .limit(Number(limit))
      .sort({ startTime: -1 });

    const total = await GroupSession.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: groupSessions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching group sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch group sessions",
    });
  }
};

// Get group session by ID
export const getGroupSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const groupSession = await GroupSession.findById(id)
      .populate("mentorId", "userId")
      .populate("mentorId.userId", "firstName lastName email avatar")
      .populate("students", "userId")
      .populate("students.userId", "firstName lastName email avatar");

    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    res.json({
      success: true,
      data: groupSession,
    });
  } catch (error) {
    console.error("Error fetching group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch group session",
    });
  }
};

// Create new group session
export const createGroupSession = async (req: Request, res: Response) => {
  try {
    const groupSessionData = req.body;

    const mentor = await Mentor.findById(groupSessionData.mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    const conflictingSession = await GroupSession.findOne({
      mentorId: groupSessionData.mentorId,
      startTime: { $lt: groupSessionData.endTime },
      endTime: { $gt: groupSessionData.startTime },
      status: { $in: ["scheduled", "active"] },
    });

    if (conflictingSession) {
      return res.status(400).json({
        success: false,
        error: "Time slot conflicts with existing session",
      });
    }

    const groupSession = new GroupSession({
      ...groupSessionData,
      currentStudents: 0,
      students: [],
      topics: [],
      status: "scheduled",
    });

    await groupSession.save();

    res.status(201).json({
      success: true,
      data: groupSession,
      message: "Group session created successfully",
    });
  } catch (error) {
    console.error("Error creating group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create group session",
    });
  }
};

// Update group session
export const updateGroupSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const groupSession = await GroupSession.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    res.json({
      success: true,
      data: groupSession,
      message: "Group session updated successfully",
    });
  } catch (error) {
    console.error("Error updating group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update group session",
    });
  }
};

// Delete group session
export const deleteGroupSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const groupSession = await GroupSession.findByIdAndDelete(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    res.json({
      success: true,
      message: "Group session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete group session",
    });
  }
};
