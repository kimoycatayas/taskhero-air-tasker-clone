import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().default(""),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

