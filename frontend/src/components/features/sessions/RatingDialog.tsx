import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Calendar, User, BookOpen } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  rating: number;
  setRating: (rating: number) => void;
  ratingComment: string;
  setRatingComment: (comment: string) => void;
  onSubmit: () => void;
}

export default function RatingDialog({
  isOpen,
  onClose,
  session,
  rating,
  setRating,
  ratingComment,
  setRatingComment,
  onSubmit,
}: RatingDialogProps) {
  const { colors } = useTheme();

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Rate Your Session
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-gray-200 bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-900">
                Session Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    {session.date} at {session.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{session.mentor.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{session.subject}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Rate your experience (1-5 stars)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Additional comments (optional)
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your thoughts about the session..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={rating === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
