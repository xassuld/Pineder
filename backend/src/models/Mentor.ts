import mongoose, { Document, Schema } from "mongoose";

export interface IMentor extends Document {
  userId: mongoose.Types.ObjectId;
  specialties: string[];
  bio: string;
  experience: number;
  rating: number;
  hourlyRate: number;
  mentorType: string;
  availability: Array<{
    dayOfWeek?: number; // Legacy support
    date?: string; // YYYY-MM-DD format for specific dates
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  weeklyAvailability?: Array<{
    weekStart: Date; // Monday of the week
    availability: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  }>;
  subjects: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  timezone: string;
  isVerified: boolean;
  totalSessions: number;
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

const mentorSchema = new Schema<IMentor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialties: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    mentorType: {
      type: String,
      default: "Software Engineer",
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          required: false, // Made optional for legacy support
        },
        date: {
          type: String, // YYYY-MM-DD format for specific dates
          required: false,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    weeklyAvailability: [
      {
        weekStart: {
          type: Date,
          required: true,
        },
        availability: [
          {
            dayOfWeek: {
              type: Number,
              required: true,
            },
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            isAvailable: {
              type: Boolean,
              default: true,
            },
          },
        ],
      },
    ],
    subjects: [
      {
        type: String,
      },
    ],
    education: [
      {
        type: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    timezone: {
      type: String,
      default: "UTC",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mentorSchema.index({ userId: 1 });

export default mongoose.model<IMentor>("Mentor", mentorSchema);
