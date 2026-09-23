import mongoose, { Document, Schema } from "mongoose";

export interface ITopic extends Document {
  title: string;
  description: string;
  category: string;
  votes: number;
  submittedBy: mongoose.Types.ObjectId;
  status: "pending" | "selected" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>(
  {
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
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

topicSchema.index({ status: 1, votes: -1 });
topicSchema.index({ submittedBy: 1 });

export default mongoose.model<ITopic>("Topic", topicSchema);
