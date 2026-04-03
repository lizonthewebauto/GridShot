-- Presets - saved brand + template configurations
create table if not exists public.presets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  brand_id uuid not null references public.brands on delete cascade,
  name text not null,
  template_slug text not null,
  vibe text not null default 'Authentic',
  headline text,
  body_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.presets enable row level security;

create policy "Users can view own presets"
  on public.presets for select
  using (auth.uid() = user_id);

create policy "Users can create presets"
  on public.presets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own presets"
  on public.presets for update
  using (auth.uid() = user_id);

create policy "Users can delete own presets"
  on public.presets for delete
  using (auth.uid() = user_id);
