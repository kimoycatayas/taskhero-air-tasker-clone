# 📋 Quick Reference - Supabase Integration

## 🔑 Environment Variables

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Optional
```

## 🛠️ Setup Commands

```bash
# Interactive setup
bun run setup

# Start dev server
bun run dev

# Test API
bun run test:api
```

## 📁 New File Structure

```
src/
├── config/
│   ├── env.ts           ← Added Supabase env vars
│   └── supabase.ts      ← NEW: Supabase client
├── controllers/
│   └── tasks.controller.ts  ← Updated to use Supabase
├── types/
│   ├── database.types.ts    ← NEW: DB schema types
│   └── index.ts         ← Updated with DB types
└── utils/
    └── supabase.utils.ts    ← NEW: Helper functions

supabase/
└── migrations/
    └── 001_create_tasks_table.sql  ← NEW: DB schema
```

## 🗄️ Database Schema

```sql
tasks (
  id              UUID PRIMARY KEY
  title           TEXT NOT NULL
  description     TEXT DEFAULT ''
  status          TEXT CHECK(status IN ('pending', 'in_progress', 'completed'))
  created_at      TIMESTAMPTZ DEFAULT NOW()
  updated_at      TIMESTAMPTZ DEFAULT NOW()
  user_id         UUID → auth.users
)
```

## 🔒 Security (RLS Enabled)

- ✅ Users can view their own tasks
- ✅ Users can create tasks
- ✅ Users can update their own tasks
- ✅ Users can delete their own tasks
- ℹ️  Currently allows `user_id IS NULL` for testing

## 🔌 Using Supabase Client

```typescript
import { supabase } from "@/config/supabase";

// Query
const { data, error } = await supabase
  .from("tasks")
  .select("*")
  .eq("status", "pending");

// Insert
const { data, error } = await supabase
  .from("tasks")
  .insert({ title: "Task", status: "pending" });

// Update
const { data, error } = await supabase
  .from("tasks")
  .update({ status: "completed" })
  .eq("id", taskId);

// Delete
const { error } = await supabase
  .from("tasks")
  .delete()
  .eq("id", taskId);
```

## 🛠️ Helper Functions

```typescript
import {
  checkSupabaseConnection,
  getTaskStats,
  searchTasks,
  getTasksByStatus,
  markTaskCompleted,
} from "@/utils/supabase.utils";

// Health check
const healthy = await checkSupabaseConnection();

// Statistics
const stats = await getTaskStats();
// → { total: 10, pending: 3, in_progress: 4, completed: 3 }

// Search
const results = await searchTasks("important");

// Filter by status
const pending = await getTasksByStatus("pending");

// Quick complete
await markTaskCompleted(taskId);
```

## 📝 Type Safety

```typescript
import type { Task, TaskInsert, TaskUpdate } from "@/types";

// Type-safe operations
const newTask: TaskInsert = {
  title: "My Task",
  description: "Details",
  status: "pending", // ← Autocomplete & type-checked!
};

const task: Task = await getTask(id);
```

## 🚨 Common Errors

| Error                                  | Solution                               |
| -------------------------------------- | -------------------------------------- |
| "Invalid Supabase URL"                 | Check SUPABASE_URL in .env             |
| "Failed to fetch tasks"                | Run database migration                 |
| "Row Level Security policy violation"  | Check RLS policies or add `user_id`    |
| Server won't start                     | Verify all env vars are set            |

## 📚 Documentation Files

- **SUPABASE_SETUP.md** - Complete setup instructions
- **SUPABASE_INTEGRATION.md** - What changed & how to use
- **README.md** - Project overview

## 🔄 Database Migration Steps

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy/paste from: `supabase/migrations/001_create_tasks_table.sql`
4. Click "Run"
5. Verify in Table Editor

## 🎯 Next Actions

1. Get Supabase credentials from dashboard
2. Run: `bun run setup`
3. Run database migration
4. Start server: `bun run dev`
5. Test: `curl http://localhost:3001/health`

---

**Quick help**: Run `bun run setup` for interactive configuration

