-- Gridshot - RLS Hardening for Production
-- Run this AFTER the initial migration.sql

-- ============================================================
-- FIX: Remove overly permissive public photo access policy
-- Photos should only be accessible to their owners
-- ============================================================
drop policy if exists "Public photo access" on storage.objects;

-- ============================================================
-- ADD: Update policy for connected_accounts (was missing)
-- ============================================================
create policy "Users can update own connections"
  on public.connected_accounts for update
  using (auth.uid() = user_id);

-- ============================================================
-- ADD: Profiles insert policy for the trigger function
-- The handle_new_user() function runs as SECURITY DEFINER,
-- but an explicit insert policy is good practice
-- ============================================================
create policy "System can create profiles"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- ADD: Templates read access (public, read-only)
-- Templates have no RLS but should be explicitly readable
-- ============================================================
alter table public.templates enable row level security;

create policy "Anyone can view active templates"
  on public.templates for select
  using (is_active = true);

-- ============================================================
-- ADD: Rate limiting support table
-- Track API usage per user for rate limiting
-- ============================================================
create table if not exists public.api_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  endpoint text not null,
  called_at timestamptz not null default now()
);

alter table public.api_usage enable row level security;

-- No user-facing RLS needed -- this table is only accessed server-side

-- Create index for efficient rate limit queries
create index if not exists idx_api_usage_user_endpoint_time
  on public.api_usage (user_id, endpoint, called_at desc);

-- Auto-cleanup: delete records older than 24 hours
-- Run this as a cron job or Supabase scheduled function
create or replace function public.cleanup_api_usage()
returns void as $$
begin
  delete from public.api_usage where called_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;
