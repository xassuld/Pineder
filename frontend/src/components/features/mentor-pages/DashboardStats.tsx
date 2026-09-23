import React from "react";
import { Card, CardContent } from "../../../design/system/card";
import { Users, Calendar, AlertCircle } from "lucide-react";
import { useMentorDashboard } from "../../../core/hooks/useMentorDashboard";

interface DashboardStatsProps {
  cardBg: string;
  colors: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ cardBg, colors }) => {
  const { data, loading } = useMentorDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className={`${cardBg} border-2 hover:shadow-lg transition-all duration-300`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-3">
      <Card
        className={`${cardBg} border-2 hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="mb-2 text-base font-semibold sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                Pending Requests
              </h3>
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {data?.pendingRequests || 0}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 text-blue-600 sm:w-8 sm:h-8" />
          </div>
        </CardContent>
      </Card>

      <Card
        className={`${cardBg} border-2 hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="mb-2 text-base font-semibold sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                Today&apos;s Sessions
              </h3>
              <p className="text-2xl font-bold text-green-600 sm:text-3xl">
                {data?.todaysSessions || 0}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-green-600 sm:w-8 sm:h-8" />
          </div>
        </CardContent>
      </Card>

      <Card
        className={`${cardBg} border-2 hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="mb-2 text-base font-semibold sm:text-lg"
                style={{ color: colors.text.primary }}
              >
                Total Students
              </h3>
              <p className="text-2xl font-bold text-purple-600 sm:text-3xl">
                {data?.totalStudents || 0}
              </p>
            </div>
            <Users className="w-6 h-6 text-purple-600 sm:w-8 sm:h-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
