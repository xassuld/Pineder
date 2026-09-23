import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";
import { Check, X } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

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

interface AvailabilityModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  currentStatus: "available" | "unavailable" | "unknown";
  setCurrentStatus: (status: "available" | "unavailable" | "unknown") => void;
  weekData: WeeklyData;
  onSave: (newWeekData: WeeklyData) => void;
  colors: any;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  showAddModal,
  setShowAddModal,
  currentStatus,
  setCurrentStatus,
  weekData,
  onSave,
  colors,
}) => {
  const [editingWeekData, setEditingWeekData] = useState<WeeklyData>(weekData);
  const { isDarkMode } = useTheme();

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

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const isPastDate = dateKey < new Date().toISOString().split("T")[0];
    return {
      text: `${dayName} ${monthDay}`,
      isPast: isPastDate,
    };
  };

  // Reset editing data when modal opens
  useEffect(() => {
    if (showAddModal) {
      setEditingWeekData(JSON.parse(JSON.stringify(weekData)));
    }
  }, [showAddModal, weekData]);

  const handleSlotClick = (dateKey: string, time: string) => {
    setEditingWeekData((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((slot) =>
        slot.time === time ? { ...slot, status: currentStatus } : slot
      ),
    }));
  };

  const handleClear = () => {
    setEditingWeekData(JSON.parse(JSON.stringify(weekData)));
  };

  const handleSave = () => {
    console.log("Modal: About to save editingWeekData:", editingWeekData);
    console.log("Modal: Calling onSave with data:", editingWeekData);
    onSave(editingWeekData);
  };

  if (!showAddModal) return null;

  return (
    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
      <DialogContent
        className="max-w-sm mx-auto w-[95vw] z-[9999] sm:max-w-2xl lg:max-w-4xl"
        style={{
          backgroundColor: isDarkMode ? colors.background.card : "#ffffff",
          borderColor: colors.border.primary,
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-lg sm:text-xl"
            style={{ color: colors.text.primary }}
          >
            Set Your Weekly Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Instructions */}
          <p
            className="text-xs sm:text-sm"
            style={{ color: colors.text.secondary }}
          >
            First select a status below, then click on time slots to apply it.
            You can set availability for any date, including past dates.
          </p>

          {/* Status Selection Buttons */}
          <div className="flex flex-col gap-2 mb-4 sm:mb-6 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => setCurrentStatus("available")}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm sm:w-auto sm:px-4 sm:py-2 sm:text-base ${
                currentStatus === "available"
                  ? "bg-green-600 border-green-600 text-white"
                  : "bg-transparent border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              }`}
            >
              <Check className="inline w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              Available
            </button>
            <button
              onClick={() => setCurrentStatus("unavailable")}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm sm:w-auto sm:px-4 sm:py-2 sm:text-base ${
                currentStatus === "unavailable"
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-transparent border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <X className="inline w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              Unavailable
            </button>
            <button
              onClick={() => setCurrentStatus("unknown")}
              className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm sm:w-auto sm:px-4 sm:py-2 sm:text-base ${
                currentStatus === "unknown"
                  ? "bg-gray-600 border-gray-600 text-white"
                  : "bg-transparent border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20"
              }`}
            >
              Unknown
            </button>
          </div>

          {/* Interactive Calendar */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {dates.map((dateKey) => (
              <div key={dateKey} className="space-y-1 sm:space-y-2">
                <div
                  className={`h-8 text-[10px] font-medium text-center sm:h-12 sm:text-sm ${
                    formatDateHeader(dateKey).isPast ? "text-gray-400" : ""
                  }`}
                  style={{
                    color: formatDateHeader(dateKey).isPast
                      ? "#9CA3AF"
                      : isDarkMode
                      ? "#e5e7eb"
                      : colors.text.primary,
                  }}
                >
                  {formatDateHeader(dateKey).text}
                  {formatDateHeader(dateKey).isPast && (
                    <div className="text-[8px] text-gray-400">(Past)</div>
                  )}
                </div>
                {editingWeekData[dateKey]?.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotClick(dateKey, slot.time)}
                    className={`h-5 border-2 rounded cursor-pointer transition-all duration-200 hover:scale-105 flex items-center justify-center text-xs font-medium sm:h-8 ${
                      slot.status === "available"
                        ? "border-green-600 text-green-700 dark:text-green-300"
                        : slot.status === "unavailable"
                        ? "border-red-600 text-red-700 dark:text-red-300"
                        : "border-gray-400 text-gray-700 dark:text-gray-200"
                    }`}
                    style={{
                      backgroundColor:
                        slot.status === "available"
                          ? isDarkMode
                            ? "#064e3b"
                            : "#dcfce7"
                          : slot.status === "unavailable"
                          ? isDarkMode
                            ? "#7f1d1d"
                            : "#fee2e2"
                          : isDarkMode
                          ? "#374151"
                          : "#f3f4f6",
                    }}
                  >
                    <span className="text-[10px] sm:text-xs px-1 truncate">
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 justify-end mt-4 sm:mt-6 sm:flex-row sm:gap-4">
            <button
              onClick={handleClear}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
