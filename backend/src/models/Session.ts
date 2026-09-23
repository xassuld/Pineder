import mongoose, { Schema } from "mongoose";
import { ISession } from "../types/session";

const sessionSchema = new Schema<ISession>(
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
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
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
      default: "requested",
    },
    subject: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    rating: {
      type: Number,
    },
    feedback: {
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
    studentChoice: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    requestNotes: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    zoomMeetingId: {
      type: String,
    },
    zoomJoinUrl: {
      type: String,
    },
    zoomStartUrl: {
      type: String,
    },
    zoomPassword: {
      type: String,
    },
    meetingProvider: {
      type: String,
      default: "zoom",
    },
    rescheduleRequest: {
      requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      requestedAt: {
        type: Date,
      },
      newStartTime: {
        type: Date,
      },
      newEndTime: {
        type: Date,
      },
      reason: {
        type: String,
      },
      status: {
        type: String,
        default: "pending",
      },
      approvedAt: {
        type: Date,
      },
      rejectedAt: {
        type: Date,
      },
      rejectionReason: {
        type: String,
      },
    },
    rescheduleHistory: [
      {
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: "Student",
        },
        requestedAt: {
          type: Date,
        },
        oldStartTime: {
          type: Date,
        },
        oldEndTime: {
          type: Date,
        },
        newStartTime: {
          type: Date,
        },
        newEndTime: {
          type: Date,
        },
        reason: {
          type: String,
        },
        status: {
          type: String,
          default: "pending",
        },
        approvedAt: {
          type: Date,
        },
        rejectedAt: {
          type: Date,
        },
        rejectionReason: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ mentorId: 1, startTime: 1 });
sessionSchema.index({ studentId: 1, startTime: 1 });
sessionSchema.index({ status: 1, startTime: 1 });

export default mongoose.model<ISession>("Session", sessionSchema);
