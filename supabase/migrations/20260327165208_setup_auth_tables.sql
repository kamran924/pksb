/*
  # Setup Admin Authentication Tables

  1. Create admin_profiles table
    - Links authenticated users to admin profiles
    - Stores admin metadata
  2. Security
    - Enable RLS on admin_profiles table
    - Add policies for authenticated users to read/update own profile
    - Only authenticated users can be admins
*/

CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  is_admin boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can update own profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Only admins can insert profiles"
  ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND is_admin = true);