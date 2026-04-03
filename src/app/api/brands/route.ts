import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createTeam } from '@/lib/bundle-social/client';
import { slugify } from '@/lib/utils';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Check if this is the user's first brand
  const { count } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const isFirst = (count ?? 0) === 0;

  const { data: brand, error } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      name: body.name,
      slug: slugify(body.name),
      website_url: body.website_url || null,
      logo_url: body.logo_url || null,
      tagline: body.tagline || null,
      voice_description: body.voice_description,
      tone_presets: body.tone_presets || [],
      style_keywords: body.style_keywords || [],
      brand_personality: body.brand_personality || null,
      icp_description: body.icp_description || null,
      target_audience: body.target_audience || null,
      audience_pain_points: body.audience_pain_points || [],
      audience_desires: body.audience_desires || [],
      niche: body.niche || null,
      service_area: body.service_area || null,
      price_positioning: body.price_positioning || null,
      differentiator: body.differentiator || null,
      color_primary: body.color_primary || '#4a5940',
      color_secondary: body.color_secondary || '#f5f0e8',
      color_accent: body.color_accent || null,
      color_background: body.color_background || null,
      color_text: body.color_text || null,
      brand_colors: body.brand_colors || [],
      font_heading: body.font_heading || 'Playfair Display',
      font_body: body.font_body || 'Lora',
      font_accent: body.font_accent || null,
      review_count: body.review_count || null,
      review_tagline: body.review_tagline || null,
      instagram_handle: body.instagram_handle || null,
      website_tagline: body.website_tagline || null,
      social_links: body.social_links || {},
      is_default: isFirst,
      extracted_from_url: body.extracted_from_url || false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create Bundle Social team in background (don't fail brand creation if this fails)
  try {
    const team = await createTeam(body.name);
    const admin = createAdminClient();
    await admin
      .from('brands')
      .update({ bundle_social_team_id: team.id })
      .eq('id', brand.id);
  } catch (err) {
    console.error('Failed to create Bundle Social team:', err);
  }

  return NextResponse.json(brand, { status: 201 });
}
