import React from "react";
import Image from "next/image";
import { Mentor } from "../../../core/lib/data/mentors";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TeacherCardProps {
  mentor: Mentor;
  isDarkMode: boolean;
  onClick: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
}

export function TeacherCard({
  mentor,
  isDarkMode,
  onClick,
  onBookSession,
}: TeacherCardProps) {
  const { colors } = useTheme();

  return (
    <div
      className="p-4 transition-all duration-200 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
      onClick={() => onClick(mentor)}
      style={{
        backgroundColor: isDarkMode
          ? colors.background.card
          : colors.background.card,
        border: `1px solid ${
          isDarkMode ? colors.border.primary : colors.border.primary
        }`,
      }}
    >
      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 overflow-hidden rounded-full">
          {mentor.image ? (
            <Image
              src={mentor.image}
              alt={mentor.name}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-green-600">
              <span className="text-lg font-semibold text-white">
                {mentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3
        className="mb-2 text-base font-bold text-center"
        style={{ color: colors.text.primary }}
      >
        {mentor.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center justify-center mb-2">
        <span className="mr-1 text-yellow-500">★</span>
        <span
          className="text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          {mentor.rating.toFixed(1)}
        </span>
      </div>

      {/* Specialties */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {mentor.expertise.slice(0, 2).map((specialty, index) => (
          <span
            key={index}
            className="text-xs font-medium"
            style={{ color: colors.accent.primary }}
          >
            {specialty}
          </span>
        ))}
      </div>

      {/* Book Session Button */}
      <button
        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg hover:opacity-90"
        style={{ backgroundColor: colors.accent.primary }}
        onClick={(e) => {
          e.stopPropagation();
          onBookSession(mentor);
        }}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Book Session
      </button>
    </div>
  );
}
