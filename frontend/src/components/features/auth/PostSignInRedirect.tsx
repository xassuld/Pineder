import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useProfileStatus } from "../../../core/hooks/useProfileStatus";

export function PostSignInRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { hasProfile, isCompleted, role, loading, error } = useProfileStatus();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isLoaded || !isSignedIn || !user || hasRedirected || loading) return;

    const currentPath = router.pathname;
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("pineder-user-role") : null;
    const effectiveRole = storedRole === "mentor" || storedRole === "student" ? storedRole : role;
    
    // Don't redirect if user is already on a valid page
    const isOnValidPage =
      currentPath === "/" ||
      currentPath === "/dashboard" ||
      currentPath === "/user/dashboard" ||
      currentPath === "/user/student-dashboard" ||
      currentPath === "/mentor/dashboard" ||
      currentPath.startsWith("/profile/") ||
      currentPath.startsWith("/auth/");

    if (isOnValidPage) {
      console.log("User is on valid page, not redirecting");
      setHasRedirected(true);
      return;
    }

    // Determine redirect path based on profile status
    let redirectPath = "/";
    
    if (!hasProfile || !isCompleted) {
      // First time user or incomplete profile - redirect to profile creation
      if (effectiveRole === "mentor") {
        redirectPath = "/profile/mentor";
      } else if (effectiveRole === "student") {
        redirectPath = "/profile/student";
      }
    } else {
      // User has completed profile - redirect to homepage
      redirectPath = "/";
    }

    console.log("Redirecting user:", {
      hasProfile,
      isCompleted,
      role,
      redirectPath,
      currentPath
    });

    router.push(redirectPath);
    setHasRedirected(true);
  }, [
    isClient,
    isLoaded,
    isSignedIn,
    user,
    hasRedirected,
    loading,
    hasProfile,
    isCompleted,
    role,
    router,
  ]);

  if (!isClient) return null;

  return null;
}
