import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import {
  Calendar,
  Clock,
  User,
  Star,
  Video,
  Clock3,
  MessageCircle,
  X,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";

interface SessionCardProps {
  session: any;
  index: number;
  onJoinSession: (session: any) => void;
  onRequestReschedule: (session: any) => void;
  onRateSession: (session: any) => void;
  onCancelSession: (session: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function SessionCard({
  session,
  index,
  onJoinSession,
  onRequestReschedule,
  getStatusColor,
  getStatusIcon,
}: SessionCardProps) {
  const { colors, isDarkMode } = useTheme();
  const { user } = useUser();

  // Determine if user is a mentor or student
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const isMentor = email.endsWith("@gmail.com");
  const isStudent = email.endsWith("@nest.edu.mn");

  const getCardColor = (status: string) => {
    switch (status) {
      case "upcoming":
      case "approved":
        return "from-[#58CC02] to-[#46A302]";
      case "completed":
        return "from-[#58CC02] to-[#46A302]";
      case "cancelled":
        return "from-red-400 to-pink-500";
      case "requested":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-[#58CC02] to-[#46A302]";
    }
  };

  const openTeamsChat = () => {
    const mentor = session?.mentor || {};
    let teamsUrl = "https://teams.microsoft.com/";
    if (mentor.teamsId) {
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.teamsId}`;
    } else if (mentor.email) {
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.email}`;
    }
    window.open(teamsUrl, "_blank");
  };

  // Get display status for UI
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "requested":
        return "pending";
      case "approved":
        return "upcoming";
      default:
        return status;
    }
  };

  const displayStatus = getDisplayStatus(session.status);

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      whileHover={{
        y: -8,
        rotateX: 2,
        rotateY: 1,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="group"
      style={{ perspective: 1000 }}
    >
      <Card
        className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 transform-gpu ${
          isDarkMode
            ? "border border-gray-700 shadow-lg hover:shadow-2xl bg-gray-900"
            : "border border-gray-200 shadow-sm hover:shadow-xl bg-white"
        }`}
      >
        {/* Header Section - Clear Visual Hierarchy */}
        <div
          className={`p-5 border-b transition-colors duration-300 ${
            isDarkMode
              ? "border-gray-600/30 bg-gray-800/60"
              : "border-gray-100 bg-gray-50/30"
          }`}
        >
          <div className="flex items-start space-x-4">
            {/* Mentor Profile - Consistent sizing */}
            <div className="flex-shrink-0">
              <Image
                src={session.mentor?.image || "/default-avatar.png"}
                alt={session.mentor?.name || "Mentor"}
                width={80}
                height={80}
                className={`rounded-lg object-cover border shadow-sm transition-colors duration-300 ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              />
            </div>

            {/* Session Information - Prioritized content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Status Badge - Subtle but clear */}
              <div className="flex items-center">
                <Badge
                  className={`${getStatusColor(
                    displayStatus
                  )} text-xs font-medium px-2 py-1`}
                >
                  {getStatusIcon(displayStatus)}
                  <span className="ml-1 capitalize">{displayStatus}</span>
                </Badge>
              </div>

              {/* Session Title - Most important information */}
              <h3
                className={`text-lg font-semibold leading-tight line-clamp-2 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {session.title}
              </h3>

              {/* Mentor Name - Secondary information */}
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {session.mentor?.name || "Unknown Mentor"}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-col flex-1 p-5">
          {/* Session Description */}
          {session.description && (
            <div
              className={`mb-4 p-3 rounded-lg border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 shadow-lg"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200"
              }`}
            >
              <p
                className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${
                  isDarkMode ? "text-gray-100" : "text-gray-700"
                }`}
              >
                {session.description}
              </p>
            </div>
          )}

          {/* Session Details Grid - Grouped related information */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Date Information */}
            <div
              className={`flex items-center space-x-2.5 p-3 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-800/60 border-gray-600/30 hover:border-gray-500/50"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <Calendar
                className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {session.date}
              </span>
            </div>

            {/* Student Choice - Consistent styling */}
            <div
              className={`flex items-center space-x-2.5 p-3 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-800/60 border-gray-600/30 hover:border-gray-500/50"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <span className="text-lg flex-shrink-0">
                {session.studentChoice === "ice cream" && "🍦"}
                {session.studentChoice === "coffee" && "☕"}
                {session.studentChoice === "free" && "🎁"}
              </span>
              <div className="min-w-0">
                <span
                  className={`text-xs font-medium block transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Student Choice
                </span>
                <p
                  className={`text-sm font-medium truncate transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {session.studentChoice === "ice cream" && "Ice Cream"}
                  {session.studentChoice === "coffee" && "Coffee"}
                  {session.studentChoice === "free" && "Free"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Clear hierarchy and consistency */}
          {(session.status === "upcoming" || session.status === "approved") && (
            <div className="mt-auto space-y-3">
              {/* Primary Actions Row */}
              <div className="flex gap-3">
                <Button
                  className={`flex-1 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                    isDarkMode
                      ? "bg-green-800 hover:bg-green-700"
                      : "bg-[#58CC02] hover:bg-[#46A302]"
                  }`}
                  onClick={() => onJoinSession(session)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Zoom
                </Button>

                {/* Only show Teams Chat for mentors */}
                {isMentor && (
                  <Button
                    className={`flex-1 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      isDarkMode
                        ? "bg-green-800 hover:bg-green-700"
                        : "bg-[#58CC02] hover:bg-[#46A302]"
                    }`}
                    onClick={openTeamsChat}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Teams Chat
                  </Button>
                )}
              </div>

              {/* Reschedule Button - Temporarily removed */}
              {/* <Button
                className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                  isDarkMode
                    ? "bg-green-800 hover:bg-green-700"
                    : "bg-[#58CC02] hover:bg-[#46A302]"
                }`}
                onClick={() => onRequestReschedule(session)}
              >
                <Clock3 className="w-4 h-4 mr-2" />
                Reschedule
              </Button> */}
            </div>
          )}

          {/* Pending Status - Show for requested sessions */}
          {session.status === "requested" && (
            <div className="mt-auto">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center space-x-2 text-yellow-700">
                  <span className="text-lg">⏳</span>
                  <span className="font-medium text-sm">
                    Waiting for mentor approval
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Completed Session State - Professional completion indicator */}
          {session.status === "completed" && (
            <div className="mt-auto">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span className="font-medium text-sm">Session Completed</span>
                </div>
              </div>
            </div>
          )}

          {/* Cancelled session indicator */}
          {session.status === "cancelled" && (
            <div className="mt-auto text-center">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <span className="text-2xl">❌</span>
                  <span className="text-lg font-bold">Session Cancelled</span>
                </div>
                <p className="text-red-500 mt-1">
                  This session has been cancelled
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
