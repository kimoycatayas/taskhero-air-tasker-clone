import { authApi } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  count?: number;
}

class TasksApi {
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = authApi.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const result: ApiResponse<Task[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch tasks");
    }

    return result.data || [];
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const result: ApiResponse<Task> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch task");
    }

    if (!result.data) {
      throw new Error("Task not found");
    }

    return result.data;
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Task> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create task");
    }

    if (!result.data) {
      throw new Error("Failed to create task");
    }

    return result.data;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Task> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update task");
    }

    if (!result.data) {
      throw new Error("Failed to update task");
    }

    return result.data;
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const result: ApiResponse<void> = await response.json();
      throw new Error(result.message || "Failed to delete task");
    }
  }
}

export const tasksApi = new TasksApi();

