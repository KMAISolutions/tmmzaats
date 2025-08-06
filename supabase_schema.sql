CREATE TABLE structured_jobs (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL, -- Array of text
  description TEXT NOT NULL,
  closing_date DATE,
  contact_email TEXT,
  contact_phone TEXT
);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE structured_jobs ENABLE ROW LEVEL SECURITY;

-- Policy for public read access: Anyone can view jobs
CREATE POLICY "Public jobs are viewable by everyone." ON structured_jobs
  FOR SELECT USING (true);

-- Policy for anonymous users to insert jobs (via the anon key)
CREATE POLICY "Allow anon insert for structured_jobs" ON structured_jobs
  FOR INSERT TO anon WITH CHECK (true);

-- Policy for anonymous users to update jobs (if needed, though less common for public data)
CREATE POLICY "Allow anon update for structured_jobs" ON structured_jobs
  FOR UPDATE TO anon USING (true);

-- Policy for anonymous users to delete jobs (if needed, though less common for public data)
CREATE POLICY "Allow anon delete for structured_jobs" ON structured_jobs
  FOR DELETE TO anon USING (true);