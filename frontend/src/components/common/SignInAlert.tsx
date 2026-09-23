import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "../../design/system/button";
import { useTheme } from "../../core/contexts/ThemeContext";

interface SignInAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const SignInAlert: React.FC<SignInAlertProps> = ({
  isOpen,
  onClose,
  title = "Sign In Required",
  message = "Please sign in to access this page and unlock all features.",
}) => {
  const { colors, isDarkMode } = useTheme();

  if (!isOpen) return null;

  const handleSignIn = () => {
    window.location.href = "/auth/sign-in";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md p-6 shadow-2xl rounded-2xl"
        style={{
          backgroundColor: colors?.background?.card || "#ffffff",
          border: `2px solid ${colors?.accent?.primary || "#08CB00"}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div
            className="p-3 rounded-full"
            style={{
              backgroundColor: `${colors?.accent?.primary || "#08CB00"}20`,
            }}
          >
            <AlertCircle
              className="w-8 h-8"
              style={{ color: colors?.accent?.primary || "#08CB00" }}
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className="mb-2 text-xl font-bold text-center"
          style={{ color: colors?.text?.primary || "#111827" }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          className="mb-6 text-sm text-center"
          style={{ color: colors?.text?.secondary || "#6b7280" }}
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSignIn}
            className="w-full py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: colors?.accent?.primary || "#08CB00",
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full py-3 font-semibold transition-all duration-300 hover:scale-105"
            style={{
              borderColor: colors?.border?.primary || "#d1d5db",
              color: colors?.text?.secondary || "#6b7280",
            }}
          >
            Maybe Later
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
