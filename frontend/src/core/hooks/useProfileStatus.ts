import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface ProfileStatus {
  hasProfile: boolean;
  isCompleted: boolean;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export function useProfileStatus() {
  const { user, isSignedIn } = useUser();
  const [status, setStatus] = useState<ProfileStatus>({
    hasProfile: false,
    isCompleted: false,
    role: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isSignedIn || !user) {
      setStatus({
        hasProfile: false,
        isCompleted: false,
        role: null,
        loading: false,
        error: null,
      });
      return;
    }

    const checkProfileStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true, error: null }));

        const storedRole =
          typeof window !== "undefined"
            ? localStorage.getItem("pineder-user-role")
            : null;

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email && !storedRole) {
          throw new Error("No email address found");
        }

        const isMentor = storedRole === "mentor" || (!storedRole && email?.endsWith("@gmail.com"));
        const role = isMentor ? "mentor" : (storedRole === "student" ? "student" : "student");
        const endpoint = isMentor ? "/api/mentors/profile" : "/api/student-profile";

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-user-role": role,
              "x-user-email": email,
              "x-user-id": user.id,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Check if profile exists and is completed
          const hasProfile = data.success && data.data;
          const isCompleted = hasProfile && (
            (role === "mentor" && data.data.title && data.data.bio) ||
            (role === "student" && data.data.className && data.data.studentCode)
          );

          setStatus({
            hasProfile,
            isCompleted,
            role,
            loading: false,
            error: null,
          });
        } else {
          // Profile doesn't exist
          setStatus({
            hasProfile: false,
            isCompleted: false,
            role,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
        setStatus({
          hasProfile: false,
          isCompleted: false,
          role: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to check profile status",
        });
      }
    };

    checkProfileStatus();
  }, [isSignedIn, user]);

  return status;
}
