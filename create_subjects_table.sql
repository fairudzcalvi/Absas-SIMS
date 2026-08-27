-- Create subjects table for ABSAS SIMS
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subjects table
CREATE TABLE subjects (
  subject_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  subject_code VARCHAR(50),
  department VARCHAR(100),
  grade_level INTEGER,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_subjects_department ON subjects(department);
CREATE INDEX idx_subjects_grade_level ON subjects(grade_level);
CREATE INDEX idx_subjects_status ON subjects(status);
CREATE INDEX idx_subjects_name ON subjects(subject_name);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Grant table-level permissions to authenticated role
GRANT SELECT ON public.subjects TO authenticated;
GRANT INSERT ON public.subjects TO authenticated;
GRANT UPDATE ON public.subjects TO authenticated;
GRANT DELETE ON public.subjects TO authenticated;

-- Create RLS policies for admin-only access
-- Since you mentioned only admin users exist, these policies allow authenticated access
-- For production, you may want to add specific role-based policies

-- Allow all operations for authenticated users (admin only in your case)
CREATE POLICY "Allow all operations for authenticated users"
ON subjects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample subjects
INSERT INTO subjects (subject_name, subject_code, department, grade_level, description, status) VALUES
('Mathematics', 'MATH', 'Elementary', 1, 'Basic mathematics for grade 1 students', 'Active'),
('Mathematics', 'MATH', 'Elementary', 2, 'Basic mathematics for grade 2 students', 'Active'),
('Science', 'SCI', 'Elementary', 1, 'Introduction to science for grade 1 students', 'Active'),
('Science', 'SCI', 'Elementary', 2, 'Introduction to science for grade 2 students', 'Active'),
('English', 'ENG', 'Elementary', 1, 'English language arts for grade 1 students', 'Active'),
('English', 'ENG', 'Elementary', 2, 'English language arts for grade 2 students', 'Active'),
('Filipino', 'FIL', 'Elementary', 1, 'Filipino language for grade 1 students', 'Active'),
('Filipino', 'FIL', 'Elementary', 2, 'Filipino language for grade 2 students', 'Active'),
('Mathematics', 'MATH-JH', 'Junior High', 7, 'Mathematics for junior high students', 'Active'),
('Science', 'SCI-JH', 'Junior High', 7, 'Science for junior high students', 'Active'),
('English', 'ENG-JH', 'Junior High', 7, 'English for junior high students', 'Active'),
('Filipino', 'FIL-JH', 'Junior High', 7, 'Filipino for junior high students', 'Active');