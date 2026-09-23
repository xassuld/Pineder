import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  location: string;
  locationType: "online" | "in-person" | "hybrid";
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  currency: string;
  category: string;
  eventType:
    | "workshop"
    | "discussion"
    | "seminar"
    | "meetup"
    | "webinar"
    | "q&a";
  tags: string[];
  isPublic: boolean;
  status: "draft" | "published" | "cancelled" | "completed";
  participants: mongoose.Types.ObjectId[];
  registeredStudents: mongoose.Types.ObjectId[];
  eventId: string;
  meetingLink?: string;
  materials?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
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
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      default: "online",
    },
    maxParticipants: {
      type: Number,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    category: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      default: "discussion",
    },
    tags: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "draft",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    registeredStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    eventId: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", async function (next) {
  if (this.isNew && !this.eventId) {
    const count = await mongoose.model("Event").countDocuments();
    this.eventId = `#${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

eventSchema.index({ mentorId: 1, startTime: 1 });
eventSchema.index({ status: 1, startTime: 1 });
eventSchema.index({ category: 1, isPublic: 1 });
eventSchema.index({ eventId: 1 });
eventSchema.index({ startTime: 1, endTime: 1 });

export default mongoose.model<IEvent>("Event", eventSchema);
