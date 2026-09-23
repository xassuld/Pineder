import React from "react";
import { Plus, Send, Heart, MessageCircle, Bookmark, Flag } from "lucide-react";
import { Button } from "../../../design/system/button";
import { CommunityPost } from "../../../core/lib/data/communities";

type CommunityPostsSectionProps = {
  posts: CommunityPost[];
  newPostTitle: string;
  setNewPostTitle: (title: string) => void;
  newPostContent: string;
  setNewPostContent: (content: string) => void;
  showNewPostForm: boolean;
  setShowNewPostForm: (show: boolean) => void;
  colors: any;
  onCreatePost: (e: React.FormEvent) => void;
};

export const CommunityPostsSection: React.FC<CommunityPostsSectionProps> = ({
  posts,
  newPostTitle,
  setNewPostTitle,
  newPostContent,
  setNewPostContent,
  showNewPostForm,
  setShowNewPostForm,
  colors,
  onCreatePost,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8">
      {/* New Post Button */}
      {!showNewPostForm && (
        <Button
          onClick={() => setShowNewPostForm(true)}
          className="mb-6 rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            color: colors.text.inverse,
          }}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Post
        </Button>
      )}

      {/* New Post Form */}
      {showNewPostForm && (
        <div
          className="mb-8 rounded-xl border-2 p-6"
          style={{ borderColor: colors.border.primary }}
        >
          <form onSubmit={onCreatePost} className="space-y-4">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
              }}
              required
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
              }}
              required
            />
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewPostForm(false)}
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg px-6 py-2 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.accent.primary,
                  color: colors.text.inverse,
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Post
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
            }}
          >
            <div className="mb-4 flex items-center space-x-3">
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div
                  className="font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {post.authorName}
                </div>
                <div
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            <h3
              className="mb-2 text-xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              {post.title}
            </h3>
            <p className="mb-4" style={{ color: colors.text.primary }}>
              {post.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 transition-colors duration-200 hover:text-red-500">
                  <Heart className="h-5 w-5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 transition-colors duration-200 hover:text-yellow-500">
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="p-2 transition-colors duration-200 hover:text-red-500">
                  <Flag className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
