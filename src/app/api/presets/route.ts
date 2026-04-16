import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { VIBE_OPTIONS } from '@/types';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: presets, error } = await supabase
    .from('presets')
    .select('*, brands(name, color_primary, color_secondary, font_heading, font_body)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Presets fetch error:', error);
    return NextResponse.json({ error: 'Failed to load presets' }, { status: 500 });
  }
  return NextResponse.json(presets);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (!(body.template_slug in TEMPLATE_REGISTRY)) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  if (body.vibe && !(VIBE_OPTIONS as readonly string[]).includes(body.vibe)) {
    return NextResponse.json({ error: 'Invalid vibe' }, { status: 400 });
  }

  // Verify brand ownership
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('id', body.brand_id)
    .eq('user_id', user.id)
    .single();

  if (!brand) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 });
  }

  const { data: preset, error } = await supabase
    .from('presets')
    .insert({
      user_id: user.id,
      brand_id: body.brand_id,
      name: body.name.trim(),
      template_slug: body.template_slug,
      vibe: body.vibe || 'Authentic',
      headline: body.headline || null,
      body_text: body.body_text || null,
      color_primary: body.color_primary || null,
      color_secondary: body.color_secondary || null,
      color_accent: body.color_accent || null,
      font_heading: body.font_heading || null,
      font_body: body.font_body || null,
      elements: body.elements && typeof body.elements === 'object' ? body.elements : {},
    })
    .select()
    .single();

  if (error) {
    console.error('Preset create error:', error);
    return NextResponse.json({ error: 'Failed to create preset' }, { status: 500 });
  }

  return NextResponse.json(preset, { status: 201 });
}
