-- Add brand_colors jsonb array column for dynamic color management
-- Run this in your Supabase SQL Editor

alter table public.brands add column if not exists brand_colors jsonb not null default '[]'::jsonb;
