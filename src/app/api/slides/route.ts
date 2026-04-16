import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { VIBE_OPTIONS } from '@/types';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: slides, error } = await supabase
    .from('slides')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Slides fetch error:', error);
    return NextResponse.json({ error: 'Failed to load slides' }, { status: 500 });
  }
  return NextResponse.json(slides);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const templateSlug = body.template_slug;
  if (!templateSlug || !(templateSlug in TEMPLATE_REGISTRY)) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  if (body.vibe && !(VIBE_OPTIONS as readonly string[]).includes(body.vibe)) {
    return NextResponse.json({ error: 'Invalid vibe' }, { status: 400 });
  }

  if (!body.brand_id) {
    return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
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

  // Resolve template_slug → templates.id, upserting via admin client if missing
  // (templates table only ships with 5 seeded rows but the registry has 41).
  let { data: template } = await supabase
    .from('templates')
    .select('id')
    .eq('slug', templateSlug)
    .maybeSingle();

  if (!template) {
    try {
      const admin = createAdminClient();
      const meta = TEMPLATE_REGISTRY[templateSlug as keyof typeof TEMPLATE_REGISTRY];
      const { data: inserted, error: insertErr } = await admin
        .from('templates')
        .upsert(
          { slug: templateSlug, name: meta.name, is_active: true, slide_count_default: 1 },
          { onConflict: 'slug' }
        )
        .select('id')
        .single();
      if (insertErr) throw insertErr;
      template = inserted;
    } catch (err) {
      console.error('Template upsert error:', err);
      return NextResponse.json(
        { error: 'Template not registered. Run the templates seed migration.' },
        { status: 500 }
      );
    }
  }

  const { data: slide, error } = await supabase
    .from('slides')
    .insert({
      user_id: user.id,
      brand_id: body.brand_id,
      template_id: template.id,
      photo_url: body.photo_url ?? null,
      photo_storage_path: body.photo_storage_path ?? null,
      vibe: body.vibe || 'Authentic',
      headline: body.headline?.trim() || null,
      body_text: body.body_text?.trim() || null,
      slide_order: body.slide_order ?? 0,
      carousel_group_id: body.carousel_group_id ?? null,
      metadata: body.metadata ?? {},
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    console.error('Slide create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(slide, { status: 201 });
}
