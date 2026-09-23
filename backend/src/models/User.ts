import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  backgroundImage?: string;
  bio: string;
  title?: string;
  studentCode?: string;
  major?: string;
  mentorSpecialization?: string;
  mentorExperience?: number;
  timezone?: string; // User's timezone (e.g., "America/New_York", "Europe/London")
  profileCompleted: boolean;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    title: {
      type: String,
    },
    studentCode: {
      type: String,
    },
    major: {
      type: String,
    },
    mentorSpecialization: {
      type: String,
    },
    mentorExperience: {
      type: Number,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    timezone: {
      type: String,
      default: "UTC", // Default to UTC if not specified
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      emailUpdates: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ profileCompleted: 1 });

export default mongoose.model<IUser>("User", userSchema);
