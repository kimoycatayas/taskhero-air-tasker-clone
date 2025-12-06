import { Router } from "express";
import tasksRouter from "./tasks.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "TaskHero API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      tasks: "/api/tasks",
    },
  });
});

router.use("/tasks", tasksRouter);

export default router;
