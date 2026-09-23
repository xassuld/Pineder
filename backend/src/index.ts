import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { logger } from "./utils/logger";
import dotenv from "dotenv";

// Suppress all Node.js warnings
process.removeAllListeners("warning");
process.on("warning", () => {});
import {
  securityHeaders,
  rateLimiter,
  errorHandler,
  requestLogger,
  notFoundHandler,
} from "./middleware/security";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import mentorRoutes from "./routes/mentors";
import studentRoutes from "./routes/students";
import groupSessionRoutes from "./routes/groupSessions";
import eventRoutes from "./routes/events";
import ratingRoutes from "./routes/ratings";
import rescheduleRoutes from "./routes/reschedule";
import topicRoutes from "./routes/topics";
import mentorDashboardRoutes from "./routes/mentorDashboard";
import studentProfileRoutes from "./routes/studentProfile";
import communityRoutes from "./routes/communities";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

app.use(securityHeaders);
app.use(rateLimiter);

// Disable request logging for cleaner output

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL || "https://yourdomain.com"]
        : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-user-id",
      "x-user-email",
      "x-user-role",
      "x-user-firstname",
      "x-user-lastname",
    ],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/group-sessions", groupSessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/reschedule", rescheduleRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/mentor-dashboard", mentorDashboardRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/communities", communityRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    database: "Connected",
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API is running with MVC architecture!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      users: "/api/users",
      sessions: "/api/sessions",
      mentors: "/api/mentors",
      students: "/api/students",
      groupSessions: "/api/group-sessions",
      events: "/api/events",
      ratings: "/api/ratings",
      topics: "/api/topics",
      reschedule: "/api/reschedule",
      mentorDashboard: "/api/mentor-dashboard",
      studentProfile: "/api/student-profile",
      communities: "/api/communities",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server failed`);
    process.exit(1);
  }
};

startServer();
