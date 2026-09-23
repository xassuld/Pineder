import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Calendar, User, BookOpen, Clock, CheckCircle } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useState, useEffect } from "react";

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  rescheduleReason: string;
  setRescheduleReason: (reason: string) => void;
  onSubmit: (newStartTime: string, newEndTime: string) => void;
}

export default function RescheduleDialog({
  isOpen,
  onClose,
  session,
  rescheduleReason,
  setRescheduleReason,
  onSubmit,
}: RescheduleDialogProps) {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock available times for the teacher
  const getTeacherAvailableTimes = () => {
    return ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];
  };

  if (!isOpen || !session) return null;

  // Helper functions for time slot management
  const getAvailableTimes = () => {
    return [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ];
  };

  const isTimeAvailable = (day: string, time: string) => {
    // Check against mentor's actual availability
    if (!session?.mentor?.availability) return false;

    const dayMap: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    };

    const dayNumber = dayMap[day];
    const mentorAvailability = session.mentor.availability.find(
      (a: any) => a.dayOfWeek === dayNumber && a.isAvailable
    );

    if (!mentorAvailability) return false;

    const [hour] = time.split(":").map(Number);
    const startHour = new Date(mentorAvailability.startTime).getHours();
    const endHour = new Date(mentorAvailability.endTime).getHours();

    // Check if the time is within mentor's available hours
    const isWithinHours = hour >= startHour && hour < endHour;

    // Also check if this specific time slot is not already booked
    // This would require checking existing sessions for this mentor on this day/time
    // For now, we'll just check the time range
    return isWithinHours;
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    console.log("selectedTime:", selectedTime);
    console.log("rescheduleReason:", rescheduleReason);

    if (selectedTime && rescheduleReason.trim()) {
      try {
        setIsSubmitting(true);
        console.log("Validation passed, processing request...");

        // Get the original session date
        const originalDate = new Date(session.date + " " + session.time);

        // Parse the selected time
        const [hour, minute] = selectedTime.split(":").map(Number);
        if (isNaN(hour) || isNaN(minute)) {
          console.log("Invalid time selected");
          setIsSubmitting(false);
          return;
        }

        // Create the start and end times for the same day
        const startTime = new Date(originalDate);
        startTime.setHours(hour, minute, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, minute, 0, 0);

        // Check if it's the same time as original
        if (selectedTime === session.time) {
          console.log("Same time as original session");
          setIsSubmitting(false);
          return;
        }

        // Show loading state
        console.log("Sending reschedule request...");
        console.log("Selected time:", selectedTime);
        console.log("Reason:", rescheduleReason);
        console.log("New start time:", startTime.toISOString());
        console.log("New end time:", endTime.toISOString());

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Call the onSubmit function
        onSubmit(startTime.toISOString(), endTime.toISOString());

        // Show success state
        setIsRequestSent(true);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error sending reschedule request:", error);
        setIsSubmitting(false);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleClose = () => {
    setIsRequestSent(false);
    setSelectedTime("");
    setRescheduleReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto bg-black/50 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 my-4"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold sm:text-xl"
              style={{ color: colors.text.primary }}
            >
              {isRequestSent ? "Request Sent!" : "Request Reschedule"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {isRequestSent ? (
            // Success Alert Dialog
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Reschedule Request Sent!
                </h3>
                <p className="max-w-sm text-sm text-gray-600">
                  Your reschedule request has been sent to {session.mentor.name}
                  . You will receive a notification once they respond to your
                  request.
                </p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg sm:p-4 bg-gray-50">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Request Details
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700">
                      <span className="font-medium">Original:</span>{" "}
                      {session.date} at {session.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700">
                      <span className="font-medium">Requested:</span>{" "}
                      {session.date} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700">
                      <span className="font-medium">Mentor:</span>{" "}
                      {session.mentor.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleClose}
                  className="px-8 py-2 text-white bg-green-600 hover:bg-green-700"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            // Original Form Content
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg sm:p-4 bg-gray-50">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
                  Session Details
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700 break-words">
                      {session.date} at {session.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700 break-words">
                      {session.mentor.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="flex-shrink-0 w-3 h-3 text-gray-600 sm:w-4 sm:h-4" />
                    <span className="text-gray-700 break-words">
                      {session.subject}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label
                  className="block mb-3 text-sm font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Select from Teacher&apos;s Available Times *
                </label>

                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {getTeacherAvailableTimes().map((time) => {
                      const isSelected = selectedTime === time;
                      const time12Hour = new Date(
                        `2000-01-01T${time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          disabled={isSubmitting}
                          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? "bg-[#58CC02] text-white border-[#58CC02]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          } ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="font-medium">{time}</div>
                          <div className="text-xs opacity-75">{time12Hour}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    Click to select from teacher&apos;s available time slots
                  </p>
                </div>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Reason for Rescheduling *
                </label>
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Please explain why you need to reschedule this session..."
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !selectedTime || !rescheduleReason.trim() || isSubmitting
                  }
                  className="flex-1 order-1 text-white bg-green-600 hover:bg-green-700 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
