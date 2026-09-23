import React, { useState } from "react";
import {
  X,
  User,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";
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
}

interface ViewAllAnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  studentName: string;
  answers: Answer[];
  onVoteAnswer?: (answerId: string, voteType: "upvote" | "downvote") => void;
}

export const ViewAllAnswersModal: React.FC<ViewAllAnswersModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  studentName,
  answers,
  onVoteAnswer,
}) => {
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

  const handleVote = (answerId: string, voteType: "upvote" | "downvote") => {
    if (onVoteAnswer) {
      onVoteAnswer(answerId, voteType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-xl bg-white rounded-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle>
            <div>
              <span className="text-2xl font-bold text-gray-900">
                All Answers
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Topic: {topicTitle} • {studentName}&apos;s Question
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Question Context */}
          <div className="2 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
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

          {/* Answer Count */}
          <div className="flex justify-end">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>
                {answers.length} answer{answers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Answers List */}
          {answers.length > 0 ? (
            <div className="space-y-4">
              {answers.map((answer) => (
                <div
                  key={answer.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={answer.authorImage} />
                      <AvatarFallback className="bg-green-100 text-green-800 text-sm font-medium">
                        {answer.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {answer.authorName}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(answer.createdAt)}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {answer.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleVote(answer.id, "upvote")}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{answer.upvotes}</span>
                          </button>
                          <button
                            onClick={() => handleVote(answer.id, "downvote")}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span>{answer.downvotes}</span>
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {answer.upvotes - answer.downvotes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">
                No answers yet
              </h3>
              <p className="text-gray-500">
                Be the first to help this student by providing an answer!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
