import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

function inferExtension(name: string, mimeType: string) {
  const fromMime = MIME_EXTENSION_MAP[mimeType];
  if (fromMime) return fromMime;

  const fromName = name.split('.').pop()?.toLowerCase();
  if (fromName) return fromName;

  return 'jpg';
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const accessToken = body?.accessToken;
  const files = Array.isArray(body?.files) ? body.files : [];

  if (!accessToken || files.length === 0) {
    return NextResponse.json({ error: 'Google Drive file data is required' }, { status: 400 });
  }

  const importedFiles = [];

  for (const [index, file] of files.entries()) {
    const fileId = typeof file?.id === 'string' ? file.id : null;
    if (!fileId) {
      continue;
    }

    const metadataRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!metadataRes.ok) {
      const message = await metadataRes.text();
      return NextResponse.json({ error: `Could not read Drive metadata: ${message}` }, { status: 400 });
    }

    const metadata = await metadataRes.json();
    const mimeType = metadata.mimeType as string;
    if (!mimeType?.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files can be imported from Google Drive' }, { status: 400 });
    }

    const mediaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!mediaRes.ok) {
      const message = await mediaRes.text();
      return NextResponse.json({ error: `Could not download Drive file: ${message}` }, { status: 400 });
    }

    const bytes = new Uint8Array(await mediaRes.arrayBuffer());
    const cleanBase = slugify((metadata.name as string) || `drive-image-${index + 1}`) || `drive-image-${index + 1}`;
    const ext = inferExtension(metadata.name as string, mimeType);
    const path = `${user.id}/${Date.now()}-${index + 1}-${cleanBase}.${ext}`;

    const { error } = await supabase.storage
      .from('photos')
      .upload(path, bytes, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage.from('photos').getPublicUrl(path);
    importedFiles.push({
      name: metadata.name,
      url: publicUrl.publicUrl,
      storagePath: path,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ files: importedFiles });
}
