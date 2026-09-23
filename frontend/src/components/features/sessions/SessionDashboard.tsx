import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Avatar, AvatarFallback } from "../../../design/system/avatar";
import { ImageWithFallback } from "../../common/figma/ImageWithFallback";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface Session {
  id: string;
  mentorId: number;
  mentorName: string;
  mentorImage: string;
  mentorRole: string;
  date: string;
  time: string;
  sessionType: "1on1" | "group";
  topic: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
  rating?: number;
  feedback?: string;
}

interface SessionDashboardProps {
  sessions: Session[];
  onJoinSession: (session: Session) => void;
  onCancelSession: (sessionId: string) => void;
  onRateSession: (sessionId: string, rating: number, feedback: string) => void;
}

export function SessionDashboard({
  sessions,
  onJoinSession,
  onCancelSession,
  onRateSession,
}: SessionDashboardProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const cancelledSessions = sessions.filter((s) => s.status === "cancelled");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Clock className="w-4 h-4" style={{ color: colors.accent.primary }} />
        );
      case "completed":
        return (
          <CheckCircle
            className="w-4 h-4"
            style={{ color: colors.accent.success }}
          />
        );
      case "cancelled":
        return (
          <XCircle className="w-4 h-4" style={{ color: colors.accent.error }} />
        );
      default:
        return (
          <Clock className="w-4 h-4" style={{ color: colors.text.muted }} />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          backgroundColor: `${colors.accent.primary}20`,
          color: colors.accent.primary,
        };
      case "completed":
        return {
          backgroundColor: `${colors.accent.success}20`,
          color: colors.accent.success,
        };
      case "cancelled":
        return {
          backgroundColor: `${colors.accent.error}20`,
          color: colors.accent.error,
        };
      default:
        return {
          backgroundColor: `${colors.text.muted}20`,
          color: colors.text.muted,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleRateSession = (sessionId: string) => {
    if (rating > 0) {
      onRateSession(sessionId, rating, feedback);
      setRating(0);
      setFeedback("");
      setShowRatingModal(null);
    }
  };

  const renderSessionCard = (session: Session) => (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-start space-x-4">
        <Avatar className="w-12 h-12">
          <ImageWithFallback
            src={session.mentorImage}
            alt={session.mentorName}
            className="object-cover"
          />
          <AvatarFallback className="text-sm">
            {session.mentorName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4
                className="font-semibold"
                style={{ color: colors.text.primary }}
              >
                {session.mentorName}
              </h4>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {session.mentorRole}
              </p>
            </div>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={getStatusColor(session.status)}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>

          <div className="space-y-2">
            <div
              className="flex items-center space-x-4 text-sm"
              style={{ color: colors.text.secondary }}
            >
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(session.time)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{session.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                {session.sessionType === "1on1" ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                <span>
                  {session.sessionType === "1on1" ? "1-on-1" : "Group"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare
                className="w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                {session.topic}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            {session.status === "upcoming" && (
              <>
                <Button
                  onClick={() => onJoinSession(session)}
                  size="sm"
                  style={{
                    backgroundColor: colors.accent.secondary,
                    color: colors.text.inverse,
                  }}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Join Session
                </Button>
                <Button
                  onClick={() => onCancelSession(session.id)}
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: colors.accent.error,
                    color: colors.accent.error,
                  }}
                >
                  Cancel
                </Button>
              </>
            )}

            {session.status === "completed" && !session.rating && (
              <Button
                onClick={() => setShowRatingModal(session.id)}
                size="sm"
                variant="outline"
                style={{
                  borderColor: colors.accent.secondary,
                  color: colors.accent.secondary,
                }}
              >
                <Star className="w-4 h-4 mr-1" />
                Rate Session
              </Button>
            )}

            {session.status === "completed" && session.rating && (
              <div
                className="flex items-center space-x-2 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Rated: {session.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            My Sessions
          </h2>
          <p style={{ color: colors.text.secondary }}>
            Manage your upcoming and completed tutoring sessions
          </p>
        </div>
        <Button
          className="hover:opacity-90 transition-opacity"
          style={{
            background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
            color: colors.text.inverse,
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book New Session
        </Button>
      </div>

      {/* Tabs */}
      <div
        className="flex space-x-1 p-1 rounded-lg"
        style={{ backgroundColor: colors.background.tertiary }}
      >
        {[
          {
            key: "upcoming",
            label: "Upcoming",
            count: upcomingSessions.length,
          },
          {
            key: "completed",
            label: "Completed",
            count: completedSessions.length,
          },
          {
            key: "cancelled",
            label: "Cancelled",
            count: cancelledSessions.length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor:
                activeTab === tab.key
                  ? colors.background.primary
                  : "transparent",
              color:
                activeTab === tab.key
                  ? colors.text.primary
                  : colors.text.secondary,
            }}
          >
            {tab.label}
            <span
              className="ml-2 px-2 py-1 rounded-full text-xs"
              style={{
                backgroundColor: colors.background.tertiary,
                color: colors.text.secondary,
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {activeTab === "upcoming" &&
          upcomingSessions.length > 0 &&
          upcomingSessions.map(renderSessionCard)}

        {activeTab === "completed" &&
          completedSessions.length > 0 &&
          completedSessions.map(renderSessionCard)}

        {activeTab === "cancelled" &&
          cancelledSessions.length > 0 &&
          cancelledSessions.map(renderSessionCard)}

        {/* Empty State */}
        {((activeTab === "upcoming" && upcomingSessions.length === 0) ||
          (activeTab === "completed" && completedSessions.length === 0) ||
          (activeTab === "cancelled" && cancelledSessions.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {activeTab} sessions
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "upcoming"
                ? "You don't have any upcoming sessions. Book a session to get started!"
                : activeTab === "completed"
                ? "You haven't completed any sessions yet."
                : "You haven't cancelled any sessions."}
            </p>
            {activeTab === "upcoming" && (
              <Button
                className="hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
                  color: colors.text.inverse,
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Your First Session
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rate Your Session</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-colors ${
                        rating >= star
                          ? "text-yellow-400 bg-yellow-50"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--pico-secondary)]"
                  placeholder="Share your experience..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRateSession(showRatingModal)}
                disabled={rating === 0}
                className="flex-1 bg-[var(--pico-secondary)] hover:bg-[var(--pico-secondary)]/90 text-white disabled:opacity-50"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
