import React from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, Lightbulb, Layers } from "lucide-react";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  topics: TopicSubmission[];
  getVoteCount: (topicId: string, voteType: "upvote" | "downvote") => number;
}

export const TopicTabs: React.FC<TopicTabsProps> = ({
  activeTab,
  setActiveTab,
  topics,
  getVoteCount,
}) => {
  const { colors, isDarkMode } = useTheme();
  const tabs = [
    { id: "all", label: "All Topics", icon: Lightbulb, count: topics.length },
    {
      id: "frontend",
      label: "Frontend",
      icon: Target,
      count: topics.filter((t) => t.category === "Frontend Development").length,
    },
    {
      id: "backend",
      label: "Backend",
      icon: BookOpen,
      count: topics.filter((t) => t.category === "Backend Development").length,
    },
    {
      id: "fullstack",
      label: "Fullstack",
      icon: Layers,
      count: topics.filter((t) => t.category === "Full-Stack Development")
        .length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex pb-2 space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            whileHover={{
              scale: 1.08,
              y: -6,
              rotateX: 10,
              rotateY: 3,
              z: 30,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              perspective: 800,
              backgroundColor:
                activeTab === tab.id
                  ? "#059669"
                  : isDarkMode
                  ? "#000000"
                  : "#ffffff",
              color:
                activeTab === tab.id
                  ? "white"
                  : isDarkMode
                  ? "#ffffff"
                  : colors.text.primary,
              borderColor:
                activeTab === tab.id
                  ? "#059669"
                  : isDarkMode
                  ? "#6b7280"
                  : colors.border.primary,
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-2xl font-medium text-xs transition-all duration-300 ease-out whitespace-nowrap flex-shrink-0 sm:px-4 sm:text-sm border ${
              activeTab === tab.id
                ? "shadow-lg shadow-green-600/30"
                : "hover:bg-green-600/10 hover:border-green-600 hover:text-green-600 hover:shadow-md"
            }`}
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={`px-1.5 py-0.5 rounded-xl text-xs font-bold transition-all duration-300 sm:px-2 ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "group-hover:bg-green-600/10 group-hover:text-green-600"
              }`}
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "rgba(255,255,255,0.2)"
                    : isDarkMode
                    ? "#6b7280"
                    : "#f1f3f4",
                color:
                  activeTab === tab.id
                    ? "white"
                    : isDarkMode
                    ? "#ffffff"
                    : colors.text.secondary,
                borderColor: isDarkMode ? "#9ca3af" : "transparent",
              }}
            >
              {tab.count}
            </motion.span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
