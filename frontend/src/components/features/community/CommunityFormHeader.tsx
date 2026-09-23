import React from "react";
import { Users } from "lucide-react";
import { Button } from "../../../design/system/button";

type CommunityFormHeaderProps = {
  colors: any;
  onClose: () => void;
};

export const CommunityFormHeader: React.FC<CommunityFormHeaderProps> = ({
  colors,
  onClose,
}) => {
  return (
    <div
      className="sticky top-0 z-10 rounded-t-3xl"
      style={{
        background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
      }}
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-white" />
          <div className="text-white">
            <h2 className="text-2xl font-bold">Create New Community</h2>
            <p style={{ color: colors.text.inverse }}>
              Build a learning community around your interests
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-200"
        >
          ×
        </Button>
      </div>
    </div>
  );
};
