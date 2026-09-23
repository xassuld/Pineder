import { useState, useEffect } from "react";
import {
  Plus,
  BookOpen,
  Lightbulb,
  Target,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import * as Dialog from "@radix-ui/react-dialog";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { motion } from "framer-motion";

interface TopicSubmissionFormProps {
  onSubmit: (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TopicSubmissionForm({
  onSubmit,
  isOpen,
  onClose,
}: TopicSubmissionFormProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    type: "error" | "success" | "info";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const categories = [
    "Backend Development",
    "Frontend Development",
    "Full-Stack Development",
    "UI Design",
    "UX Design",
  ];

  const showAlert = (
    type: "error" | "success" | "info",
    title: string,
    message: string
  ) => {
    setAlertDialog({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle keyboard escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation with user feedback
    if (!topic.trim()) {
      showAlert("error", "Topic Required", "Please enter a topic title");
      return;
    }

    if (!description.trim()) {
      showAlert("error", "Description Required", "Please enter a description");
      return;
    }

    if (!category) {
      showAlert("error", "Category Required", "Please select a category");
      return;
    }

    // Validate user is logged in
    if (!user?.id) {
      showAlert("error", "Login Required", "Please log in to submit a topic");
      return;
    }

    // Debug user info
    console.log("User object:", user);
    console.log("User imageUrl:", user?.imageUrl);
    console.log("User profileImage:", (user as any)?.profileImage);
    console.log("User fullName:", user?.fullName);
    console.log("User firstName:", user?.firstName);
    console.log("User publicMetadata:", user?.publicMetadata);

    const newTopic = {
      studentId: user.id,
      studentName: user?.fullName || user?.firstName || "Current Student",
      studentImage:
        user?.imageUrl ||
        (user as any)?.profileImage ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      topic: topic.trim(),
      description: description.trim(),
      category,
      email: user?.primaryEmailAddress?.emailAddress || "",
    };

    console.log("Submitting new topic:", newTopic);

    try {
      onSubmit(newTopic);

      // Reset form
      setTopic("");
      setDescription("");
      setCategory("");

      // Close modal
      onClose();

      // Show success message
      showAlert("success", "Success!", "Topic submitted successfully! 🎉");
    } catch (error) {
      console.error("Error submitting topic:", error);
      showAlert(
        "error",
        "Submission Failed",
        "Failed to submit topic. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-md overflow-hidden border shadow-2xl rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="border-b p-6"
          style={{
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-600">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2
                className="text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Suggest a Learning Topic
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="h-8 w-8 p-0 hover:bg-opacity-10 rounded-full"
              style={{
                color: colors.text.primary,
                backgroundColor: "transparent",
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={submitForm} className="space-y-6">
            {/* Topic Title */}
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                What do you want to learn? *
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React Performance Optimization"
                className="w-full px-4 py-3 border-2 rounded-2xl transition-all duration-200 focus:ring-2 focus:ring-green-600 focus:ring-opacity-20"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  pointerEvents: "auto",
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Tell us more *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning goals..."
                rows={4}
                className="w-full px-4 py-3 border-2 rounded-2xl transition-all duration-200 focus:ring-2 focus:ring-opacity-20 resize-none"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  pointerEvents: "auto",
                }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-2xl transition-all duration-200 focus:ring-2 focus:ring-opacity-20 appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  pointerEvents: "auto",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 h-12 border-2 rounded-2xl transition-all duration-200 hover:scale-105 font-semibold"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-semibold bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Topic
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Dialog */}
      <Dialog.Root open={alertDialog.isOpen} onOpenChange={closeAlert}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[10001]" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 z-[10002]"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
              border: "1px solid",
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              {alertDialog.type === "error" && (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              {alertDialog.type === "success" && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              {alertDialog.type === "info" && (
                <AlertCircle className="w-6 h-6 text-blue-500" />
              )}
              <Dialog.Title
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {alertDialog.title}
              </Dialog.Title>
            </div>

            <Dialog.Description
              className="mb-6"
              style={{ color: colors.text.secondary }}
            >
              {alertDialog.message}
            </Dialog.Description>

            <div className="flex justify-end">
              <Dialog.Close asChild>
                <Button
                  variant={
                    alertDialog.type === "error" ? "destructive" : "default"
                  }
                  onClick={closeAlert}
                >
                  OK
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
