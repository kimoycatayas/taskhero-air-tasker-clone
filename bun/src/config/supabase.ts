import { createClient } from "@supabase/supabase-js";
import { config } from "@/config/env";
import type { Database } from "@/types/database.types";

// Create Supabase client with anon key (for client-side operations)
export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Disable session persistence for server-side
    },
  }
);

// Create Supabase client with service role key (for admin operations)
// Use this for bypassing RLS policies when needed
export const supabaseAdmin = config.SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

