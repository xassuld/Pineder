import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  subject: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  recordingUrl?: string;
  materials?: string[];
  studentChoice: StudentChoice;
  paymentStatus: PaymentStatus;
  requestNotes?: string;
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  zoomPassword?: string;
  teamsChatUrl?: string;
  meetingProvider: MeetingProvider;
  rescheduleRequest?: IRescheduleRequest;
  rescheduleHistory?: IRescheduleHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export type SessionStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "reschedule_requested";

export const SessionStatusValues = [
  "requested",
  "approved",
  "rejected",
  "scheduled",
  "active",
  "completed",
  "cancelled",
  "rescheduled",
  "reschedule_requested",
] as const;

export type StudentChoice = "free" | "coffee" | "ice-cream";

export const StudentChoiceValues = ["free", "coffee", "ice-cream"] as const;

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export const PaymentStatusValues = ["pending", "completed", "failed", "refunded"] as const;

export type MeetingProvider = "zoom" | "google-meet" | "teams" | "simple";

export const MeetingProviderValues = ["zoom", "google-meet", "teams", "simple"] as const;

export interface IRescheduleRequest {
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status?: "pending" | "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface IRescheduleHistory {
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}
