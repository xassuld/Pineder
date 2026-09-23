import React from "react";
import { Hash, MessageCircle, Users, Shield } from "lucide-react";

type CommunityDetailsTabsProps = {
  activeTab: "overview" | "posts" | "members" | "rules";
  setActiveTab: (tab: "overview" | "posts" | "members" | "rules") => void;
  colors: any;
};

export const CommunityDetailsTabs: React.FC<CommunityDetailsTabsProps> = ({
  activeTab,
  setActiveTab,
  colors,
}) => {
  const tabs = [
    { key: "overview", label: "Overview", icon: Hash },
    { key: "posts", label: "Posts", icon: MessageCircle },
    { key: "members", label: "Members", icon: Users },
    { key: "rules", label: "Rules", icon: Shield },
  ];

  return (
    <div
      className="border-b px-8"
      style={{ borderColor: colors.border.primary }}
    >
      <div className="flex space-x-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 border-b-2 py-4 transition-all duration-200 ${
              activeTab === key
                ? "border-current font-semibold"
                : "border-transparent hover:border-current/50"
            }`}
            style={{
              color:
                activeTab === key
                  ? colors.accent.primary
                  : colors.text.secondary,
            }}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
