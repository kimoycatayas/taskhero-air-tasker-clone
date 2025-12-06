import { Router } from "express";
import { asyncHandler } from "@/middleware/error-handler";
import * as taskController from "@/controllers/tasks.controller";

const router = Router();

router.get("/", asyncHandler(taskController.getAllTasks));
router.get("/:id", asyncHandler(taskController.getTaskById));
router.post("/", asyncHandler(taskController.createTask));
router.put("/:id", asyncHandler(taskController.updateTask));
router.delete("/:id", asyncHandler(taskController.deleteTask));

export default router;
