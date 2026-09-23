import { useState, useEffect, useCallback } from "react";
import { useApiCall } from "../common";
import { mentorApi } from "../../lib/api";

export interface SessionRequest {
  id: number;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentLocation: string;
  studentTimezone: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  studentLevel: "beginner" | "intermediate" | "advanced";
  studentGoals: string[];
  requestedAt: string;
  urgency: "low" | "medium" | "high";
  meetingType: "class" | "online" | "flexible";
  preferences: string[];
  nickname?: string;
}

export interface ApiResponse<T> {
  data?: T;
  total?: number;
  success?: boolean;
  message?: string;
}

export function useMentorStudents(mentorId?: string) {
  const [students, setStudents] = useState<SessionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { execute: fetchStudents, isLoading: isFetching, error: fetchError } = useApiCall<ApiResponse<SessionRequest[]>>();

  const loadStudents = useCallback(async () => {
    if (!mentorId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchStudents(() => mentorApi.getStudents(mentorId));
      
      if (response?.data) {
        setStudents(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  }, [mentorId, fetchStudents]);

  const refreshStudents = useCallback(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  return {
    students,
    isLoading: isLoading || isFetching,
    error,
    refreshStudents,
  };
} 