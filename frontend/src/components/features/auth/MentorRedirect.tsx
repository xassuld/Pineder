import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function MentorRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { userRole } = useEmailRouting();

  useEffect(() => {
    // Only redirect if user is loaded, signed in, and is a mentor
    if (!isLoaded || !isSignedIn || userRole !== "mentor") {
      return;
    }

    // Define pages where mentors should be redirected to their dashboard
    const mentorRedirectPages = [
      "/", // Home page
      "/dashboard", // Main dashboard
      "/mentors", // Mentors listing page (mentors shouldn't browse other mentors)
      "/sessions", // General sessions page
    ];

    // Only redirect if we're on a page that mentors shouldn't be on
    if (mentorRedirectPages.includes(router.pathname)) {
      router.push("/user/mentor-dashboard");
    }
  }, [isLoaded, isSignedIn, userRole, router]);

  return null;
}
