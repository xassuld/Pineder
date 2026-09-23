import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useEmailRouting, UserRole } from "../../../core/hooks/useEmailRouting";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  showLoading?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
  showLoading = true,
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { userRole } = useEmailRouting();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Redirect to sign-in if not authenticated
      router.push("/sign-in");
      return;
    }

    // If allowedRoles is specified, check if user has permission
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Redirect to homepage as fallback
        router.push("/");
      }
      return;
    }
  }, [isLoaded, isSignedIn, userRole, allowedRoles, redirectTo, router]);

  // Show loading state while checking authentication
  if (!isLoaded || showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading authentication...</p>
          <p className="mt-2 text-sm text-gray-500">
            isLoaded: {isLoaded ? "true" : "false"} | isSignedIn:{" "}
            {isSignedIn ? "true" : "false"}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
          <p className="mt-2 text-sm text-gray-500">
            User not signed in. Redirecting to /sign-in
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
