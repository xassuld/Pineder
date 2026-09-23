import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Session,
  SessionFilters,
  SessionBooking,
  PaginatedResponse,
} from "../../../types";
import { useApiCall, useDebounce } from "../common";
import { sessionApi } from "../../lib/api";

export function useSessions() {
  const { user, isSignedIn } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filters, setFilters] = useState<SessionFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const debouncedFilters = useDebounce(filters, 300);

  const {
    execute: fetchSessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useApiCall<PaginatedResponse<Session>>();
  const {
    execute: createSession,
    isLoading: isCreatingSession,
    error: createSessionError,
  } = useApiCall<Session>();
  const {
    execute: updateSession,
    isLoading: isUpdatingSession,
    error: updateSessionError,
  } = useApiCall<Session>();
  const {
    execute: deleteSession,
    isLoading: isDeletingSession,
    error: deleteSessionError,
  } = useApiCall<void>();

  // Fetch sessions with filters and pagination
  const loadSessions = useCallback(
    async (params?: Partial<SessionFilters>) => {
      if (!isSignedIn || !user) return;

      try {
        const searchParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
          ...params,
        };

        const result = await fetchSessions(async () => {
          // Determine user role based on email domain
          const email = user.emailAddresses[0]?.emailAddress || "";
          let role = "student"; // default
          if (email.endsWith("@gmail.com")) {
            role = "mentor";
          } else if (email.endsWith("@nest.edu.mn")) {
            role = "student";
          }

          const headers = {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          };

          const endpoint =
            role === "student"
              ? "/api/sessions/bookings/student"
              : "/api/sessions/mentor/all";

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
            }${endpoint}`,
            { headers }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            // Transform backend data to match frontend format
            const transformedSessions = data.data.map((session: any) => ({
              id: session._id,
              title: session.title,
              description: session.description || session.requestNotes || "",
              mentorId: session.mentorId?._id || "",
              studentId: session.studentId?._id || "",
              startTime: new Date(session.startTime),
              endTime: new Date(session.endTime),
              status: session.status,
              subject: session.subject || session.title,
              notes: session.requestNotes || "",
              rating: 0,
              feedback: "",
              mentor: {
                name:
                  session.mentorId?.userId?.firstName +
                    " " +
                    session.mentorId?.userId?.lastName || "Mentor",
                image:
                  session.mentorId?.userId?.avatar || "/api/placeholder/80/80",
                expertise: session.mentorId?.specialties || [],
                rating: session.mentorId?.rating || 0,
              },
              date: new Date(session.startTime).toLocaleDateString(),
              time: new Date(session.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              duration: "60 min",
              price: session.mentorId?.hourlyRate || 50,
              studentChoice: session.studentChoice || "free",
              meetingLink: session.zoomJoinUrl || "",
              isGroupSession: false,
            }));

            return {
              data: transformedSessions,
              total: data.pagination?.total || transformedSessions.length,
              page: data.pagination?.page || 1,
              limit: data.pagination?.limit || transformedSessions.length,
              totalPages: data.pagination?.pages || 1,
            };
          } else {
            throw new Error(data.error || "Failed to fetch sessions");
          }
        });

        if (result) {
          setSessions(result.data);
          setPagination({
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
          });
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);
      }
    },
    [
      isSignedIn,
      user,
      pagination.page,
      pagination.limit,
      filters,
      fetchSessions,
    ]
  );

  // Create new session
  const bookSession = useCallback(
    async (sessionData: SessionBooking) => {
      if (!isSignedIn) return;

      try {
        const result = await createSession(async () => {
          // Mock data for now - replace with actual API call
          return {} as Session;
        });

        if (result) {
          setSessions((prev) => [result, ...prev]);
          return result;
        }
      } catch (error) {
        console.error("Failed to book session:", error);
        throw error;
      }
    },
    [isSignedIn, createSession]
  );

  // Update existing session
  const editSession = useCallback(
    async (sessionId: string, updates: Partial<Session>) => {
      if (!isSignedIn) return;

      try {
        const result = await updateSession(async () => {
          // Mock data for now - replace with actual API call
          return {} as Session;
        });

        if (result) {
          setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, ...result } : s))
          );
          return result;
        }
      } catch (error) {
        console.error("Failed to update session:", error);
        throw error;
      }
    },
    [isSignedIn, updateSession]
  );

  // Delete session
  const cancelSession = useCallback(
    async (sessionId: string, reason?: string) => {
      if (!isSignedIn) return;

      try {
        await deleteSession(async () => {
          // Mock API call for now
          return;
        });

        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } catch (error) {
        console.error("Failed to cancel session:", error);
        throw error;
      }
    },
    [isSignedIn, deleteSession]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SessionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Change limit
  const changeLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  // Refresh sessions
  const refreshSessions = useCallback(() => {
    loadSessions();
  }, [loadSessions]);

  // Load sessions when dependencies change
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Computed values
  const hasSessions = sessions.length > 0;
  const hasFilters = Object.keys(filters).length > 0;
  const canLoadMore = pagination.page < pagination.totalPages;
  const isLoadingMore = isLoadingSessions && pagination.page > 1;
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const cancelledSessions = sessions.filter((s) => s.status === "cancelled");

  return {
    // State
    sessions,
    filters,
    pagination,
    selectedSession,

    // Loading states
    isLoading: isLoadingSessions,
    isCreatingSession,
    isUpdatingSession,
    isDeletingSession,
    isLoadingMore,

    // Errors
    sessionsError,
    createSessionError,
    updateSessionError,
    deleteSessionError,

    // Actions
    loadSessions,
    bookSession,
    editSession,
    cancelSession,
    updateFilters,
    clearFilters,
    changePage,
    changeLimit,
    refreshSessions,

    // Computed values
    hasSessions,
    hasFilters,
    canLoadMore,
    totalSessions: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    upcomingSessionsCount: upcomingSessions.length,
    completedSessionsCount: completedSessions.length,
    cancelledSessionsCount: cancelledSessions.length,
  };
}
