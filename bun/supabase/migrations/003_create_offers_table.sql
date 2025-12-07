-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate offers from same user on same task
  UNIQUE(task_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS offers_task_id_idx ON offers(task_id);
CREATE INDEX IF NOT EXISTS offers_user_id_idx ON offers(user_id);
CREATE INDEX IF NOT EXISTS offers_status_idx ON offers(status);
CREATE INDEX IF NOT EXISTS offers_created_at_idx ON offers(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view offers on tasks they own
CREATE POLICY "Task owners can view all offers on their tasks"
  ON offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = offers.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Users can view their own offers
CREATE POLICY "Users can view their own offers"
  ON offers FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create offers (but not on their own tasks)
CREATE POLICY "Users can create offers on other users' tasks"
  ON offers FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = offers.task_id
      AND tasks.user_id != auth.uid()
    )
  );

-- Users can update their own pending offers
CREATE POLICY "Users can update their own pending offers"
  ON offers FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Task owners can update offer status (accept/reject)
CREATE POLICY "Task owners can update offer status"
  ON offers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = offers.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Users can delete their own pending offers
CREATE POLICY "Users can delete their own pending offers"
  ON offers FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE offers IS 'Stores offers/bids made by users on tasks';
COMMENT ON COLUMN offers.task_id IS 'Reference to the task being offered on';
COMMENT ON COLUMN offers.user_id IS 'User who made the offer';
COMMENT ON COLUMN offers.amount IS 'Offer amount in the specified currency';
COMMENT ON COLUMN offers.currency IS 'Currency code (e.g., USD, EUR)';
COMMENT ON COLUMN offers.message IS 'Optional message from the user with their offer';
COMMENT ON COLUMN offers.status IS 'Status: pending, accepted, rejected, or withdrawn';

