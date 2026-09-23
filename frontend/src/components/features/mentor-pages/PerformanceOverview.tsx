import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { TrendingUp, Clock3 } from "lucide-react";
import { useMentorDashboard } from "../../../core/hooks/useMentorDashboard";

interface PerformanceOverviewProps {
  cardBg: string;
  colors: any;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  cardBg,
  colors,
}) => {
  const { data, loading } = useMentorDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-6 sm:gap-8 sm:mb-8 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className={`${cardBg} border-2`}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-6 sm:gap-8 sm:mb-8 lg:grid-cols-2">
      <Card className={`${cardBg} border-2`}>
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 text-lg sm:text-xl"
            style={{ color: colors.text.primary }}
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-sm sm:text-base"
                style={{ color: colors.text.secondary }}
              >
                Total Sessions
              </span>
              <span
                className="font-semibold text-base sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                {data?.totalSessions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm sm:text-base"
                style={{ color: colors.text.secondary }}
              >
                Completed
              </span>
              <span className="font-semibold text-base sm:text-lg text-green-600">
                {data?.completedSessions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm sm:text-base"
                style={{ color: colors.text.secondary }}
              >
                Average Rating
              </span>
              <span className="font-semibold text-base sm:text-lg text-yellow-600">
                {data?.averageRating ? `${data.averageRating.toFixed(1)}/5.0` : '0.0/5.0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm sm:text-base"
                style={{ color: colors.text.secondary }}
              >
                Total Hours
              </span>
              <span
                className="font-semibold text-base sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                {data?.totalHours || 0}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`${cardBg} border-2`}>
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 text-lg sm:text-xl"
            style={{ color: colors.text.primary }}
          >
            <Clock3 className="w-4 h-4 sm:w-5 sm:h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' : 
                      activity.status === 'scheduled' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p
                        className="text-xs font-medium sm:text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {activity.studentName}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        {activity.topic}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    activity.status === 'completed' ? 'text-green-800 bg-green-100' :
                    activity.status === 'scheduled' ? 'text-blue-800 bg-blue-100' :
                    'text-yellow-800 bg-yellow-100'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverview;
