import React from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import { Badge } from "../../../design/system/badge";
import {
  Calendar,
  Clock,
  Timer,
  MapPin,
  Star,
  Coffee,
  Users,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

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

interface StudentCardProps {
  currentRequest: SessionRequest;
  colors: any;
  getStudentChoiceIcon: (choice: string) => string;
  formatDateTime: (dateString: string) => { date: string; time: string };
  x: any;
  rotate: any;
  opacity: any;
  handleDragEnd: (event: any, info: any) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  currentRequest,
  colors,
  getStudentChoiceIcon,
  formatDateTime,
  x,
  rotate,
  opacity,
  handleDragEnd,
}) => {
  const { isDarkMode, colors: themeColors } = useTheme();

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      className="mb-8 w-full"
    >
      {/* Main Card Container */}
      <div
        className="relative w-full max-w-sm mx-auto rounded-2xl shadow-2xl overflow-hidden sm:max-w-md backdrop-blur-md"
        style={{
          backgroundColor: isDarkMode
            ? `${themeColors.background.modal}CC` // Semi-transparent with blur in dark mode
            : `${themeColors.background.modal}80`, // More transparent in light mode
          border: `2px solid ${
            isDarkMode ? themeColors.border.primary : themeColors.accent.primary
          }`,
        }}
      >
        {/* Top Section with Student Image and Info */}
        <div
          className="relative h-36 sm:h-40"
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
              : `linear-gradient(135deg, ${themeColors.accent.primary}20 0%, ${themeColors.accent.secondary}30 50%, ${themeColors.accent.primary}20 100%)`,
            position: "relative",
          }}
        >
          {/* Subtle overlay for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
          {/* Student Image */}
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <Avatar
              className="w-14 h-14 border-3 shadow-xl sm:w-16 sm:h-16"
              style={{
                borderColor: isDarkMode
                  ? themeColors.background.card
                  : themeColors.accent.primary,
                borderWidth: "3px",
              }}
            >
              <AvatarImage src={currentRequest.studentId.userId.avatar} />
              <AvatarFallback
                className="text-lg font-bold text-white sm:text-xl"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                    : `linear-gradient(135deg, ${themeColors.accent.primary} 0%, ${themeColors.accent.secondary} 100%)`,
                  boxShadow: isDarkMode
                    ? "0 8px 25px rgba(59, 130, 246, 0.4)"
                    : `0 8px 25px ${themeColors.accent.primary}40`,
                }}
              >
                {`${currentRequest.studentId.userId.firstName.charAt(
                  0
                )}${currentRequest.studentId.userId.lastName.charAt(0)}`}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Student Info - Left Column */}
          <div className="absolute left-3 top-20 sm:left-4 sm:top-22">
            <div className="space-y-0.5">
              <h3
                className="text-sm font-bold sm:text-base"
                style={{
                  color: isDarkMode
                    ? colors.text.primary
                    : themeColors.accent.primary,
                  fontWeight: "700",
                }}
              >
                {`${currentRequest.studentId.userId.firstName} ${currentRequest.studentId.userId.lastName}`}
              </h3>
              <p
                className="text-xs sm:text-sm"
                style={{
                  color: isDarkMode
                    ? colors.text.secondary
                    : themeColors.accent.secondary,
                  fontWeight: "500",
                }}
              >
                {currentRequest.studentId.userId.email}
              </p>
            </div>
          </div>

          {/* Session Details - Right Column */}
          <div className="absolute right-3 top-3 space-y-2 sm:right-4 sm:top-4 sm:space-y-2">
            <div
              className="flex items-center space-x-2 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(0,0,0,0.7)"
                  : `${themeColors.accent.primary}20`,
                border: `2px solid ${
                  isDarkMode
                    ? `${colors.border.primary}60`
                    : themeColors.accent.primary
                }`,
                boxShadow: isDarkMode
                  ? "0 4px 15px rgba(0,0,0,0.4)"
                  : `0 4px 15px ${themeColors.accent.primary}30`,
              }}
            >
              <div
                className="p-1 rounded-md"
                style={{
                  backgroundColor: isDarkMode
                    ? "#3b82f6"
                    : themeColors.accent.primary,
                }}
              >
                <Calendar className="w-3 h-3 text-white sm:w-3.5 sm:h-3.5" />
              </div>
              <span
                className="text-xs font-semibold sm:text-sm"
                style={{
                  color: isDarkMode
                    ? colors.text.primary
                    : themeColors.accent.primary,
                  fontWeight: "600",
                }}
              >
                {formatDateTime(currentRequest.startTime).date}
              </span>
            </div>
            <div
              className="flex items-center space-x-2 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(0,0,0,0.7)"
                  : `${themeColors.accent.success}20`,
                border: `2px solid ${
                  isDarkMode
                    ? `${colors.border.primary}60`
                    : themeColors.accent.success
                }`,
                boxShadow: isDarkMode
                  ? "0 4px 15px rgba(0,0,0,0.4)"
                  : `0 4px 15px ${themeColors.accent.success}30`,
              }}
            >
              <div
                className="p-1 rounded-md"
                style={{
                  backgroundColor: isDarkMode
                    ? "#10b981"
                    : themeColors.accent.success,
                }}
              >
                <Clock className="w-3 h-3 text-white sm:w-3.5 sm:h-3.5" />
              </div>
              <span
                className="text-xs font-semibold sm:text-sm"
                style={{
                  color: isDarkMode
                    ? colors.text.primary
                    : themeColors.accent.success,
                  fontWeight: "600",
                }}
              >
                {formatDateTime(currentRequest.startTime).time} • 1h
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="p-4 space-y-4 sm:p-5 sm:space-y-4"
          style={{
            backgroundColor: isDarkMode
              ? "#000000"
              : `${themeColors.background.card}80`,
          }}
        >
          {/* Session Title */}
          <div
            className="text-center p-3 rounded-xl"
            style={{
              backgroundColor: isDarkMode
                ? "#1a1a1a"
                : `${themeColors.accent.primary}10`,
              border: `2px solid ${
                isDarkMode
                  ? `${colors.border.primary}40`
                  : themeColors.accent.primary
              }`,
            }}
          >
            <h2
              className="text-base font-bold mb-2 sm:text-lg sm:mb-2"
              style={{
                color: isDarkMode
                  ? colors.text.primary
                  : themeColors.accent.primary,
                fontWeight: "700",
              }}
            >
              {currentRequest.title}
            </h2>
            <p
              className="text-xs leading-relaxed sm:text-sm"
              style={{
                color: isDarkMode
                  ? colors.text.secondary
                  : themeColors.accent.secondary,
                fontWeight: "500",
              }}
            >
              {currentRequest.requestNotes
                ?.replace(/(sd\s+)?Timezone Info:[\s\S]*?(?=\n\n|\n$|$)/i, "")
                .replace(/Asia\/Ulaanbaatar[\s\S]*?(?=\n\n|\n$|$)/i, "")
                .replace(/UTC[\+\-]?\d*\.?\d*[\s\S]*?(?=\n\n|\n$|$)/i, "")
                .trim() || "No additional notes provided"}
            </p>
          </div>

          {/* Bottom Section */}
          <div
            className="pt-4 border-t rounded-xl p-3 sm:pt-4 sm:p-3"
            style={{
              borderColor: isDarkMode
                ? `${colors.border.primary}40`
                : themeColors.accent.primary,
              backgroundColor: isDarkMode
                ? "#1a1a1a"
                : `${themeColors.accent.primary}10`,
              border: `2px solid ${
                isDarkMode
                  ? `${colors.border.primary}40`
                  : themeColors.accent.primary
              }`,
            }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Requested Time */}
              <div
                className="text-center p-2 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "#000000"
                    : `${themeColors.background.card}60`,
                  border: `2px solid ${
                    isDarkMode
                      ? `${colors.border.primary}30`
                      : themeColors.accent.primary
                  }`,
                }}
              >
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Timer
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ color: colors.text.secondary }}
                  />
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Requested
                  </span>
                </div>
                <p
                  className="text-xs font-medium sm:text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {formatDateTime(currentRequest.startTime).date} at{" "}
                  {formatDateTime(currentRequest.startTime).time}
                </p>
              </div>

              {/* Meeting Preferences */}
              <div
                className="text-center p-2 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "#000000"
                    : `${themeColors.background.card}60`,
                  border: `2px solid ${
                    isDarkMode
                      ? `${colors.border.primary}30`
                      : themeColors.accent.primary
                  }`,
                }}
              >
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Users
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ color: colors.text.secondary }}
                  />
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Meeting
                  </span>
                </div>
                <p
                  className="text-xs font-medium sm:text-sm"
                  style={{ color: colors.text.primary }}
                >
                  Online
                </p>
              </div>
            </div>

            {/* Additional Preferences */}
            <div
              className="mt-3 text-center p-2 rounded-lg"
              style={{
                backgroundColor: isDarkMode
                  ? "#000000"
                  : `${themeColors.background.card}60`,
                border: `2px solid ${
                  isDarkMode
                    ? `${colors.border.primary}30`
                    : themeColors.accent.primary
                }`,
              }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coffee
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  style={{ color: colors.text.secondary }}
                />
                <span
                  className="text-xs sm:text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  Preferences
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <span
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{
                    color: isDarkMode
                      ? colors.text.secondary
                      : themeColors.accent.primary,
                    backgroundColor: isDarkMode
                      ? "#1a1a1a"
                      : `${themeColors.accent.primary}20`,
                    border: `2px solid ${
                      isDarkMode
                        ? `${colors.border.primary}30`
                        : themeColors.accent.primary
                    }`,
                  }}
                >
                  {getStudentChoiceIcon(currentRequest.studentChoice)}{" "}
                  {currentRequest.studentChoice}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500 opacity-20 sm:left-4">
            <div className="text-xl sm:text-2xl">←</div>
            <div className="text-xs">Decline</div>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 opacity-20 sm:right-4">
            <div className="text-xl sm:text-2xl">→</div>
            <div className="text-xs">Accept</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;
