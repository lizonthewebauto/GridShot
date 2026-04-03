-- Brand Presets: reusable style configurations per brand
create table public.brand_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  color_primary text not null default '#4a5940',
  color_secondary text not null default '#f5f0e8',
  font_heading text not null default 'Playfair Display',
  font_body text not null default 'Lora',
  vibe text not null default 'Authentic',
  elements jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table brand_presets enable row level security;
create policy "Users can CRUD own presets" on brand_presets for all using (auth.uid() = user_id);
