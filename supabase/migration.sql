-- Gridshot - Full Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  stripe_customer_id text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'business')),
  subscription_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- BRANDS
-- ============================================================
create table if not exists public.brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  slug text not null,
  website_url text,
  logo_url text,
  tagline text,
  voice_description text,
  tone_presets text[] not null default '{}',
  style_keywords text[] not null default '{}',
  brand_personality text,
  -- ICP & Audience
  icp_description text,
  target_audience text,
  audience_pain_points text[] not null default '{}',
  audience_desires text[] not null default '{}',
  niche text,
  service_area text,
  price_positioning text,
  differentiator text,
  -- Colors
  color_primary text not null default '#2d2d2d',
  color_secondary text not null default '#faf8f5',
  color_accent text,
  color_background text,
  color_text text,
  -- Typography
  font_heading text not null default 'Playfair Display',
  font_body text not null default 'Lora',
  font_accent text,
  -- Social proof
  review_count text,
  review_tagline text,
  -- Social & web
  instagram_handle text,
  website_tagline text,
  social_links jsonb not null default '{}',
  -- Integration
  bundle_social_team_id text,
  is_default boolean not null default false,
  extracted_from_url boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brands enable row level security;

create policy "Users can view own brands"
  on public.brands for select
  using (auth.uid() = user_id);

create policy "Users can create brands"
  on public.brands for insert
  with check (auth.uid() = user_id);

create policy "Users can update own brands"
  on public.brands for update
  using (auth.uid() = user_id);

create policy "Users can delete own brands"
  on public.brands for delete
  using (auth.uid() = user_id);

-- ============================================================
-- TEMPLATES
-- ============================================================
create table if not exists public.templates (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  thumbnail_url text,
  is_active boolean not null default true,
  slide_count_default int not null default 1,
  created_at timestamptz not null default now()
);

-- Seed templates
insert into public.templates (slug, name, description, slide_count_default)
values
  ('editorial-elegant', 'Editorial Elegant', 'Timeless editorial layout with elegant typography', 1),
  ('bold-showcase', 'Bold Showcase', 'High-impact layout with large photo and bold uppercase text', 1),
  ('minimal-centered', 'Minimal Centered', 'Clean centered design with circular photo crop', 1),
  ('split-story', 'Split Story', 'Side-by-side photo and text for storytelling', 1),
  ('cinematic-overlay', 'Cinematic Overlay', 'Full-bleed photo with dramatic gradient text overlay', 1)
on conflict (slug) do nothing;

-- ============================================================
-- SLIDES
-- ============================================================
create table if not exists public.slides (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  template_id uuid not null references public.templates on delete restrict,
  photo_storage_path text,
  photo_url text,
  vibe text not null default 'Authentic',
  headline text,
  body_text text,
  slide_order int not null default 0,
  carousel_group_id uuid,
  exported_image_path text,
  exported_image_url text,
  metadata jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'generating', 'ready', 'exporting', 'exported', 'posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.slides enable row level security;

create policy "Users can view own slides"
  on public.slides for select
  using (auth.uid() = user_id);

create policy "Users can create slides"
  on public.slides for insert
  with check (auth.uid() = user_id);

create policy "Users can update own slides"
  on public.slides for update
  using (auth.uid() = user_id);

create policy "Users can delete own slides"
  on public.slides for delete
  using (auth.uid() = user_id);

-- ============================================================
-- CONNECTED ACCOUNTS
-- ============================================================
create table if not exists public.connected_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  platform text not null,
  platform_username text,
  bundle_social_account_id text not null,
  status text not null default 'active',
  connected_at timestamptz not null default now()
);

alter table public.connected_accounts enable row level security;

create policy "Users can view own connections"
  on public.connected_accounts for select
  using (auth.uid() = user_id);

create policy "Users can create connections"
  on public.connected_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own connections"
  on public.connected_accounts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- POSTS
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  slide_ids uuid[] not null default '{}',
  caption text,
  platforms text[] not null default '{}',
  bundle_social_post_id text,
  scheduled_at timestamptz,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Users can view own posts"
  on public.posts for select
  using (auth.uid() = user_id);

create policy "Users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "Users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own photos"
  on storage.objects for select
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public photo access"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Users can delete own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
