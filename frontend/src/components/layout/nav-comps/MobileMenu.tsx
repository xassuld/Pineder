"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../../../design/system/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  X,
  Sun,
  Moon,
  Calendar,
  Users,
  BookOpen,
  Gift,
  IceCream,
  User,
  Coffee,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import type { ColorTheme } from "../../../core/contexts/ThemeContext";
import { useUserProfile } from "../../../core/hooks/useUserProfile";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setIsUserSidebarOpen: (open: boolean) => void;
  navigationItems: NavigationItem[];
  isDarkMode: boolean;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export function MobileMenu({
  menuOpen,
  setMenuOpen,
  setIsUserSidebarOpen,
  navigationItems,
  isDarkMode,
  toggleTheme,
  colorTheme,
  setColorTheme,
}: MobileMenuProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { colors } = useTheme();
  const { profile } = useUserProfile();

  const renderMobileNavigationItem = (item: NavigationItem) => {
    // Handle mentor-specific navigation items
    if (item.id === "dashboard" && item.href.includes("/mentor")) {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/mentor/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <BookOpen className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/mentor/group-sessions"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Users className="w-5 h-5" />
              <span>Group Sessions</span>
            </Link>
          </div>
        </div>
      );
    }

    if (item.id === "community") {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/community/events"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </Link>

            <Link
              href="/community/communities"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Users className="w-5 h-5" />
              <span>Communities</span>
            </Link>
          </div>
        </div>
      );
    }

    if (item.id === "sessions") {
      return (
        <Link
          key={item.id}
          href={item.href}
          onClick={() => setMenuOpen(false)}
          className="flex items-center space-x-2 text-lg font-medium transition-all duration-300 transform cursor-pointer font-outfit hover:scale-105 focus:outline-none"
          style={{ color: colors.text.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          <span>{item.name}</span>
        </Link>
      );
    }

    if (item.id === "pricing") {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Gift className="w-5 h-5" />
              <span>Free - No cost, pure learning</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <IceCream className="w-5 h-5" />
              <span>Ice Cream - Sweet learning experience</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Coffee className="w-5 h-5" />
              <span>Coffee - Energizing learning boost</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        className="block text-lg font-medium transition-all duration-300 transform font-outfit hover:text-accent-foreground hover:scale-105 focus:outline-none"
        style={{ color: colors.text.primary }}
      >
        {item.name}
      </Link>
    );
  };

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <div
        className="absolute right-0 top-0 h-full w-80 max-w-[90vw] shadow-2xl overflow-y-auto"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="h-full px-4 py-6 space-y-4">
          {/* Mobile Menu Header with Close Button */}
          <div
            className="flex items-center justify-between pb-4 border-b"
            style={{ borderColor: colors.border.primary }}
          >
            <h3
              className="text-lg font-semibold font-outfit"
              style={{ color: colors.text.primary }}
            >
              Menu
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 p-0 transition-all duration-300 ease-in-out border rounded-lg"
              style={{
                color: colors.text.primary,
                borderColor: colors.border.primary,
                backgroundColor: "transparent",
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile Section - Mobile */}
          {isSignedIn && (
            <div
              className="pb-4 border-b"
              style={{ borderColor: colors.border.primary }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={profile?.avatar || user?.imageUrl}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0) ||
                      user?.emailAddresses[0]?.emailAddress.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className="font-semibold font-outfit"
                    style={{ color: colors.text.primary }}
                  >
                    {user?.fullName || user?.firstName || "User"}
                  </div>
                  <div
                    className="text-sm font-inter"
                    style={{ color: colors.text.secondary }}
                  >
                    {user?.emailAddresses[0]?.emailAddress || ""}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  console.log("Profile button clicked, opening user sidebar");
                  setIsUserSidebarOpen(true);
                  setMenuOpen(false);
                  console.log("User sidebar should now be open");
                }}
                className="w-full justify-start text-lg"
                style={{ color: colors.text.primary }}
              >
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </Button>
            </div>
          )}

          {/* Mobile Navigation Items */}
          {navigationItems.map(renderMobileNavigationItem)}

          {/* Mobile Theme Options */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: colors.border.primary }}
          >
            <h4
              className="mb-3 text-lg font-medium font-outfit"
              style={{ color: colors.text.primary }}
            >
              Theme Options
            </h4>
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="justify-start w-full text-lg"
                style={{ color: colors.text.primary }}
              >
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>Switch to {isDarkMode ? "Light" : "Dark"} Mode</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
