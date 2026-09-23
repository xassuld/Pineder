import { Request, Response } from "express";
import GroupSession from "../../models/GroupSession";

// Join group session
export const joinGroupSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const groupSession = await GroupSession.findById(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    if (groupSession.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        error: "Cannot join session that is not scheduled",
      });
    }

    if (groupSession.currentStudents >= groupSession.maxStudents) {
      return res.status(400).json({
        success: false,
        error: "Group session is full",
      });
    }

    if (groupSession.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        error: "Student is already in this session",
      });
    }

    groupSession.students.push(studentId);
    groupSession.currentStudents += 1;
    await groupSession.save();

    res.json({
      success: true,
      data: groupSession,
      message: "Successfully joined group session",
    });
  } catch (error) {
    console.error("Error joining group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to join group session",
    });
  }
};

// Leave group session
export const leaveGroupSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const groupSession = await GroupSession.findById(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    if (groupSession.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        error: "Cannot leave session that is not scheduled",
      });
    }

    if (!groupSession.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        error: "Student is not in this session",
      });
    }

    groupSession.students = groupSession.students.filter(
      (id: any) => id.toString() !== studentId
    );
    groupSession.currentStudents -= 1;
    await groupSession.save();

    res.json({
      success: true,
      data: groupSession,
      message: "Successfully left group session",
    });
  } catch (error) {
    console.error("Error leaving group session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to leave group session",
    });
  }
};
