import { Button } from "../../../design/system/button";
import { ChevronRight, ChevronUp } from "lucide-react";
import { MentorCategory, Mentor } from "../../../core/lib/data/mentors";
import { TeacherCard } from "./TeacherCard";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TeacherCategoryProps {
  category: MentorCategory;
  isDarkMode: boolean;
  onTeacherClick: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
  showViewAll?: boolean;
}

export function TeacherCategory({
  category,
  isDarkMode,
  onTeacherClick,
  onBookSession,
  showViewAll = true, // Default to true for homepage
}: TeacherCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(showViewAll); // Start expanded if showViewAll is true
  const { colors } = useTheme();

  // Show all mentors if expanded, or 5 initially if not expanded
  const mentorsToShow = isExpanded
    ? category.mentors
    : category.mentors.slice(0, 5);
  const hasMoreMentors = category.mentors.length > 5;

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-semibold capitalize"
          style={{ color: colors.text.primary }}
        >
          {category.title}
        </h3>
        {showViewAll && hasMoreMentors && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="transition-all duration-200 cursor-pointer"
            style={{
              color: "#08CB00",
              backgroundColor: "transparent",
            }}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {mentorsToShow.map((mentor) => (
          <div key={mentor.id} className="w-full">
            <TeacherCard
              mentor={mentor}
              isDarkMode={isDarkMode}
              onClick={onTeacherClick}
              onBookSession={onBookSession}
            />
          </div>
        ))}
      </div>

      {/* Show count info when expanded */}
      {isExpanded && (
        <div
          className="text-sm text-center"
          style={{ color: colors.text.secondary }}
        >
          Showing {category.mentors.length} of {category.mentors.length} mentors
          in this category
        </div>
      )}
    </div>
  );
}
