import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');

  let query = supabase
    .from('brand_presets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (brandId) {
    query = query.eq('brand_id', brandId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (!body.brand_id || !body.name) {
    return NextResponse.json({ error: 'brand_id and name are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('brand_presets')
    .insert({
      user_id: user.id,
      brand_id: body.brand_id,
      name: body.name,
      color_primary: body.color_primary || '#4a5940',
      color_secondary: body.color_secondary || '#f5f0e8',
      font_heading: body.font_heading || 'Playfair Display',
      font_body: body.font_body || 'Lora',
      vibe: body.vibe || 'Authentic',
      elements: body.elements || {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
