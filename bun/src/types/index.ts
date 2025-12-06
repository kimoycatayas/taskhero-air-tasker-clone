export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
  count?: number;
}
