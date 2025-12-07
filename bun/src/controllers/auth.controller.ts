import type { Request, Response } from "express";
import { supabase, supabaseAdmin } from "@/config/supabase";
import { AppError } from "@/middleware/error-handler";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  refreshTokenSchema,
} from "@/validators/auth.validator";
import type { AuthResponse } from "@/types";
import { config } from "@/config/env";

/**
 * Sign up a new user
 */
export const signup = async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { email, password, fullName } = result.data;

  // Create user with Supabase Auth using signUp
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (error) {
    if (
      error.message.includes("already registered") ||
      error.message.includes("already been registered")
    ) {
      throw new AppError(409, "User with this email already exists");
    }
    throw new AppError(400, error.message);
  }

  if (!data.user) {
    throw new AppError(500, "Failed to create user");
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    // User created but needs to confirm email
    res.status(201).json({
      status: "success",
      message:
        "Signup successful! Please check your email to confirm your account before logging in.",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        },
        requiresEmailConfirmation: true,
      },
    });
    return;
  }

  // User created and session generated (email confirmation disabled)
  const response: AuthResponse = {
    user: {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    },
    session: {
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
      expires_in: data.session!.expires_in,
      expires_at: data.session!.expires_at!,
    },
  };

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: response,
  });
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { email, password } = result.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!data.user || !data.session) {
    throw new AppError(500, "Failed to create session");
  }

  const response: AuthResponse = {
    user: {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at!,
    },
  };

  res.json({
    status: "success",
    message: "Login successful",
    data: response,
  });
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "No token provided");
  }

  const token = authHeader.substring(7);

  const { error } = await supabase.auth.admin.signOut(token);

  if (error) {
    throw new AppError(500, "Failed to logout");
  }

  res.json({
    status: "success",
    message: "Logout successful",
  });
};

/**
 * Request password reset
 */
export const resetPassword = async (req: Request, res: Response) => {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { email } = result.data;

  // Get the redirect URL from environment or use default frontend URL
  const redirectUrl =
    process.env.PASSWORD_RESET_URL ||
    "http://localhost:3000/auth/update-password";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    throw new AppError(500, error.message);
  }

  // Always return success even if email doesn't exist (security best practice)
  res.json({
    status: "success",
    message:
      "If an account exists with this email, a password reset link has been sent",
  });
};

/**
 * Update password (after reset)
 */
export const updatePassword = async (req: Request, res: Response) => {
  const result = updatePasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { password } = result.data;

  // Get token from authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "No token provided");
  }

  const token = authHeader.substring(7);

  // Verify the recovery token and get the user
  const { data: userData, error: userError } = await supabase.auth.getUser(
    token
  );

  if (userError || !userData.user) {
    throw new AppError(
      401,
      "Invalid or expired reset token. Please request a new password reset."
    );
  }

  // Check if service role key is available for admin operations
  if (!config.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(
      500,
      "Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables."
    );
  }

  // Use admin API to update the user's password
  // This is allowed because we've verified the recovery token above
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userData.user.id,
    { password }
  );

  if (error) {
    console.log("Password update error:", error);
    throw new AppError(
      500,
      error.message || "Failed to update password. Please try again."
    );
  }

  if (!data.user) {
    throw new AppError(500, "Failed to update password");
  }

  res.json({
    status: "success",
    message: "Password updated successfully",
  });
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response) => {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { refresh_token } = result.data;

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error || !data.session) {
    throw new AppError(401, "Invalid refresh token");
  }

  const response = {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at!,
  };

  res.json({
    status: "success",
    data: response,
  });
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(
    req.user.id
  );

  if (error || !data.user) {
    throw new AppError(404, "User not found");
  }

  res.json({
    status: "success",
    data: {
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      user_metadata: data.user.user_metadata,
    },
  });
};
