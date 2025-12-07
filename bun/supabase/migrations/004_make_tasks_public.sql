-- Update RLS policies to make tasks publicly viewable
-- This allows any user (authenticated or not) to view all tasks

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;

-- Create new public SELECT policy
-- Anyone can view all tasks (they are public job postings)
CREATE POLICY "Anyone can view all tasks"
  ON tasks FOR SELECT
  USING (true);

-- Keep the other policies as they were
-- (Users still need to be authenticated and own the task to modify it)

