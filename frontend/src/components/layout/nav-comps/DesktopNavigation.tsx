"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../../../design/system/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../design/system/dropdown-menu";
import {
  ChevronDown,
  Calendar,
  Users,
  BookOpen,
  Gift,
  IceCream,
  Coffee,
  User,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
  isDarkMode: boolean;
  isMentorNavigation?: boolean;
}

export function DesktopNavigation({
  navigationItems,
  isDarkMode,
  isMentorNavigation = false,
}: DesktopNavigationProps) {
  const { colors } = useTheme();

  const renderNavigationItem = (item: NavigationItem) => {
    if (item.id === "community") {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 text-lg font-medium transition-all duration-300 border-0 cursor-pointer font-outfit focus:outline-none focus:ring-0 hover:scale-105"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <span>{item.name}</span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="border-0 shadow-2xl w-72 focus:outline-none focus:ring-0"
            style={{
              backgroundColor: isDarkMode ? "#000000" : "#ffffff",
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "none",
              outline: "none",
            }}
          >
            <DropdownMenuItem
              asChild
              className="border-0 focus:outline-none focus:ring-0"
              style={{ border: "none", outline: "none" }}
            >
              <Link
                href="/community/events"
                className="flex items-center px-4 py-3 space-x-2 text-base transition-all duration-300 transform border-0 cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                style={{
                  color: colors.text.primary,
                  border: "none",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-base">Events</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="border-0 focus:outline-none focus:ring-0 "
            >
              <Link
                href="/community/communities"
                className="flex items-center px-4 py-3 space-x-2 text-base transition-all duration-300 transform border-0 cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <Users className="w-5 h-5" />
                <span className="text-base">Communities</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.id === "sessions" && !isMentorNavigation) {
      return (
        <Link key={item.id} href={item.href}>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-lg font-medium transition-all duration-300 border-0 cursor-pointer font-outfit focus:outline-none focus:ring-0 hover:scale-105"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <span>{item.name}</span>
            </Button>
          </motion.div>
        </Link>
      );
    }

    if (item.id === "pricing") {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 text-lg font-medium transition-all duration-300 border-0 cursor-pointer font-outfit focus:outline-none focus:ring-0 hover:scale-105"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <span>{item.name}</span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="border-0 shadow-2xl w-72 focus:outline-none focus:ring-0"
            style={{
              backgroundColor: isDarkMode ? "#000000" : "#ffffff",
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "none",
              outline: "none",
            }}
          >
            <DropdownMenuItem
              asChild
              className="border-0 focus:outline-none focus:ring-0 "
            >
              <Link
                href="/#pricing"
                className="flex items-center px-4 py-3 space-x-3 text-base transition-all duration-300 transform border-0 cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{
                    backgroundColor: colors.background.primary,
                  }}
                >
                  <Gift
                    className="w-5 h-5"
                    style={{ color: colors.accent.primary }}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-base font-bold font-space-grotesk"
                    style={{ color: colors.accent.primary }}
                  >
                    Free
                  </span>
                  <span
                    className="text-sm font-inter"
                    style={{ color: colors.text.secondary }}
                  >
                    No cost, pure learning
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="border-0 focus:outline-none focus:ring-0 "
            >
              <Link
                href="/#pricing"
                className="flex items-center px-4 py-3 space-x-3 text-base transition-all duration-300 transform border-0 cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{
                    backgroundColor: colors.background.primary,
                  }}
                >
                  <IceCream
                    className="w-6 h-6"
                    style={{ color: colors.text.primary }}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-base font-bold font-space-grotesk"
                    style={{ color: colors.text.primary }}
                  >
                    Ice Cream
                  </span>
                  <span
                    className="text-sm font-inter"
                    style={{ color: colors.text.secondary }}
                  >
                    Sweet learning experience
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="border-0 focus:outline-none focus:ring-0 "
            >
              <Link
                href="/#pricing"
                className="flex items-center px-4 py-3 space-x-3 text-base transition-all duration-300 transform border-0 cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                style={{ color: colors.text.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{
                    backgroundColor: colors.background.primary,
                  }}
                >
                  <Coffee
                    className="w-6 h-6"
                    style={{ color: colors.text.primary }}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-base font-bold font-space-grotesk"
                    style={{ color: colors.text.primary }}
                  >
                    Coffee
                  </span>
                  <span
                    className="text-sm font-inter"
                    style={{ color: colors.text.secondary }}
                  >
                    Energizing learning boost
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <motion.div
        key={item.id}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href={item.href}
          className="inline-block text-lg font-medium transition-all duration-300 transform border-0 cursor-pointer font-outfit hover:scale-105 focus:scale-105 focus:outline-none focus:ring-0"
          style={{ color: colors.text.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          {item.name}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-8">
      {navigationItems.map(renderNavigationItem)}
    </div>
  );
}
