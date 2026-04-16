import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { connectPlatform } from '@/lib/bundle-social/client';
import { PLATFORM_OPTIONS } from '@/types';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId, platform } = await request.json();
  if (!brandId || !platform) {
    return NextResponse.json({ error: 'brandId and platform are required' }, { status: 400 });
  }

  const upper = String(platform).toUpperCase();
  if (!(PLATFORM_OPTIONS as readonly string[]).includes(upper)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id, bundle_social_team_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();
  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  if (!brand.bundle_social_team_id) {
    return NextResponse.json(
      { error: 'Brand has no social team. Recreate the brand to provision one.' },
      { status: 400 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUrl = `${origin}/connections/callback`;

  const result = await connectPlatform(brand.bundle_social_team_id, upper, redirectUrl);
  return NextResponse.json(result);
}
