import { ApiResponse, PaginatedResponse } from "../../../types";
import { ERROR_MESSAGES, API_BASE_URL, API_TIMEOUT } from "../constants";

// API client configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
};

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Request timeout utility
const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), ms);
  });
};

// Fetch wrapper with timeout and error handling
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(ERROR_MESSAGES.TIMEOUT_ERROR, 408, "Request Timeout");
    }
    throw error;
  }
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

// Add auth header to request
const addAuthHeader = (headers: HeadersInit): HeadersInit => {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};

// Parse response and handle errors
const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new ApiError(
      errorData.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      response.status,
      response.statusText,
      errorData
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(
      "Invalid JSON response",
      response.status,
      response.statusText
    );
  }
};

// Base API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const headers = addAuthHeader({
    ...API_CONFIG.headers,
    ...options.headers,
  });

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0, "Network Error");
    }

    throw new ApiError(ERROR_MESSAGES.UNKNOWN_ERROR, 0, "Unknown Error");
  }
};

// HTTP method functions
export const api = {
  // GET request
  get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return apiRequest<T>(url.pathname + url.search, {
      method: "GET",
    });
  },

  // POST request
  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT request
  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PATCH request
  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE request
  delete: <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "DELETE",
    });
  },

  // File upload
  upload: <T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(
              new ApiError(
                "Invalid response format",
                xhr.status,
                xhr.statusText
              )
            );
          }
        } else {
          reject(new ApiError("Upload failed", xhr.status, xhr.statusText));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0, "Network Error"));
      });

      xhr.addEventListener("abort", () => {
        reject(new ApiError("Upload cancelled", 0, "Cancelled"));
      });

      xhr.open("POST", `${API_CONFIG.baseURL}${endpoint}`);

      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },
};

// Specific API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: any }>>(
      "/auth/login",
      credentials
    ),

  register: (userData: any) =>
    api.post<ApiResponse<{ token: string; user: any }>>(
      "/auth/register",
      userData
    ),

  logout: () => api.post<ApiResponse<void>>("/auth/logout"),

  refreshToken: () => api.post<ApiResponse<{ token: string }>>("/auth/refresh"),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<void>>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<void>>("/auth/reset-password", { token, password }),

  verifyEmail: (token: string) =>
    api.post<ApiResponse<void>>("/auth/verify-email", { token }),
};

export const userApi = {
  getProfile: () => api.get<ApiResponse<any>>("/users/profile"),

  updateProfile: (data: any) =>
    api.put<ApiResponse<any>>("/users/profile", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse<void>>("/users/change-password", data),

  deleteAccount: () => api.delete<ApiResponse<void>>("/users/account"),

  getSettings: () => api.get<ApiResponse<any>>("/users/settings"),

  updateSettings: (data: any) =>
    api.put<ApiResponse<any>>("/users/settings", data),
};

export const mentorApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>("/mentors", params),

  getById: (id: string) => api.get<ApiResponse<any>>(`/mentors/${id}`),

  search: (query: string, filters?: any) =>
    api.get<PaginatedResponse<any>>("/mentors/search", { query, ...filters }),

  getAvailability: (id: string, date?: string) =>
    api.get<ApiResponse<any>>(`/mentors/${id}/availability`, { date }),

  getReviews: (id: string, params?: any) =>
    api.get<PaginatedResponse<any>>(`/mentors/${id}/reviews`, params),

  getSessions: (id: string, params?: any) =>
    api.get<PaginatedResponse<any>>(`/mentors/${id}/sessions`, params),

  getStudents: (mentorId: string) =>
    api.get<ApiResponse<any>>(`/mentors/${mentorId}/students`),
};

export const sessionApi = {
  getAll: (params?: any) =>
    api.get<PaginatedResponse<any>>("/sessions", params),

  getById: (id: string) => api.get<ApiResponse<any>>(`/sessions/${id}`),

  create: (data: any) => api.post<ApiResponse<any>>("/sessions", data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/sessions/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<void>>(`/sessions/${id}`),

  cancel: (id: string, reason?: string) =>
    api.post<ApiResponse<void>>(`/sessions/${id}/cancel`, { reason }),

  reschedule: (id: string, data: any) =>
    api.post<ApiResponse<any>>(`/sessions/${id}/reschedule`, data),

  complete: (id: string, data?: any) =>
    api.post<ApiResponse<void>>(`/sessions/${id}/complete`, data),

  addFeedback: (id: string, data: any) =>
    api.post<ApiResponse<void>>(`/sessions/${id}/feedback`, data),
};

export const groupSessionApi = {
  getAll: (params?: any) =>
    api.get<PaginatedResponse<any>>("/group-sessions", params),

  getById: (id: string) => api.get<ApiResponse<any>>(`/group-sessions/${id}`),

  create: (data: any) => api.post<ApiResponse<any>>("/group-sessions", data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/group-sessions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/group-sessions/${id}`),

  join: (id: string) =>
    api.post<ApiResponse<void>>(`/group-sessions/${id}/join`),

  leave: (id: string) =>
    api.post<ApiResponse<void>>(`/group-sessions/${id}/leave`),

  getTopics: (id: string) =>
    api.get<ApiResponse<any>>(`/group-sessions/${id}/topics`),

  submitTopic: (id: string, data: any) =>
    api.post<ApiResponse<any>>(`/group-sessions/${id}/topics`, data),

  voteTopic: (id: string, topicId: string) =>
    api.post<ApiResponse<void>>(`/group-sessions/${id}/topics/${topicId}/vote`),
};

export const communityApi = {
  getAll: (params?: any) =>
    api.get<PaginatedResponse<any>>("/communities", params),

  getById: (id: string) => api.get<ApiResponse<any>>(`/communities/${id}`),

  create: (data: any) => api.post<ApiResponse<any>>("/communities", data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/communities/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<void>>(`/communities/${id}`),

  join: (id: string) => api.post<ApiResponse<void>>(`/communities/${id}/join`),

  leave: (id: string) =>
    api.post<ApiResponse<void>>(`/communities/${id}/leave`),

  getPosts: (id: string, params?: any) =>
    api.get<PaginatedResponse<any>>(`/communities/${id}/posts`, params),

  createPost: (id: string, data: any) =>
    api.post<ApiResponse<any>>(`/communities/${id}/posts`, data),

  getPost: (communityId: string, postId: string) =>
    api.get<ApiResponse<any>>(`/communities/${communityId}/posts/${postId}`),

  updatePost: (communityId: string, postId: string, data: any) =>
    api.put<ApiResponse<any>>(
      `/communities/${communityId}/posts/${postId}`,
      data
    ),

  deletePost: (communityId: string, postId: string) =>
    api.delete<ApiResponse<void>>(
      `/communities/${communityId}/posts/${postId}`
    ),

  likePost: (communityId: string, postId: string) =>
    api.post<ApiResponse<void>>(
      `/communities/${communityId}/posts/${postId}/like`
    ),

  unlikePost: (communityId: string, postId: string) =>
    api.delete<ApiResponse<void>>(
      `/communities/${communityId}/posts/${postId}/like`
    ),

  addComment: (communityId: string, postId: string, data: any) =>
    api.post<ApiResponse<any>>(
      `/communities/${communityId}/posts/${postId}/comments`,
      data
    ),

  updateComment: (
    communityId: string,
    postId: string,
    commentId: string,
    data: any
  ) =>
    api.put<ApiResponse<any>>(
      `/communities/${communityId}/posts/${postId}/comments/${commentId}`,
      data
    ),

  deleteComment: (communityId: string, postId: string, commentId: string) =>
    api.delete<ApiResponse<void>>(
      `/communities/${communityId}/posts/${postId}/comments/${commentId}`
    ),
};

export const paymentApi = {
  createPaymentIntent: (data: any) =>
    api.post<ApiResponse<any>>("/payments/create-intent", data),

  confirmPayment: (paymentIntentId: string) =>
    api.post<ApiResponse<any>>(`/payments/${paymentIntentId}/confirm`),

  getPaymentHistory: (params?: any) =>
    api.get<PaginatedResponse<any>>("/payments/history", params),

  getPaymentById: (id: string) => api.get<ApiResponse<any>>(`/payments/${id}`),

  refundPayment: (id: string, reason?: string) =>
    api.post<ApiResponse<void>>(`/payments/${id}/refund`, { reason }),
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Retry utility for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Don't retry on client errors (4xx)
      if (
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};
