import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface SessionRequest {
  _id: string;
  studentId: {
    _id: string;
    studentCode: string;
    major: string;
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
  };
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "rejected" | "completed" | "cancelled";
  studentChoice: "free" | "coffee" | "ice-cream";
  requestNotes?: string;
  createdAt: string;
}

interface UseMentorStudentsReturn {
  sessionRequests: SessionRequest[];
  setSessionRequests: React.Dispatch<React.SetStateAction<SessionRequest[]>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMentorStudents = (): UseMentorStudentsReturn => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionRequests = async () => {
    if (!isSignedIn || !user || !isLoaded) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const email = user.emailAddresses[0]?.emailAddress;
      const userRole = email?.endsWith("@nest.edu.mn") ? "student" : "mentor";

      if (userRole !== "mentor") {
        setError("Access denied. Mentor role required.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/mentor/all?status=requested`,
        {
          headers: {
            "x-user-role": userRole,
            "x-user-email": email || "",
            "x-user-id": user.id,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSessionRequests(result.data);
        } else {
          setSessionRequests([]);
        }
      } else {
        setError("Failed to fetch session requests");
        setSessionRequests([]);
      }
    } catch (err) {
      console.error("Error fetching session requests:", err);
      setError("Failed to fetch session requests");
      setSessionRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionRequests();
  }, [isSignedIn, user, isLoaded]);

  const refetch = () => {
    fetchSessionRequests();
  };

  return {
    sessionRequests,
    setSessionRequests,
    isLoading,
    error,
    refetch,
  };
};
