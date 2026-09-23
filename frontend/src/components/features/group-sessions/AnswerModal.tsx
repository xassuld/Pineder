import React, { useState } from "react";
import { X, Send, User } from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";
import { Textarea } from "../../../design/system/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";

interface Answer {
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
}

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  studentName: string;
  onAnswerSubmit: (answer: string) => void;
  onReplySubmit?: (answerId: string, replyContent: string) => void;
  onVoteAnswer?: (answerId: string, voteType: "upvote" | "downvote") => void;
  onVoteReply?: (
    answerId: string,
    replyId: string,
    voteType: "upvote" | "downvote"
  ) => void;
  existingAnswers?: Answer[];
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  studentName,
  onAnswerSubmit,
  onReplySubmit,
  onVoteAnswer,
  onVoteReply,
  existingAnswers = [],
}) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      await onAnswerSubmit(answer.trim());
      setAnswer("");
      onClose();
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (answerId: string) => {
    if (!replyContent.trim() || !onReplySubmit) return;

    try {
      await onReplySubmit(answerId, replyContent.trim());
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  const startReply = (answerId: string) => {
    setReplyingTo(answerId);
    setReplyContent("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-xl bg-white rounded-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle>
            <div>
              <span className="text-2xl font-bold text-gray-900">
                Answer Question
              </span>
              <p className="text-sm text-gray-600 mt-1">Topic: {topicTitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Question Context */}
          <div className="bg-gradient-to-r from-green-50 to-indigo-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-green-800">
                {studentName}&apos;s Question
              </h4>
            </div>
            <p className="text-sm text-green-700 leading-relaxed">
              &ldquo;I&apos;m struggling with React performance optimization.
              Can someone explain how to use React.memo and useMemo effectively?
              I want to understand when and why to use them.&rdquo;
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Your Answer</h4>
            <Textarea
              placeholder="Share your knowledge and help this student understand the concept better..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Existing Answers */}
          {existingAnswers.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>Previous Answers ({existingAnswers.length})</span>
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {existingAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={answer.authorImage} />
                        <AvatarFallback className="bg-green-100 text-green-800 text-sm">
                          {answer.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {answer.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(answer.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {answer.content}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <button
                              onClick={() =>
                                onVoteAnswer?.(answer.id, "upvote")
                              }
                              className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                                answer.userVote === "upvote"
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-600 hover:text-green-600"
                              }`}
                            >
                              <span>👍</span>
                              <span>{answer.upvotes}</span>
                            </button>
                            <button
                              onClick={() =>
                                onVoteAnswer?.(answer.id, "downvote")
                              }
                              className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                                answer.userVote === "downvote"
                                  ? "text-red-600 font-semibold"
                                  : "text-gray-600 hover:text-red-600"
                              }`}
                            >
                              <span>👎</span>
                              <span>{answer.downvotes}</span>
                            </button>
                            <span className="text-xs text-gray-500 font-medium">
                              Score: {answer.upvotes - answer.downvotes}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startReply(answer.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === answer.id && (
                      <div className="ml-8 bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-blue-800">
                            Reply to {answer.authorName}
                          </h5>
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelReply}
                              className="px-3 py-1 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReplySubmit(answer.id)}
                              disabled={!replyContent.trim()}
                              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white"
                            >
                              Submit Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {answer.replies && answer.replies.length > 0 && (
                      <div className="ml-8 space-y-3 mt-3">
                        {answer.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                          >
                            <div className="flex items-start space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.authorImage} />
                                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                  {reply.authorName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-medium text-blue-900">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-xs text-blue-600">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                  {reply.content}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-3 text-xs text-blue-600">
                                    <button
                                      onClick={() =>
                                        onVoteReply?.(
                                          answer.id,
                                          reply.id,
                                          "upvote"
                                        )
                                      }
                                      className={`flex items-center space-x-1 cursor-pointer ${
                                        reply.userVote === "upvote"
                                          ? "text-blue-700 font-semibold"
                                          : "text-blue-600 hover:text-blue-700"
                                      }`}
                                    >
                                      <span>👍</span>
                                      <span>{reply.upvotes}</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        onVoteReply?.(
                                          answer.id,
                                          reply.id,
                                          "downvote"
                                        )
                                      }
                                      className={`flex items-center space-x-1 cursor-pointer ${
                                        reply.userVote === "downvote"
                                          ? "text-blue-700 font-semibold"
                                          : "text-blue-600 hover:text-blue-700"
                                      }`}
                                    >
                                      <span>👎</span>
                                      <span>{reply.downvotes}</span>
                                    </button>
                                  </div>
                                  <span className="text-xs text-blue-500 font-medium">
                                    Score: {reply.upvotes - reply.downvotes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
