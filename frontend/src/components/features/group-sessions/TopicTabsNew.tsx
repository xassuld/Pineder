import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Target, BookOpen, Lightbulb, TrendingUp, Layers } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicTabsNewProps {
  activeTab: "all" | "frontend" | "backend" | "fullstack" | "trending";
  setActiveTab: (
    tab: "all" | "frontend" | "backend" | "fullstack" | "trending"
  ) => void;
  stats: {
    all: number;
    frontend: number;
    backend: number;
    fullstack: number;
    trending: number;
  };
}

export default function TopicTabsNew({
  activeTab,
  setActiveTab,
  stats,
}: TopicTabsNewProps) {
  const { isDarkMode } = useTheme();

  const tabs = [
    {
      id: "all" as const,
      label: "All Topics",
      icon: Lightbulb,
      count: stats.all,
    },
    {
      id: "frontend" as const,
      label: "Frontend",
      icon: Target,
      count: stats.frontend,
    },
    {
      id: "backend" as const,
      label: "Backend",
      icon: BookOpen,
      count: stats.backend,
    },
    {
      id: "fullstack" as const,
      label: "Fullstack",
      icon: Layers,
      count: stats.fullstack,
    },
    {
      id: "trending" as const,
      label: "Trending",
      icon: TrendingUp,
      count: stats.trending,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      {/* Enhanced tabs with Duolingo green styling */}
      <div
        className={`flex flex-wrap justify-center p-3 gap-3 rounded-3xl shadow-xl backdrop-blur-sm transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-700/50"
            : "bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200/50"
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.div
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
                  activeTab === tab.id
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/30 border-2 border-green-600"
                    : `hover:shadow-md border-2 border-transparent transition-colors duration-300 ${
                        isDarkMode
                          ? "hover:bg-green-600 hover:border-green-600 hover:text-white text-gray-300"
                          : "hover:bg-green-600/10 hover:border-green-600/30"
                      }`
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label} ({tab.count})
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
