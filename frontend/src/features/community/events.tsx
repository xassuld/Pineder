import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  BookOpen,
  Video,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { useState } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";

export default function CommunityEvents() {
  const { isDarkMode, colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)); // December 2024
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  const events = [
    {
      id: 1,
      title: "pinequest",
      startTime: "09:00",
      endTime: "10:30",
      date: new Date(2024, 11, 4), // December 4th
      endDate: new Date(2024, 11, 4), // Single day event
      type: "Blog Post",
      status: "Published",
      icon: BookOpen,
      description: "How to create engaging content for developers",
      location: "Online",
      attendees: 45,
      category: "Content",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "demo",
      startTime: "14:00",
      endTime: "15:00",
      date: new Date(2024, 11, 7), // December 7th
      endDate: new Date(2024, 11, 7), // Single day event
      type: "Video",
      status: "In Review",
      icon: Video,
      description: "Live coding session: Building a React app",
      location: "Online",
      attendees: 23,
      category: "Workshop",
      color: "bg-orange-500",
    },
    {
      id: 3,
      title: "teachers day",
      startTime: "10:00",
      endTime: "12:00",
      date: new Date(2024, 11, 10), // December 10th
      endDate: new Date(2024, 11, 10), // Single day event
      type: "Event",
      status: "Scheduled",
      icon: Calendar,
      description: "Annual celebration and recognition of educators",
      location: "Main Campus",
      attendees: 120,
      category: "Event",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "how to leap",
      startTime: "16:00",
      endTime: "17:30",
      date: new Date(2024, 11, 13), // December 13th
      endDate: new Date(2024, 11, 14), // Two day event
      type: "Podcast",
      status: "Idea",
      icon: Mic,
      description: "Career advancement strategies for developers",
      location: "Online",
      attendees: 67,
      category: "Learning",
      color: "bg-purple-500",
    },
    {
      id: 5,
      title: "group study session",
      startTime: "19:00",
      endTime: "21:00",
      date: new Date(2024, 11, 15), // December 15th
      endDate: new Date(2024, 11, 15), // Single day event
      type: "Workshop",
      status: "In Progress",
      icon: Users,
      description: "Collaborative learning: Advanced JavaScript concepts",
      location: "Study Hall A",
      attendees: 25,
      category: "Workshop",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "graduation event",
      startTime: "15:00",
      endTime: "18:00",
      date: new Date(2024, 11, 18), // December 18th
      endDate: new Date(2024, 11, 18), // Single day event
      type: "Event",
      status: "Scheduled",
      icon: Calendar,
      description: "Class of 2024 graduation ceremony",
      location: "Auditorium",
      attendees: 500,
      category: "Event",
      color: "bg-green-500",
    },
    {
      id: 7,
      title: "udurlug",
      startTime: "11:00",
      endTime: "12:30",
      date: new Date(2024, 11, 20), // December 20th
      endDate: new Date(2024, 11, 20), // Single day event
      type: "Blog Post",
      status: "In Progress",
      icon: BookOpen,
      description: "Writing technical documentation that developers love",
      location: "Online",
      attendees: 34,
      category: "Content",
      color: "bg-blue-500",
    },
    {
      id: 8,
      title: "Holiday Party",
      startTime: "18:00",
      endTime: "22:00",
      date: new Date(2024, 11, 25), // December 25th
      endDate: new Date(2024, 11, 25), // Single day event
      type: "Event",
      status: "Scheduled",
      icon: Calendar,
      description: "End of year celebration with the team",
      location: "Main Office",
      attendees: 80,
      category: "Event",
      color: "bg-green-500",
    },
    {
      id: 9,
      title: "Code Review Session",
      startTime: "13:00",
      endTime: "14:30",
      date: new Date(2024, 11, 28), // December 28th
      endDate: new Date(2024, 11, 28), // Single day event
      type: "Workshop",
      status: "Scheduled",
      icon: Users,
      description: "Group code review and feedback session",
      location: "Online",
      attendees: 15,
      category: "Workshop",
      color: "bg-orange-500",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add previous month's days
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const foundEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      const compareDate = new Date(date);

      // Reset time to compare only dates
      eventDate.setHours(0, 0, 0, 0);
      compareDate.setHours(0, 0, 0, 0);

      const isMatch = eventDate.getTime() === compareDate.getTime();

      return isMatch;
    });

    return foundEvents;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return {
          backgroundColor: `${colors.accent.success}20`,
          color: colors.accent.success,
        };
      case "In Review":
        return {
          backgroundColor: `${colors.accent.warning}20`,
          color: colors.accent.warning,
        };
      case "Idea":
        return {
          backgroundColor: `${colors.accent.primary}20`,
          color: colors.accent.primary,
        };
      case "In Progress":
        return {
          backgroundColor: `${colors.accent.warning}20`,
          color: colors.accent.warning,
        };
      case "Scheduled":
        return {
          backgroundColor: `${colors.accent.info}20`,
          color: colors.accent.info,
        };
      default:
        return {
          backgroundColor: `${colors.text.muted}20`,
          color: colors.text.muted,
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Content":
        return {
          backgroundColor: `${colors.accent.primary}20`,
          color: colors.accent.primary,
        };
      case "Workshop":
        return {
          backgroundColor: `${colors.accent.warning}20`,
          color: colors.accent.warning,
        };
      case "Event":
        return {
          backgroundColor: `${colors.accent.info}20`,
          color: colors.accent.info,
        };
      case "Learning":
        return {
          backgroundColor: `${colors.accent.success}20`,
          color: colors.accent.success,
        };
      default:
        return {
          backgroundColor: `${colors.text.muted}20`,
          color: colors.text.muted,
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Blog Post":
        return BookOpen;
      case "Video":
        return Video;
      case "Podcast":
        return Mic;
      case "Event":
        return Calendar;
      case "Workshop":
        return Users;
      default:
        return Calendar;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentMonth);
    return (
      <div
        className="grid grid-cols-7 gap-0 border"
        style={{ borderColor: colors.border.primary }}
      >
        {/* Day Headers */}
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-sm border-b"
            style={{
              color: colors.text.secondary,
              borderColor: colors.border.primary,
              backgroundColor: `${colors.background.primary}30`,
            }}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className="min-h-[120px] p-2 border-r border-b"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: day.isCurrentMonth
                  ? isToday
                    ? `${colors.accent.primary}10`
                    : colors.background.primary
                  : `${colors.background.secondary}20`,
              }}
            >
              {/* Date number */}
              <div
                className="text-sm font-medium mb-2"
                style={{
                  color: day.isCurrentMonth
                    ? isToday
                      ? colors.accent.primary
                      : colors.text.primary
                    : colors.text.secondary,
                  fontWeight: isToday ? "bold" : "normal",
                }}
              >
                {day.date.getDate() === 1
                  ? `${day.date.getDate()} ${day.date.toLocaleDateString(
                      "en-US",
                      { month: "short" }
                    )}`
                  : day.date.getDate()}
              </div>

              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.map((event) => {
                  const IconComponent = getTypeIcon(event.type);
                  const isMultiDay =
                    event.date.getTime() !== event.endDate.getTime();
                  const isStartDay =
                    event.date.getTime() === day.date.getTime();
                  const isEndDay =
                    event.endDate.getTime() === day.date.getTime();

                  // Only show event on start day or if it's a multi-day event
                  if (!isStartDay && !isMultiDay) return null;

                  return (
                    <div
                      key={event.id}
                      className={`text-xs p-1 cursor-pointer transition-colors text-white font-medium ${
                        isMultiDay && !isStartDay ? "rounded-none" : "rounded"
                      } ${isMultiDay && isStartDay ? "rounded-l" : ""} ${
                        isMultiDay && isEndDay ? "rounded-r" : ""
                      }`}
                      style={{
                        backgroundColor:
                          event.color === "bg-blue-500"
                            ? colors.accent.primary
                            : event.color === "bg-orange-500"
                            ? colors.accent.warning
                            : event.color === "bg-green-500"
                            ? colors.accent.success
                            : event.color === "bg-purple-500"
                            ? colors.accent.info
                            : event.color === "bg-yellow-500"
                            ? colors.accent.warning
                            : colors.accent.secondary,
                      }}
                      title={`${event.title} - ${formatTime(
                        event.startTime
                      )} - ${formatTime(event.endTime)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-xs opacity-90 font-normal">
                          {formatTime(event.startTime)}
                        </span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    // Simple week view implementation
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div
        className="grid grid-cols-7 gap-0 border"
        style={{ borderColor: colors.border.primary }}
      >
        {/* Day Headers */}
        {weekDays.map((date) => (
          <div
            key={date.toISOString()}
            className="p-3 text-center font-semibold text-sm border-b"
            style={{
              color: colors.text.secondary,
              borderColor: colors.border.primary,
              backgroundColor: `${colors.background.primary}30`,
            }}
          >
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        ))}

        {/* Week Days */}
        {weekDays.map((date) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={date.toISOString()}
              className="min-h-[160px] p-2 border-r border-b"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: isToday
                  ? `${colors.accent.primary}10`
                  : colors.background.primary,
              }}
            >
              <div
                className="text-sm font-medium mb-2"
                style={{
                  color: isToday ? colors.accent.primary : colors.text.primary,
                  fontWeight: isToday ? "bold" : "normal",
                }}
              >
                {date.getDate()}
              </div>

              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.map((event) => {
                  const IconComponent = getTypeIcon(event.type);
                  const isMultiDay =
                    event.date.getTime() !== event.endDate.getTime();
                  const isStartDay = event.date.getTime() === date.getTime();
                  const isEndDay = event.endDate.getTime() === date.getTime();

                  // Only show event on start day or if it's a multi-day event
                  if (!isStartDay && !isMultiDay) return null;

                  return (
                    <div
                      key={event.id}
                      className="text-xs p-1 cursor-pointer transition-colors text-white font-medium"
                      style={{
                        backgroundColor:
                          event.color === "bg-blue-500"
                            ? colors.accent.primary
                            : event.color === "bg-orange-500"
                            ? colors.accent.warning
                            : event.color === "bg-green-500"
                            ? colors.accent.success
                            : event.color === "bg-purple-500"
                            ? colors.accent.info
                            : event.color === "bg-yellow-500"
                            ? colors.accent.warning
                            : colors.accent.secondary,
                        borderRadius:
                          isMultiDay && !isStartDay
                            ? 0
                            : isMultiDay && isStartDay
                            ? "0.25rem 0 0 0.25rem"
                            : isMultiDay && isEndDay
                            ? "0 0.25rem 0.25rem 0"
                            : "0.25rem",
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-xs opacity-90 font-normal">
                          {formatTime(event.startTime)}
                        </span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    // Simple day view implementation
    const today = new Date();
    const todayEvents = getEventsForDate(today);

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        </div>

        {todayEvents.length > 0 ? (
          <div className="space-y-3">
            {todayEvents.map((event) => {
              const IconComponent = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.accent.secondary}, ${colors.accent.success})`,
                      }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {event.title}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-lg font-bold"
                        style={{ color: colors.accent.secondary }}
                      >
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {getDuration(event.startTime, event.endTime)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-16"
            style={{ color: colors.text.secondary }}
          >
            No events scheduled for today
          </div>
        )}
      </div>
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Layout>
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Header - Minimalist Big Font Design */}
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1
              className="text-8xl md:text-9xl font-black tracking-tight leading-none mb-8"
              style={{ color: colors.text.primary }}
            >
              COMMUNITY
            </h1>
            <h2
              className="text-7xl md:text-8xl font-black tracking-tight leading-none mb-12"
              style={{ color: colors.text.primary }}
            >
              EVENTS
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide"
              style={{ color: colors.text.secondary }}
            >
              Discover and participate in community-driven events. From
              workshops to meetups, connect with fellow learners and mentors.
            </p>
          </motion.div>
        </div>

        {/* Calendar Section */}
        <div
          className="container mx-auto px-4 py-16"
          style={{ backgroundColor: colors.background.primary }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border rounded-lg p-6 shadow-lg"
            style={{
              backgroundColor: isDarkMode
                ? colors.background.tertiary
                : colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <h2
                  className="text-3xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div
                  className="flex items-center rounded-lg p-1"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  {(["month", "week", "day"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode(mode)}
                      className="transition-all duration-200"
                      style={{
                        backgroundColor:
                          viewMode === mode
                            ? colors.background.secondary
                            : "transparent",
                        color:
                          viewMode === mode
                            ? colors.text.primary
                            : colors.text.secondary,
                      }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentMonth(new Date())}
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                >
                  Today
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1
                        )
                      )
                    }
                    style={{ color: colors.text.primary }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1
                        )
                      )
                    }
                    style={{ color: colors.text.primary }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Content */}
            {viewMode === "month" && renderMonthView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
