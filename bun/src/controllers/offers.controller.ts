import type { Request, Response } from "express";
import { AppError } from "@/middleware/error-handler";
import {
  createOfferSchema,
  updateOfferSchema,
} from "@/validators/offer.validator";
import { supabaseAdmin } from "@/config/supabase";

/**
 * Get all offers for a specific task
 * Public - anyone can view offers (transparent marketplace)
 */
export const getOffersByTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  // Verify task exists
  const { data: task, error: taskError } = await supabaseAdmin
    .from("tasks")
    .select("id")
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    throw new AppError(404, "Task not found");
  }

  // Get all offers for this task (public visibility)
  const { data: offers, error } = await supabaseAdmin
    .from("offers")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(500, `Failed to fetch offers: ${error.message}`);
  }

  res.json({
    status: "success",
    data: offers,
    count: offers?.length || 0,
  });
};

/**
 * Get all offers made by the authenticated user
 */
export const getMyOffers = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const { data: offers, error } = await supabaseAdmin
    .from("offers")
    .select(`
      *,
      tasks:task_id (
        id,
        title,
        status,
        budget_min,
        budget_max
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(500, `Failed to fetch offers: ${error.message}`);
  }

  res.json({
    status: "success",
    data: offers,
    count: offers?.length || 0,
  });
};

/**
 * Get a specific offer by ID
 */
export const getOfferById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const { data: offer, error } = await supabaseAdmin
    .from("offers")
    .select(`
      *,
      tasks:task_id (
        id,
        title,
        user_id
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new AppError(404, "Offer not found");
    }
    throw new AppError(500, `Failed to fetch offer: ${error.message}`);
  }

  // Check if user is offer owner or task owner
  const isOfferOwner = offer.user_id === userId;
  const isTaskOwner = (offer as any).tasks?.user_id === userId;

  if (!isOfferOwner && !isTaskOwner) {
    throw new AppError(403, "You don't have permission to view this offer");
  }

  res.json({
    status: "success",
    data: offer,
  });
};

/**
 * Create a new offer
 */
export const createOffer = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const result = createOfferSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { task_id, amount, currency, message } = result.data;

  // Verify task exists and user is not the task owner
  const { data: task, error: taskError } = await supabaseAdmin
    .from("tasks")
    .select("user_id, status")
    .eq("id", task_id)
    .single();

  if (taskError || !task) {
    throw new AppError(404, "Task not found");
  }

  if (task.user_id === userId) {
    throw new AppError(400, "You cannot make an offer on your own task");
  }

  if (task.status !== "pending") {
    throw new AppError(400, "This task is no longer accepting offers");
  }

  // Check if user already has an offer on this task
  const { data: existingOffer } = await supabaseAdmin
    .from("offers")
    .select("id")
    .eq("task_id", task_id)
    .eq("user_id", userId)
    .single();

  if (existingOffer) {
    throw new AppError(
      400,
      "You have already made an offer on this task. Please update your existing offer instead."
    );
  }

  const { data: newOffer, error } = await supabaseAdmin
    .from("offers")
    .insert({
      task_id,
      user_id: userId,
      amount,
      currency: currency || "USD",
      message,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new AppError(500, `Failed to create offer: ${error.message}`);
  }

  res.status(201).json({
    status: "success",
    data: newOffer,
    message: "Offer created successfully",
  });
};

/**
 * Update an offer (amount, message, or status)
 */
export const updateOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const result = updateOfferSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  // Get the offer with task info
  const { data: offer, error: fetchError } = await supabaseAdmin
    .from("offers")
    .select(`
      *,
      tasks:task_id (
        user_id
      )
    `)
    .eq("id", id)
    .single();

  if (fetchError || !offer) {
    throw new AppError(404, "Offer not found");
  }

  const isOfferOwner = offer.user_id === userId;
  const isTaskOwner = (offer as any).tasks?.user_id === userId;

  // Offer owner can only update their own pending offers (amount/message)
  if (isOfferOwner && !isTaskOwner) {
    if (offer.status !== "pending") {
      throw new AppError(400, "You can only update pending offers");
    }

    if (result.data.status) {
      throw new AppError(
        403,
        "Only the task owner can change the offer status"
      );
    }
  }

  // Task owner can only update status
  if (isTaskOwner && !isOfferOwner) {
    if (!result.data.status) {
      throw new AppError(403, "You can only update the offer status");
    }

    if (result.data.amount || result.data.message) {
      throw new AppError(
        403,
        "Only the offer owner can change the amount or message"
      );
    }
  }

  // If neither owner nor task owner
  if (!isOfferOwner && !isTaskOwner) {
    throw new AppError(403, "You don't have permission to update this offer");
  }

  // Update the offer
  const { data: updatedOffer, error } = await supabaseAdmin
    .from("offers")
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new AppError(500, `Failed to update offer: ${error.message}`);
  }

  // If task owner accepted the offer, update task status to "in_progress"
  if (isTaskOwner && result.data.status === "accepted") {
    const { error: taskUpdateError } = await supabaseAdmin
      .from("tasks")
      .update({
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", offer.task_id);

    if (taskUpdateError) {
      console.error("Failed to update task status:", taskUpdateError);
      // Don't throw error, offer was accepted successfully
    }

    // Optionally: Reject all other pending offers on this task
    await supabaseAdmin
      .from("offers")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("task_id", offer.task_id)
      .eq("status", "pending")
      .neq("id", id);
  }

  res.json({
    status: "success",
    data: updatedOffer,
    message: "Offer updated successfully",
  });
};

/**
 * Delete/withdraw an offer
 */
export const deleteOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const { data: offer, error: fetchError } = await supabaseAdmin
    .from("offers")
    .select("user_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !offer) {
    throw new AppError(404, "Offer not found");
  }

  if (offer.user_id !== userId) {
    throw new AppError(403, "You can only delete your own offers");
  }

  if (offer.status !== "pending") {
    throw new AppError(400, "You can only delete pending offers");
  }

  const { error } = await supabaseAdmin.from("offers").delete().eq("id", id);

  if (error) {
    throw new AppError(500, `Failed to delete offer: ${error.message}`);
  }

  res.status(204).send();
};

