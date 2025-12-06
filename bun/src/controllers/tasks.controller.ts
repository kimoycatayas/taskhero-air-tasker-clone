import type { Request, Response } from "express";
import { AppError } from "@/middleware/error-handler";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";
import type { Task } from "@/types";

// Mock data for now
let tasks: Task[] = [
  {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

export const getAllTasks = async (_req: Request, res: Response) => {
  res.json({
    status: "success",
    data: tasks,
    count: tasks.length,
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  res.json({
    status: "success",
    data: task,
  });
};

export const createTask = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const { title, description } = result.data;

  const newTask: Task = {
    id: String(tasks.length + 1),
    title,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json({
    status: "success",
    data: newTask,
  });
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, result.error.errors[0].message);
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new AppError(404, "Task not found");
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...result.data,
  };

  res.json({
    status: "success",
    data: tasks[taskIndex],
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new AppError(404, "Task not found");
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
};
