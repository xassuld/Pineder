import { useState } from "react";
import { Plus, Calendar, Clock, Users, MapPin, BookOpen } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent } from "../../../design/system/card";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { CreateEventData } from "../../../core/hooks/useEvents";

interface EventSubmissionFormProps {
  onSubmit: (event: CreateEventData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function EventSubmissionForm({
  onSubmit,
  isOpen,
  onClose,
}: EventSubmissionFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const eventTypes = [
    "workshop",
    "discussion",
    "seminar",
    "meetup",
    "webinar",
    "q&a",
  ];

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Database",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Architecture",
    "General Programming",
    "Other",
  ];

  const durationOptions = [
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "1.5 hours", value: 90 },
    { label: "2 hours", value: 120 },
    { label: "3 hours", value: 180 },
    { label: "4 hours", value: 240 },
  ];

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !eventType ||
      !eventDate ||
      !startTime ||
      !category
    ) {
      return;
    }

    const newEvent: CreateEventData = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      eventDate,
      startTime,
      duration,
      maxParticipants,
      location: location.trim() || "Online",
      category,
      tags: [],
      isPublic: true,
    };

    onSubmit(newEvent);

    // Reset form
    setTitle("");
    setDescription("");
    setEventType("");
    setEventDate("");
    setStartTime("");
    setDuration(60);
    setMaxParticipants(20);
    setLocation("");
    setCategory("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
          }}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-white" />
              <div className="text-white">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <p className="text-sm" style={{ color: colors.text.inverse }}>
                  Quick event setup
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={submitForm} className="space-y-4">
            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Event Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., React Performance Workshop..."
                className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Event Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what participants will learn..."
                rows={3}
                className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              />
            </div>

            {/* Event Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventType"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Event Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Duration and Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Duration
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Max Participants
                </label>
                <input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  max="100"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Location (Optional)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Online, Conference Room A..."
                className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
              />
            </div>

            {/* Tips */}
            <Card
              className="border-0 shadow-lg"
              style={{
                backgroundColor: `${colors.accent.primary}10`,
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <BookOpen
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent.primary }}
                  />
                  <div style={{ color: colors.accent.primary }}>
                    <p className="text-sm font-medium mb-1">
                      💡 Quick tips: Clear objectives, realistic limits
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 text-base border-2 rounded-lg transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
                  color: colors.text.inverse,
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
