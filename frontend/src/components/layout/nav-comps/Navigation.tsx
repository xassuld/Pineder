"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";
import { useUserProfile } from "../../../core/hooks/useUserProfile";
import UserSidebar from "../UserSidebar";
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { RightSideControls } from "./RightSideControls";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";
import { Sprout } from "lucide-react";
interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { colorTheme, toggleTheme, setColorTheme, isDarkMode, colors } =
    useTheme();
  const { userRole } = useEmailRouting();
  const { profile } = useUserProfile();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const mentorNavigationItems: NavigationItem[] = [
    {
      id: "sessions",
      name: "Session",
      href: "/mentor/sessions",
    },
    {
      id: "group-sessions",
      name: "Group Sessions",
      href: "/mentor/group-sessions",
    },
    { id: "availability", name: "Availability", href: "/mentor/availability" },
    { id: "students", name: "Students", href: "/mentor/students" },
    { id: "events", name: "Events", href: "/mentor/events" },
  ];

  const navigationItems: NavigationItem[] = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Session", href: "/sessions" },
    { id: "community", name: "Community", href: "/community/communities" },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

  const signedInNavigationItems: NavigationItem[] = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Session", href: "/sessions" },
    { id: "community", name: "Community", href: "/community/communities" },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

  const currentNavigationItems = isSignedIn
    ? userRole === "mentor"
      ? mentorNavigationItems
      : signedInNavigationItems
    : navigationItems;

  // Use default colors during SSR to prevent hydration mismatch
  const defaultColors = {
    background: {
      primary: "#ffffff",
    },
    border: {
      primary: "#dee2e6",
    },
  };

  const currentColors = mounted ? colors : defaultColors;

  // Don't render navigation items until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav
        className="sticky top-0 z-50 w-full transition-all duration-300 border-b"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="hidden md:block">
              {/* Placeholder for navigation items */}
            </div>
            <div className="flex items-center space-x-4">
              {/* Placeholder for right side controls */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: currentColors.background.primary,
        borderBottom: `1px solid ${currentColors.border.primary}`,
      }}
    >
      {/* Single Unified Navigation Bar */}
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
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
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary})`,
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
          {/* Center - Main Navigation Items (Hidden on mobile) */}
          <div className="hidden md:block">
            <DesktopNavigation
              navigationItems={currentNavigationItems}
              isDarkMode={isDarkMode}
              isMentorNavigation={userRole === "mentor"}
            />
          </div>

          {/* Right Side - Theme Toggle, User Menu, and Mobile Menu Button */}
          <RightSideControls
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setIsUserSidebarOpen={setIsUserSidebarOpen}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setIsUserSidebarOpen={setIsUserSidebarOpen}
        navigationItems={currentNavigationItems}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
      />

      {/* User Sidebar */}
      {isSignedIn && (
        <UserSidebar
          isOpen={isUserSidebarOpen}
          onClose={() => setIsUserSidebarOpen(false)}
          user={{
            name: user?.fullName || user?.firstName || "User",
            email: user?.emailAddresses[0]?.emailAddress || "",
            role: userRole as "student" | "mentor" | "admin",
            avatar: profile?.avatar || user?.imageUrl || "", // Use uploaded avatar first, fallback to Clerk
            initials:
              user?.firstName?.charAt(0) ||
              user?.emailAddresses[0]?.emailAddress.charAt(0) ||
              "U",
          }}
        />
      )}
    </motion.nav>
  );
}
