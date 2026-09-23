import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  Target,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../design/system/alert-dialog";
import { AnswerModal } from "./AnswerModal";
import { ViewAllAnswersModal } from "./ViewAllAnswersModal";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicCardProps {
  topic: TopicSubmission;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  userVote: "upvote" | "downvote" | null;
  onVote: (topicId: string, voteType: "upvote" | "downvote") => void;
  onEdit?: (topic: TopicSubmission) => void;
  onDelete?: (topicId: string) => void;
  getMentorImage: (id: string) => string;
  responseCount: number;
  isTopVoted?: boolean;
}

// Helper function to calculate time ago
const getTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  upvotes,
  downvotes,
  totalVotes,
  userVote,
  onVote,
  onEdit,
  onDelete,
  getMentorImage,
  responseCount,
  isTopVoted = false,
}) => {
  const { user } = useUser();
  const { colors, isDarkMode } = useTheme();
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [answers, setAnswers] = useState<
    Array<{
      id: string;
      content: string;
      authorName: string;
      authorImage?: string;
      createdAt: string;
      upvotes: number;
      downvotes: number;
      userVote?: "upvote" | "downvote" | null;
      replies?: Array<{
        id: string;
        content: string;
        authorName: string;
        authorImage?: string;
        createdAt: string;
        upvotes: number;
        downvotes: number;
        userVote?: "upvote" | "downvote" | null;
      }>;
    }>
  >([]);

  const handleVote = (topicId: string, voteType: "upvote" | "downvote") => {
    console.log("Voting on topic:", topicId, "with vote:", voteType);
    onVote(topicId, voteType);
  };

  const handleAnswerSubmit = async (answer: string) => {
    // In real app, this would send the answer to an API
    console.log("TopicCard: Submitting answer:", answer);
    console.log("TopicCard: Current user:", user);

    // Create new answer object
    const newAnswer = {
      id: Date.now().toString(),
      content: answer,
      authorName: user?.fullName || user?.firstName || "Anonymous User",
      authorImage: user?.imageUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    console.log("TopicCard: Created new answer:", newAnswer);

    // Add answer to local state
    setAnswers((prev) => {
      const updated = [...prev, newAnswer];
      console.log("TopicCard: Updated answers array:", updated);
      return updated;
    });

    console.log("TopicCard: Answer submitted for topic:", topic.id);
  };

  const handleReplySubmit = async (answerId: string, replyContent: string) => {
    console.log("Submitting reply to answer:", answerId, replyContent);

    // Create new reply object
    const newReply = {
      id: Date.now().toString(),
      content: replyContent,
      authorName: user?.fullName || user?.firstName || "Anonymous User",
      authorImage: user?.imageUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };

    // Add reply to the specific answer
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === answerId
          ? { ...answer, replies: [...(answer.replies || []), newReply] }
          : answer
      )
    );

    console.log("Reply submitted for answer:", answerId);
  };

  const handleVoteAnswer = (
    answerId: string,
    voteType: "upvote" | "downvote"
  ) => {
    console.log("Voting on answer:", answerId, "vote:", voteType);

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        // Check if user already voted
        if (answer.userVote === voteType) {
          // User is clicking the same vote again - remove the vote
          return {
            ...answer,
            upvotes:
              voteType === "upvote" ? answer.upvotes - 1 : answer.upvotes,
            downvotes:
              voteType === "downvote" ? answer.downvotes - 1 : answer.downvotes,
            userVote: null,
          };
        } else if (answer.userVote) {
          // User is changing their vote
          const oldVote = answer.userVote;
          return {
            ...answer,
            upvotes:
              answer.upvotes +
              (voteType === "upvote" ? 1 : -1) +
              (oldVote === "upvote" ? -1 : 0),
            downvotes:
              answer.downvotes +
              (voteType === "downvote" ? 1 : -1) +
              (oldVote === "downvote" ? -1 : 0),
            userVote: voteType,
          };
        } else {
          // User is voting for the first time
          return {
            ...answer,
            upvotes:
              voteType === "upvote" ? answer.upvotes + 1 : answer.upvotes,
            downvotes:
              voteType === "downvote" ? answer.downvotes + 1 : answer.downvotes,
            userVote: voteType,
          };
        }
      })
    );
  };

  const handleVoteReply = (
    answerId: string,
    replyId: string,
    voteType: "upvote" | "downvote"
  ) => {
    console.log("Voting on reply:", replyId, "vote:", voteType);

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        return {
          ...answer,
          replies:
            answer.replies?.map((reply) => {
              if (reply.id !== replyId) return reply;

              // Check if user already voted
              if (reply.userVote === voteType) {
                // User is clicking the same vote again - remove the vote
                return {
                  ...reply,
                  upvotes:
                    voteType === "upvote" ? reply.upvotes - 1 : reply.upvotes,
                  downvotes:
                    voteType === "downvote"
                      ? reply.downvotes - 1
                      : reply.downvotes,
                  userVote: null,
                };
              } else if (reply.userVote) {
                // User is changing their vote
                const oldVote = reply.userVote;
                return {
                  ...reply,
                  upvotes:
                    reply.upvotes +
                    (voteType === "upvote" ? 1 : -1) +
                    (oldVote === "upvote" ? -1 : 0),
                  downvotes:
                    reply.downvotes +
                    (voteType === "downvote" ? 1 : -1) +
                    (oldVote === "downvote" ? -1 : 0),
                  userVote: voteType,
                };
              } else {
                // User is voting for the first time
                return {
                  ...reply,
                  upvotes:
                    voteType === "upvote" ? reply.upvotes + 1 : reply.upvotes,
                  downvotes:
                    voteType === "downvote"
                      ? reply.downvotes + 1
                      : reply.downvotes,
                  userVote: voteType,
                };
              }
            }) || [],
        };
      })
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div
        className={`border rounded-2xl transition-all duration-300 overflow-hidden relative ${
          isTopVoted
            ? "border-2 shadow-xl"
            : isDarkMode
            ? "shadow-sm hover:shadow-md shadow-gray-800/20"
            : "shadow-lg hover:shadow-xl"
        }`}
        style={{
          backgroundColor: colors.background.card,
          borderColor: isTopVoted
            ? isDarkMode
              ? "#6b7280" // Same gray border as other cards in dark mode
              : colors.border.primary // Same border as other cards in light mode
            : isDarkMode
            ? "#6b7280" // Lighter gray border in dark mode
            : colors.border.primary,
        }}
      >
        {/* Top Voted Badge - Only for top voted topic */}
        {/* Removed the TOP badge - keeping only the blue border for distinction */}

        <div className="p-8 sm:p-10">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-6">
            {/* Category Badge */}
            <span
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border ${
                isDarkMode
                  ? "bg-transparent text-green-600 border-gray-600"
                  : "bg-transparent text-green-600 border-gray-300"
              }`}
            >
              📚 {topic.category}
            </span>

            {/* Action Buttons - Only show for topic creator */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(topic)}
                  className="p-1.5 sm:p-2 text-green-600 hover:text-green-700 hover:bg-green-600/10 rounded-lg transition-all duration-200"
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              )}

              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-0 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md mx-4">
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTitle className="text-xl font-bold text-gray-900 mb-3 sm:text-2xl">
                        Delete Topic
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
                        Are you sure you want to delete &quot;{topic.topic}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                      <AlertDialogCancel className="flex-1 px-6 py-3 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border-0 transition-all duration-300 hover:scale-105">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(topic.id)}
                        className="flex-1 px-6 py-3 rounded-2xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/30 border-2 border-green-600 transition-all duration-300 hover:scale-105 transform"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Topic Title */}
          <h3
            className="text-lg sm:text-xl font-bold mb-6 leading-tight"
            style={{ color: colors.text.primary }}
          >
            {topic.topic}
          </h3>

          {/* Student Request Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src={topic.studentImage || getMentorImage(topic.id)}
                alt={`${topic.studentName}'s profile`}
                width={32}
                height={32}
                className="rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  Student Request • {getTimeAgo(topic.submittedAt)}
                </p>
              </div>
            </div>

            {/* Vote Count */}
            <div className="text-center">
              <div
                className="text-sm sm:text-lg font-bold"
                style={{ color: colors.text.primary }}
              >
                {totalVotes}
              </div>
              <div
                className="text-xs sm:text-sm"
                style={{ color: colors.text.secondary }}
              >
                votes
              </div>
            </div>
          </div>

          {/* Topic Description */}
          <div className="mb-6">
            <p
              className="text-sm sm:text-base leading-relaxed p-5 sm:p-6 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                color: colors.text.secondary,
                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
              }}
            >
              {topic.description || "No description provided yet"}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote(topic.id, "upvote")}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                  userVote === "upvote"
                    ? isDarkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-600"
                }`}
              >
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-base">{upvotes}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote(topic.id, "downvote")}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                  userVote === "downvote"
                    ? isDarkMode
                      ? "bg-red-800 text-red-100"
                      : "bg-red-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700 hover:bg-red-800 text-gray-300 hover:text-red-100"
                    : "bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600"
                }`}
              >
                <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-base">{downvotes}</span>
              </motion.button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* View All Replies Button */}
              <Button
                onClick={() => setIsViewAllModalOpen(true)}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">View</span>
                <span className="ml-1">({answers.length})</span>
              </Button>

              {/* Reply Button */}
              <Button
                onClick={() => setIsAnswerModalOpen(true)}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Modal */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        topicTitle={topic.topic}
        studentName={topic.studentName}
        onAnswerSubmit={handleAnswerSubmit}
        onReplySubmit={handleReplySubmit}
        onVoteAnswer={handleVoteAnswer}
        onVoteReply={handleVoteReply}
        existingAnswers={answers}
      />

      {/* View All Answers Modal */}
      <ViewAllAnswersModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        topicTitle={topic.topic}
        studentName={topic.studentName}
        answers={answers}
        onVoteAnswer={handleVoteAnswer}
      />
    </motion.div>
  );
};
