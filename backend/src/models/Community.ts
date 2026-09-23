import mongoose, { Schema } from "mongoose";

export interface ICommunity {
  name: string;
  description: string;
  category: string;
  members: number;
  topics: string[];
  recentActivity: string;
  status: "active" | "growing" | "new";
  createdAt: Date;
  createdBy: string;
  rules: string[];
  isPrivate: boolean;
  memberIds: string[];
  image?: string;
}

const communitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    members: {
      type: Number,
      default: 1,
    },
    topics: [
      {
        type: String,
      },
    ],
    recentActivity: {
      type: String,
      default: "Just created",
    },
    status: {
      type: String,
      enum: ["active", "growing", "new"],
      default: "new",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true,
    },
    rules: [
      {
        type: String,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    memberIds: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

communitySchema.index({ name: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ status: 1 });
communitySchema.index({ createdAt: -1 });

export default mongoose.model<ICommunity>("Community", communitySchema);
