import type { Request, Response } from "express";
import { AppError } from "@/middleware/error-handler";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";
import { supabaseAdmin } from "@/config/supabase";

export const getAllTasks = async (_req: Request, res: Response) => {
  // Get all tasks with offer counts ordered by creation date (newest first)
  // All tasks are public so any user can see them and make offers
  const { data: tasks, error } = await supabaseAdmin
    .from("tasks")
    .select(
      `
      *,
      offers:offers(count)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(500, `Failed to fetch tasks: ${error.message}`);
  }

  // Transform the data to include offer_count
  const tasksWithCount = tasks?.map((task: any) => ({
    ...task,
    offer_count: task.offers?.[0]?.count || 0,
    offers: undefined, // Remove the offers object
  }));

  res.json({
    status: "success",
    data: tasksWithCount,
    count: tasksWithCount?.length || 0,
  });
};

export const getMyTasks = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const { data: tasks, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(500, `Failed to fetch tasks: ${error.message}`);
  }

  res.json({
    status: "success",
    data: tasks,
    count: tasks?.length || 0,
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // All tasks are public - anyone can view them
  const { data: task, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new AppError(404, "Task not found");
    }
    throw new AppError(500, `Failed to fetch task: ${error.message}`);
  }

  res.json({
    status: "success",
    data: task,
  });
};

export const createTask = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const {
    title,
    description,
    date_type,
    task_date,
    location_address,
    location_lat,
    location_lng,
    budget_min,
    budget_max,
    budget_currency,
  } = result.data;
  const userId = req.user?.id || null;

  const { data: newTask, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      title,
      description,
      date_type,
      task_date,
      location_address,
      location_lat,
      location_lng,
      budget_min,
      budget_max,
      budget_currency: budget_currency || "USD",
      status: "pending",
      user_id: userId, // Associate task with user if authenticated
    })
    .select()
    .single();

  if (error) {
    throw new AppError(500, `Failed to create task: ${error.message}`);
  }

  res.status(201).json({
    status: "success",
    data: newTask,
  });
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const userId = req.user?.id;

  // Build query with user_id filter if authenticated
  let query = supabaseAdmin
    .from("tasks")
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.is("user_id", null);
  }

  const { data: updatedTask, error } = await query.select().single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new AppError(404, "Task not found");
    }
    throw new AppError(500, `Failed to update task: ${error.message}`);
  }

  res.json({
    status: "success",
    data: updatedTask,
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  let query = supabaseAdmin.from("tasks").delete().eq("id", id);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.is("user_id", null);
  }

  const { error } = await query;

  if (error) {
    throw new AppError(500, `Failed to delete task: ${error.message}`);
  }

  res.status(204).send();
};

/**
 * Complete a task - only the tasker with accepted offer can complete
 */
export const completeTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // Get the task
  const { data: task, error: taskError } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (taskError || !task) {
    throw new AppError(404, "Task not found");
  }

  // Check if task is in progress
  if (task.status !== "in_progress") {
    throw new AppError(400, "Task must be in progress to be completed");
  }

  // Verify user has an accepted offer for this task
  const { data: acceptedOffer, error: offerError } = await supabaseAdmin
    .from("offers")
    .select("id, status")
    .eq("task_id", id)
    .eq("user_id", userId)
    .eq("status", "accepted")
    .single();

  if (offerError || !acceptedOffer) {
    throw new AppError(
      403,
      "You don't have permission to complete this task. Only the tasker with an accepted offer can complete it."
    );
  }

  // Update task status to completed
  const { data: updatedTask, error: updateError } = await supabaseAdmin
    .from("tasks")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    throw new AppError(500, `Failed to complete task: ${updateError.message}`);
  }

  res.json({
    status: "success",
    data: updatedTask,
    message: "Task completed successfully",
  });
};

/**
 * Decline a task - tasker with accepted offer withdraws from the task
 */
export const declineTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // Get the task
  const { data: task, error: taskError } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (taskError || !task) {
    throw new AppError(404, "Task not found");
  }

  // Check if task is in progress
  if (task.status !== "in_progress") {
    throw new AppError(400, "Task must be in progress to be declined");
  }

  // Verify user has an accepted offer for this task
  const { data: acceptedOffer, error: offerError } = await supabaseAdmin
    .from("offers")
    .select("id, status")
    .eq("task_id", id)
    .eq("user_id", userId)
    .eq("status", "accepted")
    .single();

  if (offerError || !acceptedOffer) {
    throw new AppError(
      403,
      "You don't have permission to decline this task. Only the tasker with an accepted offer can decline it."
    );
  }

  // Update offer status to withdrawn
  const { error: offerUpdateError } = await supabaseAdmin
    .from("offers")
    .update({
      status: "withdrawn",
      updated_at: new Date().toISOString(),
    })
    .eq("id", acceptedOffer.id);

  if (offerUpdateError) {
    throw new AppError(
      500,
      `Failed to withdraw offer: ${offerUpdateError.message}`
    );
  }

  // Update task status back to pending
  const { data: updatedTask, error: updateError } = await supabaseAdmin
    .from("tasks")
    .update({
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    throw new AppError(500, `Failed to decline task: ${updateError.message}`);
  }

  res.json({
    status: "success",
    data: updatedTask,
    message:
      "Task declined successfully. The task is now available for other taskers.",
  });
};
