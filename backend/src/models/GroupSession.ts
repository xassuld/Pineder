import mongoose, { Document, Schema } from "mongoose";

export interface IGroupSession extends Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  maxStudents: number;
  currentStudents: number;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";
  subject: string;
  price: number;
  currency: string;
  meetingLink?: string;
  recordingUrl?: string;
  materials?: string[];
  students: mongoose.Types.ObjectId[];
  topics: Array<{
    id: string;
    title: string;
    description: string;
    category?: string;
    votes: number;
    submittedBy: mongoose.Types.ObjectId;
    status: "pending" | "approved" | "rejected" | "selected" | "completed";
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const groupSessionSchema = new Schema<IGroupSession>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    maxStudents: {
      type: Number,
      required: true,
    },
    currentStudents: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "scheduled",
    },
    subject: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    meetingLink: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    topics: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        category: {
          type: String,
          default: "General",
        },
        votes: {
          type: Number,
          default: 0,
        },
        submittedBy: {
          type: Schema.Types.ObjectId,
          ref: "Student",
        },
        status: {
          type: String,
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

groupSessionSchema.index({ mentorId: 1, startTime: 1 });
groupSessionSchema.index({ status: 1, startTime: 1 });
groupSessionSchema.index({ subject: 1 });

export default mongoose.model<IGroupSession>(
  "GroupSession",
  groupSessionSchema
);
