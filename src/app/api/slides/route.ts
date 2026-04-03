import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    brandId,
    templateSlug,
    photoUrl,
    vibe,
    headline,
    bodyText,
    slideOrder,
    carouselGroupId,
  } = await request.json();

  if (!brandId) {
    return NextResponse.json({ error: 'brandId is required' }, { status: 400 });
  }

  // Look up template by slug
  const { data: template } = await supabase
    .from('templates')
    .select('id')
    .eq('slug', templateSlug || 'editorial-elegant')
    .single();

  const { data: slide, error } = await supabase
    .from('slides')
    .insert({
      user_id: user.id,
      brand_id: brandId,
      template_id: template?.id || null,
      photo_url: photoUrl,
      vibe: vibe || 'Authentic',
      headline: headline || null,
      body_text: bodyText || null,
      slide_order: slideOrder || 0,
      carousel_group_id: carouselGroupId || null,
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(slide, { status: 201 });
}
