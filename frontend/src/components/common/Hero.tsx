import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../../core/contexts/ThemeContext";
import { LogoLoader } from "../shared/LogoLoader";
import { HeroContent } from "./HeroContent";
import { Hero3DModel } from "./Hero3DModel";
import { HeroFloatingIcons } from "./HeroFloatingIcons";

export const Hero = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const codeSnippets = [
    "const future = await code();",
    "function learn() { return 'success'; }",
    "if (dedication) { achieve(); }",
    "while (learning) { grow(); }",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  const handleStartLearning = () => {
    router.push("/mentors");
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom right, ${colors.background.primary}, ${colors.background.secondary}, ${colors.background.tertiary})`,
        }}
      >
        <LogoLoader
          message="Initializing your learning journey... 🚀"
          size="lg"
        />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Theme-aware background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: colors.background.primary,
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left side - Text content */}
            <HeroContent
              currentCodeIndex={currentCodeIndex}
              codeSnippets={codeSnippets}
              onStartLearning={handleStartLearning}
            />

            {/* Right side - 3D Model */}
            <Hero3DModel />
          </div>
        </div>
      </div>

      {/* Floating tech icons */}
      <HeroFloatingIcons />
    </section>
  );
};
