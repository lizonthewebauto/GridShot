import { NextResponse } from 'next/server';

import type { DraftPost } from '@/types';
import { getDraftPost } from '@/lib/drafts';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const draft = await getDraftPost(supabase, user.id, id);
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  return NextResponse.json(draft);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const updates: Partial<DraftPost> & { updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body?.caption === 'string') updates.caption = body.caption;
  if (typeof body?.notes === 'string' || body?.notes === null) updates.notes = body?.notes ?? null;
  if (typeof body?.layout_family === 'string') updates.layout_family = body.layout_family;
  if (typeof body?.status === 'string') updates.status = body.status;
  if (typeof body?.content_goal === 'string' || body?.content_goal === null) {
    updates.content_goal = body?.content_goal ?? null;
  }
  if (body?.metadata && typeof body.metadata === 'object') {
    updates.metadata = body.metadata;
  }

  const { data, error } = await supabase
    .from('draft_posts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Could not update draft' }, { status: 500 });
  }

  const draft = await getDraftPost(supabase, user.id, id);
  return NextResponse.json(draft);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('draft_posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
