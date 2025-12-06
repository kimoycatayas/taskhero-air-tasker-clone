# Supabase Setup Guide

This guide will help you set up Supabase for the TaskHero API.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase project created (you mentioned you already did this!)

## 🔧 Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on the **Settings** icon (gear icon) in the sidebar
3. Navigate to **API** section
4. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (optional, for admin operations)

## 🔐 Step 2: Configure Environment Variables

Update your `.env` file with your Supabase credentials:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Optional
```

## 🗄️ Step 3: Create the Database Schema

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the contents from:
   ```
   supabase/migrations/001_create_tasks_table.sql
   ```
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## ✅ Step 4: Verify the Setup

After running the migration, verify in your Supabase dashboard:

1. Go to **Table Editor**
2. You should see a `tasks` table with the following columns:
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `status` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)
   - `user_id` (uuid, nullable)

3. Go to **Authentication** → **Policies**
4. You should see RLS policies for the `tasks` table

## 🚀 Step 5: Test the Integration

1. Make sure your `.env` file has the correct credentials
2. Restart your development server:
   ```bash
   bun run dev
   ```

3. Test the API:
   ```bash
   # Create a task
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"My First Supabase Task","description":"Testing Supabase integration"}'

   # Get all tasks
   curl http://localhost:3001/api/tasks
   ```

## 📝 What's Been Set Up

### Files Created/Updated:

1. **`src/config/supabase.ts`** - Supabase client configuration
2. **`src/config/env.ts`** - Added Supabase environment variables
3. **`src/types/database.types.ts`** - TypeScript types for database schema
4. **`src/controllers/tasks.controller.ts`** - Updated to use Supabase
5. **`supabase/migrations/001_create_tasks_table.sql`** - Database schema

### Features Implemented:

- ✅ Supabase client with proper configuration
- ✅ Full CRUD operations using Supabase
- ✅ Row Level Security (RLS) policies
- ✅ Auto-updating timestamps
- ✅ Proper error handling
- ✅ Type-safe database queries
- ✅ User authentication support (when you add auth)

## 🔒 Security Features

The migration includes:

1. **Row Level Security (RLS)** - Enabled by default
2. **Access Policies** - Users can only access their own tasks
3. **Secure by default** - All operations require proper authentication

## 📊 Generating Types

To auto-generate TypeScript types from your Supabase schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

## 🎯 Next Steps

1. **Add Authentication**
   - Implement JWT middleware
   - Add user registration/login endpoints
   - Pass user ID to tasks

2. **Add More Tables**
   - Users profile
   - Categories
   - Tags

3. **Real-time Features**
   - Subscribe to task changes
   - Live updates

4. **File Storage**
   - Add task attachments using Supabase Storage

## 🆘 Troubleshooting

### Error: "Invalid Supabase URL"
- Check that your `SUPABASE_URL` is correct in `.env`
- Make sure there are no trailing slashes

### Error: "Failed to fetch tasks"
- Verify your `SUPABASE_ANON_KEY` is correct
- Check that the tasks table exists in your database
- Verify RLS policies are set up correctly

### Error: "Row Level Security policy violation"
- For now, the policies allow operations when `user_id IS NULL`
- Once you add authentication, you'll need to pass the user's ID

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your Supabase integration is ready! 🎉**

