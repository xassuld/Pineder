import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { TopicCard } from "./TopicCard";
import { TopicDetailsModal } from "./TopicDetailsModal";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicVotingProps {
  topics: TopicSubmission[];
  onVote: (topicId: string, voteType: "upvote" | "downvote") => void;
  onEdit?: (topic: TopicSubmission) => void;
  onDelete?: (topicId: string) => void;
  getVoteCount: (topicId: string, voteType: "upvote" | "downvote") => number;
  getUserVote: (topicId: string) => "upvote" | "downvote" | null;
}

const TopicVoting: React.FC<TopicVotingProps> = ({
  topics,
  onVote,
  onEdit,
  onDelete,
  getVoteCount,
  getUserVote,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicSubmission | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const getMentorImage = (id: string) => {
    const images = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    ];
    return images[parseInt(id) % images.length];
  };

  // Sort topics by vote count and identify the top voted topic
  const sortedTopics = topics.sort((a, b) => {
    const aVotes =
      getVoteCount(a.id, "upvote") - getVoteCount(a.id, "downvote");
    const bVotes =
      getVoteCount(b.id, "upvote") - getVoteCount(b.id, "downvote");
    return bVotes - aVotes;
  });

  // Get the top voted topic (first one after sorting)
  const topVotedTopic = sortedTopics.length > 0 ? sortedTopics[0] : null;
  const topVoteCount = topVotedTopic
    ? getVoteCount(topVotedTopic.id, "upvote") -
      getVoteCount(topVotedTopic.id, "downvote")
    : 0;

  const openDetails = (topic: TopicSubmission) => {
    setSelectedTopic(topic);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTopic(null);
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12">
        <Lightbulb
          className="w-16 h-16 mx-auto mb-4"
          style={{ color: isDarkMode ? "#6b7280" : "#9ca3af" }}
        />
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
        >
          No topics available
        </h3>
        <p style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
          No student requests yet. Submit a topic to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative z-10 min-h-full">
      {/* Top Voted Topic Section */}
      {topVotedTopic && topVoteCount > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                🏆 Most Requested Topic This Week
              </h2>
            </div>
          </div>
          <div className="max-w-4xl">
            <TopicCard
              topic={topVotedTopic}
              upvotes={getVoteCount(topVotedTopic.id, "upvote")}
              downvotes={getVoteCount(topVotedTopic.id, "downvote")}
              totalVotes={topVoteCount}
              userVote={getUserVote(topVotedTopic.id)}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
              getMentorImage={getMentorImage}
              responseCount={0}
              isTopVoted={true}
            />
          </div>
        </div>
      )}

      {/* All Topics Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          Student-Requested Topics
        </h3>
      </div>

      {/* Topics Grid - Responsive Layout */}
      <div className="grid grid-cols-1 gap-12 pb-12 pr-2">
        {sortedTopics.map((topic, index) => {
          const upvotes = getVoteCount(topic.id, "upvote");
          const downvotes = getVoteCount(topic.id, "downvote");
          const totalVotes = upvotes - downvotes;
          const userVote = getUserVote(topic.id);
          const isTopVoted = topic.id === topVotedTopic?.id;

          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              upvotes={upvotes}
              downvotes={downvotes}
              totalVotes={totalVotes}
              userVote={userVote}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
              getMentorImage={getMentorImage}
              responseCount={0}
              isTopVoted={isTopVoted}
            />
          );
        })}
      </div>

      {/* Topic Details Modal */}
      {selectedTopic && (
        <TopicDetailsModal
          topic={selectedTopic}
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          onVote={onVote}
          getVoteCount={getVoteCount}
        />
      )}
    </div>
  );
};

export default TopicVoting;
