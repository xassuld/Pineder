import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface MentorDashboardData {
  pendingRequests: number;
  todaysSessions: number;
  totalStudents: number;
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalHours: number;
  recentActivity: Array<{
    studentName: string;
    topic: string;
    status: string;
    timestamp: string;
  }>;
  upcomingSessions: Array<{
    id: string;
    studentName: string;
    topic: string;
    date: string;
    time: string;
    zoomJoinUrl?: string;
    zoomStartUrl?: string;
  }>;
}

export const useMentorDashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isSignedIn || !user || !isLoaded) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = user.emailAddresses[0]?.emailAddress;
        const userRole = email?.endsWith("@nest.edu.mn") ? "student" : "mentor";

        if (userRole !== "mentor") {
          setError("Access denied. Mentor role required.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/mentor-dashboard/stats`,
          {
            headers: {
              "x-user-role": userRole,
              "x-user-email": email || "",
              "x-user-id": user.id,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setData(result.data);
          } else {
            // Fallback to basic data if API doesn't return expected format
            setData({
              pendingRequests: 0,
              todaysSessions: 0,
              totalStudents: 0,
              totalSessions: 0,
              completedSessions: 0,
              averageRating: 0,
              totalHours: 0,
              recentActivity: [],
              upcomingSessions: [],
            });
          }
        } else {
          // Fallback to basic data on error
          setData({
            pendingRequests: 0,
            todaysSessions: 0,
            totalStudents: 0,
            totalSessions: 0,
            completedSessions: 0,
            averageRating: 0,
            totalHours: 0,
            recentActivity: [],
            upcomingSessions: [],
          });
        }
      } catch (err) {
        console.error("Error fetching mentor dashboard data:", err);
        setError("Failed to fetch dashboard data");
        // Set basic data on error
        setData({
          pendingRequests: 0,
          todaysSessions: 0,
          totalStudents: 0,
          totalSessions: 0,
          completedSessions: 0,
          averageRating: 0,
          totalHours: 0,
          recentActivity: [],
          upcomingSessions: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isSignedIn, user, isLoaded]);

  return { data, loading, error };
};
