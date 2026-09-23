"use client";

import { Button } from "../../../design/system/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../../../design/system/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Sun, Moon, X, Menu, ChevronDown } from "lucide-react";
import { useTheme, ColorTheme } from "../../../core/contexts/ThemeContext";
import { useUserProfile } from "../../../core/hooks/useUserProfile";

interface RightSideControlsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setIsUserSidebarOpen: (open: boolean) => void;
}

export function RightSideControls({
  isDarkMode,
  toggleTheme,
  colorTheme,
  setColorTheme,
  menuOpen,
  setMenuOpen,
  setIsUserSidebarOpen,
}: RightSideControlsProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { colors } = useTheme();
  const { profile } = useUserProfile();

  return (
    <div className="flex items-center space-x-4">
      {/* Theme Toggle Button - Visible on tablet and desktop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="items-center justify-center hidden w-10 h-10 p-0 transition-all duration-500 ease-in-out border rounded-full md:flex hover:scale-110"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.accent.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border.primary;
        }}
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          <Sun
            className={`w-5 h-5 absolute inset-0 m-auto transition-all duration-500 ${
              isDarkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
            style={{ color: colors.text.primary }}
          />
          <Moon
            className={`w-5 h-5 absolute inset-0 m-auto transition-all duration-500 ${
              isDarkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
            }`}
            style={{ color: colors.text.primary }}
          />
        </div>
      </Button>

      {/* User Menu - Visible on tablet and desktop */}
      {isLoaded && (
        <>
          {isSignedIn ? (
            <Button
              variant="ghost"
              size="icon"
              className="hidden w-8 h-8 p-0 transition-all duration-300 ease-in-out border rounded-lg md:flex hover:bg-gray-100"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              onClick={() => setIsUserSidebarOpen(true)}
            >
              <Avatar className="w-6 h-6">
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
            </Button>
          ) : (
            <div className="items-center hidden space-x-2 md:flex">
              <SignInButton mode="modal">
                <Button
                  className="font-medium transition-all duration-200 transform shadow-lg cursor-pointer hover:shadow-xl hover:scale-105"
                  style={{
                    background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
                    color: colors.text.inverse,
                  }}
                >
                  Get Started
                </Button>
              </SignInButton>
            </div>
          )}
        </>
      )}

      {/* Mobile Menu Toggle Button - Visible on mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-8 h-8 p-0 transition-all duration-300 ease-in-out border rounded-lg md:hidden"
        style={{
          color: colors.text.primary,
          borderColor: colors.border.primary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.accent.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border.primary;
        }}
      >
        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>
    </div>
  );
}
