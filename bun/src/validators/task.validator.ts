import { z } from "zod";

export const createTaskSchema = z.object({
  // Step 1: Title & Date
  title: z.string().min(1, "Title is required").max(200),
  date_type: z
    .enum(["on_date", "before_date", "flexible"], {
      required_error: "Date type is required",
    })
    .optional(),
  task_date: z.string().datetime().optional().nullable(),

  // Step 2: Location
  location_address: z.string().optional().nullable(),
  location_lat: z.number().min(-90).max(90).optional().nullable(),
  location_lng: z.number().min(-180).max(180).optional().nullable(),

  // Step 3: Details
  description: z.string().optional().default(""),

  // Step 4: Budget
  budget_min: z.number().min(0).optional().nullable(),
  budget_max: z.number().min(0).optional().nullable(),
  budget_currency: z.string().default("USD").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  date_type: z.enum(["on_date", "before_date", "flexible"]).optional(),
  task_date: z.string().datetime().optional().nullable(),
  location_address: z.string().optional().nullable(),
  location_lat: z.number().min(-90).max(90).optional().nullable(),
  location_lng: z.number().min(-180).max(180).optional().nullable(),
  budget_min: z.number().min(0).optional().nullable(),
  budget_max: z.number().min(0).optional().nullable(),
  budget_currency: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

