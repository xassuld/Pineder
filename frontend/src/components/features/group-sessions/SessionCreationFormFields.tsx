import { Calendar, Clock, Users, Target, MapPin, Video } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";

interface SessionCreationFormFieldsProps {
  selectedTopicId: string;
  setSelectedTopicId: (value: string) => void;
  maxParticipants: number;
  setMaxParticipants: (value: number) => void;
  scheduledDate: string;
  setScheduledDate: (value: string) => void;
  scheduledTime: string;
  setScheduledTime: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  description: string;
  setDescription: (value: string) => void;
  difficulty: "beginner" | "intermediate" | "advanced";
  setDifficulty: (value: "beginner" | "intermediate" | "advanced") => void;
  tags: string;
  setTags: (value: string) => void;
  meetingLocation: "zoom" | "in-person";
  setMeetingLocation: (value: "zoom" | "in-person") => void;
  meetingLink: string;
  setMeetingLink: (value: string) => void;
  meetingAddress: string;
  setMeetingAddress: (value: string) => void;
  availableTopics: TopicSubmission[];
}

export function SessionCreationFormFields({
  selectedTopicId,
  setSelectedTopicId,
  maxParticipants,
  setMaxParticipants,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  duration,
  setDuration,
  description,
  setDescription,
  difficulty,
  setDifficulty,
  tags,
  setTags,
  meetingLocation,
  setMeetingLocation,
  meetingLink,
  setMeetingLink,
  meetingAddress,
  setMeetingAddress,
  availableTopics,
}: SessionCreationFormFieldsProps) {
  const { colors } = useTheme();
  const difficulties = ["beginner", "intermediate", "advanced"];

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {/* Topic Selection */}
      <div>
        <label
          htmlFor="topic"
          className="block mb-2 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Select Topic
        </label>
        <select
          id="topic"
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full px-3 py-2 transition-all duration-200 border-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.input,
            color: colors.text.primary,
          }}
          required
        >
          <option value="">Choose a topic from student submissions</option>
          {availableTopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.topic} - {topic.category}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Session Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what will be covered in this session..."
          rows={3}
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.input,
            color: colors.text.primary,
          }}
          required
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <Calendar className="inline w-4 h-4 mr-2" />
            Date
          </label>
          <input
            id="date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <Clock className="inline w-4 h-4 mr-2" />
            Time
          </label>
          <input
            id="time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>
      </div>

      {/* Duration and Max Participants */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="duration"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <Clock className="inline w-4 h-4 mr-2" />
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            min="30"
            max="180"
            step="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="maxParticipants"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <Users className="inline w-4 h-4 mr-2" />
            Max Participants
          </label>
          <input
            id="maxParticipants"
            type="number"
            min="5"
            max="50"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>
      </div>

      {/* Meeting Location */}
      <div>
        <label
          htmlFor="meetingLocation"
          className="block mb-2 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          <MapPin className="inline w-4 h-4 mr-2" />
          Meeting Location
        </label>
        <p className="mb-3 text-xs text-gray-600">
          Choose how participants will join this group session
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label
            className="flex items-center p-3 space-x-2 transition-all duration-200 border-2 rounded-lg cursor-pointer hover:bg-gray-50/50"
            style={{
              borderColor:
                meetingLocation === "zoom"
                  ? colors.accent.success
                  : colors.border.primary,
              backgroundColor:
                meetingLocation === "zoom"
                  ? colors.accent.success + "10"
                  : "transparent",
            }}
          >
            <input
              type="radio"
              name="meetingLocation"
              value="zoom"
              checked={meetingLocation === "zoom"}
              onChange={(e) =>
                setMeetingLocation(e.target.value as "zoom" | "in-person")
              }
              className="w-4 h-4 text-green-600 focus:ring-green-600"
            />
            <Video className="w-4 h-4 text-green-600" />
            <span
              className="text-sm font-medium"
              style={{ color: colors.text.primary }}
            >
              Zoom Meeting
            </span>
          </label>
          <label
            className="flex items-center p-3 space-x-2 transition-all duration-200 border-2 rounded-lg cursor-pointer hover:bg-gray-50/50"
            style={{
              borderColor:
                meetingLocation === "in-person"
                  ? colors.accent.success
                  : colors.border.primary,
              backgroundColor:
                meetingLocation === "in-person"
                  ? colors.accent.success + "10"
                  : "transparent",
            }}
          >
            <input
              type="radio"
              name="meetingLocation"
              value="in-person"
              checked={meetingLocation === "in-person"}
              onChange={(e) =>
                setMeetingLocation(e.target.value as "zoom" | "in-person")
              }
              className="w-4 h-4 text-green-600 focus:ring-green-600"
            />
            <MapPin className="w-4 h-4 text-green-600" />
            <span
              className="text-sm font-medium"
              style={{ color: colors.text.primary }}
            >
              In-Person Class
            </span>
          </label>
        </div>
      </div>

      {/* Meeting Details */}
      {meetingLocation === "zoom" && (
        <div>
          <label
            htmlFor="meetingLink"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <Video className="inline w-4 h-4 mr-2" />
            Zoom Meeting Link
          </label>
          <input
            id="meetingLink"
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>
      )}

      {meetingLocation === "in-person" && (
        <div>
          <label
            htmlFor="meetingAddress"
            className="block mb-2 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            <MapPin className="inline w-4 h-4 mr-2" />
            Meeting Address
          </label>
          <input
            id="meetingAddress"
            type="text"
            value={meetingAddress}
            onChange={(e) => setMeetingAddress(e.target.value)}
            placeholder="Enter the physical address or location"
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.input,
              color: colors.text.primary,
            }}
            required
          />
        </div>
      )}

      {/* Difficulty */}
      <div>
        <label
          htmlFor="difficulty"
          className="block mb-2 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          <Target className="inline w-4 h-4 mr-2" />
          Difficulty Level
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value as "beginner" | "intermediate" | "advanced"
            )
          }
          className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.input,
            color: colors.text.primary,
          }}
          required
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="block mb-2 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., React, Performance, Frontend"
          className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.input,
            color: colors.text.primary,
          }}
        />
      </div>
    </div>
  );
}
