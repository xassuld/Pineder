import { Card, CardContent } from "../../../design/system/card";
import { Users, User, BookOpen } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface EmptyStateCardProps {
  type: "group" | "oneonone" | "all";
}

export default function EmptyStateCard({ type }: EmptyStateCardProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (type) {
      case "group":
        return (
          <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
        );
      case "oneonone":
        return (
          <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
        );
      case "all":
        return (
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case "group":
        return "No group sessions";
      case "oneonone":
        return "No 1-on-1 sessions";
      case "all":
        return "No sessions found";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "group":
        return "No group sessions available at the moment.";
      case "oneonone":
        return "No 1-on-1 sessions available at the moment.";
      case "all":
        return "No sessions available at the moment.";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 sm:p-8 md:p-12 text-center">
        {getIcon()}
        <h3
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: colors.text.primary }}
        >
          {getTitle()}
        </h3>
        <p
          className="text-sm sm:text-base"
          style={{ color: colors.text.secondary }}
        >
          {getMessage()}
        </p>
      </CardContent>
    </Card>
  );
}
