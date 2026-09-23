import React, { useState } from "react";
import { Card, CardContent } from "../../../design/system/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  id: string;
  day: string;
  date?: string; // YYYY-MM-DD format
  time: string;
  status: "available" | "unavailable" | "unknown";
}

interface WeeklyData {
  [key: string]: TimeSlot[];
}

interface WeeklyCalendarProps {
  weekData: WeeklyData;
  cardBg: string;
  colors: any;
  getSlotStyles: (status: string) => string;
  onWeekChange?: (weekStart: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  weekData,
  cardBg,
  colors,
  getSlotStyles,
  onWeekChange,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];
  // Get the dates from weekData keys (which are now actual dates)
  const dates = Object.keys(weekData).sort();

  // Helper functions for week navigation
  const getWeekRange = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = endOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  };

  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
    onWeekChange?.(prevWeek);
  };

  const handleCurrentWeek = () => {
    const now = new Date();
    setCurrentWeek(now);
    onWeekChange?.(now);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
    onWeekChange?.(nextWeek);
  };

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return (
      <div className="text-center">
        <div
          className="text-xs font-medium"
          style={{ color: colors.text.primary }}
        >
          {dayName}
        </div>
        <div className="text-xs" style={{ color: colors.text.secondary }}>
          {monthDay}
        </div>
      </div>
    );
  };

  return (
    <Card className={`${cardBg} shadow-lg border-0 mb-6 sm:mb-8`}>
      <CardContent className="p-4 sm:p-6">
        {/* Header with Setting Availability For and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5" />
            <div>
              <h3
                className="text-base font-bold sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                Setting Availability For
              </h3>
              <p
                className="text-xs sm:text-sm"
                style={{ color: colors.text.secondary }}
              >
                {getWeekRange()}
              </p>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousWeek}
              className="flex items-center gap-1 px-3 py-1 text-xs transition-colors rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <ChevronLeft className="w-3 h-3" />
              Previous
            </button>
            <button
              onClick={handleCurrentWeek}
              className="flex items-center gap-1 px-3 py-1 text-xs transition-colors rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Calendar className="w-3 h-3" />
              Current
            </button>
            <button
              onClick={handleNextWeek}
              className="flex items-center gap-1 px-3 py-1 text-xs transition-colors rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1 overflow-x-auto sm:gap-2">
          {/* Dates */}
          {dates.map((dateKey) => (
            <div key={dateKey} className="min-w-0 space-y-1 sm:space-y-2">
              <div
                className="h-12 text-xs font-medium text-center sm:h-16"
                style={{ color: colors.text.primary }}
              >
                {formatDateHeader(dateKey)}
              </div>
              {weekData[dateKey]
                ? weekData[dateKey].map((slot) => (
                    <div
                      key={slot.id}
                      className={`h-6 border-2 rounded cursor-default flex items-center justify-center text-xs font-medium sm:h-8 ${getSlotStyles(
                        slot.status
                      )}`}
                    >
                      {slot.time}
                    </div>
                  ))
                : // Fallback: create empty slots if data is missing
                  timeSlots.map((time) => (
                    <div
                      key={`${dateKey}-${time}`}
                      className="flex items-center justify-center h-6 text-xs font-medium border-2 rounded cursor-default sm:h-8"
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary,
                        color: colors.text.primary,
                      }}
                    >
                      {time}
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;
