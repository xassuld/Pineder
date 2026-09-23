import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Navigation } from "../../components/layout/Navigation";
import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import {
  Users,
  Calendar,
  Star,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock3,
  TrendingUp,
  Heart,
  Check,
  X,
  Eye,
  MessageSquare,
} from "lucide-react";

interface Session {
  id: number;
  studentName: string;
  topic: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  duration: string;
  studentEmail: string;
}

interface SessionRequest {
  id: number;
  studentName: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  studentEmail: string;
  message: string;
  requestedAt: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  sessionsCompleted: number;
  lastSession: string;
  progress: number;
  avatar: string;
}

interface Analytics {
  totalSessions: number;
  completedSessions: number;
  totalStudents: number;
  averageRating: number;
  sessionHours: number;
  pendingRequests: number;
}

const MentorDashboard = () => {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const cardBg = isDarkMode
    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-white/20"
    : "bg-white border-black/20";

  // Mock data
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      studentName: "Alex Chen",
      topic: "Advanced React Patterns",
      date: "2024-01-15",
      time: "14:00",
      status: "upcoming",
      duration: "1 hour",
      studentEmail: "alex.chen@nest.edu.mn",
    },
    {
      id: 2,
      studentName: "Sarah Kim",
      topic: "Machine Learning Fundamentals",
      date: "2024-01-16",
      time: "10:00",
      status: "upcoming",
      duration: "1.5 hours",
      studentEmail: "sarah.kim@nest.edu.mn",
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      topic: "Web Security Best Practices",
      date: "2024-01-14",
      time: "16:00",
      status: "completed",
      duration: "1 hour",
      studentEmail: "mike.johnson@nest.edu.mn",
    },
  ]);

  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([
    {
      id: 1,
      studentName: "Emily Davis",
      topic: "Data Structures & Algorithms",
      date: "2024-01-20",
      time: "15:00",
      duration: "1 hour",
      studentEmail: "emily.davis@nest.edu.mn",
      message:
        "I need help understanding binary trees and graph algorithms. Can we go through some practice problems?",
      requestedAt: "2 hours ago",
    },
    {
      id: 2,
      studentName: "David Wilson",
      topic: "Cloud Architecture Design",
      date: "2024-01-22",
      time: "11:00",
      duration: "1.5 hours",
      studentEmail: "david.wilson@nest.edu.mn",
      message:
        "I'm working on a project and need guidance on AWS services and best practices for scalability.",
      requestedAt: "1 day ago",
    },
  ]);

  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "Alex Chen",
      email: "alex.chen@nest.edu.mn",
      sessionsCompleted: 5,
      lastSession: "2 days ago",
      progress: 85,
      avatar: "",
    },
    {
      id: 2,
      name: "Sarah Kim",
      email: "sarah.kim@nest.edu.mn",
      sessionsCompleted: 3,
      lastSession: "1 week ago",
      progress: 60,
      avatar: "",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@nest.edu.mn",
      sessionsCompleted: 8,
      lastSession: "3 days ago",
      progress: 95,
      avatar: "",
    },
  ]);

  const [analytics] = useState<Analytics>({
    totalSessions: 45,
    completedSessions: 42,
    totalStudents: 12,
    averageRating: 4.8,
    sessionHours: 38,
    pendingRequests: 2,
  });

  const [acceptedSessions, setAcceptedSessions] = useState<Session[]>([
    {
      id: 1,
      studentName: "Emily Davis",
      topic: "Data Structures & Algorithms",
      date: "2024-01-20",
      time: "15:00",
      status: "upcoming",
      duration: "1 hour",
      studentEmail: "emily.davis@nest.edu.mn",
    },
    {
      id: 2,
      studentName: "David Wilson",
      topic: "Cloud Architecture Design",
      date: "2024-01-22",
      time: "11:00",
      status: "upcoming",
      duration: "1.5 hours",
      studentEmail: "david.wilson@nest.edu.mn",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "completed":
        return "bg-[#08CB00]/10 text-[#08CB00] dark:bg-[#08CB00]/20 dark:text-[#08CB00]";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleAcceptRequest = (requestId: number) => {
    const request = sessionRequests.find((r) => r.id === requestId);
    if (request) {
      // Add to sessions
      const newSession: Session = {
        id: Date.now(),
        studentName: request.studentName,
        topic: request.topic,
        date: request.date,
        time: request.time,
        status: "upcoming",
        duration: request.duration,
        studentEmail: request.studentEmail,
      };
      setAcceptedSessions((prev) => [...prev, newSession]);

      // Remove from requests
      setSessionRequests((prev) => prev.filter((r) => r.id !== requestId));

      // Show success message (you can add a toast notification here)
    }
  };

  const handleDenyRequest = (requestId: number) => {
    const request = sessionRequests.find((r) => r.id === requestId);
    if (request) {
      // Remove from requests
      setSessionRequests((prev) => prev.filter((r) => r.id !== requestId));

      // Show success message (you can add a toast notification here)
    }
  };

  const handleViewAllSessions = () => {
    // Add navigation logic here
  };

  const handleViewAllStudents = () => {
    // Add navigation logic here
  };

  const handleScheduleSession = () => {
    // Add scheduling logic here
  };

  return (
    <>
      <Head>
        <title>Mentor Dashboard | Pineder</title>
        <meta
          name="description"
          content="Professional mentor dashboard - Manage sessions, track students, and grow your mentoring practice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDarkMode ? "bg-[#222222]" : "bg-white"
        }`}
      >
        <Navigation />

        {/* Main Content */}
        <div className="px-4 pt-32 pb-12">
          <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2 space-x-2">
                        <h1
                          className="text-3xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Welcome back, {user?.firstName || "Mentor"}!
                        </h1>
                        {sessionRequests.length > 0 && (
                          <div className="relative">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            <div className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1 animate-ping"></div>
                          </div>
                        )}
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Your role:{" "}
                        <span className="font-semibold text-[var(--pico-primary)]">
                          Professional Mentor
                        </span>
                      </p>
                      {sessionRequests.length > 0 && (
                        <p
                          className="text-sm mt-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <span className="font-semibold text-orange-500">
                            {sessionRequests.length} new session request
                            {sessionRequests.length > 1 ? "s" : ""} waiting for
                            your response
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white"
                        onClick={handleScheduleSession}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Total Sessions
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.totalSessions}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Active Students
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.totalStudents}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#08CB00]">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Average Rating
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.averageRating}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Pending Requests
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.pendingRequests}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardHeader>
                  <CardTitle
                    className="flex items-center space-x-2"
                    style={{ color: colors.text.primary }}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col space-y-2 border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                      onClick={() => router.push("/mentor/availability")}
                    >
                      <Calendar className="w-6 h-6" />
                      <span>Manage Availability</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex-col space-y-2 border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                      onClick={() => router.push("/mentor/students")}
                    >
                      <Users className="w-6 h-6" />
                      <span>Review Requests</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex-col space-y-2 border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                      onClick={() => router.push("/profile/mentor")}
                    >
                      <User className="w-6 h-6" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Requests - Integrated Notifications */}
            {sessionRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card
                  className={`${cardBg} shadow-lg border-0 border-l-4 border-orange-500`}
                >
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <span>New Session Requests</span>
                      <Badge className="text-orange-800 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 animate-pulse">
                        {sessionRequests.length}
                      </Badge>
                    </CardTitle>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Students are waiting for your response. Review and respond
                      to these session requests.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessionRequests.slice(0, 3).map((request) => (
                        <div
                          key={request.id}
                          className={`p-4 rounded-lg border transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-[#333333] border-gray-700"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4
                              className="font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {request.studentName}
                            </h4>
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {request.requestedAt}
                            </span>
                          </div>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Topic:</strong> {request.topic}
                          </p>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Date:</strong> {request.date} at{" "}
                            {request.time} ({request.duration}h)
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="text-white bg-[#08CB00] hover:bg-[#06a800]"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => handleDenyRequest(request.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                              onClick={() => router.push("/mentor/students")}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review All
                            </Button>
                          </div>
                        </div>
                      ))}
                      {sessionRequests.length > 3 && (
                        <Button
                          variant="outline"
                          className="w-full border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                          onClick={() => router.push("/mentor/students")}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          View All {sessionRequests.length} Requests
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Accepted Sessions */}
            {acceptedSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <Card
                  className={`${cardBg} shadow-lg border-0 border-l-4 border-green-500`}
                >
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Accepted Sessions</span>
                      <Badge className="text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                        {acceptedSessions.length}
                      </Badge>
                    </CardTitle>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      These sessions have been confirmed and are ready to be
                      scheduled.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {acceptedSessions.map((session) => (
                        <div
                          key={session.id}
                          className={`p-4 rounded-lg border transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-[#333333] border-gray-700"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4
                              className="font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {session.studentName}
                            </h4>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              {session.status}
                            </Badge>
                          </div>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Topic:</strong> {session.topic}
                          </p>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Date:</strong> {session.date} at{" "}
                            {session.time} ({session.duration}h)
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="text-white bg-[#08CB00] hover:bg-[#06a800]"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Schedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message Student
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className={`${cardBg} shadow-lg border-0`}>
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Upcoming Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions
                        .filter((session) => session.status === "upcoming")
                        .map((session) => (
                          <div
                            key={session.id}
                            className={`p-4 rounded-lg border transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[#333333] border-gray-700"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4
                                className="font-semibold"
                                style={{ color: colors.text.primary }}
                              >
                                {session.studentName}
                              </h4>
                              <Badge className={getStatusColor(session.status)}>
                                {session.status}
                              </Badge>
                            </div>
                            <p
                              className="text-sm mb-2"
                              style={{ color: colors.text.secondary }}
                            >
                              {session.topic}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span style={{ color: colors.text.secondary }}>
                                {session.date} at {session.time}
                              </span>
                              <span style={{ color: colors.text.secondary }}>
                                {session.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      <Button
                        variant="outline"
                        className="w-full border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                        onClick={handleViewAllSessions}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        View All Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Students */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className={`${cardBg} shadow-lg border-0`}>
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <Users className="w-5 h-5" />
                      <span>Recent Students</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.slice(0, 3).map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors duration-200"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4
                              className="font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {student.name}
                            </h4>
                            <p
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {student.sessionsCompleted} sessions completed
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="w-16 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                              <div
                                className="h-full bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)]"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <p
                              className="text-xs mt-1"
                              style={{ color: colors.text.secondary }}
                            >
                              {student.progress}%
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                        onClick={handleViewAllStudents}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        View All Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
