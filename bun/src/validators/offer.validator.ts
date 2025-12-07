import { z } from "zod";

export const createOfferSchema = z.object({
  task_id: z.string().uuid("Invalid task ID"),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().default("USD").optional(),
  message: z.string().max(1000, "Message too long").optional(),
});

export const updateOfferSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0").optional(),
  message: z.string().max(1000, "Message too long").optional(),
  status: z
    .enum(["pending", "accepted", "rejected", "withdrawn"])
    .optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

