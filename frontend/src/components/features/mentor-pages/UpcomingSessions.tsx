import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Video, Calendar, Clock, User } from "lucide-react";
import { useMentorDashboard } from "../../../core/hooks/useMentorDashboard";

interface UpcomingSessionsProps {
  cardBg: string;
  colors: any;
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({
  cardBg,
  colors,
}) => {
  const { data, loading } = useMentorDashboard();

  const handleJoinMeeting = (session: any) => {
    if (session.zoomStartUrl) {
      window.open(session.zoomStartUrl, '_blank');
    } else if (session.zoomJoinUrl) {
      window.open(session.zoomJoinUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Card className={`${cardBg} border-2`}>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${cardBg} border-2`}>
      <CardHeader>
        <CardTitle
          className="flex items-center gap-2 text-lg sm:text-xl"
          style={{ color: colors.text.primary }}
        >
          <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          Join Accepted Zoom Meetings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {data?.upcomingSessions && data.upcomingSessions.length > 0 ? (
            data.upcomingSessions.map((session, index) => (
              <div
                key={session.id || index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h4
                        className="font-semibold text-sm sm:text-base"
                        style={{ color: colors.text.primary }}
                      >
                        {session.studentName}
                      </h4>
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      {session.topic}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinMeeting(session)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs sm:text-sm"
                    disabled={!session.zoomStartUrl && !session.zoomJoinUrl}
                  >
                    <Video className="w-3 h-3 mr-1" />
                    {session.zoomStartUrl ? "Start Meeting" : "Join Meeting"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p
                className="text-sm"
                style={{ color: colors.text.secondary }}
              >
                No upcoming sessions with Zoom meetings
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: colors.text.secondary }}
              >
                Approved sessions will appear here with join buttons
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
