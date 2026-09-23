import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../design/system/button";
import {
  GroupSession,
  TopicSubmission,
} from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { SessionCreationFormFields } from "./SessionCreationFormFields";

interface SessionCreationFormProps {
  onSubmit: (
    session: Omit<
      GroupSession,
      "id" | "createdAt" | "updatedAt" | "participants" | "currentParticipants"
    >
  ) => void;
  isOpen: boolean;
  onClose: () => void;
  availableTopics: TopicSubmission[];
}

export function SessionCreationForm({
  onSubmit,
  isOpen,
  onClose,
  availableTopics,
}: SessionCreationFormProps) {
  const { colors } = useTheme();
  const { user } = useUser();

  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [tags, setTags] = useState("");
  const [meetingLocation, setMeetingLocation] = useState<"zoom" | "in-person">(
    "zoom"
  );
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingAddress, setMeetingAddress] = useState("");

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedTopicId ||
      !scheduledDate ||
      !scheduledTime ||
      !description.trim() ||
      (meetingLocation === "zoom" && !meetingLink.trim()) ||
      (meetingLocation === "in-person" && !meetingAddress.trim())
    ) {
      return;
    }

    const selectedTopic = availableTopics.find(
      (topic) => topic.id === selectedTopicId
    );
    if (!selectedTopic) return;

    const newSession = {
      topic: selectedTopic,
      teacherId: user?.id || "current-mentor",
      teacherName: user?.fullName || user?.firstName || "Current Mentor",
      teacherImage:
        user?.imageUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      maxParticipants,
      status: "scheduled" as const,
      scheduledDate,
      scheduledTime,
      duration,
      meetingLocation,
      meetingLink: meetingLocation === "zoom" ? meetingLink : undefined,
      meetingAddress:
        meetingLocation === "in-person" ? meetingAddress : undefined,
      description: description.trim(),
      category: selectedTopic.category,
      difficulty,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    onSubmit(newSession);

    // Reset form
    setSelectedTopicId("");
    setMaxParticipants(10);
    setScheduledDate("");
    setScheduledTime("");
    setDuration(60);
    setDescription("");
    setDifficulty("intermediate");
    setTags("");
    setMeetingLocation("zoom");
    setMeetingLink("");
    setMeetingAddress("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg sm:rounded-xl shadow-lg border mx-2 max-h-[90vh] overflow-y-auto"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b-2 rounded-t-3xl backdrop-blur-md"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between p-2 sm:p-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BookOpen
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: colors.accent.primary }}
              />
              <div>
                <h2
                  className="text-sm font-bold sm:text-base md:text-lg"
                  style={{ color: colors.accent.primary }}
                >
                  Create New Group Session
                </h2>
                <p
                  className="text-xs"
                  style={{ color: colors.accent.secondary }}
                >
                  Schedule a group learning session
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-5 h-5 p-0 sm:h-6 sm:w-6 hover:bg-opacity-10"
              style={{
                color: colors.accent.primary,
                backgroundColor: "transparent",
              }}
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          <form onSubmit={submitForm}>
            {/* Form Fields Component */}
            <SessionCreationFormFields
              selectedTopicId={selectedTopicId}
              setSelectedTopicId={setSelectedTopicId}
              maxParticipants={maxParticipants}
              setMaxParticipants={setMaxParticipants}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              duration={duration}
              setDuration={setDuration}
              description={description}
              setDescription={setDescription}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              tags={tags}
              setTags={setTags}
              meetingLocation={meetingLocation}
              setMeetingLocation={setMeetingLocation}
              meetingLink={meetingLink}
              setMeetingLink={setMeetingLink}
              meetingAddress={meetingAddress}
              setMeetingAddress={setMeetingAddress}
              availableTopics={availableTopics}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 text-base transition-all duration-200 border-2 sm:h-12 sm:text-lg rounded-xl"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 text-base transition-all duration-200 shadow-lg sm:h-12 sm:text-lg rounded-xl hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
                  color: colors.text.inverse,
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Session
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
