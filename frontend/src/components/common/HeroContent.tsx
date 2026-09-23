import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, Zap, ArrowRight } from "lucide-react";
import { useTheme } from "../../core/contexts/ThemeContext";

interface HeroContentProps {
  currentCodeIndex: number;
  codeSnippets: string[];
  onStartLearning: () => void;
}

export const HeroContent = ({
  currentCodeIndex,
  codeSnippets,
  onStartLearning,
}: HeroContentProps) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8 text-left"
    >
      {/* Main heading */}
      <div className="space-y-4">
        <motion.h1
          className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span style={{ color: colors.text.primary }}>Connect with</span>
          <br />
          <span
            className="text-transparent bg-gradient-to-r bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary}, ${colors.accent.success})`,
            }}
          >
            Expert Mentors
          </span>
        </motion.h1>
      </div>

      {/* Subtitle */}
      <motion.p
        className="max-w-lg text-lg text-gray-600 md:text-xl dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Join a community where students and mentors connect, learn, and grow
        together. Find your perfect mentor or share your expertise with aspiring
        developers.
      </motion.p>

      {/* Animated code snippet */}
      <motion.div
        className="max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div
          className="p-4 transition-colors duration-300 border rounded-lg backdrop-blur-sm"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: `${colors.background.card}80`,
          }}
        >
          <motion.div
            key={currentCodeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <div className="flex items-center mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <span className="ml-2 text-xs text-gray-400">community.js</span>
            </div>
            <pre className="font-mono text-sm text-green-400">
              <code>{codeSnippets[currentCodeIndex]}</code>
            </pre>
          </motion.div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        className="grid max-w-md grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Expert Mentors
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Live Sessions
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Flexible Schedule
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Community
          </span>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col gap-4 pt-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <button
          onClick={onStartLearning}
          className="flex items-center justify-center px-8 py-4 space-x-2 text-lg font-semibold transition-all duration-300 rounded-lg cursor-pointer hover:scale-105"
          style={{
            backgroundColor: colors.accent.primary,
            color: "white",
          }}
        >
          <span>Find a Mentor</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};
