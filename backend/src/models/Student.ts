import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  grade: string;
  subjects: string[];
  goals: string[];
  studentCode: string;
  major: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    subjects: [
      {
        type: String,
      },
    ],
    goals: [
      {
        type: String,
      },
    ],
    studentCode: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ userId: 1 });

export default mongoose.model<IStudent>("Student", studentSchema);
