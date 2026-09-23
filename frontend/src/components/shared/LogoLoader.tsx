import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { useTheme } from "../../core/contexts/ThemeContext";

interface LogoLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LogoLoader = ({
  message = "Growing your knowledge... 🌱",
  size = "md",
}: LogoLoaderProps) => {
  const { colors, getAccentColor } = useTheme();

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated Logo */}
      <motion.div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full`}
        style={{
          background: `linear-gradient(135deg, ${getAccentColor()}, ${getAccentColor()})`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sprout
            className={`${
              size === "sm"
                ? "w-8 h-8"
                : size === "md"
                ? "w-12 h-12"
                : "w-16 h-16"
            } text-white`}
          />
        </motion.div>
      </motion.div>

      {/* Loading Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <p
          className={`${textSizes[size]} font-medium`}
          style={{ color: colors.text.primary }}
        >
          {message}
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getAccentColor() }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
