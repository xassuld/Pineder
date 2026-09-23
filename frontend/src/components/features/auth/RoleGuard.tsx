import { ReactNode } from "react";
import { useEmailRouting, UserRole } from "../../../core/hooks/useEmailRouting";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  showFallback = true,
}: RoleGuardProps) {
  const { userRole, isStudent, isMentor, isOther } = useEmailRouting();

  // Check if user has the required role
  const hasPermission = userRole && allowedRoles.includes(userRole);

  if (!hasPermission) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }

    if (showFallback) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <div className="text-sm text-gray-500">
              <p>Your role: {userRole || "Unknown"}</p>
              <p>Required roles: {allowedRoles.join(", ")}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function StudentOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["student"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function MentorOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["mentor"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function StudentOrMentor({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["student", "mentor"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
