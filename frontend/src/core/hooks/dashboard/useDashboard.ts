import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardStats, DashboardWidget, CalendarEvent } from "../../../types";
import { useApiCall } from "../common";
import { sessionApi, groupSessionApi } from "../../lib/api";

export function useDashboard() {
  const { user, isSignedIn } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalHours: 0,
    averageRating: 0,
  });
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    execute: fetchStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useApiCall<DashboardStats>();
  const {
    execute: fetchSessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useApiCall();
  const {
    execute: fetchGroupSessions,
    isLoading: isLoadingGroupSessions,
    error: groupSessionsError,
  } = useApiCall();

  // Fetch dashboard statistics
  const loadStats = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      const result = await fetchStats(async () => {
        // Mock data for now - replace with actual API call
        return {
          totalSessions: 12,
          completedSessions: 8,
          upcomingSessions: 4,
          totalHours: 24,
          averageRating: 4.8,
        };
      });

      if (result) {
        setStats(result);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  }, [fetchStats, isSignedIn]);

  // Fetch upcoming sessions
  const loadSessions = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      const result = await fetchSessions(async () => {
        // Mock data for now - replace with actual API call
        return [];
      });

      if (result) {
        // Transform sessions to calendar events
        const calendarEvents: CalendarEvent[] = [];
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  }, [fetchSessions, isSignedIn]);

  // Fetch group sessions
  const loadGroupSessions = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      const result = await fetchGroupSessions(async () => {
        // Mock data for now - replace with actual API call
        return [];
      });

      if (result) {
        // Transform group sessions to calendar events
        const groupEvents: CalendarEvent[] = [];
        setEvents((prev) => [...prev, ...groupEvents]);
      }
    } catch (error) {
      console.error("Failed to load group sessions:", error);
    }
  }, [fetchGroupSessions, isSignedIn]);

  // Load all dashboard data
  const loadDashboard = useCallback(async () => {
    await Promise.all([loadStats(), loadSessions(), loadGroupSessions()]);
  }, [loadStats, loadSessions, loadGroupSessions]);

  // Update widget layout
  const updateWidgetLayout = useCallback((newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
  }, []);

  // Add new widget
  const addWidget = useCallback((widget: DashboardWidget) => {
    setWidgets((prev) => [...prev, widget]);
  }, []);

  // Remove widget
  const removeWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  }, []);

  // Update widget
  const updateWidget = useCallback(
    (widgetId: string, updates: Partial<DashboardWidget>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, ...updates } : w))
      );
    },
    []
  );

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // Optionally reload data for the selected date
  }, []);

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Initialize dashboard
  useEffect(() => {
    if (isSignedIn) {
      loadDashboard();
    }
  }, [isSignedIn, loadDashboard]);

  return {
    // State
    stats,
    widgets,
    events,
    selectedDate,

    // Loading states
    isLoading: isLoadingStats || isLoadingSessions || isLoadingGroupSessions,
    isLoadingStats,
    isLoadingSessions,
    isLoadingGroupSessions,

    // Errors
    statsError,
    sessionsError,
    groupSessionsError,

    // Actions
    loadDashboard,
    loadStats,
    loadSessions,
    loadGroupSessions,
    refreshDashboard,
    updateWidgetLayout,
    addWidget,
    removeWidget,
    updateWidget,
    handleDateSelect,

    // Computed values
    hasData: stats.totalSessions > 0 || events.length > 0,
    upcomingSessionsCount: stats.upcomingSessions,
    completedSessionsCount: stats.completedSessions,
  };
}
