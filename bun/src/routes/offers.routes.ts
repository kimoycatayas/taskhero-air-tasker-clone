import { Router } from "express";
import { asyncHandler } from "@/middleware/error-handler";
import { requireAuth, optionalAuth } from "@/middleware/auth";
import {
  getOffersByTask,
  getMyOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} from "@/controllers/offers.controller";

const router = Router();

// Get all offers for a specific task - PUBLIC (anyone can view)
router.get("/task/:taskId", optionalAuth, asyncHandler(getOffersByTask));

// All other routes require authentication
router.use(requireAuth);

// Get all offers made by the authenticated user
router.get("/my-offers", asyncHandler(getMyOffers));

// Get a specific offer by ID
router.get("/:id", asyncHandler(getOfferById));

// Create a new offer
router.post("/", asyncHandler(createOffer));

// Update an offer (amount/message for owner, status for task owner)
router.put("/:id", asyncHandler(updateOffer));

// Delete/withdraw an offer
router.delete("/:id", asyncHandler(deleteOffer));

export default router;

