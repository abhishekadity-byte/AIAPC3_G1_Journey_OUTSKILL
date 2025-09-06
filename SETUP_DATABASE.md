# 🚨 CRITICAL: Database Setup Required

## The application is currently failing because the `users` table doesn't exist in your Supabase database.

### ⚡ Quick Fix (2 minutes):

1. **Open your Supabase Dashboard**: https://vkwovdbyaqfeulypeufi.supabase.co
2. **Click "SQL Editor"** in the left sidebar
3. **Copy the entire SQL code below** and paste it into the SQL editor
4. **Click "Run"** to execute

```sql
/*
  # Create users table for authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `is_active` (boolean, default true)
      - `email_verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
    - Add indexes for performance

  3. Features
    - Automatic timestamp updates
    - Email uniqueness constraint
    - Secure password storage
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### ✅ Verify Setup:
After running the SQL, go to "Table Editor" and you should see a `users` table with all the columns listed above.

### 🔄 Alternative Method:
- Go to "Table Editor" → "New Table" → "Import from SQL"
- Upload the `supabase/migrations/create_users_table.sql` file

---

**Once you complete this setup, refresh your application and the authentication will work perfectly!**