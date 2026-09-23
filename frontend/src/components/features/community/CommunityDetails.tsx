import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Community,
  CommunityPost,
  getPostsByCommunityId,
  isUserMemberOfCommunity,
} from "../../../core/lib/data/communities";
import { CommunityDetailsHeader } from "./CommunityDetailsHeader";
import { CommunityDetailsTabs } from "./CommunityDetailsTabs";
import { CommunityPostsSection } from "./CommunityPostsSection";
import { CommunityMembersSection } from "./CommunityMembersSection";
import { useTheme } from "../../../core/contexts/ThemeContext";

type CommunityDetailsProps = {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
  onJoinLeave: (communityId: string, action: "join" | "leave") => void;
};

export const CommunityDetails = ({
  community,
  isOpen,
  onClose,
  onJoinLeave,
}: CommunityDetailsProps) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "members" | "rules"
  >("overview");
  const [posts, setPosts] = useState<CommunityPost[]>(
    getPostsByCommunityId(community.id)
  );
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isMember, setIsMember] = useState(
    isUserMemberOfCommunity("currentUser", community.id)
  );

  const handleJoinLeave = () => {
    const action = isMember ? "leave" : "join";
    onJoinLeave(community.id, action);
    setIsMember(!isMember);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      communityId: community.id,
      authorId: "currentUser",
      authorName: "Current User",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isPinned: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostForm(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden overflow-y-auto rounded-3xl shadow-2xl transition-all duration-200"
          style={{
            backgroundColor: colors.background.modal,
            borderColor: colors.border.primary,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CommunityDetailsHeader
            community={community}
            isMember={isMember}
            colors={colors}
            onClose={onClose}
            onJoinLeave={handleJoinLeave}
          />

          <CommunityDetailsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            colors={colors}
          />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <CommunityMembersSection community={community} colors={colors} />
          )}
          {activeTab === "posts" && (
            <CommunityPostsSection
              posts={posts}
              newPostTitle={newPostTitle}
              setNewPostTitle={setNewPostTitle}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              showNewPostForm={showNewPostForm}
              setShowNewPostForm={setShowNewPostForm}
              colors={colors}
              onCreatePost={handleCreatePost}
            />
          )}
          {activeTab === "members" && (
            <CommunityMembersSection community={community} colors={colors} />
          )}
          {activeTab === "rules" && (
            <CommunityMembersSection community={community} colors={colors} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
