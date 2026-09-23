import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  TopicSubmission,
  TopicVote,
} from "../../../core/lib/data/groupSessions";
import { TopicSubmissionForm } from "./TopicSubmissionForm";
import TopicVoting from "./TopicVoting";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicsSectionProps {
  topics: TopicSubmission[];
  votes: TopicVote[];
  onTopicSubmit: (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => void;
  onVote: (topicId: string, vote: "upvote" | "downvote") => void;
  onEdit?: (topic: TopicSubmission) => void;
  onDelete?: (topicId: string) => void;
}

export default function TopicsSection({
  topics,
  votes,
  onTopicSubmit,
  onVote,
  onEdit,
  onDelete,
}: TopicsSectionProps) {
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { isDarkMode, colors } = useTheme();

  // Add backdrop blur effect to navigation when modal is open
  useEffect(() => {
    const navigation = document.querySelector("nav");
    if (navigation) {
      if (showTopicForm) {
        navigation.classList.add("backdrop-blur-md");
        navigation.classList.add("bg-opacity-80");
      } else {
        navigation.classList.remove("backdrop-blur-md");
        navigation.classList.remove("bg-opacity-80");
      }
    }

    return () => {
      if (navigation) {
        navigation.classList.remove("backdrop-blur-md");
        navigation.classList.remove("bg-opacity-80");
      }
    };
  }, [showTopicForm]);

  const handleTopicSubmit = (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => {
    console.log("TopicsSection: Handling topic submission:", topic);

    try {
      onTopicSubmit(topic);
      setShowTopicForm(false); // Close the form after successful submission
      console.log("Topic submitted successfully, form closed");
    } catch (error) {
      console.error("Error in TopicsSection:", error);
      // Keep form open if there's an error
    }
  };

  const handleCloseForm = () => {
    setShowTopicForm(false);
    console.log("Topic form closed manually");
  };

  const getVoteCount = (topicId: string, voteType: "upvote" | "downvote") => {
    const topicVotes = votes.filter((v) => v.topicId === topicId);
    return topicVotes.filter((v) => v.vote === voteType).length;
  };

  const getUserVote = (topicId: string) => {
    // For demo purposes, let's use the first student in the votes as the current user
    // In a real app, this would come from authentication context
    const userVote = votes.find(
      (v) => v.topicId === topicId && v.studentId === "student1"
    );

    // Debug logging
    console.log("getUserVote called for topic:", topicId);
    console.log("Available votes:", votes);
    console.log("Found user vote:", userVote);

    return userVote?.vote || null;
  };

  const getFilteredTopics = () => {
    let filtered = [...topics];

    switch (activeFilter) {
      case "frontend":
        filtered = filtered.filter(
          (topic) => topic.category === "Frontend Development"
        );
        break;
      case "backend":
        filtered = filtered.filter(
          (topic) => topic.category === "Backend Development"
        );
        break;
      case "fullstack":
        filtered = filtered.filter(
          (topic) => topic.category === "Full-Stack Development"
        );
        break;
      case "ui-design":
        filtered = filtered.filter((topic) => topic.category === "UI Design");
        break;
      case "ux-design":
        filtered = filtered.filter((topic) => topic.category === "UX Design");
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredTopics = getFilteredTopics();

  const getFilterCount = (filterType: string) => {
    switch (filterType) {
      case "frontend":
        return topics.filter((t) => t.category === "Frontend Development")
          .length;
      case "backend":
        return topics.filter((t) => t.category === "Backend Development")
          .length;
      case "fullstack":
        return topics.filter((t) => t.category === "Full-Stack Development")
          .length;
      case "ui-design":
        return topics.filter((t) => t.category === "UI Design").length;
      case "ux-design":
        return topics.filter((t) => t.category === "UX Design").length;
      default:
        return topics.length;
    }
  };

  const filters = [
    { id: "all", label: "All Topics", count: getFilterCount("all") },
    {
      id: "frontend",
      label: "Frontend Development",
      count: getFilterCount("frontend"),
    },
    {
      id: "backend",
      label: "Backend Development",
      count: getFilterCount("backend"),
    },
    {
      id: "fullstack",
      label: "Full-Stack Development",
      count: getFilterCount("fullstack"),
    },
    { id: "ui-design", label: "UI Design", count: getFilterCount("ui-design") },
    { id: "ux-design", label: "UX Design", count: getFilterCount("ux-design") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2
              className="text-lg font-bold mb-1 sm:text-xl"
              style={{ color: isDarkMode ? "#ffffff" : "#111827" }}
            >
              Learning Topics
            </h2>
            <p
              className="text-sm"
              style={{ color: isDarkMode ? "#d1d5db" : "#4b5563" }}
            >
              Vote on student-requested topics for upcoming group learning
              sessions
            </p>
          </div>
          <Button
            onClick={() => setShowTopicForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Topic
          </Button>
        </div>
      </div>

      {/* Topic Submission Form */}
      {showTopicForm && (
        <TopicSubmissionForm
          onSubmit={handleTopicSubmit}
          isOpen={showTopicForm}
          onClose={handleCloseForm}
        />
      )}

      {/* New Layout: Left Sidebar + Right Content */}
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-300px)]">
        {/* Left Sidebar - Category Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-4">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Categories
            </h3>
            <div className="space-y-3">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 border-2 ${
                    activeFilter === filter.id
                      ? "bg-green-600/10 text-green-600 border-green-600 shadow-lg shadow-green-600/20"
                      : isDarkMode
                      ? "bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 border-gray-600 hover:border-gray-500"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">
                      {filter.label}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        activeFilter === filter.id
                          ? "bg-green-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Content - Topic Cards (Scrollable) */}
        <div className="flex-1 overflow-y-auto pl-4 pr-8 py-6">
          <TopicVoting
            topics={filteredTopics}
            onVote={onVote}
            onEdit={onEdit}
            onDelete={onDelete}
            getVoteCount={getVoteCount}
            getUserVote={getUserVote}
          />
        </div>
      </div>
    </motion.div>
  );
}
