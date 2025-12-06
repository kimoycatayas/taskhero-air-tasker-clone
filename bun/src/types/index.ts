import type { Database } from "./database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
  count?: number;
}
