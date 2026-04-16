-- Seed all 42 templates currently exposed by TEMPLATE_REGISTRY.
-- Safe to run multiple times — uses ON CONFLICT (slug) DO NOTHING.
-- Run this whenever you add new template slugs to src/lib/templates/registry.ts.

insert into public.templates (slug, name, description, slide_count_default) values
  ('editorial-pro',          'Editorial Pro',          'Flagship configurable layout — every element is editable', 1),
  ('editorial-elegant',      'Editorial Elegant',      'Timeless editorial layout with elegant typography',         1),
  ('bold-showcase',          'Bold Showcase',          'High-impact layout with large photo and bold uppercase text', 1),
  ('minimal-centered',       'Minimal Centered',       'Clean centered design with circular photo crop',            1),
  ('split-story',            'Split Story',            'Side-by-side photo and text for storytelling',              1),
  ('cinematic-overlay',      'Cinematic Overlay',      'Full-bleed photo with dramatic gradient text overlay',      1),
  ('photo-only',             'Photo Only',             'Pure photography, no text overlay',                          1),
  ('magazine-cover',         'Magazine Cover',         'Editorial cover with masthead and headlines',                1),
  ('minimal-frame',          'Minimal Frame',          'Photo with restrained border and small text',                1),
  ('polaroid-stack',         'Polaroid Stack',         'Layered polaroid photos at angles',                          1),
  ('fullbleed-overlay',      'Fullbleed Overlay',      'Edge-to-edge photo with bottom bar text',                    1),
  ('split-portfolio',        'Split Portfolio',        'Two-column portfolio layout',                                1),
  ('film-strip',             'Film Strip',             'Filmic strip with sprocket holes',                           1),
  ('testimonial-card',       'Testimonial Card',       'Quote-driven testimonial layout',                            1),
  ('cinematic-fade',         'Cinematic Fade',         'Configurable cinematic fade with gradient',                  1),
  ('editorial-fullbleed',    'Editorial Full-Bleed',   'Edge-to-edge editorial layout',                              1),
  ('polaroid-realistic',     'Polaroid Realistic',     'Single realistic polaroid centered',                         1),
  ('triptych-strip',         'Triptych Strip',         'Three-photo horizontal strip',                                1),
  ('grid-2x2',               'Grid 2×2',               'Four-up grid with bottom title',                             1),
  ('minimal-centered-shape', 'Minimal Shape',          'Centered with shape-clipped photo',                          1),
  ('circle-gold',            'Circle Gold',            'Circular framed photo with luxe accents',                    1),
  ('duotone-wash',           'Duotone Wash',           'Two-tone duotone treatment',                                 1),
  ('split-half',             'Split 50/50',            'Half image, half color block',                               1),
  ('typographic-hero',       'Typographic Hero',       'Type-led layout, photo subordinate',                         1),
  ('scrapbook-realistic',    'Scrapbook',              'Tactile scrapbook with tape and shadows',                    1),
  ('newspaper',              'Newspaper',              'Newsprint layout with masthead and columns',                 1),
  ('risograph',              'Risograph',              'Riso-printed look with halftone dots',                       1),
  ('luxury-gold',            'Luxury Gold',            'Gold-on-dark luxury aesthetic',                              1),
  ('quote-card',             'Quote Card',             'Large quote with attribution',                               1),
  ('geometric-blocks',       'Geometric Blocks',       'Bauhaus-inspired blocks of color',                           1),
  ('collage-offset',         'Collage Offset',         'Offset photos with collage feel',                            1),
  ('stacked-letterforms',    'Stacked Letterforms',    'Massive stacked typography',                                 1),
  ('oversized-italic',       'Oversized Italic',       'Big italic display headline',                                1),
  ('sidebar-index',          'Sidebar Index',          'Vertical sidebar with index numbering',                      1),
  ('baseball-card',          'Baseball Card',          'Trading-card framing',                                       1),
  ('wax-seal-invite',        'Wax Seal Invite',        'Formal invitation with wax-seal motif',                      1),
  ('blueprint-grid',         'Blueprint Grid',         'Architectural blueprint grid',                               1),
  ('photobooth-strip',       'Photobooth Strip',       'Vertical photobooth strip of four',                          1),
  ('art-deco-fan',           'Art Deco Fan',           'Art Deco fan motif',                                         1),
  ('boarding-pass',          'Boarding Pass',          'Boarding-pass ticket layout',                                1),
  ('memphis-zine',           'Memphis 80s Zine',       'Memphis-style 80s zine',                                     1),
  ('apple-note',             'Apple Note',             'iOS-style note app screenshot',                              1)
on conflict (slug) do nothing;

-- ============================================================
-- Optional: SECURITY DEFINER RPC so any authed user can register
-- a missing template at runtime (used by /api/slides as a fallback
-- when SUPABASE_SERVICE_ROLE_KEY is not configured).
-- ============================================================
create or replace function public.ensure_template(p_slug text, p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.templates (slug, name, is_active, slide_count_default)
  values (p_slug, p_name, true, 1)
  on conflict (slug) do update set name = excluded.name
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.ensure_template(text, text) from public;
grant execute on function public.ensure_template(text, text) to authenticated;
