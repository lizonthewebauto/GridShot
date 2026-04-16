import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadMedia, createPost } from '@/lib/bundle-social/client';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId, slideIds, platforms, caption, scheduledAt } = await request.json();

  if (!brandId || !slideIds?.length || !platforms?.length) {
    return NextResponse.json({ error: 'brandId, slideIds, and platforms are required' }, { status: 400 });
  }

  // Get brand's Bundle Social team
  const { data: brand } = await supabase
    .from('brands')
    .select('bundle_social_team_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();

  if (!brand?.bundle_social_team_id) {
    return NextResponse.json({ error: 'Brand has no social team connected' }, { status: 400 });
  }

  // Get connected accounts for the requested platforms
  const { data: connectedAccounts } = await supabase
    .from('connected_accounts')
    .select('platform, bundle_social_account_id')
    .eq('brand_id', brandId)
    .eq('user_id', user.id)
    .in('platform', platforms.map((p: string) => p.toUpperCase()));

  if (!connectedAccounts?.length) {
    return NextResponse.json({ error: 'No connected accounts for the selected platforms' }, { status: 400 });
  }

  // Get slide images
  const { data: slides } = await supabase
    .from('slides')
    .select('id, exported_image_url')
    .in('id', slideIds);

  if (!slides?.length) {
    return NextResponse.json({ error: 'No slides found' }, { status: 404 });
  }

  // Upload images to Bundle Social
  const uploadIds: string[] = [];
  for (const slide of slides) {
    if (slide.exported_image_url) {
      const { uploadId } = await uploadMedia(brand.bundle_social_team_id, slide.exported_image_url);
      uploadIds.push(uploadId);
    }
  }

  // Build platform accounts with their socialAccountIds
  const platformAccounts = connectedAccounts.map((acc) => ({
    platform: acc.platform,
    socialAccountId: acc.bundle_social_account_id,
  }));

  // Create the post via Bundle Social
  const { postId } = await createPost({
    teamId: brand.bundle_social_team_id,
    platformAccounts,
    text: caption || '',
    uploadIds,
    scheduledAt,
  });

  // Save to our database
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      brand_id: brandId,
      slide_ids: slideIds,
      caption,
      platforms,
      bundle_social_post_id: postId,
      scheduled_at: scheduledAt,
      status: 'scheduled',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(post, { status: 201 });
}
