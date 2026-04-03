-- PhotoFlow Studio Database Schema
-- Run this in your Supabase SQL Editor

-- ── Profiles ──
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  stripe_customer_id text unique,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'business')),
  subscription_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Brands ──
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  logo_url text,
  voice_description text,
  tone_presets text[] default '{}',
  color_primary text default '#4a5940',
  color_secondary text default '#f5f0e8',
  color_accent text,
  font_heading text default 'Playfair Display',
  font_body text default 'Lora',
  review_count text,
  review_tagline text,
  bundle_social_team_id text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table brands enable row level security;
create policy "Users can CRUD own brands" on brands for all using (auth.uid() = user_id);

-- ── Templates ──
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  thumbnail_url text,
  is_active boolean not null default true,
  slide_count_default int not null default 1,
  created_at timestamptz not null default now()
);

alter table templates enable row level security;
create policy "Anyone can read templates" on templates for select using (true);

-- Seed the first template
insert into templates (slug, name, description) values (
  'editorial-elegant',
  'Editorial Elegant',
  'Classic editorial style with spaced studio name, bold serif headline, and italic body copy on a warm cream background.'
);

-- ── Slides ──
create table public.slides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  template_id uuid not null references templates(id),
  photo_storage_path text,
  photo_url text,
  vibe text default 'Authentic',
  headline text,
  body_text text,
  slide_order int not null default 0,
  carousel_group_id uuid,
  exported_image_path text,
  exported_image_url text,
  metadata jsonb default '{}',
  status text not null default 'draft' check (status in ('draft','generating','ready','exporting','exported','posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table slides enable row level security;
create policy "Users can CRUD own slides" on slides for all using (auth.uid() = user_id);

-- ── Connected Accounts ──
create table public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  platform text not null,
  platform_username text,
  bundle_social_account_id text not null,
  status text not null default 'active',
  connected_at timestamptz not null default now(),
  unique(brand_id, bundle_social_account_id)
);

alter table connected_accounts enable row level security;
create policy "Users can manage own accounts" on connected_accounts for all using (auth.uid() = user_id);

-- ── Posts ──
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  slide_ids uuid[] not null,
  caption text,
  platforms text[] not null,
  bundle_social_post_id text,
  scheduled_at timestamptz,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft','scheduled','publishing','published','failed')),
  error_message text,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;
create policy "Users can CRUD own posts" on posts for all using (auth.uid() = user_id);

-- ── Storage Buckets ──
insert into storage.buckets (id, name, public) values ('photos', 'photos', false);
insert into storage.buckets (id, name, public) values ('exports', 'exports', false);

-- Storage policies: users can manage their own files (prefixed by user id)
create policy "Users can upload photos" on storage.objects for insert
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own photos" on storage.objects for select
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own photos" on storage.objects for delete
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload exports" on storage.objects for insert
  with check (bucket_id = 'exports' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own exports" on storage.objects for select
  using (bucket_id = 'exports' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own exports" on storage.objects for delete
  using (bucket_id = 'exports' and (storage.foldername(name))[1] = auth.uid()::text);
