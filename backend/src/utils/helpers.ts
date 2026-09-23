import { Response } from "express";
import { logger } from "./logger";
import {
  ApiResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../types/common";

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: ApiResponse<T> = createSuccessResponse(data, message, status);
  res.status(status).json(response);
};

export const sendError = (res: Response, error: string, status = 500) => {
  const response = createErrorResponse(error);
  res.status(status).json(response);
};

export const sendNotFound = (res: Response, resource = "Resource") => {
  return sendError(res, `${resource} not found`, 404);
};

export const sendUnauthorized = (res: Response, message = "Unauthorized") => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = "Forbidden") => {
  return sendError(res, message, 403);
};

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationOptions = (
  page: string | number | undefined,
  limit: string | number | undefined
): PaginationOptions => {
  const pageNum = parseInt(String(page)) || 1;
  const limitNum = parseInt(String(limit)) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};




