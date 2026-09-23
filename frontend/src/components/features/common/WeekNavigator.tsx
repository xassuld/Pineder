import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../../design/system/button";

interface WeekNavigatorProps {
  currentWeek: Date;
  onWeekChange: (week: Date) => void;
  title?: string;
  showCurrentWeek?: boolean;
  className?: string;
}

export function WeekNavigator({
  currentWeek,
  onWeekChange,
  title = "Week",
  showCurrentWeek = true,
  className = "",
}: WeekNavigatorProps) {
  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { start: startOfWeek, end: endOfWeek };
  };

  const formatWeekRange = (date: Date) => {
    const { start, end } = getWeekRange(date);
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  };

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    console.log(
      "WeekNavigator: Going to previous week:",
      newWeek.toDateString()
    );
    onWeekChange(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    console.log("WeekNavigator: Going to next week:", newWeek.toDateString());
    onWeekChange(newWeek);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    // Get Monday of current week
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(diff);
    console.log(
      "WeekNavigator: Going to current week:",
      mondayOfCurrentWeek.toDateString()
    );
    onWeekChange(mondayOfCurrentWeek);
  };

  const isCurrentWeek = () => {
    const now = new Date();
    const currentWeekRange = getWeekRange(now);
    const selectedWeekRange = getWeekRange(currentWeek);

    return (
      currentWeekRange.start.getTime() === selectedWeekRange.start.getTime() &&
      currentWeekRange.end.getTime() === selectedWeekRange.end.getTime()
    );
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
            {isCurrentWeek() && (
              <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                Current Week
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatWeekRange(currentWeek)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={goToPreviousWeek}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {showCurrentWeek && (
          <Button
            onClick={goToCurrentWeek}
            variant={isCurrentWeek() ? "default" : "outline"}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Current</span>
          </Button>
        )}

        <Button
          onClick={goToNextWeek}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default WeekNavigator;
