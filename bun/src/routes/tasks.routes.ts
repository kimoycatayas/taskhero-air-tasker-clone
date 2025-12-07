import { Router } from "express";
import { asyncHandler } from "@/middleware/error-handler";
import { optionalAuth, requireAuth } from "@/middleware/auth";
import * as taskController from "@/controllers/tasks.controller";

const router = Router();

// Apply optional auth to all routes - works with or without authentication
router.use(optionalAuth);

// Get all tasks (public - no auth required)
router.get("/", asyncHandler(taskController.getAllTasks));

// Get only user's own tasks (requires auth)
router.get("/my-tasks", requireAuth, asyncHandler(taskController.getMyTasks));

// Task actions for taskers
router.post("/:id/complete", requireAuth, asyncHandler(taskController.completeTask));
router.post("/:id/decline", requireAuth, asyncHandler(taskController.declineTask));

router.get("/:id", asyncHandler(taskController.getTaskById));
router.post("/", asyncHandler(taskController.createTask));
router.put("/:id", asyncHandler(taskController.updateTask));
router.delete("/:id", asyncHandler(taskController.deleteTask));

export default router;
