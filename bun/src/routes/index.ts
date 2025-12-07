import { Router } from "express";
import tasksRouter from "./tasks.routes";
import authRouter from "./auth.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "TaskHero API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      tasks: "/api/tasks",
    },
  });
});

router.use("/auth", authRouter);
router.use("/tasks", tasksRouter);

export default router;
