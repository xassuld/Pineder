import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Input } from "../../../design/system/input";
import { Label } from "../../../design/system/label";

interface TeamsChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    name: string;
    email?: string;
    teamsId?: string;
    expertise?: string[];
  };
  session?: {
    title: string;
    date: string;
    time: string;
  };
}

export default function TeamsChatModal({
  isOpen,
  onClose,
  mentor,
  session,
}: TeamsChatModalProps) {
  const [message, setMessage] = useState("");

  const handleTeamsChat = () => {
    let teamsUrl = "";

    if (mentor.teamsId) {
      // Direct Teams user ID link
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.teamsId}`;
    } else if (mentor.email) {
      // Email-based Teams chat
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.email}`;
    } else {
      // Fallback: Open Teams app or web version
      teamsUrl = "https://teams.microsoft.com/";
    }

    window.open(teamsUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl"
        >
          {/* Header */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Teams Chat</h2>
                <p className="mt-1 text-sm text-blue-100">
                  {mentor.name} - {mentor.expertise?.join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-2 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message Input */}
            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Мессеж (optional)
              </Label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Таны асуулт эсвэл санал..."
                className="w-full"
              />
            </div>

            {/* Action Button */}
            <Button
              onClick={handleTeamsChat}
              className="w-full py-3 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Teams дээр нээх
            </Button>

            {/* Info */}
            <div className="p-3 text-xs text-center text-gray-500 rounded-lg bg-gray-50">
              <p>Microsoft Teams app эсвэл web version дээр холбогдоно</p>
              <p className="mt-1">
                {mentor.email
                  ? `Email: ${mentor.email}`
                  : "Teams дээр хайж олно уу"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
