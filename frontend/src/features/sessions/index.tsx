import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
// Merged imports - preserving your organized structure while incorporating teammate's improvements
import { useTheme } from "../../core/contexts/ThemeContext";
import { Card, CardContent } from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { TopicSubmissionForm } from "../../components/features/group-sessions/TopicSubmissionForm";
import TopicVoting from "../../components/features/group-sessions/TopicVoting";
import { Plus, Target, Users, Calendar, Lightbulb } from "lucide-react";
import { useGroupSessions } from "../../core/hooks/useGroupSessions";
import { TopicSubmission } from "../../core/lib/data/groupSessions";

export default function GroupSessionsPage() {
  const { isDarkMode, colors } = useTheme();
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"topics" | "sessions">("topics");

  // Use real API hook instead of mock data
  const {
    groupSessions,
    topics,
    isLoading,
    error,
    submitTopic,
    voteTopic,
    refreshData,
  } = useGroupSessions();

  // Preserve teammate's existing theme logic
  useEffect(() => {
    // Load and apply saved theme preferences on mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("pico-theme");
      const savedDarkMode = localStorage.getItem("pico-dark-mode");
      const defaultTheme = localStorage.getItem("pico-default-theme");
      const defaultDarkMode = localStorage.getItem("pico-default-dark-mode");

      const root = document.documentElement;

      // Apply saved theme, or default theme, or fallback to theme 4 (Forest)
      let themeId = 4; // Fallback
      if (savedTheme) {
        themeId = parseInt(savedTheme);
      } else if (defaultTheme) {
        themeId = parseInt(defaultTheme);
      }
      root.className = `theme-${themeId}`;

      // Apply saved dark mode, or default dark mode, or fallback to true (dark mode)
      let isDark = true; // Fallback
      if (savedDarkMode !== null) {
        isDark = savedDarkMode === "true";
      } else if (defaultDarkMode !== null) {
        isDark = defaultDarkMode === "true";
      }
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  // Preserve teammate's theme change listener
  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const savedDarkMode = localStorage.getItem("pico-dark-mode");
        // Note: We're using the useTheme hook for this now
      }
    };

    // Initial check
    checkDarkMode();

    // Listen for storage changes (when theme is toggled)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pico-dark-mode") {
        checkDarkMode();
      }
    };

    // Set up periodic check for theme changes
    const interval = setInterval(checkDarkMode, 1000);

    // Add event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }

    // Cleanup
    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, []);

  const handleTopicSubmit = async (
    newTopic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => {
    try {
      if (groupSessions.length === 0) {
        throw new Error("No group sessions available");
      }

      const groupId = groupSessions[0]._id;
      await submitTopic(groupId, {
        title: newTopic.topic,
        description: newTopic.description,
        category: newTopic.category,
      });

      setShowTopicForm(false);
    } catch (error) {
      console.error("Failed to submit topic:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleVote = async (
    topicId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      if (groupSessions.length === 0) {
        throw new Error("No group sessions available");
      }

      const groupId = groupSessions[0]._id;
      await voteTopic(groupId, topicId, voteType);
    } catch (error) {
      console.error("Failed to vote on topic:", error);
      // You might want to show an error message to the user here
    }
  };

  const getVoteCount = (topicId: string, voteType: "upvote" | "downvote") => {
    // For now, we'll use the votes field from the topic
    // In a more sophisticated implementation, you might want to track upvotes/downvotes separately
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return 0;

    // Since the backend only tracks total votes, we'll show them as upvotes for now
    return voteType === "upvote" ? topic.votes : 0;
  };

  const getUserVote = (topicId: string) => {
    // This would need to be implemented based on how the backend tracks user votes
    // For now, return null (no vote)
    return null;
  };

  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p style={{ color: colors.text.secondary }}>
              Loading group sessions...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <p className="mb-4 text-red-500">Error: {error}</p>
            <Button
              onClick={refreshData}
              style={{ backgroundColor: colors.accent.primary }}
            >
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Group Sessions - Pineder</title>
        <meta
          name="description"
          content="Join group study sessions and vote on learning topics on Pineder"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Header - Minimalist Big Font Design */}
        <div className="container px-4 py-24 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1
              className="mb-8 font-black leading-none tracking-tight text-8xl md:text-9xl"
              style={{ color: colors.text.primary }}
            >
              GROUP
            </h1>
            <h2
              className="text-9xl md:text-[12rem] font-black tracking-tightest leading-none mb-12 acumin-style"
              style={{
                color: colors.text.primary,
                fontSize: "clamp(6rem, 12vw, 14rem)",
                lineHeight: "0.6",
              }}
            >
              SESSIONS
            </h2>
            <p
              className="max-w-2xl mx-auto text-lg font-light tracking-wide md:text-xl"
              style={{ color: colors.text.secondary }}
            >
              Collaborative learning experiences where knowledge meets
              community. Join forces with peers to explore topics, share
              insights, and grow together.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="container px-4 py-16 mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-4">
            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Lightbulb
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.primary }}
                />
                <div
                  className="mb-1 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {topics.length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Topics Suggested
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Target
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.success }}
                />
                <div
                  className="mb-1 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {topics.reduce((total, topic) => total + topic.votes, 0)}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Total Votes
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Users
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.info }}
                />
                <div
                  className="mb-1 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {groupSessions.length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Active Sessions
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Calendar
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.warning }}
                />
                <div
                  className="mb-1 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {groupSessions.filter((s) => s.status === "scheduled").length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Scheduled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowTopicForm(true)}
              className="px-8 text-lg transition-all duration-200 shadow-lg h-14 rounded-xl hover:shadow-xl"
              style={{
                background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
                color: colors.text.inverse,
              }}
            >
              <Plus className="w-6 h-6 mr-2" />
              Suggest New Topic
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div
              className="flex p-1 space-x-1 rounded-xl"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <button
                onClick={() => setActiveTab("topics")}
                className="px-6 py-3 font-medium transition-all duration-200 rounded-lg"
                style={{
                  backgroundColor:
                    activeTab === "topics"
                      ? colors.background.primary
                      : "transparent",
                  color:
                    activeTab === "topics"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                <Target className="inline w-4 h-4 mr-2" />
                Topic Voting
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className="px-6 py-3 font-medium transition-all duration-200 rounded-lg"
                style={{
                  backgroundColor:
                    activeTab === "sessions"
                      ? colors.background.primary
                      : "transparent",
                  color:
                    activeTab === "sessions"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                <Users className="inline w-4 h-6 mr-2" />
                Group Sessions
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "topics" ? (
              <TopicVoting
                topics={topics.map((topic) => ({
                  id: topic.id,
                  topic: topic.title,
                  description: topic.description,
                  studentName: "Student", // This would need to be populated from the backend
                  category: topic.category || "General",
                  difficulty: "beginner",
                  status: topic.status === "completed" || topic.status === "selected" ? "approved" : topic.status,
                  submittedAt: topic.createdAt,
                  studentImage: "",
                  studentLevel: "beginner",
                  grade: "Beginner",
                  interests: topic.category || "",
                  studentId: topic.submittedBy,
                  email: "",
                }))}
                onVote={handleVote}
                getVoteCount={getVoteCount}
                getUserVote={getUserVote}
              />
            ) : (
              <div className="py-12 text-center">
                <Users
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: colors.text.muted }}
                />
                <h3
                  className="mb-2 text-xl font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Group Sessions Coming Soon
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  Once topics are voted on and approved, group sessions will be
                  created here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Topic Submission Form */}
        <TopicSubmissionForm
          isOpen={showTopicForm}
          onClose={() => setShowTopicForm(false)}
          onSubmit={handleTopicSubmit}
        />
      </div>
    </Layout>
  );
}
