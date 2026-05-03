import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { listDraftPosts } from '@/lib/drafts';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId') || undefined;

  try {
    const drafts = await listDraftPosts(supabase, user.id, brandId);
    return NextResponse.json(drafts);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load drafts' },
      { status: 500 },
    );
  }
}
