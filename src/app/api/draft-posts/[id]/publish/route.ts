import { NextResponse } from 'next/server';

import { getDraftPost } from '@/lib/drafts';
import { createPost, uploadMedia } from '@/lib/bundle-social/client';
import { resolveRequestedPublishLifecycle } from '@/lib/publishing/lifecycle';
import { createClient } from '@/lib/supabase/server';

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid media data URL');
  }

  const [, contentType, payload] = match;
  return {
    contentType,
    bytes: Buffer.from(payload, 'base64'),
  };
}

async function uploadGeneratedMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  draftId: string,
  media: string[],
) {
  const storagePaths: string[] = [];

  for (let index = 0; index < media.length; index += 1) {
    const { contentType, bytes } = parseDataUrl(media[index]);
    const extension = contentType.includes('png') ? 'png' : 'jpg';
    const path = `${userId}/generated/${draftId}-${Date.now()}-${index + 1}.${extension}`;

    const { error } = await supabase.storage.from('photos').upload(path, bytes, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    storagePaths.push(path);
  }

  const { data: signedUrls, error } = await supabase.storage
    .from('photos')
    .createSignedUrls(storagePaths, 3600);

  if (error) {
    throw new Error(error.message);
  }

  const mediaUrls = storagePaths.map((path, index) => signedUrls?.[index]?.signedUrl || '');
  if (mediaUrls.some((url) => !url)) {
    throw new Error('Could not create signed URLs for exported media');
  }

  return {
    storagePaths,
    mediaUrls,
  };
}

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
  const caption = typeof body?.caption === 'string' ? body.caption : '';
  const scheduledAtRaw = typeof body?.scheduledAt === 'string' ? body.scheduledAt : null;
  const rawMedia = Array.isArray(body?.media) ? (body.media as unknown[]) : [];
  const media = rawMedia.filter((item): item is string => typeof item === 'string');
  const rawPlatforms = Array.isArray(body?.platforms) ? (body.platforms as unknown[]) : [];
  const platforms = rawPlatforms.filter((item): item is string => typeof item === 'string');

  if (platforms.length === 0 || media.length === 0) {
    return NextResponse.json({ error: 'media and platforms are required' }, { status: 400 });
  }

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
    const publishLifecycle = resolveRequestedPublishLifecycle(scheduledAtRaw);
    const scheduledAt = publishLifecycle.scheduledAt;
    const { storagePaths, mediaUrls } = await uploadGeneratedMedia(supabase, user.id, draft.id, media);

    if (!brand.bundle_social_team_id) {
      return NextResponse.json({ error: 'Bundle Social is not configured for this brand.' }, { status: 400 });
    }

    const { data: connectedAccounts } = await supabase
      .from('connected_accounts')
      .select('platform, bundle_social_account_id')
      .eq('brand_id', draft.brand_id)
      .eq('user_id', user.id)
      .in('platform', platforms.map((platform) => platform.toUpperCase()));

    if (!connectedAccounts?.length) {
      return NextResponse.json(
        { error: 'No connected Bundle Social accounts for the selected platforms.' },
        { status: 400 },
      );
    }

    const uploadIds = [];
    for (const url of mediaUrls) {
      const uploaded = await uploadMedia(brand.bundle_social_team_id, url);
      uploadIds.push(uploaded.uploadId);
    }

    const created = await createPost({
      teamId: brand.bundle_social_team_id,
      platformAccounts: connectedAccounts.map((account) => ({
        platform: account.platform,
        socialAccountId: account.bundle_social_account_id,
      })),
      text: caption,
      uploadIds,
      scheduledAt: scheduledAt.toISOString(),
    });

    const providerPostId = created.postId;

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        brand_id: draft.brand_id,
        draft_post_id: draft.id,
        slide_ids: [],
        caption,
        platforms,
        bundle_social_post_id: providerPostId,
        media_count: media.length,
        media_storage_paths: storagePaths,
        scheduled_at: scheduledAt.toISOString(),
        status: publishLifecycle.localStatus,
      })
      .select()
      .single();

    if (error || !post) {
      throw new Error(error?.message || 'Could not save published post');
    }

    await supabase
      .from('draft_posts')
      .update({
        caption,
        status: 'scheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', draft.id)
      .eq('user_id', user.id);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not publish draft' },
      { status: 500 },
    );
  }
}
