import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { VIBE_OPTIONS } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: preset, error } = await supabase
    .from('presets')
    .select('*, brands(name, color_primary, color_secondary, font_heading, font_body)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !preset) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(preset);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase
    .from('presets')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (!(body.template_slug in TEMPLATE_REGISTRY)) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  if (!(VIBE_OPTIONS as readonly string[]).includes(body.vibe)) {
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
    .update({
      name: body.name.trim(),
      brand_id: body.brand_id,
      template_slug: body.template_slug,
      vibe: body.vibe,
      headline: body.headline || null,
      body_text: body.body_text || null,
      color_primary: body.color_primary ?? null,
      color_secondary: body.color_secondary ?? null,
      color_accent: body.color_accent ?? null,
      font_heading: body.font_heading ?? null,
      font_body: body.font_body ?? null,
      elements: body.elements && typeof body.elements === 'object' ? body.elements : {},
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Preset update error:', error);
    return NextResponse.json({ error: 'Failed to update preset' }, { status: 500 });
  }
  return NextResponse.json(preset);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Preset delete error:', error);
    return NextResponse.json({ error: 'Failed to delete preset' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
