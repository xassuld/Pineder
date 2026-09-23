import React, { useState } from "react";
import Head from "next/head";
import { useMotionValue, useTransform } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../design/system/button";
import { Users, Loader2 } from "lucide-react";
import {
  StudentCard,
  SessionTypeDialog,
} from "../../components/features/mentor-pages";
import { useMentorStudents } from "../../core/hooks/useMentorStudents";

interface SessionRequest {
  _id: string;
  studentId: {
    _id: string;
    studentCode: string;
    major: string;
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
  };
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "rejected" | "completed" | "cancelled";
  studentChoice: "free" | "coffee" | "ice-cream";
  requestNotes?: string;
  createdAt: string;
}

interface AcceptedSession {
  _id: string;
  studentName: string;
  studentEmail: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending";
  sessionType: "online" | "in-class";
  classDetails?: { room: string };
}

const MentorStudentsPage: React.FC = () => {
  const { isDarkMode, colors } = useTheme();
  const { sessionRequests, setSessionRequests, isLoading, error, refetch } =
    useMentorStudents();

  const [acceptedSessions, setAcceptedSessions] = useState<AcceptedSession[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSessionTypeDialog, setShowSessionTypeDialog] = useState(false);
  const [pendingAcceptId, setPendingAcceptId] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<
    "online" | "in-class"
  >("online");
  const [classDetails, setClassDetails] = useState({ room: "" });

  // Motion values for swipe animation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const getStudentChoiceIcon = (choice: string) => {
    switch (choice) {
      case "coffee":
        return "☕";
      case "ice-cream":
        return "🍦";
      case "free":
        return "🎁";
      default:
        return "🎁";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      // Swipe right → Accept
      handleAcceptRequest(currentRequest._id);
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left → Decline
      handleDecline(currentRequest._id);
    }
    x.set(0);
  };

  const handleAcceptRequest = (requestId: string) => {
    setPendingAcceptId(requestId);
    setShowSessionTypeDialog(true);
  };

  const handleAcceptWithType = async () => {
    if (pendingAcceptId) {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
          }/api/sessions/${pendingAcceptId}/approve`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-role": "mentor",
              "x-user-email": "itugs7986@gmail.com", // This should come from user context
              "x-user-id": "test",
            },
          }
        );

        if (response.ok) {
          // Remove the accepted request from the list
          setSessionRequests((prev) =>
            prev.filter((r) => r._id !== pendingAcceptId)
          );
          setCurrentIndex((prev) => Math.min(prev, sessionRequests.length - 2));
        } else {
          console.error("Failed to approve session");
        }
      } catch (error) {
        console.error("Error approving session:", error);
      }

      setShowSessionTypeDialog(false);
      setPendingAcceptId(null);
      setSelectedSessionType("online");
      setClassDetails({ room: "" });
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": "itugs7986@gmail.com", // This should come from user context
            "x-user-id": "test",
          },
          body: JSON.stringify({
            rejectionReason: "Session declined by mentor",
          }),
        }
      );

      if (response.ok) {
        // Remove the declined request from the list
        setSessionRequests((prev) => prev.filter((r) => r._id !== requestId));
        setCurrentIndex((prev) => Math.min(prev, sessionRequests.length - 2));
      } else {
        console.error("Failed to reject session");
      }
    } catch (error) {
      console.error("Error rejecting session:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Mentor Students | Pineder</title>
          <meta
            name="description"
            content="Review and manage student session requests"
          />
        </Head>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <Loader2
              className="w-16 h-16 mx-auto mb-4 animate-spin"
              style={{ color: colors.text.secondary }}
            />
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Loading Requests...
            </h2>
            <p style={{ color: colors.text.secondary }}>
              Fetching student session requests
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <Head>
          <title>Mentor Students | Pineder</title>
          <meta
            name="description"
            content="Review and manage student session requests"
          />
        </Head>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <Users
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: colors.text.secondary }}
            />
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Error Loading Requests
            </h2>
            <p style={{ color: colors.text.secondary }}>{error}</p>
            <Button
              onClick={refetch}
              className="mt-4"
              style={{
                backgroundColor: colors.accent.primary,
                color: "white",
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // No requests state
  if (sessionRequests.length === 0) {
    return (
      <Layout>
        <Head>
          <title>Mentor Students | Pineder</title>
          <meta
            name="description"
            content="Review and manage student session requests"
          />
        </Head>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <Users
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: colors.text.secondary }}
            />
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              No Pending Requests
            </h2>
            <p style={{ color: colors.text.secondary }}>
              All student session requests have been processed!
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentRequest = sessionRequests[currentIndex];

  return (
    <Layout>
      <Head>
        <title>Mentor Students | Pineder</title>
        <meta
          name="description"
          content="Review and manage student session requests"
        />
      </Head>

      <div
        className="w-full min-h-screen"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="w-full max-w-sm px-4 py-4 mx-auto sm:max-w-lg sm:px-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <h1
              className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl"
              style={{ color: colors.text.primary }}
            >
              Student Session Requests
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: colors.text.secondary }}
            >
              Swipe right to accept, left to decline
            </p>
          </div>

          {/* Session Request Card */}
          <div className="w-full">
            <StudentCard
              currentRequest={currentRequest}
              colors={{ ...colors, isDarkMode }}
              getStudentChoiceIcon={getStudentChoiceIcon}
              formatDateTime={formatDateTime}
              x={x}
              rotate={rotate}
              opacity={opacity}
              handleDragEnd={handleDragEnd}
            />
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-center sm:space-x-4 sm:mt-8 sm:gap-0">
            <Button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              variant="outline"
              className="w-full px-6 py-3 sm:w-auto"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentIndex(
                  Math.min(sessionRequests.length - 1, currentIndex + 1)
                )
              }
              disabled={currentIndex === sessionRequests.length - 1}
              className="w-full px-6 py-3 font-semibold sm:w-auto"
              style={{
                backgroundColor: colors.accent.primary,
                color: "white",
              }}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Session Type Dialog */}
        <SessionTypeDialog
          showSessionTypeDialog={showSessionTypeDialog}
          setShowSessionTypeDialog={setShowSessionTypeDialog}
          selectedSessionType={selectedSessionType}
          setSelectedSessionType={setSelectedSessionType}
          classDetails={classDetails}
          setClassDetails={setClassDetails}
          handleAcceptWithType={handleAcceptWithType}
        />
      </div>
    </Layout>
  );
};

export default MentorStudentsPage;
