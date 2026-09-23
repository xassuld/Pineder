import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  title?: string;
  studentCode?: string;
  major?: string;
  specialties?: string[];
  mentorType?: string;
  profileCompleted: boolean;
}

export const useUserProfile = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isSignedIn || !user || !isLoaded) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = user.emailAddresses[0]?.emailAddress;
        const storedRole =
          typeof window !== "undefined"
            ? localStorage.getItem("pineder-user-role")
            : null;
        const userRole = storedRole === "student" || storedRole === "mentor"
          ? storedRole
          : email?.endsWith("@nest.edu.mn")
            ? "student"
            : "mentor";

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
          }/api/${userRole}s/profile`,
          {
            headers: {
              "x-user-role": userRole,
              "x-user-email": email || "",
              "x-user-id": user.id,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProfile(data.data);
          } else {
            // If no profile exists, create a basic one
            setProfile({
              email: email || "",
              role: userRole,
              profileCompleted: false,
            });
          }
        } else if (response.status === 429) {
          // Rate limited - create basic profile
          console.warn("Rate limited, using basic profile");
          setProfile({
            email: email || "",
            role: userRole,
            profileCompleted: false,
          });
        } else {
          // If profile doesn't exist, create a basic one
          setProfile({
            email: email || "",
            role: userRole,
            profileCompleted: false,
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch profile");
        // Set basic profile on error to prevent page crash
        const email = user.emailAddresses[0]?.emailAddress;
        const storedRole =
          typeof window !== "undefined"
            ? localStorage.getItem("pineder-user-role")
            : null;
        const userRole = storedRole === "student" || storedRole === "mentor"
          ? storedRole
          : email?.endsWith("@nest.edu.mn")
            ? "student"
            : "mentor";
        setProfile({
          email: email || "",
          role: userRole,
          profileCompleted: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isSignedIn, user, isLoaded]);

  return { profile, loading, error };
};
