import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { useEmailRouting } from "../core/hooks/useEmailRouting";
import { useTheme } from "../core/contexts/ThemeContext";
import { Layout } from "../components/layout/Layout";
import StudentDashboard from "./user/student-dashboard";
import MentorDashboard from "./mentor/dashboard";
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  MessageCircle,
  User,
} from "lucide-react";

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { userRole, isStudent, isMentor, isOther } = useEmailRouting();
  const { isDarkMode, colors } = useTheme();

  // Teammate's theme variables - integrated with your structure
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = isDarkMode
    ? "bg-[#0F0E0E] border-white/20"
    : "bg-white border-black/20";

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isSignedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            <p className="text-gray-600">
              Please sign in to access the dashboard
            </p>
          </div>
        </div>
      </Layout>
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
    <Layout>
      <Head>
        <title>Dashboard | Pineder</title>
        <meta name="description" content="Your personalized dashboard" />
      </Head>

      <main className="px-4 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2 text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Welcome back, {user?.firstName || "User"}!
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Your role:{" "}
            <span className="font-semibold">{userRole || "Unknown"}</span>
          </p>
        </div>

        {/* User Info Card */}
        <div
          className="p-6 mb-8 border rounded-xl"
          style={{
            backgroundColor: isDarkMode
              ? colors.background.secondary
              : colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3
                className="text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                {user?.fullName || "User"}
              </h3>
              {/* Merged content - preserving your organized structure while incorporating teammate's improvements */}
              <p className={mutedTextColor}>
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <p className={`text-sm ${mutedTextColor}`}>
                Member since:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className={`p-6 rounded-xl border ${cardBg}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-sm ${mutedTextColor}`}>Sessions</p>
                <p className={`text-2xl font-bold ${textColor}`}>0</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${cardBg}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-sm ${mutedTextColor}`}>Connections</p>
                <p className={`text-2xl font-bold ${textColor}`}>0</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${cardBg}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--pico-accent)] to-[var(--pico-primary)] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-sm ${mutedTextColor}`}>Upcoming</p>
                <p className={`text-2xl font-bold ${textColor}`}>0</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${cardBg}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-accent)] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-sm ${mutedTextColor}`}>Messages</p>
                <p className={`text-2xl font-bold ${textColor}`}>0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>
            Recent Activity
          </h2>
          <div className="py-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className={mutedTextColor}>No recent activity</p>
            <p className={`text-sm ${mutedTextColor} mt-2`}>
              Your learning activities will appear here
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
