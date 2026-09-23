import { Request, Response, NextFunction } from "express";
import { forbiddenResponse } from "../utils/responseHelpers";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers["x-user-role"] as string;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return forbiddenResponse(res, "Insufficient permissions");
    }
    
    next();
  };
};

export const requireStudent = requireRole(["student"]);
export const requireMentor = requireRole(["mentor"]);
