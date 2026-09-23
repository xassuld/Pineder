import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

export interface Mentor {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    title: string;
    bio: string;
  };
  specialties: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  totalSessions: number;
  totalStudents: number;
  isVerified: boolean;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
}

interface UseMentorsReturn {
  mentors: Mentor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMentors = (): UseMentorsReturn => {
  const { user } = useUser();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMentors([]); // Initialize with empty array

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authentication headers if user is logged in
      if (user) {
        headers["x-user-role"] =
          (user.publicMetadata?.role as string) || "student";
        headers["x-user-email"] = user.emailAddresses[0]?.emailAddress || "";
        headers["x-user-id"] = user.id || "";
        headers["x-user-firstname"] = user.firstName || "";
        headers["x-user-lastname"] = user.lastName || "";
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors?limit=50`,
        {
          headers,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.data) {
          // The API returns data as an array directly, not data.mentors
          const mentorsArray = Array.isArray(data.data)
            ? data.data
            : data.data.mentors || [];
          
          const validMentors = mentorsArray
            .filter((mentor: any) => mentor && mentor.userId !== null)
            .map((mentor: any) => {
              // Use Clerk user data if this is the current user, otherwise use database data
              const isCurrentUser = user && mentor.userId.email === user.emailAddresses[0]?.emailAddress;
              
              return {
                _id: mentor._id,
                userId: {
                  firstName: isCurrentUser 
                    ? (user?.firstName || mentor.userId.firstName || "Unknown")
                    : (mentor.userId.firstName || "Unknown"),
                  lastName: isCurrentUser 
                    ? (user?.lastName || mentor.userId.lastName || "Mentor")
                    : (mentor.userId.lastName || "Mentor"),
                  email: mentor.userId.email || "",
                  avatar: mentor.userId.avatar || "",
                  title: mentor.userId.title || "Mentor",
                  bio: mentor.bio || mentor.userId.bio || "No bio available",
                },
                specialties: mentor.specialties || [],
                experience: mentor.experience || 0,
                rating: mentor.rating || 0,
                hourlyRate: mentor.hourlyRate || 0,
                totalSessions: mentor.totalSessions || 0,
                totalStudents: mentor.totalStudents || 0,
                isVerified: mentor.isVerified || false,
                availability: mentor.availability || [],
              };
            });

          setMentors(validMentors);
        } else {
          setError("Failed to load mentors");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch mentors");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Request timeout - please try again");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency for useCallback

  useEffect(() => {
    // Always fetch mentors (public data)
    fetchMentors();
  }, [user, fetchMentors]); // Dependency for useEffect

  const refetch = useCallback(() => {
    fetchMentors();
  }, [fetchMentors]);

  return { mentors, isLoading, error, refetch };
};
