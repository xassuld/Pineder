import React from "react";
import { Users, Hash, Calendar, Share2, X } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { Community } from "../../../core/lib/data/communities";

type CommunityDetailsHeaderProps = {
  community: Community;
  isMember: boolean;
  colors: any;
  onClose: () => void;
  onJoinLeave: () => void;
};

export const CommunityDetailsHeader: React.FC<CommunityDetailsHeaderProps> = ({
  community,
  isMember,
  colors,
  onClose,
  onJoinLeave,
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
    <>
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 h-10 w-10 p-0 transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: `${colors.accent.primary}10`,
          color: colors.text.primary,
        }}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="relative p-8 pb-4">
        <div className="flex items-start space-x-6">
          {/* Community Image */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              {community.image ? (
                <img
                  src={community.image}
                  alt={community.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  {community.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Community Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <h1
                className="truncate text-3xl font-bold"
                style={{ color: colors.text.primary }}
              >
                {community.name}
              </h1>
              <Badge
                className="px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor:
                    community.status === "active"
                      ? `${colors.accent.success}20`
                      : community.status === "growing"
                      ? `${colors.accent.info}20`
                      : `${colors.accent.warning}20`,
                  color:
                    community.status === "active"
                      ? colors.accent.success
                      : community.status === "growing"
                      ? colors.accent.info
                      : colors.accent.warning,
                  borderColor: colors.border.primary,
                }}
              >
                {community.status}
              </Badge>
            </div>

            <p
              className="mb-4 text-lg"
              style={{ color: colors.text.secondary }}
            >
              {community.description}
            </p>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users
                  className="h-5 w-5"
                  style={{ color: colors.text.secondary }}
                />
                <span style={{ color: colors.text.secondary }}>
                  {community.members.toLocaleString()} members
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash
                  className="h-5 w-5"
                  style={{ color: colors.text.secondary }}
                />
                <span style={{ color: colors.text.secondary }}>
                  {community.topics.length} topics
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar
                  className="h-5 w-5"
                  style={{ color: colors.text.secondary }}
                />
                <span style={{ color: colors.text.secondary }}>
                  Created {formatDate(community.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 space-y-3">
            <Button
              onClick={onJoinLeave}
              className="w-full rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: isMember
                  ? colors.accent.error
                  : `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
                color: colors.text.inverse,
              }}
            >
              {isMember ? "Leave Community" : "Join Community"}
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
                backgroundColor: `${colors.accent.primary}10`,
              }}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
