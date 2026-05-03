import { NextResponse } from 'next/server';

import type { Brand, DraftPostSlide } from '@/types';
import { getDraftPost } from '@/lib/drafts';
import { generateOneDraft } from '@/lib/generated-content/service';
import { createClient } from '@/lib/supabase/server';
import { listUserUploadCandidates } from '@/lib/uploads';

export async function POST(
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
  const scope = body?.scope === 'slide' ? 'slide' : 'draft';
  const slideId = typeof body?.slideId === 'string' ? body.slideId : '';

  const draft = await getDraftPost(supabase, user.id, id);
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', draft.brand_id)
    .eq('user_id', user.id)
    .single();

  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }

  try {
    if (scope === 'slide') {
      const slide = draft.slides?.find((item) => item.id === slideId) as DraftPostSlide | undefined;
      if (!slide?.photo_storage_path || !slide.photo_url) {
        return NextResponse.json({ error: 'Slide image is required for single-slide regenerate' }, { status: 400 });
      }

      const result = await generateOneDraft({
        brand: brand as Brand,
        uploads: [
          {
            storagePath: slide.photo_storage_path,
            photoUrl: slide.photo_url,
            fileName: slide.photo_storage_path.split('/').pop() || 'slide.jpg',
          },
        ],
        kind: 'single',
        requestedPhotoCount: 1,
        postIndex: slide.slide_order,
      });

      const nextSlide = result.slides[0];
      const { error: slideError } = await supabase
        .from('draft_post_slides')
        .update({
          headline: nextSlide.headline,
          body_text: nextSlide.body_text,
          metadata: {
            ...(slide.metadata || {}),
            ...nextSlide.metadata,
            regeneratedAt: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', slide.id)
        .eq('draft_post_id', draft.id)
        .eq('user_id', user.id);

      if (slideError) {
        throw new Error(slideError.message);
      }

      await supabase.from('generation_runs').insert({
        user_id: user.id,
        brand_id: draft.brand_id,
        draft_post_id: draft.id,
        kind: draft.kind,
        status: 'succeeded',
        requested_photo_count: 1,
        request_payload: { scope: 'slide', slideId: slide.id },
        selected_uploads: result.selectedUploads,
        model_output: result.modelOutput,
      });
    } else {
      const uploads = await listUserUploadCandidates(supabase, user.id);
      const result = await generateOneDraft({
        brand: brand as Brand,
        uploads,
        kind: draft.kind,
        requestedPhotoCount: draft.requested_photo_count,
        postIndex: 0,
      });

      const { error: draftError } = await supabase
        .from('draft_posts')
        .update({
          caption: result.caption,
          metadata: {
            ...(draft.metadata || {}),
            fitScore: result.fitScore,
            redrawRecommended: result.redrawRecommended,
            reason: result.reason,
            attempts: result.attempts,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', draft.id)
        .eq('user_id', user.id);

      if (draftError) {
        throw new Error(draftError.message);
      }

      const { error: deleteError } = await supabase
        .from('draft_post_slides')
        .delete()
        .eq('draft_post_id', draft.id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      const { error: insertError } = await supabase.from('draft_post_slides').insert(
        result.slides.map((slide) => ({
          draft_post_id: draft.id,
          user_id: user.id,
          slide_order: slide.slide_order,
          photo_storage_path: slide.photo_storage_path,
          photo_url: null,
          headline: slide.headline,
          body_text: slide.body_text,
          metadata: slide.metadata,
        })),
      );

      if (insertError) {
        throw new Error(insertError.message);
      }

      await supabase.from('generation_runs').insert({
        user_id: user.id,
        brand_id: draft.brand_id,
        draft_post_id: draft.id,
        kind: draft.kind,
        status: 'succeeded',
        requested_photo_count: draft.requested_photo_count,
        request_payload: { scope: 'draft' },
        selected_uploads: result.selectedUploads,
        model_output: result.modelOutput,
      });
    }

    const refreshed = await getDraftPost(supabase, user.id, draft.id);
    return NextResponse.json(refreshed);
  } catch (error) {
    await supabase.from('generation_runs').insert({
      user_id: user.id,
      brand_id: draft.brand_id,
      draft_post_id: draft.id,
      kind: draft.kind,
      status: 'failed',
      requested_photo_count: scope === 'slide' ? 1 : draft.requested_photo_count,
      request_payload: { scope, slideId: slideId || null },
      selected_uploads: [],
      model_output: {},
      error_message: error instanceof Error ? error.message : 'Regenerate failed',
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not regenerate draft' },
      { status: 500 },
    );
  }
}
