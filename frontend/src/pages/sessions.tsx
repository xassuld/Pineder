import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Layout } from "../components/layout/Layout";
import { SignInAlert } from "../components/common/SignInAlert";
import {
  SessionTabs,
  SessionGrid,
  EmptyStateCard,
  RescheduleDialog,
  RatingDialog,
} from "../components/features/sessions";
import { Footer } from "../components/layout/Footer";
import { mentorCategories } from "../core/lib/data/mentors";
import { useSessions } from "../core/hooks";
import { Button } from "../design/system/button";

interface SessionData {
  id: string;
  title: string;
  mentor: {
    name: string;
    image: string;
    expertise: string[];
    rating: number;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  duration: string;
  subject: string;
  price: number;
  studentChoice: "ice cream" | "coffee" | "free";
  meetingLink?: string;
}

interface GroupSessionData {
  id: string;
  title: string;
  mentor: {
    name: string;
    image: string;
    expertise: string[];
    rating: number;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  duration: string;
  subject: string;
  price: number;
  studentChoice: "ice cream" | "coffee" | "free";
  meetingLink?: string;
  maxParticipants: number;
  currentParticipants: number;
  participants: string[];
}

type AnySession = SessionData | GroupSessionData;

export default function SessionsPage() {
  const { colors } = useTheme();
  const { user, isSignedIn, isLoaded } = useUser();
  const [showSignInAlert, setShowSignInAlert] = useState(false);
  const {
    sessions,
    isLoading,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
  } = useSessions();
  const [activeTab, setActiveTab] = useState<"group" | "oneonone" | "all">(
    "oneonone"
  );
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<
    SessionData | GroupSessionData | null
  >(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  // Show sign-in alert for unsigned users
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowSignInAlert(true);
    }
  }, [isLoaded, isSignedIn]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show sign-in alert for unsigned users
  if (!isSignedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Sessions
            </h2>
            <p
              className="mb-6 text-lg"
              style={{ color: colors.text.secondary }}
            >
              Sign in to access your sessions and manage your learning journey.
            </p>
            <Button
              onClick={() => setShowSignInAlert(true)}
              className="px-6 py-3 font-semibold text-white rounded-lg"
              style={{ backgroundColor: colors.accent.primary }}
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
        <SignInAlert
          isOpen={showSignInAlert}
          onClose={() => setShowSignInAlert(false)}
          title="Access Your Sessions"
          message="Sign in to view and manage your sessions, join group sessions, and track your progress."
        />
      </Layout>
    );
  }

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "all") return true;
    if (activeTab === "oneonone") return true; // Show all sessions in oneonone tab
    if (activeTab === "group") return false; // No group sessions for now
    return false;
  });

  const stats = {
    total: sessions.length,
    oneonone: sessions.length,
    group: 0, // No group sessions for now
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="w-4 h-4">⏰</span>;
      case "pending":
        return <span className="w-4 h-4">⏳</span>;
      case "completed":
        return <span className="w-4 h-4">✅</span>;
      case "cancelled":
        return <span className="w-4 h-4">❌</span>;
      default:
        return <span className="w-4 h-4">🕐</span>;
    }
  };

  const handleJoinSession = (session: SessionData | GroupSessionData) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    } else {
      alert(
        "Meeting link not available yet. Please wait for the mentor to approve the session."
      );
    }
  };

  const handleRequestReschedule = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRescheduleDialog(true);
  };

  const handleCancelSession = (session: SessionData | GroupSessionData) => {
    if (confirm("Are you sure you want to cancel this session?")) {
      cancelSession(session.id);
    }
  };

  const cancelSession = async (sessionId: string) => {
    if (!user) {
      alert("Please sign in to cancel sessions");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      // console.log("Cancelling session:", {
      //   sessionId,
      //   email,
      //   role,
      //   userId: user.id,
      // });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/bookings/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
        }
      );

      // console.log("Cancel response status:", response.status);
      // console.log("Cancel response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        // console.log("Cancel response data:", data);
        if (data.success) {
          alert("Session cancelled successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        const errorText = await response.text();
        // console.error("Cancel error response:", errorText);
        alert("Failed to cancel session");
      }
    } catch (error) {
      // console.error("Error cancelling session:", error);
      alert("Failed to cancel session");
    }
  };

  const handleSubmitReschedule = (newStartTime: string, newEndTime: string) => {
    if (rescheduleReason.trim() && selectedSession) {
      // Call backend API to request reschedule
      requestReschedule(
        selectedSession.id,
        newStartTime,
        newEndTime,
        rescheduleReason
      );
      setShowRescheduleDialog(false);
      setRescheduleReason("");
      setSelectedSession(null);
    }
  };

  const requestReschedule = async (
    sessionId: string,
    newStartTime: string,
    newEndTime: string,
    reason: string
  ) => {
    if (!user) {
      alert("Please sign in to request reschedule");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/reschedule/${sessionId}/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
          body: JSON.stringify({
            newStartTime,
            newEndTime,
            reason,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Reschedule request sent successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        alert("Failed to send reschedule request");
      }
    } catch (error) {
      // console.error("Error requesting reschedule:", error);
      alert("Failed to send reschedule request");
    }
  };

  const handleRateSession = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRatingDialog(true);
    setRating(0);
    setRatingComment("");
  };

  const handleSubmitRating = () => {
    if (rating > 0 && selectedSession) {
      // Call backend API to submit rating
      submitRating(selectedSession.id, rating, ratingComment);
      setShowRatingDialog(false);
      setRating(0);
      setRatingComment("");
      setSelectedSession(null);
    }
  };

  const submitRating = async (
    sessionId: string,
    rating: number,
    comment: string
  ) => {
    if (!user) {
      alert("Please sign in to submit ratings");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Rating submitted successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        alert("Failed to submit rating");
      }
    } catch (error) {
      // console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  const getCurrentSessions = () => {
    if (activeTab === "group") return [];
    if (activeTab === "oneonone") return filteredSessions;
    if (activeTab === "all") return filteredSessions;
    return [];
  };

  const getEmptyStateType = () => {
    if (activeTab === "group") return "group";
    if (activeTab === "oneonone") return "oneonone";
    return "all";
  };

  return (
    <Layout showFooter={false}>
      <Head>
        <title>My Sessions | Pineder</title>
        <meta
          name="description"
          content="Track your learning sessions, view upcoming appointments, and review completed sessions with mentors."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <SessionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLoading ? (
            <div className="py-2 text-center">
              <div className="w-8 h-8 mx-auto mb-2 border-b-2 border-green-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Loading your sessions...
              </p>
            </div>
          ) : getCurrentSessions().length === 0 ? (
            <EmptyStateCard type={getEmptyStateType()} />
          ) : (
            <SessionGrid
              sessions={getCurrentSessions()}
              onJoinSession={handleJoinSession}
              onRequestReschedule={handleRequestReschedule}
              onRateSession={() => {}}
              onCancelSession={() => {}}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}
        </motion.div>
      </div>

      <RescheduleDialog
        isOpen={showRescheduleDialog}
        onClose={() => {
          setShowRescheduleDialog(false);
          setRescheduleReason("");
          setSelectedSession(null);
        }}
        session={selectedSession}
        rescheduleReason={rescheduleReason}
        setRescheduleReason={setRescheduleReason}
        onSubmit={handleSubmitReschedule}
      />

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => {
          setShowRatingDialog(false);
          setRating(0);
          setRatingComment("");
          setSelectedSession(null);
        }}
        session={selectedSession}
        rating={rating}
        setRating={setRating}
        ratingComment={ratingComment}
        setRatingComment={setRatingComment}
        onSubmit={handleSubmitRating}
      />

      <Footer />
    </Layout>
  );
}
