import { NextResponse } from 'next/server';

import { getDraftPost } from '@/lib/drafts';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; slideId: string }> },
) {
  const { id, slideId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body?.headline === 'string' || body?.headline === null) {
    updates.headline = body?.headline ?? null;
  }
  if (typeof body?.body_text === 'string' || body?.body_text === null) {
    updates.body_text = body?.body_text ?? null;
  }
  if (typeof body?.photo_storage_path === 'string' || body?.photo_storage_path === null) {
    updates.photo_storage_path = body?.photo_storage_path ?? null;
  }
  if (typeof body?.slide_order === 'number') {
    updates.slide_order = body.slide_order;
  }
  if (body?.metadata && typeof body.metadata === 'object') {
    updates.metadata = body.metadata;
  }

  const { error } = await supabase
    .from('draft_post_slides')
    .update(updates)
    .eq('id', slideId)
    .eq('draft_post_id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const draft = await getDraftPost(supabase, user.id, id);
  return NextResponse.json(draft);
}
