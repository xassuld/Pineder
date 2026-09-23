import { motion } from "framer-motion";
import { Star, Target, Zap, Crown, Award } from "lucide-react";

interface AchievementPanelProps {
  totalSessions: number;
  completedSessions: number;
  streakDays: number;
}

export default function AchievementPanel({
  totalSessions,
  completedSessions,
  streakDays,
}: AchievementPanelProps) {
  const achievements = [
    {
      id: "first-session",
      title: "First Steps",
      description: "Complete your first session",
      icon: Star,
      unlocked: completedSessions >= 1,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "streak-3",
      title: "On Fire!",
      description: "Maintain a 3-day streak",
      icon: Zap,
      unlocked: streakDays >= 3,
      color: "from-orange-400 to-red-500",
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Crown,
      unlocked: streakDays >= 7,
      color: "from-blue-400 to-purple-500",
    },
    {
      id: "sessions-10",
      title: "Dedicated Learner",
      description: "Complete 10 sessions",
      icon: Target,
      unlocked: completedSessions >= 10,
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8"
    >
      {/* Simple header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{completedSessions}</div>
            <div className="text-sm opacity-90">Sessions Completed</div>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold">{streakDays}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className={`text-center p-4 rounded-2xl transition-all duration-300 ${
                achievement.unlocked
                  ? "bg-gradient-to-br " +
                    achievement.color +
                    " text-white shadow-lg"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <div className="flex justify-center mb-2">
                <achievement.icon
                  className={`w-8 h-8 ${
                    achievement.unlocked ? "text-white" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-sm font-bold mb-1">{achievement.title}</div>
              <div className="text-xs opacity-80">
                {achievement.description}
              </div>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="mt-2"
                >
                  <Award className="w-5 h-5 mx-auto text-yellow-300" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simple stats */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-semibold">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {totalSessions > 0
              ? Math.round((completedSessions / totalSessions) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-green-600">Keep up the great work!</div>
        </div>
      </div>
    </motion.div>
  );
}
