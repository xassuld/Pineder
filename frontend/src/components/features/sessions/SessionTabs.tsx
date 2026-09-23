import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Users, User, BookOpen } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionTabsProps {
  activeTab: "group" | "oneonone" | "all";
  setActiveTab: (tab: "group" | "oneonone" | "all") => void;
  stats: {
    total: number;
    oneonone: number;
    group: number;
  };
}

export default function SessionTabs({
  activeTab,
  setActiveTab,
  stats,
}: SessionTabsProps) {
  const { isDarkMode } = useTheme();

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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={activeTab === "group" ? "default" : "ghost"}
            onClick={() => setActiveTab("group")}
            className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
              activeTab === "group"
                ? "bg-[#58CC02] hover:bg-[#46A302] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02]"
                : `hover:shadow-md border-2 border-transparent transition-colors duration-300 ${
                    isDarkMode
                      ? "hover:bg-[#58CC02] hover:border-[#58CC02] hover:text-white text-gray-300"
                      : "hover:bg-[#58CC02]/10 hover:border-[#58CC02]/30"
                  }`
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Group ({stats.group})
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={activeTab === "oneonone" ? "default" : "ghost"}
            onClick={() => setActiveTab("oneonone")}
            className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
              activeTab === "oneonone"
                ? "bg-[#58CC02] hover:bg-[#46A302] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02]"
                : `hover:shadow-md border-2 border-transparent transition-colors duration-300 ${
                    isDarkMode
                      ? "hover:bg-[#58CC02] hover:border-[#58CC02] hover:text-white text-gray-300"
                      : "hover:bg-[#58CC02]/10 hover:border-[#58CC02]/30"
                  }`
            }`}
          >
            <User className="w-5 h-5 mr-2" />1 on 1 ({stats.oneonone})
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            onClick={() => setActiveTab("all")}
            className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
              activeTab === "all"
                ? "bg-[#58CC02] hover:bg-[#58CC02] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02]"
                : `hover:shadow-md border-2 border-transparent transition-colors duration-300 ${
                    isDarkMode
                      ? "hover:bg-[#58CC02] hover:border-[#58CC02] hover:text-white text-gray-300"
                      : "hover:bg-[#58CC02]/10 hover:border-[#58CC02]/30"
                  }`
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            All ({stats.total})
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
