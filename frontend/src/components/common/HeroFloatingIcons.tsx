import { motion } from "framer-motion";
import { Zap, Rocket } from "lucide-react";
import { useTheme } from "../../core/contexts/ThemeContext";

export const HeroFloatingIcons = () => {
  const { colors } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[
        { icon: Zap, x: "10%", y: "20%" },
        { icon: Rocket, x: "85%", y: "30%" },
      ].map((item, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            <item.icon
              className="w-8 h-8 opacity-20"
              style={{ color: colors.accent.primary }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
};
