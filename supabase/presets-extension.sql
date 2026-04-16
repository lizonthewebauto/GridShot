-- Extend the presets table to capture a full slide configuration:
-- color overrides, font overrides, and the SlideElements JSON.
-- Idempotent; safe to run multiple times.

alter table public.presets
  add column if not exists color_primary   text,
  add column if not exists color_secondary text,
  add column if not exists color_accent    text,
  add column if not exists font_heading    text,
  add column if not exists font_body       text,
  add column if not exists elements        jsonb not null default '{}'::jsonb;
