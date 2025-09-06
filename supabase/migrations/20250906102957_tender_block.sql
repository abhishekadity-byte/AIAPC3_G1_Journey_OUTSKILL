/*
  # Create user_profiles table

  1. New Tables
    - `user_profiles`
      - `user_id` (text, primary key)
      - `name` (text)
      - `preferences` (jsonb)
      - `budget_range` (text)
      - `travel_style` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for authenticated users to manage their own profile data

  3. Changes
    - Creates user_profiles table with all required fields
    - Sets up automatic timestamp management
    - Adds performance indexes
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id text PRIMARY KEY,
  name text,
  preferences jsonb DEFAULT '{}',
  budget_range text,
  travel_style text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_travel_style ON user_profiles(travel_style);
CREATE INDEX IF NOT EXISTS idx_user_profiles_budget_range ON user_profiles(budget_range);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();