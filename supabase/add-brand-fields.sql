-- Add new brand profile fields for website extraction
-- Run this in your Supabase SQL Editor if the brands table already exists

alter table public.brands add column if not exists website_url text;
alter table public.brands add column if not exists tagline text;
alter table public.brands add column if not exists style_keywords text[] default '{}';
alter table public.brands add column if not exists brand_personality text;
alter table public.brands add column if not exists color_background text;
alter table public.brands add column if not exists color_text text;
alter table public.brands add column if not exists font_accent text;
alter table public.brands add column if not exists instagram_handle text;
alter table public.brands add column if not exists website_tagline text;
alter table public.brands add column if not exists extracted_from_url boolean not null default false;
