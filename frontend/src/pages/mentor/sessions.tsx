import React, { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { Card, CardContent } from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../design/system/avatar";
import {
  Video,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

interface Session {
  _id: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  studentChoice: string;
  requestNotes?: string;
  zoomStartUrl?: string;
  zoomJoinUrl?: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
  };
}

interface GroupSession {
  _id: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  participants: any[];
}

export default function MentorSessionsPage() {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();
  // Only show approved sessions
  const activeTab = "approved"; // Changed from useState
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const cardBg = isDarkMode
    ? "bg-[#0F0E0E] border-gray-800"
    : "bg-white border-gray-200";

  useEffect(() => {
    fetchSessions();
  }, []); // Removed activeTab from dependency array

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const email = user?.emailAddresses[0]?.emailAddress;

      if (!email) return;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/mentor/all?status=approved`, // Hardcoded status
        {
          headers: {
            "x-user-role": "mentor",
            "x-user-email": email,
            "x-user-id": user?.id || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSessions(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSession = async (sessionId: string) => {
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": email || "",
            "x-user-id": user?.id || "",
          },
        }
      );

      if (response.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Error approving session:", error);
    }
  };

  const handleRejectSession = async () => {
    if (!selectedSession || !rejectionReason.trim()) return;

    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${selectedSession._id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": email || "",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (response.ok) {
        setShowRejectDialog(false);
        setRejectionReason("");
        setSelectedSession(null);
        fetchSessions();
      }
    } catch (error) {
      console.error("Error rejecting session:", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "requested":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStudentChoiceIcon = (choice: string) => {
    switch (choice) {
      case "ice cream":
        return "🍦";
      case "coffee":
        return "☕";
      case "free":
        return "🎁";
      default:
        return "🎁";
    }
  };

  const approvedSessions = sessions.filter((s) => s.status === "approved");

  return (
    <Layout>
      <Head>
        <title>Mentor Sessions | Pineder</title>
        <meta
          name="description"
          content="Manage your approved mentoring sessions and join Zoom meetings"
        />
      </Head>

      <div
        className="w-full min-h-screen pb-16"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="w-full max-w-sm px-4 py-4 mx-auto sm:max-w-2xl sm:px-6 sm:py-8 lg:max-w-4xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1
              className="mb-2 text-xl font-bold text-center sm:text-left sm:text-2xl md:text-3xl lg:text-4xl"
              style={{ color: colors.text.primary }}
            >
              Approved Sessions
            </h1>
            <p
              className="text-sm text-center sm:text-left sm:text-lg"
              style={{ color: colors.text.secondary }}
            >
              Join your scheduled mentoring sessions and connect with students
              through Zoom meetings
            </p>
          </div>

          {/* Sessions Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {approvedSessions.length === 0 ? (
                <Card className={`${cardBg} shadow-sm`}>
                  <CardContent className="py-12 text-center">
                    <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3
                      className="mb-2 text-lg font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      No approved sessions yet
                    </h3>
                    <p style={{ color: colors.text.secondary }}>
                      Once you approve session requests from students, they will
                      appear here for you to join.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {approvedSessions.map((session, index) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`${cardBg} shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={session.studentId.userId.avatar}
                                  alt={`${session.studentId.userId.firstName} ${session.studentId.userId.lastName}`}
                                />
                                <AvatarFallback>
                                  {session.studentId.userId.firstName.charAt(0)}
                                  {session.studentId.userId.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center mb-2 space-x-2">
                                  <h3
                                    className="text-lg font-semibold"
                                    style={{ color: colors.text.primary }}
                                  >
                                    {session.title}
                                  </h3>
                                  <Badge className="text-green-800 bg-green-100 border-green-200">
                                    Approved
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                  <div
                                    className="flex items-center space-x-2 text-sm"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    <User className="w-4 h-4" />
                                    <span>
                                      {session.studentId.userId.firstName ||
                                        "Unknown"}{" "}
                                      {session.studentId.userId.lastName ||
                                        "Student"}
                                    </span>
                                  </div>

                                  <div
                                    className="flex items-center space-x-2 text-sm"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {formatDateTime(session.startTime).date}
                                    </span>
                                  </div>

                                  <div
                                    className="flex items-center space-x-2 text-sm"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {formatDateTime(session.startTime).time}
                                    </span>
                                  </div>

                                  <div
                                    className="flex items-center space-x-2 text-sm"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    <span className="text-lg">
                                      {getStudentChoiceIcon(
                                        session.studentChoice
                                      )}
                                    </span>
                                    <span className="capitalize">
                                      {session.studentChoice === "ice cream"
                                        ? "Ice Cream"
                                        : session.studentChoice === "coffee"
                                        ? "Coffee"
                                        : "Free"}
                                    </span>
                                  </div>
                                </div>

                                {session.requestNotes && (
                                  <div className="p-3 mb-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-start space-x-2">
                                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                                      <p
                                        className="text-sm"
                                        style={{ color: colors.text.secondary }}
                                      >
                                        {session.requestNotes
                                          ?.replace(
                                            /(sd\s+)?Timezone Info:[\s\S]*?(?=\n\n|\n$|$)/i,
                                            ""
                                          )
                                          .replace(
                                            /Asia\/Ulaanbaatar[\s\S]*?(?=\n\n|\n$|$)/i,
                                            ""
                                          )
                                          .replace(
                                            /UTC[\+\-]?\d*\.?\d*[\s\S]*?(?=\n\n|\n$|$)/i,
                                            ""
                                          )
                                          .trim() ||
                                          "No additional notes provided"}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              {session.zoomStartUrl && (
                                <Button
                                  onClick={() =>
                                    window.open(session.zoomStartUrl, "_blank")
                                  }
                                  className="text-white bg-green-600 hover:bg-green-700"
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Start Meeting
                                </Button>
                              )}
                              {session.zoomJoinUrl && !session.zoomStartUrl && (
                                <Button
                                  onClick={() =>
                                    window.open(session.zoomJoinUrl, "_blank")
                                  }
                                  className="text-white bg-green-600 hover:bg-green-700"
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Meeting
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <h3
              className="mb-4 text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Reject Session Request
            </h3>
            <p className="mb-4" style={{ color: colors.text.secondary }}>
              Are you sure you want to reject this session request? Please
              provide a reason.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />

            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                  setSelectedSession(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSession}
                className="flex-1 text-white bg-red-600 hover:bg-red-700"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
