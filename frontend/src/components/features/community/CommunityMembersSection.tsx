import React from "react";
import { Users, Hash, Shield } from "lucide-react";
import { Badge } from "../../../design/system/badge";
import { Community } from "../../../core/lib/data/communities";

type CommunityMembersSectionProps = {
  community: Community;
  colors: any;
};

export const CommunityMembersSection: React.FC<
  CommunityMembersSectionProps
> = ({ community, colors }) => {
  // Mock members data - in real app this would come from props or API
  const mockMembers = [
    {
      id: "1",
      name: "John Doe",
      role: "Admin",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Moderator",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "3",
      name: "Bob Johnson",
      role: "Member",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <div className="p-8">
      {/* Overview Tab Content */}
      <div className="space-y-8">
        {/* Topics */}
        <div>
          <h3
            className="mb-4 text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Topics & Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {community.topics.map((topic, index) => (
              <Badge
                key={index}
                className="px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent.primary}20`,
                  color: colors.accent.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <Hash className="mr-2 h-4 w-4" />
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div>
          <h3
            className="mb-4 text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Community Rules
          </h3>
          <div className="space-y-3">
            {community.rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.secondary,
                }}
              >
                <Shield
                  className="mt-1 h-5 w-5 flex-shrink-0"
                  style={{ color: colors.accent.primary }}
                />
                <span style={{ color: colors.text.primary }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Members */}
        <div>
          <h3
            className="mb-4 text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Top Members
          </h3>
          <div className="space-y-3">
            {mockMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.secondary,
                }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div
                    className="font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {member.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {member.role}
                  </div>
                </div>
                <Badge
                  className="px-3 py-1 text-xs"
                  style={{
                    backgroundColor:
                      member.role === "Admin"
                        ? `${colors.accent.error}20`
                        : member.role === "Moderator"
                        ? `${colors.accent.warning}20`
                        : `${colors.accent.success}20`,
                    color:
                      member.role === "Admin"
                        ? colors.accent.error
                        : member.role === "Moderator"
                        ? colors.accent.warning
                        : colors.accent.success,
                  }}
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
