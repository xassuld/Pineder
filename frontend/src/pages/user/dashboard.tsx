import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { useEmailRouting } from "../../core/hooks/useEmailRouting";
import {
  StudentOnly,
  MentorOnly,
  RoleGuard,
} from "../../components/features/auth/RoleGuard";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Navigation } from "../../components/layout/Navigation";
import StudentDashboard from "./student-dashboard";
import MentorDashboard from "../mentor/dashboard";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  MessageCircle,
  Settings,
  User,
  Mail,
  Shield,
} from "lucide-react";

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { userRole, isStudent, isMentor, isOther } = useEmailRouting();
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = isDarkMode
    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-white/20"
    : "bg-white border-black/20";

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">
            Please sign in to access the dashboard
          </p>
        </div>
      </div>
    );
  }

  // If user is a student, show the original student dashboard
  if (isStudent) {
    return <StudentDashboard />;
  }

  // If user is a mentor, show the mentor dashboard
  if (isMentor) {
    return <MentorDashboard />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0F0E0E]" : "bg-white"}`}>
      <Navigation />

      <Head>
        <title>Dashboard | Pineder</title>
        <meta name="description" content="Your personalized dashboard" />
      </Head>

      <main className="px-4 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
            Welcome back, {user?.firstName || "User"}!
          </h1>
          <p className={mutedTextColor}>
            Your role:{" "}
            <span className="font-semibold">{userRole || "Unknown"}</span>
          </p>
        </div>

        {/* User Info Card */}
        <div className={`p-6 rounded-xl border mb-8 ${cardBg}`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${textColor}`}>
                {user?.fullName || "User"}
              </h3>
              <p className={mutedTextColor}>
                <Mail className="inline w-4 h-4 mr-2" />
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <div className="flex items-center mt-2">
                <Shield className="w-4 h-4 mr-2 text-[var(--pico-primary)]" />
                <span className={`text-sm ${mutedTextColor}`}>
                  Role: {userRole || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-based Content for others */}
        <RoleGuard allowedRoles={["other"]}>
          <div className={`p-6 rounded-xl border ${cardBg} mb-8`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
              Welcome to Pineder!
            </h3>
            <p className={mutedTextColor}>
              You&apos;re using an email domain that doesn&apos;t match our
              standard roles. You have access to general features. Contact
              support if you need specific access.
            </p>
          </div>
        </RoleGuard>

        {/* Authentication Status */}
        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            Authentication Status
          </h3>
          <div className="space-y-2">
            <p className={mutedTextColor}>
              <span className="font-medium">Signed In:</span>{" "}
              {isSignedIn ? "Yes" : "No"}
            </p>
            <p className={mutedTextColor}>
              <span className="font-medium">User Role:</span>{" "}
              {userRole || "Unknown"}
            </p>
            <p className={mutedTextColor}>
              <span className="font-medium">Email Domain:</span>{" "}
              {user?.primaryEmailAddress?.emailAddress || "N/A"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
