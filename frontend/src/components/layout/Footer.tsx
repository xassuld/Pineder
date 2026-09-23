import { motion } from "framer-motion";
import { Button } from "../../design/system/button";
import { Separator } from "../../design/system/separator";
import { Badge } from "../../design/system/badge";
import { Input } from "../../design/system/input";
import { Card, CardContent } from "../../design/system/card";
import {
  Sprout,
  Github,
  Heart,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../core/contexts/ThemeContext";
import { cn } from "../../design/system/utils";

export function Footer() {
  const { isDarkMode, colors, getAccentColor } = useTheme();

  return (
    <footer
      className="transition-colors duration-200 border-t"
      style={{
        backgroundColor: colors.background.primary,
        borderTopColor: colors.border.primary,
      }}
    >
      {/* Top Row - Logo and Social Icons */}
      <div
        className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 transition-all duration-300"
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor()}, ${getAccentColor()})`,
                }}
              >
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span
                className="text-xl font-bold font-outfit"
                style={{ color: colors.text.primary }}
              >
                Pineder
              </span>
            </Link>
          </motion.div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <motion.a
              href="https://github.com/pineder"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-all duration-200 rounded-full hover:bg-opacity-10"
              style={{
                color: colors.text.secondary,
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Github className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://twitter.com/pineder"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-all duration-200 rounded-full hover:bg-opacity-10"
              style={{
                color: colors.text.secondary,
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://linkedin.com/company/pineder"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-all duration-200 rounded-full hover:bg-opacity-10"
              style={{
                color: colors.text.secondary,
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://instagram.com/pineder"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-all duration-200 rounded-full hover:bg-opacity-10"
              style={{
                color: colors.text.secondary,
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Instagram className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://youtube.com/@pineder"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-all duration-200 rounded-full hover:bg-opacity-10"
              style={{
                color: colors.text.secondary,
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Youtube className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Compact Text Only */}
      <div
        className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="text-center">
            <p
              className={`text-sm ${colors.text.muted} transition-colors duration-200`}
            >
              © 2025 Pineder. All rights reserved.
            </p>
          </div>
          <div className="text-center">
            <p
              className={`text-sm ${colors.text.muted} transition-colors duration-200`}
            >
              Made with <Heart className="inline w-4 h-4 mx-1 text-red-500" />{" "}
              by Pineder Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
