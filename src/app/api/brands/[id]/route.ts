import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const { data: brand, error } = await supabase
    .from('brands')
    .update({
      name: body.name,
      website_url: body.website_url,
      logo_url: body.logo_url,
      tagline: body.tagline,
      voice_description: body.voice_description,
      tone_presets: body.tone_presets,
      style_keywords: body.style_keywords,
      brand_personality: body.brand_personality,
      icp_description: body.icp_description,
      target_audience: body.target_audience,
      audience_pain_points: body.audience_pain_points,
      audience_desires: body.audience_desires,
      niche: body.niche,
      service_area: body.service_area,
      price_positioning: body.price_positioning,
      differentiator: body.differentiator,
      color_primary: body.color_primary,
      color_secondary: body.color_secondary,
      color_accent: body.color_accent,
      color_background: body.color_background,
      color_text: body.color_text,
      brand_colors: body.brand_colors || [],
      font_heading: body.font_heading,
      font_body: body.font_body,
      font_accent: body.font_accent,
      review_count: body.review_count,
      review_tagline: body.review_tagline,
      instagram_handle: body.instagram_handle,
      website_tagline: body.website_tagline,
      social_links: body.social_links,
      extracted_from_url: body.extracted_from_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(brand);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
