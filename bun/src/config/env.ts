import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_VERSION: z.string().default("v1"),
});

const env = envSchema.parse({
  PORT: process.env.PORT || "3001",
  NODE_ENV: process.env.NODE_ENV || "development",
  API_VERSION: process.env.API_VERSION || "v1",
});

export const config = {
  PORT: parseInt(env.PORT, 10),
  NODE_ENV: env.NODE_ENV,
  API_VERSION: env.API_VERSION,
} as const;
