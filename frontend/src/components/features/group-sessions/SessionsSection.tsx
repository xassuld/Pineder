import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  Plus,
  Target,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { Card, CardContent } from "../../../design/system/card";
import {
  GroupSession,
  TopicSubmission,
} from "../../../core/lib/data/groupSessions";
import { SessionDetailsDialog } from "./SessionDetailsDialog";
import { SessionCreationForm } from "./SessionCreationForm";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionsSectionProps {
  groupSessions: GroupSession[];
  onSwitchToTopics: () => void;
  availableTopics: TopicSubmission[];
  onSessionCreate: (
    session: Omit<
      GroupSession,
      "id" | "participants" | "currentParticipants" | "createdAt" | "updatedAt"
    >
  ) => void;
  onSessionDelete?: (sessionId: string) => void;
  onSessionEdit?: (sessionId: string, updates: Partial<GroupSession>) => void;
}

export default function SessionsSection({
  groupSessions,
  onSwitchToTopics,
  availableTopics,
  onSessionCreate,
  onSessionDelete,
  onSessionEdit,
}: SessionsSectionProps) {
  const [selectedSession, setSelectedSession] = useState<GroupSession | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreationFormOpen, setIsCreationFormOpen] = useState(false);
  const { colors, isDarkMode } = useTheme();

  const handleDetailsClick = (session: GroupSession) => {
    setSelectedSession(session);
    setIsDetailsDialogOpen(true);
  };

  const handleSessionCreate = (
    newSession: Omit<
      GroupSession,
      "id" | "participants" | "currentParticipants" | "createdAt" | "updatedAt"
    >
  ) => {
    onSessionCreate(newSession);
    setIsCreationFormOpen(false);
  };

  const handleRescheduleSession = (session: GroupSession) => {
    console.log("Rescheduling session:", session.id);
    // This would open a reschedule modal and send notifications to all attendees
    alert(
      `Reschedule session "${session.topic?.topic}" - Notifications will be sent to all ${session.currentParticipants} attendees`
    );
  };

  const handleDeleteSession = (session: GroupSession) => {
    const confirmed = confirm(
      `Are you sure you want to remove the session "${session.topic?.topic}"?\n\nThis will notify all ${session.currentParticipants} attendees about the cancellation.`
    );

    if (confirmed) {
      console.log("Deleting session:", session.id);
      // This would delete the session and send cancellation notifications to all attendees
      onSessionDelete?.(session.id);
      alert(
        `Session "${session.topic?.topic}" has been removed. Notifications sent to all attendees.`
      );
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      planning:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      voting:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      scheduled:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      statusColors[status as keyof typeof statusColors] || statusColors.planning
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="mb-2 text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Group Sessions
          </h2>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Manage your group learning sessions
          </p>
        </div>
      </div>

      {/* Sessions Grid */}
      {groupSessions.length === 0 ? (
        <Card className="transition-all duration-300 border-2 shadow-lg hover:shadow-xl">
          <CardContent className="p-12 text-center">
            <Users className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h3
              className="mb-4 text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              No sessions yet
            </h3>
            <p
              className="mb-8 text-lg"
              style={{ color: colors.text.secondary }}
            >
              Create your first group session to get started
            </p>
            <Button
              onClick={() => setIsCreationFormOpen(true)}
              size="lg"
              className="px-8 py-4 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: colors.accent.primary,
                color: colors.text.inverse,
              }}
            >
              <Plus className="w-6 h-6 mr-3" />
              Create Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
          {groupSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <Card
                className={`
                  cursor-pointer border shadow-lg hover:shadow-xl 
                  transition-all duration-300 transform-gpu overflow-hidden
                  ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-900 hover:bg-gray-800"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                `}
                onClick={() => handleDetailsClick(session)}
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div
                    className={`
                      p-3 border-b relative
                      ${
                        isDarkMode
                          ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900"
                          : "border-gray-100 bg-gradient-to-br from-gray-50 to-white"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className="overflow-hidden text-base font-bold leading-tight"
                          style={{
                            color: colors.text.primary,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {session.topic?.topic || "Untitled Session"}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-4">
                    {/* Key Details - Compact */}
                    <div className="flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-md dark:bg-green-900">
                          <Calendar className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {session.scheduledDate && session.scheduledTime
                            ? `${session.scheduledDate} at ${session.scheduledTime}`
                            : "Not scheduled"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-md dark:bg-green-900">
                          <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {session.currentParticipants}/
                          {session.maxParticipants}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-md dark:bg-green-900">
                          <Clock className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {session.duration}m
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {session.topic?.description && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: isDarkMode ? "#1f2937" : "#f8fafc",
                            border: `1px solid ${
                              isDarkMode ? "#374151" : "#e2e8f0"
                            }`,
                          }}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600">
                                <span className="text-xs font-semibold text-white">
                                  {session.topic?.topic?.charAt(0) || "?"}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-1 space-x-2">
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: colors.text.primary }}
                                >
                                  Description
                                </span>
                                <span
                                  className="px-1.5 py-0.5 text-xs rounded-full"
                                  style={{
                                    backgroundColor: isDarkMode
                                      ? "#374151"
                                      : "#e5e7eb",
                                    color: colors.text.secondary,
                                  }}
                                >
                                  {session.topic.category}
                                </span>
                              </div>
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: colors.text.secondary }}
                              >
                                {session.topic.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end pt-3 space-x-2 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRescheduleSession(session);
                        }}
                        className="px-2 py-1.5 text-xs text-green-600 transition-all duration-200 border-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <Edit className="w-3 h-3 mr-1.5" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session);
                        }}
                        className="px-2 py-1.5 text-xs text-red-600 transition-all duration-200 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3 mr-1.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedSession && (
        <SessionDetailsDialog
          session={selectedSession}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onEdit={onSessionEdit}
        />
      )}

      <SessionCreationForm
        isOpen={isCreationFormOpen}
        onClose={() => setIsCreationFormOpen(false)}
        onSubmit={handleSessionCreate}
        availableTopics={availableTopics}
      />
    </div>
  );
}
