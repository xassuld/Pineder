import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success: true,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  return res.status(status).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  status = 400
): Response<ApiResponse> => {
  const response: ApiResponse = {
    success: false,
    error,
  };

  return res.status(status).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response<ApiResponse<T[]>> => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  return res.status(200).json(response);
};

export const notFoundResponse = (
  res: Response,
  resource: string = "Resource"
): Response<ApiResponse> => {
  return errorResponse(res, `${resource} not found`, 404);
};

export const unauthorizedResponse = (
  res: Response,
  message: string = "Authentication required"
): Response<ApiResponse> => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (
  res: Response,
  message: string = "Access denied"
): Response<ApiResponse> => {
  return errorResponse(res, message, 403);
};

export const validationErrorResponse = (
  res: Response,
  message: string = "Validation failed"
): Response<ApiResponse> => {
  return errorResponse(res, message, 422);
};

export const serverErrorResponse = (
  res: Response,
  message: string = "Internal server error"
): Response<ApiResponse> => {
  return errorResponse(res, message, 500);
};
