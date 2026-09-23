import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import {
  formatDateInTimezone,
  getUserTimezone,
} from "../../../core/lib/timezone";

interface Teacher {
  id?: string | number;
  _id?: string;
  name?: string;
  avatar?: string;
  expertise?: string[];
  specialties?: string[];
  rating?: number;
  totalStudents?: number;
  totalSessions?: number;
  sessions?: number;
  hourlyRate?: number;
  location?: string;
  availability?: string;
  nextAvailable?: string;
  description?: string;
  about?: string;
  role?: string;
  company?: string;
  // Mentor data structure
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    title?: string;
    bio?: string;
  };
}

interface SessionBookingDialogProps {
  teacher?: Teacher | null;
  mentor?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sessionData: SessionData) => void;
  colors?: any;
}

interface SessionData {
  teacherId: string;
  date: string;
  time: string;
  subject: string;
  description: string;
  compensation: string;
  userTimezone?: string;
}

interface MentorAvailability {
  dayOfWeek?: number; // Legacy support
  date?: string; // YYYY-MM-DD format for specific dates
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export function SessionBookingDialog({
  teacher,
  mentor,
  isOpen,
  onClose,
  onConfirm,
  colors,
}: SessionBookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCompensation, setSelectedCompensation] = useState<string>("");
  const [mentorAvailability, setMentorAvailability] = useState<
    MentorAvailability[]
  >([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Use either teacher or mentor
  const currentTeacher = teacher || mentor;

  // Load mentor availability and booked slots when dialog opens
  useEffect(() => {
    if (isOpen && currentTeacher?._id) {
      // Reset to current week when dialog opens
      setCurrentWeek(new Date());
      setSelectedDate("");
      setSelectedTime("");
      setDescription("");
      setSelectedCompensation("");
      loadMentorAvailability();
      loadBookedSlots();

      // Set up periodic refresh of booked slots every 30 seconds
      const refreshInterval = setInterval(() => {
        loadBookedSlots();
      }, 30000);

      return () => clearInterval(refreshInterval);
    }
  }, [isOpen, currentTeacher?._id]);

  const loadMentorAvailability = async () => {
    if (!currentTeacher?._id) return;

    try {
      setIsLoadingAvailability(true);
      console.log("Loading availability for mentor:", currentTeacher._id);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/${currentTeacher._id}/availability`
      );

      console.log("Availability response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Availability response data:", data);
        console.log("Response data keys:", Object.keys(data));

        if (data.success && data.data && data.data.availability) {
          console.log(
            "Setting mentor availability (nested):",
            data.data.availability
          );
          setMentorAvailability(data.data.availability);
        } else if (data.success && data.availability) {
          // Handle direct availability in response
          console.log(
            "Setting mentor availability (direct):",
            data.availability
          );
          setMentorAvailability(data.availability);
        } else if (data.success && data.data) {
          console.log("Data structure found:", data.data);
          console.log("Data keys:", Object.keys(data.data));
          if (data.data.availability) {
            console.log(
              "Setting mentor availability (data.availability):",
              data.data.availability
            );
            setMentorAvailability(data.data.availability);
          }
        } else {
          console.log("No availability data found in response");
          console.log(
            "Full response structure:",
            JSON.stringify(data, null, 2)
          );
        }
      } else {
        console.error("Failed to load availability:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading mentor availability:", error);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const loadBookedSlots = async () => {
    if (!currentTeacher?._id) return;

    try {
      console.log("Loading booked slots for mentor:", currentTeacher._id);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/${currentTeacher._id}/booked-slots`
      );

      console.log("Booked slots response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Booked slots response data:", data);

        if (data.success && data.data && data.data.bookedSlots) {
          console.log("Setting booked slots:", data.data.bookedSlots);
          setBookedSlots(data.data.bookedSlots);
        } else if (data.success && data.bookedSlots) {
          console.log("Setting booked slots (direct):", data.bookedSlots);
          setBookedSlots(data.bookedSlots);
        } else {
          console.log("No booked slots data found in response");
          setBookedSlots([]);
        }
      } else {
        console.error("Failed to load booked slots:", response.statusText);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error("Error loading booked slots:", error);
      setBookedSlots([]);
    }
  };

  if (!currentTeacher) return null;

  // Derive teacher name from different possible structures
  const teacherName =
    currentTeacher.name ||
    (currentTeacher.userId?.firstName && currentTeacher.userId?.lastName
      ? `${currentTeacher.userId.firstName} ${currentTeacher.userId.lastName}`
      : "Mentor");

  const handleConfirm = async () => {
    if (selectedDate && selectedTime && description && selectedCompensation) {
      // Convert time to proper format for backend
      const normalizedTime = normalizeTimeForComparison(selectedTime);

      // Map to the correct format expected by the booking hook
      const sessionData: SessionData = {
        teacherId:
          currentTeacher._id?.toString() || currentTeacher.id?.toString() || "",
        date: selectedDate,
        time: normalizedTime, // Use normalized time format
        subject: description, // Use description as subject
        description,
        compensation: selectedCompensation,
        userTimezone: "Asia/Ulaanbaatar", // All meetings in UB time
      };

      console.log("Session data being sent:", sessionData);

      // Pass a callback to refresh booked slots after successful booking
      const onConfirmWithRefresh = async (data: SessionData) => {
        await onConfirm(data);
        // Refresh booked slots after successful booking
        await loadBookedSlots();
      };

      await onConfirmWithRefresh(sessionData);
      onClose();
    }
  };

  const getAvailableDates = () => {
    const dates = [];

    // Get the current week (Monday to Friday) based on currentWeek state
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);

    // Generate 5 days (Monday to Friday) for the current week
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const getWeekInfo = (date: Date) => {
    const startOfWeek = new Date(date);
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

    return {
      start: startOfWeek,
      end: endOfWeek,
      range: `${startStr} - ${endStr}`,
    };
  };

  const getAvailableTimes = () => {
    return [
      "8:00 AM",
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
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isCurrentWeek = (weekDate: Date) => {
    const now = new Date();
    const currentWeekStart = new Date(now);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    currentWeekStart.setDate(diff);

    const compareWeekStart = new Date(weekDate);
    const compareDay = compareWeekStart.getDay();
    const compareDiff =
      compareWeekStart.getDate() - compareDay + (compareDay === 0 ? -6 : 1);
    compareWeekStart.setDate(compareDiff);

    return currentWeekStart.toDateString() === compareWeekStart.toDateString();
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude Sundays (0) and Saturdays (6), only Monday-Friday
  };

  // Helper function to normalize time format for comparison
  const normalizeTimeForComparison = (time: string): string => {
    // Convert "9:00 AM" to "09:00" format
    const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2];
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === "PM" && hour !== 12) {
        hour += 12;
      } else if (ampm === "AM" && hour === 12) {
        hour = 0;
      }

      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }

    // If already in 24-hour format, return as is
    return time;
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format
    const normalizedTime = normalizeTimeForComparison(time);

    // Check if mentor has availability for this specific date and time
    const availableSlot = mentorAvailability.find(
      (slot) =>
        slot.date === dateString &&
        normalizeTimeForComparison(slot.startTime) === normalizedTime &&
        slot.isAvailable
    );

    const isAvailable = !!availableSlot;

    // Check if this time slot is already booked
    const isBooked = bookedSlots.some(
      (slot) =>
        slot.date === dateString &&
        normalizeTimeForComparison(slot.time) === normalizedTime
    );

    // Debug logging for first few checks
    if (mentorAvailability.length > 0 && date.getDay() <= 2) {
      console.log(
        `Checking ${date.toDateString()} ${time} (${normalizedTime}): date=${dateString}, available=${isAvailable}, booked=${isBooked}`
      );
    }

    // Time slot is available only if mentor has set it as available AND it's not already booked
    return isAvailable && !isBooked;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 p-0 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 z-20"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="p-8">
              {/* Top Section - Teacher Profile and Information */}
              <div className="flex mb-8 border-b border-slate-200 dark:border-slate-700 pb-8">
                {/* Left side - Profile Picture */}
                <div className="w-52 flex-shrink-0">
                  <div className="w-full h-72 border-4 border-blue-500/20 rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={
                          currentTeacher.userId?.avatar ||
                          currentTeacher.avatar ||
                          ""
                        }
                        alt={teacherName}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="w-full h-full text-4xl bg-blue-100 dark:bg-blue-900/20">
                        {teacherName.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Right side - Teacher Information */}
                <div className="flex-1 pl-8">
                  {/* Teacher Name and Role */}
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {teacherName}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                      {currentTeacher.userId?.title ||
                        currentTeacher.role ||
                        "Mentor"}
                    </p>
                  </div>

                  {/* Rating/Stars */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentTeacher.rating || 5.0}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        (
                        {currentTeacher.totalSessions ||
                          currentTeacher.sessions ||
                          0}{" "}
                        sessions)
                      </span>
                    </div>
                  </div>

                  {/* All Expertise Fields */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        currentTeacher.expertise ||
                        currentTeacher.specialties ||
                        []
                      ).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      About
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentTeacher.userId?.bio ||
                        currentTeacher.about ||
                        currentTeacher.description ||
                        "No description available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule - Direct Time Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Select Available Time
                  </h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        loadBookedSlots();
                        loadMentorAvailability();
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors"
                      title="Refresh availability"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </button>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Week of {getWeekInfo(currentWeek).range}
                    </div>
                  </div>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => {
                      const prevWeek = new Date(currentWeek);
                      prevWeek.setDate(currentWeek.getDate() - 7);
                      setCurrentWeek(prevWeek);
                    }}
                    disabled={isCurrentWeek(currentWeek)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      isCurrentWeek(currentWeek)
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    }`}
                  >
                    ← Previous Week
                  </button>
                  <button
                    onClick={() => setCurrentWeek(new Date())}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg transition-colors"
                  >
                    Current Week
                  </button>
                  <button
                    onClick={() => {
                      const nextWeek = new Date(currentWeek);
                      nextWeek.setDate(currentWeek.getDate() + 7);
                      setCurrentWeek(nextWeek);
                    }}
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Next Week →
                  </button>
                </div>

                {/* Week Header - Days of Week with Dates */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {getAvailableDates()
                    .filter((date) => isDateAvailable(date))
                    .slice(0, 5)
                    .map((date, index) => {
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      const monthDay = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      return (
                        <div
                          key={index}
                          className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400"
                        >
                          <div>{dayName}</div>
                          <div className="text-xs">{monthDay}</div>
                        </div>
                      );
                    })}
                </div>

                {/* Weekly Schedule Grid - Direct Time Selection */}
                <div className="grid grid-cols-5 gap-2">
                  {getAvailableDates()
                    .filter((date) => isDateAvailable(date))
                    .slice(0, 5)
                    .map((date, index) => {
                      const isAvailable = isDateAvailable(date);
                      const isToday =
                        date.toDateString() === new Date().toDateString();
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      // Format date as YYYY-MM-DD for comparison
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;
                      const isSelected = selectedDate === formattedDate;

                      return (
                        <div
                          key={index}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 min-h-40 ${
                            isToday
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600"
                              : isAvailable
                              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50"
                          }`}
                        >
                          <div className="text-center mb-2">
                            <div
                              className={`font-medium mb-2 ${
                                isToday
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {dayName} {date.getDate()}
                            </div>
                          </div>

                          {isAvailable && (
                            <div className="space-y-1">
                              {getAvailableTimes().map((time) => {
                                const isTimeAvailable = isTimeSlotAvailable(
                                  date,
                                  time
                                );
                                return (
                                  <button
                                    key={time}
                                    onClick={() => {
                                      if (isTimeAvailable) {
                                        // Format date as YYYY-MM-DD for backend
                                        const year = date.getFullYear();
                                        const month = String(
                                          date.getMonth() + 1
                                        ).padStart(2, "0");
                                        const day = String(
                                          date.getDate()
                                        ).padStart(2, "0");
                                        const formattedDate = `${year}-${month}-${day}`;
                                        setSelectedDate(formattedDate);
                                        setSelectedTime(time);
                                      }
                                    }}
                                    disabled={!isTimeAvailable}
                                    className={`w-full text-xs px-2 py-1 rounded transition-all duration-200 ${
                                      selectedDate === formattedDate &&
                                      selectedTime === time
                                        ? "bg-blue-500 text-white shadow-md"
                                        : isTimeAvailable
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    <span>{time}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Session Description */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Session Description
                </h4>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you'd like to learn or work on during this session..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Compensation Options */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  What would you like to offer the mentor?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setSelectedCompensation("ice-cream")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "ice-cream"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🍦</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">
                          Free Ice Cream
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Treat your mentor to a sweet session
                        </p>
                      </div>
                      {selectedCompensation === "ice-cream" && (
                        <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCompensation("coffee")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "coffee"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-500 bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">☕</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">
                          Free Coffee
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Fuel your mentor&apos;s energy
                        </p>
                      </div>
                      {selectedCompensation === "coffee" && (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCompensation("free")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "free"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">
                          Free Gift
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          A small token of appreciation
                        </p>
                      </div>
                      {selectedCompensation === "free" && (
                        <CheckCircle className="w-6 h-6 text-purple-500 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center">
                <Button
                  onClick={handleConfirm}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !description ||
                    !selectedCompensation
                  }
                  className="px-8 py-4 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SessionBookingDialog;
