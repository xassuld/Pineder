import { Sprout } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

export default function CustomFooter() {
  const { colors } = useTheme();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Pineder Logo (Hidden on Mobile) */}
          <div className="hidden sm:flex gap-2 items-center justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold font-outfit"
              style={{ color: colors.text.primary }}
            >
              Pineder
            </span>
          </div>

          {/* Center - Short text */}
          <div className="text-sm font-medium transition-all duration-300 hover:text-green-500 hover:text-2xl hover:font-bold cursor-pointer relative group text-gray-600">
            1% better than yesterday
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-green-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              You can do it! I believe in you! ✨
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
            </div>
          </div>

          {/* Right side - Made with love text */}
          <div className="text-sm transition-all duration-300 hover:text-green-500 hover:text-lg hover:font-bold cursor-pointer text-gray-600">
            Made with{" "}
            <span className="inline-block animate-pulse text-green-400 drop-shadow-lg shadow-green-400/50 animate-bounce">
              💚
            </span>{" "}
            by Pineder Team
          </div>
        </div>
      </div>
    </footer>
  );
}
