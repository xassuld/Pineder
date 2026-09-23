import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

interface AuthCallbackProps {
  onRedirect?: (path: string) => void;
  showLoading?: boolean;
}

export function AuthCallback({
  onRedirect,
  showLoading = true,
}: AuthCallbackProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { redirectBasedOnEmail, userRole } = useEmailRouting();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;

      if (primaryEmail) {
        // Use custom redirect handler if provided
        if (onRedirect) {
          const path = getRedirectPathForEmail(primaryEmail);
          onRedirect(path);
        } else {
          // Use default email-based routing
          redirectBasedOnEmail();
        }
      }
    }
  }, [isLoaded, isSignedIn, user, onRedirect, redirectBasedOnEmail]);

  const getRedirectPathForEmail = (email: string): string => {
    const emailLower = email.toLowerCase();

    if (emailLower.endsWith("@nest.edu.mn")) {
      return "/";
    } else if (emailLower.endsWith("@gmail.com")) {
      return "/mentors";
    } else {
      return "/"; // Fallback for other email domains
    }
  };

  if (!isLoaded || showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
          {userRole && (
            <p className="text-sm text-gray-500 mt-2">
              Detected role: {userRole}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
