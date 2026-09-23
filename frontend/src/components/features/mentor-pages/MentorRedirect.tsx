import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function MentorRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { userRole } = useEmailRouting();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on client
    if (!isClient) return;

    // Allow mentors to stay on any page they visit, no automatic redirects
    // This component is kept for potential future redirect logic if needed
    // Currently, mentors can freely navigate to home page or any other page
  }, [isClient, isLoaded, isSignedIn, userRole, router]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) return null;

  return null;
}
