import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { listConnectedAccounts } from '@/lib/bundle-social/client';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId } = await request.json();

  if (!brandId) {
    return NextResponse.json({ error: 'brandId is required' }, { status: 400 });
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id, bundle_social_team_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();

  if (!brand?.bundle_social_team_id) {
    return NextResponse.json({ error: 'Brand has no social team' }, { status: 400 });
  }

  const accounts = await listConnectedAccounts(brand.bundle_social_team_id);

  const admin = createAdminClient();

  for (const account of accounts) {
    await admin.from('connected_accounts').upsert(
      {
        user_id: user.id,
        brand_id: brand.id,
        platform: account.platform,
        platform_username: account.username,
        bundle_social_account_id: account.id,
        status: 'active',
        connected_at: new Date().toISOString(),
      },
      { onConflict: 'brand_id,bundle_social_account_id' }
    );
  }

  return NextResponse.json({ synced: accounts.length });
}
