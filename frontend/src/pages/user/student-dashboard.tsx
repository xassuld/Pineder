"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import { TopicSubmissionForm } from "../../components/features/group-sessions/TopicSubmissionForm";
import {
  BookOpen,
  Plus,
  Vote,
  MessageCircle,
  TrendingUp,
  Star,
  Award,
  CheckCircle,
  Video,
  Mic,
  Users2,
  BookOpenCheck,
  User,
  Calendar,
  Clock,
  Target,
} from "lucide-react";

interface Topic {
  id: number;
  title: string;
  description: string;
  category: string;
  votes: number;
  participants: number;
  suggestedBy: string;
  suggestedDate: string;
  isVoted: boolean;
}

export default function StudentDashboard() {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();
  const [showTopicForm, setShowTopicForm] = useState(false);

  const cardBg = isDarkMode
    ? "bg-[#0F0E0E] border-gray-800"
    : "bg-white border-gray-200";
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 1,
      title: "Advanced React Patterns",
      description:
        "Deep dive into React hooks, context, and advanced state management",
      category: "Programming",
      votes: 24,
      participants: 12,
      suggestedBy: "Alex Chen",
      suggestedDate: "2 days ago",
      isVoted: true,
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      description:
        "Introduction to ML concepts, algorithms, and practical applications",
      category: "AI/ML",
      votes: 18,
      participants: 8,
      suggestedBy: "Sarah Kim",
      suggestedDate: "1 week ago",
      isVoted: false,
    },
    {
      id: 3,
      title: "Web Security Best Practices",
      description:
        "Learn about authentication, authorization, and security vulnerabilities",
      category: "Security",
      votes: 15,
      participants: 6,
      suggestedBy: "Mike Johnson",
      suggestedDate: "3 days ago",
      isVoted: false,
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      description:
        "Master fundamental data structures and algorithmic thinking",
      category: "Computer Science",
      votes: 22,
      participants: 15,
      suggestedBy: "Emily Davis",
      suggestedDate: "5 days ago",
      isVoted: true,
    },
    {
      id: 5,
      title: "Cloud Architecture Design",
      description: "Design scalable and resilient cloud-based systems",
      category: "Cloud Computing",
      votes: 12,
      participants: 4,
      suggestedBy: "David Wilson",
      suggestedDate: "1 week ago",
      isVoted: false,
    },
  ]);

  const handleVote = (topicId: number) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              votes: topic.isVoted ? topic.votes - 1 : topic.votes + 1,
              isVoted: !topic.isVoted,
            }
          : topic
      )
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { light: string; dark: string } } = {
      Programming: {
        light: "bg-blue-100 text-blue-800",
        dark: "bg-blue-900/30 text-blue-300",
      },
      "AI/ML": {
        light: "bg-purple-100 text-purple-800",
        dark: "bg-purple-900/30 text-purple-300",
      },
      Security: {
        light: "bg-red-100 text-red-800",
        dark: "bg-red-900/30 text-red-300",
      },
      "Computer Science": {
        light: "bg-[#08CB00]/10 text-[#08CB00]",
        dark: "bg-[#08CB00]/20 text-[#08CB00]",
      },
      "Cloud Computing": {
        light: "bg-orange-100 text-orange-800",
        dark: "bg-orange-900/30 text-orange-300",
      },
    };

    const colorScheme = colors[category] || {
      light: "bg-gray-100 text-gray-800",
      dark: "bg-gray-900/30 text-gray-300",
    };

    return isDarkMode ? colorScheme.dark : colorScheme.light;
  };

  const handleTopicSubmit = (newTopic: any) => {
    // Convert the new topic to match our Topic interface
    const topic: Topic = {
      id: Date.now(),
      title: newTopic.topic,
      description: newTopic.description,
      category: newTopic.category,
      votes: 0,
      participants: 0,
      suggestedBy: "You",
      suggestedDate: "Just now",
      isVoted: false,
    };

    // Add the new topic to the beginning of the list
    setTopics((prevTopics) => [topic, ...prevTopics]);
  };

  return (
    <Layout>
      <Head>
        <title>Student Dashboard | Pineder</title>
        <meta
          name="description"
          content="Student dashboard for learning and collaboration"
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
              Welcome back, {user?.firstName || "Student"}!
            </h1>
            <p
              className="text-lg sm:text-xl"
              style={{ color: colors.text.secondary }}
            >
              Here&apos;s your learning overview:
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
            {/* Left Column - Knowledge Testing */}
            <Card
              className={`transition-colors duration-200 shadow-lg ${cardBg}`}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-2 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Knowledge Testing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="py-8 text-center">
                    <BookOpen
                      className="w-16 h-16 mx-auto mb-4 transition-colors duration-200"
                      style={{ color: colors.text.muted }}
                    />
                    <p
                      className="transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Test your knowledge with interactive quizzes and
                      assessments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Empty Space */}
            <Card
              className={`transition-colors duration-200 shadow-lg ${cardBg}`}
            >
              <CardContent className="p-6">
                <div className="py-8 text-center">
                  <div
                    className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border-2 border-dashed rounded-lg transition-colors duration-200"
                    style={{ borderColor: colors.border.secondary }}
                  >
                    <Plus
                      className="w-8 h-8 transition-colors duration-200"
                      style={{ color: colors.text.muted }}
                    />
                  </div>
                  <p
                    className="transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                  >
                    Additional content area
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section - Top Questions/Topics to Discuss */}
          <Card
            className={`transition-colors duration-200 shadow-lg ${cardBg}`}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center space-x-2 transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                <Vote className="w-5 h-5" />
                <span>Top Questions / Topics to Discuss</span>
              </CardTitle>
              <p
                className="text-sm transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Vote for topics you&apos;d like to discuss with the community
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 pb-4 overflow-x-auto">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-shrink-0 p-4 rounded-lg shadow-md w-80 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(topic.category)}>
                        {topic.category}
                      </Badge>
                      <Button
                        variant={topic.isVoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(topic.id)}
                        className="h-8 px-3"
                      >
                        <Vote className="w-4 h-4 mr-1" />
                        {topic.votes}
                      </Button>
                    </div>
                    <h4
                      className="mb-1 font-medium transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      {topic.title}
                    </h4>
                    <p
                      className="mb-3 text-sm transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      {topic.description}
                    </p>
                    <div
                      className="flex items-center justify-between text-xs transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      <span>{topic.participants} participants</span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Discuss
                      </span>
                    </div>
                    <div
                      className="mt-2 text-xs transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Suggested by {topic.suggestedBy} • {topic.suggestedDate}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="w-full max-w-xs"
                  onClick={() => setShowTopicForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Suggest New Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Topic Submission Form */}
      <TopicSubmissionForm
        isOpen={showTopicForm}
        onClose={() => setShowTopicForm(false)}
        onSubmit={handleTopicSubmit}
      />
    </Layout>
  );
}
