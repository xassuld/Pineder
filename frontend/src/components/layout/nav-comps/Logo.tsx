"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

export function Logo() {
  const { colors, getAccentColor } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="ml-8"
    >
      <Link
        href="/"
        className="flex items-center space-x-2 transition-all duration-300"
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ backgroundColor: getAccentColor() }}
        >
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <span
          className="text-xl font-bold font-outfit"
          style={{ color: colors.text.primary }}
        >
          PINEDER
        </span>
      </Link>
    </motion.div>
  );
}
