import React, { useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import { Button } from "../../../design/system/button";
import { useUser } from "@clerk/nextjs";
import { GroupSession } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface EditSessionButtonProps {
  session: GroupSession;
  onEdit: (sessionId: string, updatedSession: Partial<GroupSession>) => void;
  className?: string;
  showAsIcon?: boolean;
}

export const EditSessionButton: React.FC<EditSessionButtonProps> = ({
  session,
  onEdit,
  className = "",
  showAsIcon = false,
}) => {
  const { user } = useUser();
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [maxParticipants, setMaxParticipants] = useState(
    session.maxParticipants
  );
  const [scheduledDate, setScheduledDate] = useState(
    session.scheduledDate || ""
  );
  const [scheduledTime, setScheduledTime] = useState(
    session.scheduledTime || ""
  );
  const [duration, setDuration] = useState(session.duration);
  const [description, setDescription] = useState(session.description);
  const [difficulty, setDifficulty] = useState(session.difficulty);
  const [tags, setTags] = useState(session.tags.join(", "));
  const [meetingLocation, setMeetingLocation] = useState(
    session.meetingLocation
  );
  const [meetingLink, setMeetingLink] = useState(session.meetingLink || "");
  const [meetingAddress, setMeetingAddress] = useState(
    session.meetingAddress || ""
  );

  // Check if current user is the creator of this session
  const canEdit = user?.id === session.teacherId;

  // If user can't edit, don't render anything
  if (!canEdit) {
    return null;
  }

  const handleEditClick = () => {
    console.log("Edit button clicked, setting isEditing to true");
    setIsEditing(true);
  };

  if (showAsIcon) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEditClick}
        className={className}
        title="Edit Session"
      >
        <Edit3 className="w-5 h-5" />
      </Button>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSession: Partial<GroupSession> = {
        maxParticipants,
        scheduledDate,
        scheduledTime,
        duration,
        description,
        difficulty,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        meetingLocation,
        meetingLink: meetingLocation === "zoom" ? meetingLink : undefined,
        meetingAddress:
          meetingLocation === "in-person" ? meetingAddress : undefined,
      };

      await onEdit(session.id, updatedSession);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setMaxParticipants(session.maxParticipants);
    setScheduledDate(session.scheduledDate || "");
    setScheduledTime(session.scheduledTime || "");
    setDuration(session.duration);
    setDescription(session.description);
    setDifficulty(session.difficulty);
    setTags(session.tags.join(", "));
    setMeetingLocation(session.meetingLocation);
    setMeetingLink(session.meetingLink || "");
    setMeetingAddress(session.meetingAddress || "");
    setIsEditing(false);
  };

  if (isEditing) {
    console.log("Rendering edit dialog, isEditing:", isEditing);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
        <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl rounded-lg sm:rounded-xl shadow-lg border mx-2 max-h-[90vh] overflow-y-auto bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 rounded-t-3xl bg-gray-50/80 backdrop-blur-md border-b-2 border-gray-200">
            <div className="flex items-center justify-between p-2 sm:p-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-600">
                  Edit Group Session
                </h2>
                <p className="text-xs text-green-700">Update session details</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-green-600/10 text-green-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Session Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what will be covered in this session..."
                  rows={2}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none border-gray-300"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Duration and Max Participants */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    step="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Meeting Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Meeting Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-2 cursor-pointer p-3 border-2 rounded-lg transition-all duration-200 hover:bg-gray-50/50 ${
                      meetingLocation === "zoom"
                        ? "border-green-600 bg-green-600/10"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="meetingLocation"
                      value="zoom"
                      checked={meetingLocation === "zoom"}
                      onChange={(e) =>
                        setMeetingLocation(
                          e.target.value as "zoom" | "in-person"
                        )
                      }
                      className="w-4 h-4 text-green-600 focus:ring-green-600"
                    />
                    <span className="text-sm font-medium">Zoom Meeting</span>
                  </label>
                  <label
                    className={`flex items-center space-x-2 cursor-pointer p-3 border-2 rounded-lg transition-all duration-200 hover:bg-gray-50/50 ${
                      meetingLocation === "in-person"
                        ? "border-green-600 bg-green-600/10"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="meetingLocation"
                      value="in-person"
                      checked={meetingLocation === "in-person"}
                      onChange={(e) =>
                        setMeetingLocation(
                          e.target.value as "zoom" | "in-person"
                        )
                      }
                      className="w-4 h-4 text-green-600 focus:ring-green-600"
                    />
                    <span className="text-sm font-medium">In-Person Class</span>
                  </label>
                </div>
              </div>

              {/* Meeting Details */}
              {meetingLocation === "zoom" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Zoom Meeting Link
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
              )}

              {meetingLocation === "in-person" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Meeting Address
                  </label>
                  <input
                    type="text"
                    value={meetingAddress}
                    onChange={(e) => setMeetingAddress(e.target.value)}
                    placeholder="Enter the physical address or location"
                    className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                    required
                  />
                </div>
              )}

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as "beginner" | "intermediate" | "advanced"
                    )
                  }
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., React, Performance, Frontend"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 py-3"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEditClick}
      className={
        showAsIcon
          ? `text-green-600 border-green-600 hover:bg-green-600/10 hover:border-green-600 ${className}`
          : className
      }
    >
      <Edit3 className="w-4 h-4 mr-2" />
      Edit Session
    </Button>
  );
};
