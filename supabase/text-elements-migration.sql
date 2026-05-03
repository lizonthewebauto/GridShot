-- ============================================================
-- UNIVERSAL TEXT EDITABILITY
-- Adds per-template element configs to slides + presets so every
-- text node in every template can carry per-element overrides
-- (font, size, weight, colour, alignment) like Editorial Pro does.
-- ============================================================

alter table public.slides
  add column if not exists elements jsonb not null default '{}';

alter table public.presets
  add column if not exists elements_by_template jsonb not null default '{}';
