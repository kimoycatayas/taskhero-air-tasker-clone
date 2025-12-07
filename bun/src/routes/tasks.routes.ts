import { Router } from "express";
import { asyncHandler } from "@/middleware/error-handler";
import { optionalAuth } from "@/middleware/auth";
import * as taskController from "@/controllers/tasks.controller";

const router = Router();

// Apply optional auth to all routes - works with or without authentication
router.use(optionalAuth);

router.get("/", asyncHandler(taskController.getAllTasks));
router.get("/:id", asyncHandler(taskController.getTaskById));
router.post("/", asyncHandler(taskController.createTask));
router.put("/:id", asyncHandler(taskController.updateTask));
router.delete("/:id", asyncHandler(taskController.deleteTask));

export default router;
