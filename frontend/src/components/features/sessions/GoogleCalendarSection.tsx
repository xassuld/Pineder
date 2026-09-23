import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Calendar } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface GoogleCalendarSectionProps {
  onExportToCalendar: () => void;
}

export default function GoogleCalendarSection({
  onExportToCalendar,
}: GoogleCalendarSectionProps) {
  const { colors } = useTheme();

  return (
    <div className="text-center py-8 sm:py-12 md:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-600" />
        </div>

        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            style={{ color: colors.text.primary }}
          >
            Google Calendar Integration
          </h2>
          <p
            className="text-base sm:text-lg mb-6 sm:mb-8"
            style={{ color: colors.text.secondary }}
          >
            Sync all your learning sessions with Google Calendar
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onExportToCalendar}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Export All Sessions to Google Calendar
          </Button>

          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Or use individual &ldquo;Add to Calendar&rdquo; buttons on session
            cards
          </p>
        </div>
      </motion.div>
    </div>
  );
}
