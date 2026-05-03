import type { UploadedFile } from '@/types';
import type { UploadCandidate } from '@/lib/generated-content/selection';
import type { createClient as createServerClient } from '@/lib/supabase/server';

type AppSupabase = Awaited<ReturnType<typeof createServerClient>>;

export async function listUserUploads(
  supabase: AppSupabase,
  userId: string,
): Promise<UploadedFile[]> {
  const { data: files, error } = await supabase.storage
    .from('photos')
    .list(userId, { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    throw new Error(error.message);
  }

  const filtered = (files ?? []).filter((file) => !file.name.startsWith('.'));
  const imageFiles = filtered.filter((file) => file.name !== 'generated');
  if (imageFiles.length === 0) {
    return [];
  }

  const storagePaths = imageFiles.map((file) => `${userId}/${file.name}`);
  const { data: signedUrls, error: signedUrlError } = await supabase.storage
    .from('photos')
    .createSignedUrls(storagePaths, 3600);

  if (signedUrlError) {
    throw new Error(signedUrlError.message);
  }

  return imageFiles
    .map((file, index) => ({
      name: file.name,
      url: signedUrls?.[index]?.signedUrl ?? '',
      storagePath: storagePaths[index],
      createdAt: file.created_at ?? undefined,
    }))
    .filter((file) => file.url);
}

export async function listUserUploadCandidates(
  supabase: AppSupabase,
  userId: string,
): Promise<UploadCandidate[]> {
  const uploads = await listUserUploads(supabase, userId);
  return uploads.map((upload) => ({
    storagePath: upload.storagePath,
    photoUrl: upload.url,
    fileName: upload.name,
  }));
}
