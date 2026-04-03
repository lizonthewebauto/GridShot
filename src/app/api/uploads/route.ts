import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: files, error } = await supabase.storage
    .from('photos')
    .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered = (files || []).filter((f) => !f.name.startsWith('.'));

  if (filtered.length === 0) {
    return NextResponse.json([]);
  }

  // Batch-generate all signed URLs in a single request (much faster)
  const storagePaths = filtered.map((f) => `${user.id}/${f.name}`);
  const { data: signedUrls } = await supabase.storage
    .from('photos')
    .createSignedUrls(storagePaths, 3600);

  const uploads = filtered.map((f, i) => ({
    name: f.name,
    url: signedUrls?.[i]?.signedUrl || '',
    storagePath: storagePaths[i],
    createdAt: f.created_at,
  }));

  return NextResponse.json(uploads.filter((u) => u.url));
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { storagePath } = await request.json();
  if (!storagePath || !storagePath.startsWith(user.id + '/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const { error } = await supabase.storage.from('photos').remove([storagePath]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
