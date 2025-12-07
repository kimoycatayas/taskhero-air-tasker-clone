import type { Request, Response, NextFunction } from "express";
import { supabase } from "@/config/supabase";
import { AppError } from "@/middleware/error-handler";

/**
 * Middleware to verify JWT token and attach user to request
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "No token provided");
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new AppError(401, "Invalid or expired token");
    }

    // Attach user to request
    req.user = data.user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, "Authentication failed"));
    }
  }
};

/**
 * Optional auth middleware - attaches user if token is valid, but doesn't fail if not
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data } = await supabase.auth.getUser(token);

      if (data.user) {
        req.user = data.user;
      }
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};
