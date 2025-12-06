import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import { config } from "@/config/env";
import { errorHandler } from "@/middleware/error-handler";
import { requestLogger } from "@/middleware/logger";
import { checkSupabaseConnection } from "@/utils/supabase.utils";
import routes from "@/routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", async (_req, res) => {
  const supabaseHealthy = await checkSupabaseConnection();

  res.json({
    status: supabaseHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    services: {
      database: supabaseHealthy ? "connected" : "disconnected",
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 TaskHero API running on http://localhost:${config.PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log(`🗄️  Database: Supabase`);
});
