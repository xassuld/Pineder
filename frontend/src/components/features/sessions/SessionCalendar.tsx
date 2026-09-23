import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { useTheme } from "../../../core/contexts/ThemeContext";

// Import types from the main sessions file instead of redefining them
type SessionData = any;
type GroupSessionData = any;

type AnySession = SessionData | GroupSessionData;

interface SessionCalendarProps {
  sessions: SessionData[];
  oneOnOneSessions: SessionData[];
  groupSessions: GroupSessionData[];
  onSessionClick: (session: AnySession) => void;
}

export default function SessionCalendar({
  sessions,
  oneOnOneSessions,
  groupSessions,
  onSessionClick,
}: SessionCalendarProps) {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get all sessions combined
  const allSessions = [...sessions, ...oneOnOneSessions, ...groupSessions];

  // Get current month/year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getDate();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentMonth + 1,
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Get sessions for a specific date
  const getSessionsForDate = (day: number) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentMonth,
      day
    ).toDateString();
    return allSessions.filter((session) => {
      const sessionDate = new Date(session.date).toDateString();
      return sessionDate === dateStr;
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentMonth + 1, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
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
    return months[month];
  };

  // Get day name
  const getDayName = (day: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <h2
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {getMonthName(currentMonth)} {currentDate.getFullYear()}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" onClick={goToToday} className="px-4 py-2">
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium py-2"
                style={{ color: colors.text.secondary }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-24" />;
              }

              const sessionsForDay = getSessionsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <motion.div
                  key={index}
                  className={`h-24 border border-gray-200 p-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    isToday ? "bg-blue-50 border-blue-300" : ""
                  }`}
                  onClick={() => {
                    if (sessionsForDay.length > 0) {
                      onSessionClick(sessionsForDay[0]);
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Day Number */}
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isToday ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    {day}
                  </div>

                  {/* Session Indicators */}
                  <div className="space-y-1">
                    {sessionsForDay.slice(0, 3).map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className={`text-xs p-1 rounded truncate ${
                          "maxParticipants" in session
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                        title={`${session.title} with ${session.mentor.name}`}
                      >
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              "maxParticipants" in session
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <span className="truncate">
                            {session.title.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    ))}

                    {sessionsForDay.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{sessionsForDay.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span style={{ color: colors.text.secondary }}>Group Sessions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span style={{ color: colors.text.secondary }}>1-on-1 Sessions</span>
        </div>
      </div>
    </div>
  );
}
