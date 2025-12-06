import type { Request, Response } from "express";
import { AppError } from "@/middleware/error-handler";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";
import { supabase } from "@/config/supabase";

export const getAllTasks = async (_req: Request, res: Response) => {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
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

  const { data: task, error } = await supabase
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

  const { title, description } = result.data;

  const { data: newTask, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      status: "pending",
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

  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

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

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    throw new AppError(500, `Failed to delete task: ${error.message}`);
  }

  res.status(204).send();
};
