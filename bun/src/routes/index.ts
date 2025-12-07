import { Router } from "express";
import tasksRouter from "./tasks.routes";
import authRouter from "./auth.routes";
import offersRouter from "./offers.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "TaskHero API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      tasks: "/api/tasks",
      offers: "/api/offers",
    },
  });
});

router.use("/auth", authRouter);
router.use("/tasks", tasksRouter);
router.use("/offers", offersRouter);

export default router;
