/**
 * Database schema types for Supabase
 * 
 * To regenerate these types, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: "pending" | "in_progress" | "completed";
          created_at: string;
          updated_at: string;
          user_id: string | null;
          date_type: "on_date" | "before_date" | "flexible" | null;
          task_date: string | null;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          budget_min: number | null;
          budget_max: number | null;
          budget_currency: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          date_type?: "on_date" | "before_date" | "flexible" | null;
          task_date?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_currency?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          date_type?: "on_date" | "before_date" | "flexible" | null;
          task_date?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_currency?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          amount: number;
          currency: string;
          message: string | null;
          status: "pending" | "accepted" | "rejected" | "withdrawn";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          amount: number;
          currency?: string;
          message?: string | null;
          status?: "pending" | "accepted" | "rejected" | "withdrawn";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          message?: string | null;
          status?: "pending" | "accepted" | "rejected" | "withdrawn";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "offers_task_id_fkey";
            columns: ["task_id"];
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      task_status: "pending" | "in_progress" | "completed";
      offer_status: "pending" | "accepted" | "rejected" | "withdrawn";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

