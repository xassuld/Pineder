import { useRef, useEffect } from "react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { MessageSquare } from "lucide-react";

interface Topic {
  id: string | number;
  title: string;
  category: string;
  participants: number;
  replies: number;
  lastActivity: string;
  tags: string[];
  author: string;
  upvotes: number;
  downvotes: number;
  description: string;
}

interface TrendingTopicsProps {
  allTopics: Topic[];
  isMentor?: boolean;
}

export function TrendingTopics({
  allTopics,
  isMentor = false,
}: TrendingTopicsProps) {
  const { colors, isDarkMode } = useTheme();
  const topicsScrollRef = useRef<HTMLDivElement>(null);

  // Create seamless loop by repeating topics multiple times
  const topicsToShow = [...allTopics, ...allTopics, ...allTopics, ...allTopics];

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = topicsScrollRef.current;
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
  }, [topicsToShow.length]);

  return (
    <section
      className="py-20 transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare
              className="w-6 h-6 mr-3"
              style={{ color: colors.accent.secondary }}
            />
            <span
              className="text-sm font-semibold tracking-wider uppercase"
              style={{ color: colors.text.secondary }}
            >
              {isMentor ? "Student Challenges" : "Trending Topics"}
            </span>
          </div>
          <h2
            className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
            style={{ color: colors.text.primary }}
          >
            {isMentor ? (
              <>
                Students Need Your
                <span
                  className="block text-transparent bg-gradient-to-r bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success}, ${colors.accent.primary})`,
                  }}
                >
                  Guidance
                </span>
              </>
            ) : (
              <>
                Join the
                <span
                  className="block text-transparent bg-gradient-to-r bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success}, ${colors.accent.primary})`,
                  }}
                >
                  Conversation
                </span>
              </>
            )}
          </h2>
          <p
            className="max-w-3xl mx-auto text-xl"
            style={{ color: colors.text.secondary }}
          >
            {isMentor
              ? "Explore trending questions and challenges from students. Share your insights, answer questions, or turn them into mentoring sessions."
              : "Engage in meaningful discussions about trending topics, challenges, and innovations in tech. Plus, explore student-submitted topics from our group sessions."}
          </p>
        </div>

        <div
          ref={topicsScrollRef}
          className={`overflow-x-auto pb-4 scrollbar-thin scroll-smooth transition-colors duration-300 ${
            isDarkMode
              ? "scrollbar-thumb-gray-500 scrollbar-track-gray-800"
              : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          }`}
        >
          <div
            className="flex min-w-full space-x-6 w-max"
            style={{
              animation: "scroll 400s linear infinite",
            }}
          >
            {topicsToShow.map((topic, index) => (
              <div
                key={`${topic.id}-${index}`}
                className="relative flex-shrink-0 h-auto overflow-hidden transition-all duration-500 cursor-pointer w-80 sm:w-72 group rounded-2xl hover:scale-105 hover:-translate-y-2"
                style={{
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.primary}`,
                  boxShadow: isDarkMode
                    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Gradient overlay for aesthetic appeal */}
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-transparent via-transparent to-black/5 group-hover:opacity-100"></div>

                <div className="relative z-10 p-4 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1.5 text-xs font-bold rounded-full shadow-lg transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #58CC02, #46A302)",
                        color: "white",
                      }}
                    >
                      {topic.category}
                    </span>
                  </div>

                  <h3
                    className="text-lg sm:text-lg font-bold mb-2 group-hover:text-[#58CC02] transition-colors duration-300 leading-tight min-h-[2rem]"
                    style={{ color: colors.text.primary }}
                  >
                    {topic.title}
                  </h3>

                  {/* Author and Date with enhanced styling */}
                  {topic.author && (
                    <div
                      className={`flex items-center justify-between mb-2 p-1.5 rounded-lg transition-colors duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/30"
                          : "bg-gradient-to-r from-gray-50 to-gray-100"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center text-white text-xs font-bold">
                          {topic.author.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className="text-xs font-medium"
                            style={{ color: colors.text.secondary }}
                          >
                            {topic.author}
                          </span>
                          {isMentor && (
                            <span className="text-xs font-medium text-blue-500">
                              Beginner Student
                            </span>
                          )}
                        </div>
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-lg transition-colors duration-300 ${
                          isDarkMode
                            ? "bg-gray-700/80 text-gray-200"
                            : "bg-white/80 text-gray-600"
                        }`}
                      >
                        {topic.lastActivity}
                      </span>
                    </div>
                  )}

                  {/* Description with enhanced styling */}
                  {topic.description && (
                    <p
                      className={`text-sm sm:text-xs mb-3 leading-relaxed p-2 rounded-lg transition-colors duration-300 min-h-[2.5rem] ${
                        isDarkMode
                          ? "bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/30 text-gray-200"
                          : "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 text-gray-700"
                      }`}
                    >
                      {topic.description}
                    </p>
                  )}

                  {/* Mentor-specific status and actions */}
                  {isMentor && (
                    <div className="mb-4 space-y-3">
                      {/* Status indicator */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          <span className="text-xs font-medium text-green-500">
                            Waiting for mentor response
                          </span>
                        </span>
                      </div>

                      {/* Mentor action buttons */}
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-lg hover:scale-105 transition-all duration-300">
                          Answer This Question
                        </button>
                        <button className="px-3 py-2 text-xs font-semibold text-[#58CC02] border border-[#58CC02] rounded-lg hover:bg-[#58CC02] hover:text-white transition-all duration-300">
                          Bookmark
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Enhanced tags with better styling */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md ${
                          isDarkMode
                            ? "bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-500/50 text-gray-200"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-75%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
