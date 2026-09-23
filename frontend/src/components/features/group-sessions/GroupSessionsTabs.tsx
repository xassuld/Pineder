import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Lightbulb, Users } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface GroupSessionsTabsProps {
  activeTab: "topics" | "sessions";
  setActiveTab: (tab: "topics" | "sessions") => void;
}

export default function GroupSessionsTabs({
  activeTab,
  setActiveTab,
}: GroupSessionsTabsProps) {
  const { isDarkMode } = useTheme();

  const getTabStyle = (isActive: boolean) => ({
    color: isActive ? "#16a34a" : isDarkMode ? "#f3f4f6" : "#111827",
    borderColor: isActive ? "#16a34a" : isDarkMode ? "#6b7280" : "transparent",
    backgroundColor: isActive ? "rgba(22, 163, 74, 0.1)" : "transparent",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex flex-col justify-center p-3 gap-3 sm:flex-row">
        <motion.div
          whileHover={{
            scale: 1.04,
            y: -6,
            rotateX: 8,
            rotateY: 3,
            z: 30,
          }}
          whileTap={{ scale: 0.96, y: -1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ perspective: 800 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant={activeTab === "topics" ? "default" : "ghost"}
            onClick={() => setActiveTab("topics")}
            className={`w-full rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 py-3 text-sm font-bold sm:w-auto sm:px-6 sm:py-4 sm:text-base ${
              activeTab === "topics"
                ? "bg-green-600/10 hover:bg-green-600/20 text-green-600 shadow-xl shadow-green-600/30 border-2 border-green-600"
                : "hover:bg-green-600/10 hover:shadow-md border-2 border-transparent hover:border-green-600/30"
            }`}
            style={getTabStyle(activeTab === "topics")}
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Topics & Voting
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -6,
            rotateX: 8,
            rotateY: 3,
            z: 30,
          }}
          whileTap={{ scale: 0.96, y: -1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ perspective: 800 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant={activeTab === "sessions" ? "default" : "ghost"}
            onClick={() => setActiveTab("sessions")}
            className={`w-full rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 py-3 text-sm font-bold sm:w-auto sm:px-6 sm:py-4 sm:text-base ${
              activeTab === "sessions"
                ? "bg-green-600/10 hover:bg-green-600/20 text-green-600 shadow-xl shadow-green-600/30 border-2 border-green-600"
                : "hover:bg-green-600/10 hover:shadow-md border-2 border-transparent hover:border-green-600/30"
            }`}
            style={getTabStyle(activeTab === "sessions")}
          >
            <Users className="w-5 h-5 mr-2" />
            Upcoming Sessions
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
