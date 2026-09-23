import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  X,
  Share2,
  Bookmark,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Mic,
  Video,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { Event } from "../../../core/hooks/useEvents";
import { useUser } from "@clerk/nextjs";

interface EventDetailsProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: (event: Event) => void;
}

export function EventDetails({
  event,
  isOpen,
  onClose,
  onRegister,
}: EventDetailsProps) {
  console.log("EventDetails - event object:", event);
  console.log("EventDetails - event.eventType:", event?.eventType);
  console.log("EventDetails - event.startTime:", event?.startTime);
  console.log("EventDetails - event.endTime:", event?.endTime);
  console.log("EventDetails - event.eventId:", event?.eventId);

  const { colors, isDarkMode } = useTheme();
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(
    event.registeredStudents?.includes(user?.id || "") || false
  );
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    console.log("formatDate called with:", dateString);
    const date = new Date(dateString);
    console.log("Parsed date:", date);
    console.log("Is valid date:", !isNaN(date.getTime()));

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    console.log("formatTime called with:", dateString);
    const date = new Date(dateString);
    console.log("Parsed date for time:", date);
    console.log("Is valid date for time:", !isNaN(date.getTime()));

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    const isFull = event.currentParticipants >= (event.maxParticipants || 0);
    return isFull ? colors.accent.error : colors.accent.success;
  };

  const getStatusText = () => {
    const isFull = event.currentParticipants >= (event.maxParticipants || 0);
    return isFull ? "Full" : "Open";
  };

  // Helper functions to get icon and color for event type
  const getEventIcon = (eventType: string) => {
    console.log("getEventIcon called with:", eventType);
    if (!eventType) return Calendar;

    switch (eventType) {
      case "workshop":
        return BookOpen;
      case "discussion":
        return Mic;
      case "webinar":
        return Video;
      case "q&a":
        return Users;
      default:
        return Calendar;
    }
  };

  const getEventColor = (eventType: string) => {
    console.log("getEventColor called with:", eventType);
    if (!eventType) return "bg-indigo-500";

    switch (eventType) {
      case "workshop":
        return "bg-blue-500";
      case "discussion":
        return "bg-green-500";
      case "webinar":
        return "bg-purple-500";
      case "q&a":
        return "bg-orange-500";
      default:
        return "bg-indigo-500";
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister(event);
      setIsRegistered(!isRegistered);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl border my-4"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div
                    className={`p-2 sm:p-3 rounded-full ${getEventColor(
                      event.eventType || ""
                    )} text-white flex-shrink-0`}
                  >
                    {(() => {
                      const IconComponent = getEventIcon(event.eventType || "");
                      return (
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                      );
                    })()}
                  </div>
                  <div className="text-white flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 truncate">
                      {event.title}
                    </h2>
                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {event.eventType
                          ? event.eventType.charAt(0).toUpperCase() +
                            event.eventType.slice(1)
                          : "Event"}
                      </Badge>
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: getStatusColor(),
                          color: colors.text.inverse,
                        }}
                      >
                        {getStatusText()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-white/20 text-white flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Calendar
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      style={{ color: colors.accent.primary }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Date
                      </p>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatDate(event.startTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Clock
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      style={{ color: colors.accent.primary }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Time
                      </p>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <MapPin
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      style={{ color: colors.accent.primary }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Location
                      </p>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Users
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      style={{ color: colors.accent.primary }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Attendees
                      </p>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.currentParticipants} registered
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card
              className="mb-4 sm:mb-6 border-0 shadow-sm"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle
                  className="text-base sm:text-lg"
                  style={{ color: colors.text.primary }}
                >
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Category and Additional Info */}
            <Card
              className="mb-4 sm:mb-6 border-0 shadow-sm"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium mb-1"
                      style={{ color: colors.text.primary }}
                    >
                      Category
                    </p>
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${colors.accent.primary}20`,
                        color: colors.accent.primary,
                      }}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    <p
                      className="text-xs sm:text-sm font-medium mb-1"
                      style={{ color: colors.text.primary }}
                    >
                      Event ID
                    </p>
                    <p
                      className="text-xs sm:text-sm truncate"
                      style={{ color: colors.text.secondary }}
                    >
                      {event.eventId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div
            className="border-t p-3 sm:p-4"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  style={{
                    borderColor: colors.border.primary,
                    color: isBookmarked
                      ? colors.accent.primary
                      : colors.text.secondary,
                    backgroundColor: isBookmarked
                      ? `${colors.accent.primary}10`
                      : "transparent",
                  }}
                >
                  <Bookmark
                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
                      isBookmarked ? "fill-current" : ""
                    }`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    style={{
                      borderColor: colors.border.primary,
                      color: colors.text.secondary,
                    }}
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                className="px-4 sm:px-6 py-2 transition-all duration-200 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
                style={{
                  backgroundColor: isRegistered
                    ? colors.accent.error
                    : colors.accent.success,
                  color: colors.text.inverse,
                }}
              >
                {isRegistered ? (
                  <>
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Unregister
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Register
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
