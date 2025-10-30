/*
  # Voice Over Projects Database Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `project_type` (text)
      - `script_length` (text)
      - `deadline` (date)
      - `budget_range` (text)
      - `preferred_accent` (text)
      - `desired_tone` (text)
      - `project_details` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    
    - `recordings`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `original_audio_url` (text)
      - `transformed_audio_url` (text)
      - `accent_applied` (text)
      - `tone_applied` (text)
      - `duration` (integer - in seconds)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Public can insert projects
    - Public can read/insert recordings (for demo purposes)
  
  3. Important Notes
    - Projects table stores client inquiry information
    - Recordings table stores audio files and transformation metadata
    - All timestamps use timestamptz for proper timezone handling
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  project_type text,
  script_length text,
  deadline date,
  budget_range text,
  preferred_accent text,
  desired_tone text,
  project_details text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  original_audio_url text,
  transformed_audio_url text,
  accent_applied text,
  tone_applied text,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Anyone can insert projects"
  ON projects
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  TO anon
  USING (true);

-- Recordings policies
CREATE POLICY "Anyone can insert recordings"
  ON recordings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view recordings"
  ON recordings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update recordings"
  ON recordings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);