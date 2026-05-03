import type { DraftPost, DraftPostSlide } from '@/types';
import type { createClient as createServerClient } from '@/lib/supabase/server';

type AppSupabase = Awaited<ReturnType<typeof createServerClient>>;

function normalizeDraftSlides(rows: DraftPostSlide[]): DraftPostSlide[] {
  return rows.sort((left, right) => left.slide_order - right.slide_order);
}

async function signPhotoUrls(
  supabase: AppSupabase,
  storagePaths: string[],
): Promise<Record<string, string>> {
  const uniquePaths = [...new Set(storagePaths.filter(Boolean))];
  if (uniquePaths.length === 0) return {};

  const { data, error } = await supabase.storage
    .from('photos')
    .createSignedUrls(uniquePaths, 3600);

  if (error) {
    throw new Error(error.message);
  }

  const signed = data ?? [];
  return uniquePaths.reduce<Record<string, string>>((accumulator, path, index) => {
    const signedUrl = signed[index]?.signedUrl;
    if (signedUrl) {
      accumulator[path] = signedUrl;
    }
    return accumulator;
  }, {});
}

export async function hydrateDraftSlides(
  supabase: AppSupabase,
  rows: DraftPostSlide[],
): Promise<DraftPostSlide[]> {
  const signedUrls = await signPhotoUrls(
    supabase,
    rows
      .map((row) => row.photo_storage_path)
      .filter((value): value is string => Boolean(value)),
  );

  return normalizeDraftSlides(rows).map((row) => ({
    ...row,
    photo_url:
      (row.photo_storage_path ? signedUrls[row.photo_storage_path] : null) ??
      row.photo_url ??
      null,
  }));
}

export async function listDraftPosts(
  supabase: AppSupabase,
  userId: string,
  brandId?: string,
): Promise<DraftPost[]> {
  let query = supabase
    .from('draft_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (brandId) {
    query = query.eq('brand_id', brandId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as DraftPost[];
}

export async function getDraftPost(
  supabase: AppSupabase,
  userId: string,
  draftId: string,
): Promise<DraftPost | null> {
  const { data: draft, error } = await supabase
    .from('draft_posts')
    .select('*')
    .eq('id', draftId)
    .eq('user_id', userId)
    .single();

  if (error || !draft) return null;

  const { data: slides, error: slideError } = await supabase
    .from('draft_post_slides')
    .select('*')
    .eq('draft_post_id', draftId)
    .eq('user_id', userId)
    .order('slide_order', { ascending: true });

  if (slideError) throw new Error(slideError.message);

  return {
    ...(draft as DraftPost),
    slides: await hydrateDraftSlides(supabase, (slides ?? []) as DraftPostSlide[]),
  };
}
