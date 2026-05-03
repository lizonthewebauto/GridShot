import { NextResponse } from 'next/server';

import type { Brand, GeneratedContentKind } from '@/types';
import { getDraftPost } from '@/lib/drafts';
import { generateDraftBatch } from '@/lib/generated-content/service';
import { createClient } from '@/lib/supabase/server';
import { listUserUploadCandidates } from '@/lib/uploads';

function isKind(value: string): value is GeneratedContentKind {
  return value === 'single' || value === 'carousel';
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const brandId = typeof body?.brandId === 'string' ? body.brandId : '';
  const kind = typeof body?.kind === 'string' ? body.kind : '';
  const contentCount = Number(body?.contentCount ?? 1);
  const requestedPhotoCount = Number(body?.requestedPhotoCount ?? 1);

  if (!brandId || !isKind(kind)) {
    return NextResponse.json({ error: 'brandId and a valid kind are required' }, { status: 400 });
  }

  if (!Number.isInteger(contentCount) || contentCount < 1 || contentCount > 24) {
    return NextResponse.json({ error: 'contentCount must be between 1 and 24' }, { status: 400 });
  }

  if (!Number.isInteger(requestedPhotoCount) || requestedPhotoCount < 1 || requestedPhotoCount > 12) {
    return NextResponse.json({ error: 'requestedPhotoCount must be between 1 and 12' }, { status: 400 });
  }

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();

  if (brandError || !brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }

  try {
    const uploads = await listUserUploadCandidates(supabase, user.id);
    if (uploads.length < requestedPhotoCount) {
      return NextResponse.json(
        { error: `Need at least ${requestedPhotoCount} uploaded photos before generating.` },
        { status: 400 },
      );
    }

    const generated = await generateDraftBatch({
      brand: brand as Brand,
      uploads,
      kind,
      contentCount,
      requestedPhotoCount,
    });

    const createdDrafts = [];

    for (const item of generated) {
      const { data: draft, error: draftError } = await supabase
        .from('draft_posts')
        .insert({
          user_id: user.id,
          brand_id: brandId,
          kind: item.kind,
          source: 'ai_generated',
          status: 'draft',
          layout_family: item.layoutFamily,
          caption: item.caption,
          requested_photo_count: requestedPhotoCount,
          metadata: {
            fitScore: item.fitScore,
            redrawRecommended: item.redrawRecommended,
            reason: item.reason,
            attempts: item.attempts,
          },
        })
        .select()
        .single();

      if (draftError || !draft) {
        throw new Error(draftError?.message || 'Could not create draft');
      }

      const slideRows = item.slides.map((slide) => ({
        draft_post_id: draft.id,
        user_id: user.id,
        slide_order: slide.slide_order,
        photo_storage_path: slide.photo_storage_path,
        photo_url: null,
        headline: slide.headline,
        body_text: slide.body_text,
        metadata: slide.metadata,
      }));

      const { error: slideError } = await supabase.from('draft_post_slides').insert(slideRows);
      if (slideError) {
        throw new Error(slideError.message);
      }

      const { error: runError } = await supabase.from('generation_runs').insert({
        user_id: user.id,
        brand_id: brandId,
        draft_post_id: draft.id,
        kind: item.kind,
        status: 'succeeded',
        requested_photo_count: requestedPhotoCount,
        request_payload: item.requestPayload,
        selected_uploads: item.selectedUploads,
        model_output: item.modelOutput,
      });

      if (runError) {
        throw new Error(runError.message);
      }

      const fullDraft = await getDraftPost(supabase, user.id, draft.id);
      if (!fullDraft) {
        throw new Error('Created draft could not be reloaded');
      }
      createdDrafts.push(fullDraft);
    }

    return NextResponse.json({ drafts: createdDrafts }, { status: 201 });
  } catch (error) {
    await supabase.from('generation_runs').insert({
      user_id: user.id,
      brand_id: brandId,
      kind,
      status: 'failed',
      requested_photo_count: requestedPhotoCount,
      request_payload: {
        contentCount,
        requestedPhotoCount,
      },
      selected_uploads: [],
      model_output: {},
      error_message: error instanceof Error ? error.message : 'Generation failed',
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not generate drafts' },
      { status: 500 },
    );
  }
}
