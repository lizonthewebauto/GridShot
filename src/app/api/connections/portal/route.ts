import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPortalLink } from '@/lib/bundle-social/client';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId, platform } = await request.json();

  if (!brandId) {
    return NextResponse.json({ error: 'brandId is required' }, { status: 400 });
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id, bundle_social_team_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();

  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }

  if (!brand.bundle_social_team_id) {
    return NextResponse.json({ error: 'Brand has no social team. Please recreate the brand.' }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUrl = `${origin}/connections?brandId=${brandId}&callback=true`;

  const result = await createPortalLink(
    brand.bundle_social_team_id,
    redirectUrl,
    platform ? [platform.toUpperCase()] : undefined
  );

  return NextResponse.json(result);
}
