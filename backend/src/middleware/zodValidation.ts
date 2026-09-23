import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, ZodIssue } from "zod";
import { logger } from "../utils/logger";
import { ValidationError } from "../types/common";

export const validateBody = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation error", {
          errors: error.issues,
          path: req.path,
          method: req.method,
        });

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map(
            (err: ZodIssue): ValidationError => ({
              field: err.path.join("."),
              message: err.message,
              value: err.code,
            })
          ),
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.query);
      (req as any).validatedQuery = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Query validation error", {
          errors: error.issues,
          path: req.path,
          method: req.method,
        });

        return res.status(400).json({
          success: false,
          error: "Invalid query parameters",
          details: error.issues.map(
            (err: ZodIssue): ValidationError => ({
              field: err.path.join("."),
              message: err.message,
              value: err.code,
            })
          ),
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.params);
      (req as any).validatedParams = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Params validation error", {
          errors: error.issues,
          path: req.path,
          method: req.method,
        });

        return res.status(400).json({
          success: false,
          error: "Invalid URL parameters",
          details: error.issues.map(
            (err: ZodIssue): ValidationError => ({
              field: err.path.join("."),
              message: err.message,
              value: err.code,
            })
          ),
        });
      }
      next(error);
    }
  };
};

export const validate = (schemas: {
  body?: ZodObject<any>;
  query?: ZodObject<any>;
  params?: ZodObject<any>;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        (req as any).validatedQuery = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        (req as any).validatedParams = await schemas.params.parseAsync(
          req.params
        );
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation error", {
          errors: error.issues,
          path: req.path,
          method: req.method,
        });

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map(
            (err: ZodIssue): ValidationError => ({
              field: err.path.join("."),
              message: err.message,
              value: err.code,
            })
          ),
        });
      }
      next(error);
    }
  };
};
