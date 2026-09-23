import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { logger } from "../utils/logger";

let memoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoOptions = {
    maxPoolSize: 50,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
    bufferCommands: false,
    writeConcern: {
      w: 1,
      j: false,
    },
  } as const;

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(mongoURI, mongoOptions);
    console.log("✅ Database connected");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      try {
        console.warn(
          "⚠️ MongoDB connection failed; starting in-memory MongoDB for local development..."
        );

        memoryServer = await MongoMemoryServer.create();
        const localMongoURI = memoryServer.getUri();

        await mongoose.connect(localMongoURI, mongoOptions);
        console.log("✅ In-memory MongoDB connected");
        return;
      } catch (memoryError) {
        console.error("❌ In-memory MongoDB failed");
        console.error(memoryError);
      }
    }

    console.error("❌ Database failed");
    throw error;
  }

  mongoose.set("debug", false);
  mongoose.set("strictQuery", false);
  mongoose.set("autoIndex", false);
  mongoose.set("autoCreate", false);

  process.removeAllListeners("warning");
  process.on("warning", () => {});
};
