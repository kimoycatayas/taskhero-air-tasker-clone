import { Router } from "express";
import {
  signup,
  login,
  logout,
  resetPassword,
  updatePassword,
  refreshToken,
  getProfile,
} from "@/controllers/auth.controller";
import { requireAuth } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/error-handler";

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", asyncHandler(signup));

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post("/login", asyncHandler(login));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate token
 * @access  Private
 */
router.post("/logout", requireAuth, asyncHandler(logout));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post("/reset-password", asyncHandler(resetPassword));

/**
 * @route   POST /api/auth/update-password
 * @desc    Update password (after reset - uses recovery token)
 * @access  Public (but requires valid recovery token in header)
 */
router.post("/update-password", asyncHandler(updatePassword));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post("/refresh", asyncHandler(refreshToken));

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", requireAuth, asyncHandler(getProfile));

export default router;

