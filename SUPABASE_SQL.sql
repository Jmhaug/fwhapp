-- FWH Sjekkliste - Supabase Table Setup
-- Copy and paste this into your Supabase SQL Editor
-- Run it once to create the table for data storage

-- Create the main data table
CREATE TABLE IF NOT EXISTS public.fwh_data (
    id TEXT PRIMARY KEY,
    data_json JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.fwh_data ENABLE ROW LEVEL SECURITY;

-- Create policy allowing anonymous access (read/write)
-- This allows your app to work without authentication
CREATE POLICY "Allow anonymous access" ON public.fwh_data
    FOR ALL USING (true)
    WITH CHECK (true);

-- Optional: Add a comment to explain the table
COMMENT ON TABLE public.fwh_data IS 'Stores FWH app data (tasks, invoices, recurring payment tracking)';
COMMENT ON COLUMN public.fwh_data.id IS 'Unique identifier (always "fwh_main")';
COMMENT ON COLUMN public.fwh_data.data_json IS 'JSON data containing tasks, invoices, and recurring payments for all companies';
COMMENT ON COLUMN public.fwh_data.updated_at IS 'Timestamp of last update';
COMMENT ON COLUMN public.fwh_data.created_at IS 'Timestamp of record creation';

-- Optional: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_fwh_data_id ON public.fwh_data(id);

-- Done! Your table is ready for the app to use.
