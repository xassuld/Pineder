import { useTheme } from "../../../core/contexts/ThemeContext";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";

interface Event {
  id: number;
  title: string;
  time: string;
  mentor: string;
  participants: number;
  maxParticipants: number;
  type: string;
  status: string;
}

interface HomePageEventsProps {
  events: Event[];
}

export function HomePageEvents({ events }: HomePageEventsProps) {
  const { colors, isDarkMode, getAccentColor } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return {
          backgroundColor: isDarkMode ? `${getAccentColor()}20` : `${getAccentColor()}10`,
          color: getAccentColor(),
        };
      case "Almost Full":
        return {
          backgroundColor: isDarkMode ? "rgba(251, 146, 60, 0.2)" : "rgba(251, 146, 60, 0.1)",
          color: "#ea580c",
        };
      default:
        return {
          backgroundColor: isDarkMode ? "rgba(156, 163, 175, 0.2)" : "rgba(156, 163, 175, 0.1)",
          color: "#6b7280",
        };
    }
  };

  const getButtonStyle = (status: string) => {
    if (status === "Open") {
      return {
        backgroundColor: getAccentColor(),
        color: "white",
      };
    } else {
      return {
        backgroundColor: "#eab308", // yellow-500
        color: "white",
      };
    }
  };

  const getButtonText = (status: string) => {
    return status === "Open" ? "Join Session" : "Join Waitlist";
  };

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor()}, ${getAccentColor()})`
              }}
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wider uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-colors duration-300`}
            style={{
              backgroundColor: isDarkMode ? `${getAccentColor()}20` : `${getAccentColor()}10`,
              color: getAccentColor(),
              borderColor: isDarkMode ? `${getAccentColor()}30` : `${getAccentColor()}20`
            }}
          >
            Today&apos;s Events
          </span>
          <h2
            className="mt-3 sm:mt-4 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
            style={{ color: colors.text.primary }}
          >
            <span 
              className="block mb-1 sm:mb-2 font-bold"
              style={{ color: getAccentColor() }}
            >
              Don&apos;t Miss
            </span>
            <span 
              className="block font-extrabold"
              style={{ color: getAccentColor() }}
            >
              Today&apos;s Sessions
            </span>
          </h2>
          <p
            className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl font-medium leading-relaxed px-4"
            style={{ color: colors.text.secondary }}
          >
            Join live sessions, workshops, and study groups happening today with
            our expert mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
              style={{
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
                boxShadow: isDarkMode
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Technology Background Pattern */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isDarkMode ? "opacity-10" : "opacity-5"
                }`}
              >
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-cyan-400/30"
                      : "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20"
                  }`}
                ></div>
                <div
                  className={`absolute top-0 left-0 w-full h-full transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-300/20 via-purple-300/20 to-cyan-300/20"
                      : "bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-cyan-400/10"
                  }`}
                ></div>
                <div
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                    isDarkMode ? "opacity-30" : "opacity-20"
                  }`}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative z-10 p-4 sm:p-6">
                {/* Status and Type Badges */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium rounded-full"
                    style={getStatusColor(event.status)}
                  >
                    {event.status}
                  </span>
                  <span
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${getAccentColor()}20`,
                      color: getAccentColor(),
                    }}
                  >
                    {event.type}
                  </span>
                </div>

                {/* Event Title */}
                <h3
                  className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 transition-colors duration-300"
                  style={{ color: colors.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = getAccentColor();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                >
                  {event.title}
                </h3>

                {/* Event Details */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div
                    className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30"
                        : "bg-gradient-to-r from-gray-50/80 to-gray-100/80"
                    }`}
                  >
                    <Clock
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0"
                      style={{ color: colors.text.muted }}
                    />
                    <span
                      className="text-xs sm:text-sm font-medium truncate"
                      style={{ color: colors.text.primary }}
                    >
                      {event.time}
                    </span>
                  </div>

                  <div
                    className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30"
                        : "bg-gradient-to-r from-gray-50/80 to-gray-100/80"
                    }`}
                  >
                    <Users
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0"
                      style={{ color: colors.text.muted }}
                    />
                    <span
                      className="text-xs sm:text-sm font-medium truncate"
                      style={{ color: colors.text.primary }}
                    >
                      {event.mentor}
                    </span>
                  </div>

                  <div
                    className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30"
                        : "bg-gradient-to-r from-gray-50/80 to-gray-100/80"
                    }`}
                  >
                    <TrendingUp
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0"
                      style={{ color: colors.text.muted }}
                    />
                    <span
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {event.participants}/{event.maxParticipants} students
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform`}
                  style={getButtonStyle(event.status)}
                >
                  {getButtonText(event.status)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
