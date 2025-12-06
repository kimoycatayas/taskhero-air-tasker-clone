/**
 * Supabase Utility Functions
 * Helper functions for common Supabase operations
 */

import { supabase, supabaseAdmin } from "@/config/supabase";
import type { TaskInsert, TaskUpdate } from "@/types";

/**
 * Check if Supabase connection is healthy
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("tasks").select("count").limit(1);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Get task statistics
 */
export async function getTaskStats() {
  const { data: tasks, error } = await supabase.from("tasks").select("status");

  if (error) throw error;

  const stats = {
    total: tasks?.length || 0,
    pending: tasks?.filter((t) => t.status === "pending").length || 0,
    in_progress: tasks?.filter((t) => t.status === "in_progress").length || 0,
    completed: tasks?.filter((t) => t.status === "completed").length || 0,
  };

  return stats;
}

/**
 * Bulk create tasks (admin only)
 */
export async function bulkCreateTasks(tasks: TaskInsert[]) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert(tasks)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Search tasks by title or description
 */
export async function searchTasks(query: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus(
  status: "pending" | "in_progress" | "completed"
) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Mark task as completed
 */
export async function markTaskCompleted(taskId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: "completed" })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

