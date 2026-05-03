-- ============================================================
-- DRAFTS PIPELINE
-- Ported from Chrisman Content Studio (Metricool support removed).
-- Gridshot publishes via Bundle Social only.
-- ============================================================

create table if not exists public.draft_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  kind text not null check (kind in ('single', 'carousel')),
  source text not null default 'ai_generated' check (source in ('manual', 'ai_generated')),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  layout_family text not null default 'center-left',
  caption text,
  notes text,
  requested_photo_count int not null default 1,
  content_goal text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.draft_posts enable row level security;

create policy "Users can view own draft posts"
  on public.draft_posts for select
  using (auth.uid() = user_id);

create policy "Users can create draft posts"
  on public.draft_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own draft posts"
  on public.draft_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own draft posts"
  on public.draft_posts for delete
  using (auth.uid() = user_id);

create table if not exists public.draft_post_slides (
  id uuid primary key default uuid_generate_v4(),
  draft_post_id uuid not null references public.draft_posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  slide_order int not null default 0,
  photo_storage_path text,
  photo_url text,
  headline text,
  body_text text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.draft_post_slides enable row level security;

create policy "Users can view own draft slides"
  on public.draft_post_slides for select
  using (auth.uid() = user_id);

create policy "Users can create draft slides"
  on public.draft_post_slides for insert
  with check (auth.uid() = user_id);

create policy "Users can update own draft slides"
  on public.draft_post_slides for update
  using (auth.uid() = user_id);

create policy "Users can delete own draft slides"
  on public.draft_post_slides for delete
  using (auth.uid() = user_id);

create table if not exists public.generation_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  draft_post_id uuid references public.draft_posts on delete set null,
  kind text not null check (kind in ('single', 'carousel')),
  status text not null default 'succeeded' check (status in ('pending', 'succeeded', 'failed')),
  requested_photo_count int not null default 1,
  request_payload jsonb not null default '{}',
  selected_uploads jsonb not null default '[]',
  model_output jsonb not null default '{}',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.generation_runs enable row level security;

create policy "Users can view own generation runs"
  on public.generation_runs for select
  using (auth.uid() = user_id);

create policy "Users can create generation runs"
  on public.generation_runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own generation runs"
  on public.generation_runs for update
  using (auth.uid() = user_id);

create policy "Users can delete own generation runs"
  on public.generation_runs for delete
  using (auth.uid() = user_id);

create index if not exists draft_posts_user_brand_idx
  on public.draft_posts (user_id, brand_id, created_at desc);

create index if not exists draft_post_slides_draft_order_idx
  on public.draft_post_slides (draft_post_id, slide_order);

create index if not exists generation_runs_brand_created_idx
  on public.generation_runs (brand_id, created_at desc);

-- Link published posts back to their originating draft.
-- Gridshot already has bundle_social_post_id, so no provider column needed.
alter table public.posts
  add column if not exists draft_post_id uuid references public.draft_posts(id) on delete set null,
  add column if not exists media_count int not null default 0,
  add column if not exists media_storage_paths text[] not null default '{}';
