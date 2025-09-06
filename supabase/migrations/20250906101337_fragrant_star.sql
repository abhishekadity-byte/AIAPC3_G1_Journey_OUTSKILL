/*
  # Create users table for authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique) - User's email address for login
      - `password_hash` (text) - Hashed password for security
      - `first_name` (text) - User's first name
      - `last_name` (text) - User's last name
      - `is_active` (boolean) - Account status flag
      - `email_verified` (boolean) - Email verification status
      - `created_at` (timestamp) - Account creation timestamp
      - `updated_at` (timestamp) - Last update timestamp
      - `last_login` (timestamp) - Last login timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own profile
    - Add indexes for performance

  3. Important Notes
    - Password should be hashed before storing (use bcrypt or similar)
    - Email verification should be implemented in the application
    - Consider using Supabase Auth instead of custom authentication
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();