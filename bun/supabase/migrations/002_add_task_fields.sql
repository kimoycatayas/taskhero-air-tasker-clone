-- Add new fields to tasks table for the Create Task form
ALTER TABLE tasks
  ADD COLUMN date_type TEXT CHECK (date_type IN ('on_date', 'before_date', 'flexible')),
  ADD COLUMN task_date TIMESTAMPTZ,
  ADD COLUMN location_address TEXT,
  ADD COLUMN location_lat DOUBLE PRECISION,
  ADD COLUMN location_lng DOUBLE PRECISION,
  ADD COLUMN budget_min DECIMAL(10, 2),
  ADD COLUMN budget_max DECIMAL(10, 2),
  ADD COLUMN budget_currency TEXT DEFAULT 'USD';

-- Create index on task_date for filtering/sorting
CREATE INDEX IF NOT EXISTS tasks_task_date_idx ON tasks(task_date);

-- Create index on location coordinates for geospatial queries (if needed in future)
CREATE INDEX IF NOT EXISTS tasks_location_idx ON tasks(location_lat, location_lng);

-- Add comments for documentation
COMMENT ON COLUMN tasks.date_type IS 'Type of date constraint: on_date, before_date, or flexible';
COMMENT ON COLUMN tasks.task_date IS 'The date when the task should be done or deadline';
COMMENT ON COLUMN tasks.location_address IS 'Full address string for the task location';
COMMENT ON COLUMN tasks.location_lat IS 'Latitude coordinate';
COMMENT ON COLUMN tasks.location_lng IS 'Longitude coordinate';
COMMENT ON COLUMN tasks.budget_min IS 'Minimum budget amount';
COMMENT ON COLUMN tasks.budget_max IS 'Maximum budget amount';
COMMENT ON COLUMN tasks.budget_currency IS 'Currency code (e.g., USD, EUR)';

