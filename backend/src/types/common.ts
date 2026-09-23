import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export const createSuccessResponse = <T>(
  data?: T,
  message?: string,
  status = 200
): ApiResponse<T> => {
  const response: ApiResponse<T> = { success: true };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  return response;
};

export const createErrorResponse = (
  error: string,
  details?: unknown
): ErrorResponse => ({
  success: false,
  error,
  details,
});

export interface MentorAvailability {
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface StudentProfileUpdate {
  grade?: string;
  subjects?: string[];
  interests?: string[];
  goals?: string[];
}

export interface MentorProfileUpdate {
  specialties?: string[];
  bio?: string;
  hourlyRate?: number;
  subjects?: string[];
  availability?: MentorAvailability[];
}

export interface LogMeta {
  userId?: string;
  action?: string;
  resource?: string;
  timestamp?: Date;
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationErrorResponse {
  success: false;
  error: "Validation failed";
  details: ValidationError[];
}
