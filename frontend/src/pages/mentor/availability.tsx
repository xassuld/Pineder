import React, { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { Card, CardContent } from "../../design/system/card";
import { Calendar } from "lucide-react";
import {
  WeeklyCalendar,
  AvailabilityModal,
} from "../../components/features/mentor-pages";
import { Button } from "../../design/system/button";
import { Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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

const MentorAvailabilityPage: React.FC = () => {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();

  // Week management state - ensure we start with the current week
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    // Get Monday of current week
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(diff);

    console.log("Initializing mentor availability with current week:", {
      today: today.toDateString(),
      dayOfWeek: day,
      mondayOfCurrentWeek: mondayOfCurrentWeek.toDateString(),
    });

    return mondayOfCurrentWeek;
  });

  const generateWeeklyData = useCallback(() => {
    const timeSlots = [
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

    const newWeekData: WeeklyData = {};

    // Generate dates for the current week (Monday to Friday)
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);

    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      newWeekData[dateKey] = timeSlots.map((time) => ({
        id: `${dateKey}-${time}`,
        day: dayName,
        date: dateKey,
        time,
        status: "unknown" as const, // Mentors must choose their availability
      }));
    }

    return newWeekData;
  }, [currentWeek]);

  const [weekData, setWeekData] = useState<WeeklyData>(generateWeeklyData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<
    "available" | "unavailable" | "unknown"
  >("available");
  const [isLoading, setIsLoading] = useState(false);

  const cardBg = isDarkMode
    ? "bg-[#0F0E0E] border-gray-800"
    : "bg-white border-gray-200";

  // Regenerate week data when currentWeek changes
  useEffect(() => {
    console.log(
      "Mentor Availability: Week changed to:",
      currentWeek.toDateString()
    );
    setWeekData(generateWeeklyData());
  }, [currentWeek, generateWeeklyData]);

  // Load existing availability when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  // Load availability when week changes
  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [currentWeek]);

  const loadAvailability = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log(
        "Loading availability for user:",
        user.emailAddresses[0]?.emailAddress
      );

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      headers["x-user-role"] =
        (user.publicMetadata?.role as string) || "mentor";
      headers["x-user-email"] = user.emailAddresses[0]?.emailAddress || "";
      headers["x-user-id"] = user.id || "";

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability`,
        {
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.availability) {
          console.log(
            "DEBUG: Raw backend availability data:",
            data.data.availability
          );
          const convertedData = convertBackendToFrontend(
            data.data.availability
          );
          console.log("DEBUG: Converted frontend data:", convertedData);
          setWeekData(convertedData);
        }
      } else {
        console.error("Failed to load availability:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertBackendToFrontend = (backendAvailability: any[]): WeeklyData => {
    const defaultData = generateWeeklyData();

    if (
      !backendAvailability ||
      !Array.isArray(backendAvailability) ||
      backendAvailability.length === 0
    ) {
      console.log(
        "DEBUG: No backend availability found, using default data with all slots available"
      );
      return defaultData;
    }

    console.log("DEBUG: Processing backend availability:", backendAvailability);

    const convertedData = { ...defaultData };

    backendAvailability.forEach((slot) => {
      const slotDate = slot.date; // Use actual date instead of dayOfWeek
      const startTime = slot.startTime;
      const isAvailable = slot.isAvailable;

      // Find the date in our current week data
      if (slotDate && convertedData[slotDate]) {
        const frontendTime = formatTimeForDisplay(startTime);

        const updatedSlots = convertedData[slotDate].map((timeSlot) => {
          if (timeSlot.time === frontendTime) {
            return {
              ...timeSlot,
              status: isAvailable
                ? ("available" as const)
                : ("unavailable" as const),
            };
          }
          return timeSlot;
        });

        convertedData[slotDate] = updatedSlots;
      }
    });

    return convertedData;
  };

  const formatTimeForDisplay = (time: string): string => {
    // Handle both "09:00" and "9:00 AM" formats
    if (time.includes("AM") || time.includes("PM")) {
      return time; // Already in display format
    }

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeForBackend = (time: string): string => {
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2];
      const ampm = timeMatch[3];

      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }
    return time;
  };

  const convertFrontendToBackend = (frontendData: WeeklyData): any[] => {
    const backendData: any[] = [];

    Object.entries(frontendData).forEach(([dateKey, timeSlots]) => {
      timeSlots.forEach((slot) => {
        const formattedTime = formatTimeForBackend(slot.time);

        if (slot.status === "available") {
          const [hours, minutes] = formattedTime.split(":").map(Number);
          const endHours = hours + 1;
          const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

          const backendSlot = {
            date: dateKey, // Use actual date instead of dayOfWeek
            startTime: formattedTime,
            endTime: endTime,
            isAvailable: true,
          };

          backendData.push(backendSlot);
        } else if (slot.status === "unavailable") {
          const [hours, minutes] = formattedTime.split(":").map(Number);
          const endHours = hours + 1;
          const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

          const backendSlot = {
            date: dateKey, // Use actual date instead of dayOfWeek
            startTime: formattedTime,
            endTime: endTime,
            isAvailable: false,
          };

          backendData.push(backendSlot);
        }
      });
    });

    return backendData;
  };

  const getSlotStyles = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "unavailable":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "unknown":
        return "border-gray-300 bg-white dark:bg-[#0F0E0E]";
      default:
        return "border-gray-300 bg-white dark:bg-[#0F0E0E]";
    }
  };

  const handleAddAvailability = () => {
    console.log("Mentor Availability: Opening Add Available Time modal");
    setShowAddModal(true);
    setCurrentStatus("available");
  };

  const handleSaveAvailability = async (newWeekData: WeeklyData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Saving availability with new data:", newWeekData);

      const backendData = convertFrontendToBackend(newWeekData);
      console.log("Converted backend data:", backendData);

      // Debug: Check if any dates are in the past
      const today = new Date().toISOString().split("T")[0];
      const pastDates = backendData.filter(
        (slot) => slot.date && slot.date < today
      );
      if (pastDates.length > 0) {
        console.log("DEBUG: Found past dates in availability:", pastDates);
        console.log("Today's date:", today);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      headers["x-user-role"] =
        (user.publicMetadata?.role as string) || "mentor";
      headers["x-user-email"] = user.emailAddresses[0]?.emailAddress || "";
      headers["x-user-id"] = user.id || "";

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ availability: backendData }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("Availability saved successfully");
          setWeekData(newWeekData);
          setShowAddModal(false);
        } else {
          console.error("Failed to save availability:", data.error);
        }
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to save availability:",
          response.statusText,
          errorText
        );
      }
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Mentor Availability | Pineder</title>
        <meta
          name="description"
          content="Manage your availability and schedule for student sessions"
        />
      </Head>

      <div
        className="w-full min-h-screen"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="w-full max-w-sm px-4 py-4 mx-auto sm:max-w-2xl sm:px-6 sm:py-8 lg:max-w-4xl">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <Card className={`${cardBg} shadow-lg border-0`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-center mb-4 space-x-3">
                  <Calendar
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    style={{ color: colors.accent.primary }}
                  />
                  <h1
                    className="text-xl font-bold sm:text-3xl"
                    style={{ color: colors.text.primary }}
                  >
                    Manage Your Availability
                  </h1>
                </div>
                <p
                  className="text-sm sm:text-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Set your weekly schedule to let students know when you&apos;re
                  available for sessions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Weekly Schedule */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading availability...
              </p>
            </div>
          ) : (
            <WeeklyCalendar
              key={JSON.stringify(weekData)}
              weekData={weekData}
              cardBg={cardBg}
              colors={colors}
              getSlotStyles={getSlotStyles}
            />
          )}

          {/* Add Availability Button */}
          <div className="mb-6 text-center sm:mb-8">
            <Button
              onClick={handleAddAvailability}
              className="w-full px-6 py-3 text-lg text-white bg-green-600 border-0 hover:bg-green-700
 sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Available Time
            </Button>
          </div>

          {/* Availability Modal */}
          <AvailabilityModal
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
            weekData={weekData}
            onSave={handleSaveAvailability}
            colors={colors}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MentorAvailabilityPage;
