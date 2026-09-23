import Head from "next/head";
import { useTheme } from "../../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Layout } from "../../components/layout/Layout";
import {
  DashboardStats,
  PerformanceOverview,
  QuickActions,
} from "../../components/features/mentor-pages";
import UpcomingSessions from "../../components/features/mentor-pages/UpcomingSessions";

export default function MentorDashboardPage() {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();

  const cardBg = isDarkMode
    ? "bg-[#0F0E0E] border-gray-800"
    : "bg-white border-gray-200";

  return (
    <Layout>
      <Head>
        <title>Mentor Dashboard | Pineder</title>
        <meta
          name="description"
          content="Mentor dashboard for managing sessions and students"
        />
      </Head>

      <div
        className="min-h-screen w-full"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl"
              style={{ color: colors.text.primary }}
            >
              Welcome back, {user?.firstName || "Mentor"}!
            </h1>
            <p
              className="text-lg sm:text-xl"
              style={{ color: colors.text.secondary }}
            >
              Here&apos;s today&apos;s overview:
            </p>
          </div>

          {/* Quick Stats */}
          <DashboardStats cardBg={cardBg} colors={colors} />

          {/* Performance Overview */}
          <PerformanceOverview cardBg={cardBg} colors={colors} />

          {/* Upcoming Sessions with Zoom Meetings */}
          <UpcomingSessions cardBg={cardBg} colors={colors} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
}
