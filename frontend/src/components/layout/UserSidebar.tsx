import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../design/system/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../design/system/avatar";
import { Badge } from "../../design/system/badge";
import { Input } from "../../design/system/input";
import { Label } from "../../design/system/label";
import { Lock, LogOut, Edit, X, ChevronRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "../../core/contexts/ThemeContext";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    role: "student" | "mentor" | "admin";
    avatar?: string;
    initials: string;
  };
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user: clerkUser } = useUser();

  // Local close handler
  const handleClose = () => {
    onClose();
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditProfile = () => {
    // Route to appropriate profile page based on user role
    if (user.role === "mentor") {
      router.push("/profile/mentor");
    } else if (user.role === "student") {
      router.push("/profile/student");
    } else {
      router.push("/profile/student");
    }
    onClose(); // Close sidebar after navigation
  };

  const handleSignOut = () => {
    // Close sidebar before sign out
    onClose();
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (!clerkUser) {
      alert("User not authenticated!");
      return;
    }

    try {
      // Use Clerk's password change API
      await clerkUser.updatePassword({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.oldPassword,
      });

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close dialog
      setShowPassword(false);

      alert("Password changed successfully!");
    } catch (error: any) {
      // Handle specific Clerk errors
      if (error.errors && error.errors.length > 0) {
        const errorMessage = error.errors[0].message;
        alert(`Failed to change password: ${errorMessage}`);
      } else {
        alert("Failed to change password. Please try again.");
      }
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    const baseStyle = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (role) {
      case "mentor":
        return `${baseStyle} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case "admin":
        return `${baseStyle} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="sidebar-container">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
          />

          {/* Sidebar */}
          <motion.div
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full shadow-xl w-80"
            style={{
              backgroundColor: colors.background.primary,
              borderLeft: `1px solid ${colors.border.primary}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: colors.border.primary }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                User Menu
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}
                className="hover:bg-accent"
                style={{
                  color: colors.text.primary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            <div
              className="p-6 border-b"
              style={{ borderColor: colors.border.primary }}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback
                    className="text-lg font-semibold"
                    style={{
                      backgroundColor: colors.accent.primary,
                      color: colors.text.inverse,
                    }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {user.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {user.email}
                  </p>
                  <Badge className={getRoleBadgeStyle(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2">
              {/* Edit Profile */}
              <Button
                variant="ghost"
                className="justify-start w-full h-12 text-left"
                onClick={handleEditProfile}
                style={{
                  color: colors.text.primary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Edit className="w-5 h-5 mr-3 text-blue-600" />
                <span>Edit Profile</span>
                <ChevronRight
                  className="w-4 h-4 ml-auto"
                  style={{ color: colors.text.secondary }}
                />
              </Button>

              {/* Change Password */}
              <Button
                variant="ghost"
                className="justify-start w-full h-12 text-left"
                onClick={() => setShowPassword(true)}
                style={{
                  color: colors.text.primary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Lock className="w-5 h-5 mr-3 text-orange-600" />
                <span>Change Password</span>
                <ChevronRight
                  className="w-4 h-4 ml-auto"
                  style={{ color: colors.text.secondary }}
                />
              </Button>

              {/* Sign Out */}
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="justify-start w-full h-12 text-left"
                  onClick={handleSignOut}
                  style={{
                    color: "#dc2626",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </Button>
              </SignOutButton>
            </div>

            {/* Footer */}
            <div
              className="absolute bottom-0 left-0 right-0 p-6 border-t"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: colors.background.secondary,
              }}
            >
              <div className="text-center">
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  Pineder Platform v1.0
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Change Dialog */}
      <AnimatePresence key="password-dialog">
        {showPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPassword(false)}
          >
            {/* Enhanced Background with Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute rounded-full -top-40 -right-40 w-80 h-80 blur-3xl animate-pulse"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.accent.primary}20, ${colors.accent.secondary}20)`,
                }}
              ></div>
              <div
                className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 blur-3xl animate-pulse"
                style={{
                  background: `linear-gradient(to top right, ${colors.accent.success}20, ${colors.accent.info}20)`,
                  animationDelay: "1s",
                }}
              ></div>
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 blur-3xl animate-pulse"
                style={{
                  background: `linear-gradient(to right, ${colors.accent.primary}10, ${colors.accent.secondary}10)`,
                  animationDelay: "2s",
                }}
              ></div>

              {/* Floating particles */}
              <div
                className="absolute w-4 h-4 rounded-full top-20 left-20 animate-bounce"
                style={{
                  backgroundColor: `${colors.accent.primary}30`,
                  animationDelay: "0.5s",
                }}
              ></div>
              <div
                className="absolute w-3 h-3 rounded-full top-40 right-32 animate-bounce"
                style={{
                  backgroundColor: `${colors.accent.secondary}40`,
                  animationDelay: "1.5s",
                }}
              ></div>
              <div
                className="absolute w-5 h-5 rounded-full bottom-32 left-32 animate-bounce"
                style={{
                  backgroundColor: `${colors.accent.primary}30`,
                  animationDelay: "0.8s",
                }}
              ></div>
              <div
                className="absolute w-2 h-2 rounded-full bottom-20 right-20 animate-bounce"
                style={{
                  backgroundColor: `${colors.accent.success}50`,
                  animationDelay: "2.2s",
                }}
              ></div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20, rotateX: -15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden transition-all duration-200 border shadow-2xl rounded-3xl backdrop-blur-xl perspective-1000"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.background.modal,
                borderColor: colors.border.primary,
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Enhanced Header with Green Gradient */}
              <div
                className="relative p-6 border-b"
                style={{
                  background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.tertiary})`,
                  borderColor: colors.border.primary,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `${colors.accent.success}05` }}
                ></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: colors.accent.success }}
                    >
                      Change Password
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(false)}
                    className="w-10 h-10 p-0 transition-all duration-200 rounded-full hover:scale-110"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.text.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="oldPassword"
                    className="flex items-center space-x-2 text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <span>Current Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      className="h-12 transition-all duration-200 border-2 rounded-xl backdrop-blur-sm"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.card,
                        color: colors.text.primary,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute w-8 h-8 transition-all duration-200 transform -translate-y-1/2 rounded-lg right-2 top-1/2"
                      style={{
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.background.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4 text-green-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="newPassword"
                    className="flex items-center space-x-2 text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <span>New Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="h-12 transition-all duration-200 border-2 rounded-xl backdrop-blur-sm"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.card,
                        color: colors.text.primary,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute w-8 h-8 transition-all duration-200 transform -translate-y-1/2 rounded-lg right-2 top-1/2"
                      style={{
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.background.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-green-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center space-x-2 text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <span>Confirm New Password</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="h-12 transition-all duration-200 border-2 rounded-xl backdrop-blur-sm"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.card,
                        color: colors.text.primary,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute w-8 h-8 transition-all duration-200 transform -translate-y-1/2 rounded-lg right-2 top-1/2"
                      style={{
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.background.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-green-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Actions */}
              <div
                className="p-6 border-t rounded-b-3xl"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.secondary,
                }}
              >
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword(false)}
                    className="flex-1 h-12 font-medium transition-all duration-200 border-2 rounded-xl"
                    style={{
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                      backgroundColor: "transparent",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={changePassword}
                    className="flex-1 h-12 font-medium text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default UserSidebar;
