import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserTimezone } from "../lib/timezone";

export interface SessionBookingData {
  mentorId: string;
  topic: string;
  date: string;
  time: string;
  studentChoice: string;
  requestNotes?: string;
  userTimezone?: string; // Add timezone information
  // Legacy fields for backward compatibility
  startTime?: string;
  endTime?: string;
  message?: string;
}

export interface SessionRequest {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  mentorId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "denied" | "completed" | "cancelled";
  message?: string;
  createdAt: string;
  zoomMeetingUrl?: string;
}

interface UseSessionBookingReturn {
  bookSession: (
    data: SessionBookingData
  ) => Promise<{ success: boolean; message: string }>;
  acceptSession: (
    sessionId: string
  ) => Promise<{ success: boolean; message: string }>;
  denySession: (
    sessionId: string,
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
}

export const useSessionBooking = (): UseSessionBookingReturn => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    // Determine role based on email domain
    const email = user?.emailAddresses[0]?.emailAddress || "";
    let role = "student"; // default
    if (email.endsWith("@gmail.com")) {
      role = "mentor";
    } else if (email.endsWith("@nest.edu.mn")) {
      role = "student";
    }

    return {
      "Content-Type": "application/json",
      "x-user-role": role,
      "x-user-email": email,
      "x-user-id": user?.id || "",
    };
  };

  const bookSession = async (
    data: SessionBookingData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields before sending
      if (
        !data.mentorId ||
        !data.date ||
        !data.time ||
        !data.topic ||
        !data.studentChoice
      ) {
        const errorMsg =
          "Missing required fields: mentorId, date, time, topic, and studentChoice are required";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Add user timezone to the booking data
      const bookingDataWithTimezone = {
        ...data,
        userTimezone: "Asia/Ulaanbaatar", // All meetings in UB time
      };

      console.log("Sending booking request:", bookingDataWithTimezone);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(bookingDataWithTimezone),
        }
      );

      const result = await response.json();
      console.log("Booking response:", result);
      console.log("Response status:", response.status);

      if (response.ok && result.success) {
        return { success: true, message: "Session request sent successfully!" };
      } else {
        // Provide more detailed error messages
        let errorMessage =
          result.message || result.error || "Failed to book session";

        // Handle specific error cases
        if (result.error?.includes("future time")) {
          errorMessage =
            "Please select a time that is at least 30 minutes in the future.";
        } else if (result.error?.includes("not available")) {
          errorMessage =
            "This time slot is not available. Please select a different time.";
        } else if (result.error?.includes("availability")) {
          errorMessage =
            "The mentor is not available at this time. Please check their availability.";
        }

        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to book session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSession = async (
    sessionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/approve`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          message: "Session accepted! Zoom meeting created.",
        };
      } else {
        throw new Error(result.message || "Failed to accept session");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to accept session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const denySession = async (
    sessionId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/reject`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ reason }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: "Session request denied." };
      } else {
        throw new Error(result.message || "Failed to deny session");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deny session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookSession,
    acceptSession,
    denySession,
    isLoading,
    error,
  };
};
