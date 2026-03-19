ALTER TABLE employees ADD COLUMN clerk_user_id TEXT;
ALTER TABLE employees ADD COLUMN avatar_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_clerk_user_id
  ON employees(clerk_user_id)
  WHERE clerk_user_id IS NOT NULL;
