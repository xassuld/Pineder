import { Button } from "../../../design/system/button";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useMentors, Mentor } from "../../../core/hooks/useMentors";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

interface HomePageMentorsProps {
  category?: unknown;
  isDarkMode: boolean;
  onTeacherClick: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
  isMentor?: boolean;
}

// Enhanced TeacherCard component specifically for home page
function HomePageTeacherCard({
  mentor,
  isDarkMode,
  onClick,
  onBookSession,
}: {
  mentor: Mentor;
  isDarkMode: boolean;
  onClick: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
}) {
  const { colors } = useTheme();
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/mentors");
  };

  const bookSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookSession(mentor);
  };

  return (
    <div
      className="relative w-full cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col overflow-hidden h-80 rounded-xl">
        {/* Background Image - Person's portrait as background */}
        <div className="absolute inset-0 z-0">
          {mentor.userId.avatar ? (
            <Image
              src={mentor.userId.avatar}
              alt={`${mentor.userId.firstName} ${mentor.userId.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-green-600">
              <span className="text-2xl font-bold text-white">
                {mentor.userId.firstName?.[0] || "M"}
              </span>
            </div>
          )}
          {/* Lighter overlay for better image visibility */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content overlaid on the image */}
        <div className="relative z-10 flex flex-col justify-end h-full p-4">
          {/* Name and Role at the bottom */}
          <div className="space-y-1 text-center">
            <h4 className="text-base font-bold leading-tight text-white drop-shadow-lg">
              {mentor.userId.firstName} {mentor.userId.lastName}
            </h4>
            <p className="text-sm font-medium text-white/90 drop-shadow-md">
              {mentor.specialties && mentor.specialties.length > 0
                ? mentor.specialties[0]
                : mentor.userId.title || "Mentor"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePageMentors({
  isDarkMode,
  onTeacherClick,
  onBookSession,
  isMentor = false,
}: HomePageMentorsProps) {
  const { colors, getAccentColor } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { mentors, isLoading } = useMentors();

  // Take first 10 mentors and create seamless loop by repeating them
  const selectedMentors = mentors.slice(0, 10);
  const mentorsToShow = [
    ...selectedMentors,
    ...selectedMentors,
    ...selectedMentors,
    ...selectedMentors,
  ];

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.05; // Very slow speed for comfortable viewing
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const animateScroll = () => {
      scrollPosition += scrollSpeed;

      // When we reach the end, seamlessly continue from the beginning
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: "auto", // Use 'auto' for seamless transition
      });

      animationId = requestAnimationFrame(animateScroll);
    };

    // Start animation immediately
    animationId = requestAnimationFrame(animateScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mentorsToShow.length]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3
            className={`text-3xl font-extrabold capitalize mb-3 transition-colors duration-300 ${
              isDarkMode ? "drop-shadow-lg" : "bg-clip-text text-transparent"
            }`}
            style={{
              color: isDarkMode ? getAccentColor() : undefined,
              backgroundImage: isDarkMode
                ? undefined
                : `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
            }}
          >
            {isMentor ? "Meet Fellow Mentors" : "Meet Our Tech Mentors"}
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 rounded-full animate-spin border-t-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3
          className={`text-3xl font-extrabold capitalize mb-3 transition-colors duration-300 ${
            isDarkMode ? "drop-shadow-lg" : "bg-clip-text text-transparent"
          }`}
          style={{
            color: isDarkMode ? getAccentColor() : undefined,
            backgroundImage: isDarkMode
              ? undefined
              : `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
          }}
        >
          {isMentor ? "Meet Fellow Mentors" : "Meet Our Tech Mentors"}
        </h3>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto transition-colors duration-300 pointer-events-none scroll-smooth scrollbar-hide"
      >
        <div className="flex min-w-full space-x-6 w-max animate-scroll">
          {mentorsToShow.map((mentor, index) => (
            <div
              key={`${mentor._id}-${index}`}
              className="flex-shrink-0 pointer-events-auto w-80"
            >
              <HomePageTeacherCard
                mentor={mentor}
                isDarkMode={isDarkMode}
                onClick={onTeacherClick}
                onBookSession={onBookSession}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
