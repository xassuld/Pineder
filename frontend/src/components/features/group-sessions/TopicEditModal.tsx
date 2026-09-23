import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Edit3 } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Input } from "../../../design/system/input";
import { Label } from "../../../design/system/label";
import { Textarea } from "../../../design/system/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../design/system/select";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";

interface TopicEditModalProps {
  topic: TopicSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTopic: TopicSubmission) => void;
}

export function TopicEditModal({
  topic,
  isOpen,
  onClose,
  onSave,
}: TopicEditModalProps) {
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (topic) {
      setFormData({
        topic: topic.topic,
        description: topic.description,
        category: topic.category,
      });
    }
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic) return;

    const updatedTopic: TopicSubmission = {
      ...topic,
      ...formData,
    };

    onSave(updatedTopic);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen || !topic) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Edit3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Topic</h2>
              <p className="text-gray-600">
                Update your learning topic details
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic Title */}
          <div className="space-y-2">
            <Label
              htmlFor="topic"
              className="text-sm font-semibold text-gray-700"
            >
              Topic Title *
            </Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              placeholder="Enter topic title"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what you want to learn"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700"
            >
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Backend Development">
                  Backend Development
                </SelectItem>
                <SelectItem value="Full-Stack Development">
                  Full-Stack Development
                </SelectItem>
                <SelectItem value="UI Design">UI Design</SelectItem>
                <SelectItem value="UX Design">UX Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
