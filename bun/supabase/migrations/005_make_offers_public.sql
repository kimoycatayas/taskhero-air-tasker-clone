-- Update RLS policies to make offers publicly viewable
-- This allows any user (authenticated or not) to view all offers on any task

-- Drop the old restrictive SELECT policies
DROP POLICY IF EXISTS "Task owners can view all offers on their tasks" ON offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON offers;

-- Create new public SELECT policy for offers
-- Anyone can view all offers (transparent bidding marketplace)
CREATE POLICY "Anyone can view all offers"
  ON offers FOR SELECT
  USING (true);

-- Note: Other policies (INSERT, UPDATE, DELETE) remain restricted
-- - Only authenticated users can create offers
-- - Only offer owners can update their own pending offers
-- - Only task owners can update offer status
-- - Only offer owners can delete their own pending offers

