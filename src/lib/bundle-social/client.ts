const BUNDLE_API = 'https://api.bundle.social/api/v1';

function getApiKey(): string {
  const key = process.env.BUNDLE_SOCIAL_API_KEY;
  if (!key) throw new Error('BUNDLE_SOCIAL_API_KEY not configured');
  return key;
}

function headers(): Record<string, string> {
  return {
    'x-api-key': getApiKey(),
    'Content-Type': 'application/json',
  };
}

// ── Team Management ──

export async function createTeam(name: string): Promise<{ id: string }> {
  const res = await fetch(`${BUNDLE_API}/team/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      name: `PhotoFlow - ${name}`,
      socialAccountTypes: [
        'INSTAGRAM',
        'TIKTOK',
        'TWITTER',
        'LINKEDIN',
        'FACEBOOK',
        'THREADS',
        'YOUTUBE',
        'PINTEREST',
        'BLUESKY',
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social create team failed: ${err}`);
  }

  const data = await res.json();
  const id = data?.id || data?.teamId || data?.data?.id;
  if (!id) throw new Error('No team ID in Bundle Social response');
  return { id };
}

export async function getTeam(teamId: string) {
  const res = await fetch(`${BUNDLE_API}/team/${teamId}`, {
    headers: { 'x-api-key': getApiKey() },
  });
  if (!res.ok) throw new Error('Failed to get team');
  return res.json();
}

export async function deleteTeam(teamId: string) {
  const res = await fetch(`${BUNDLE_API}/team/${teamId}`, {
    method: 'DELETE',
    headers: { 'x-api-key': getApiKey() },
  });
  if (!res.ok) throw new Error('Failed to delete team');
  return res.json();
}

// ── Social Account Connections ──

export async function createPortalLink(
  teamId: string,
  redirectUrl: string,
  platforms?: string[]
): Promise<{ url: string }> {
  const res = await fetch(`${BUNDLE_API}/social-account/create-portal-link`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      teamId,
      redirectUrl,
      socialAccountTypes: platforms || [
        'INSTAGRAM',
        'TIKTOK',
        'TWITTER',
        'LINKEDIN',
        'FACEBOOK',
        'THREADS',
        'YOUTUBE',
        'PINTEREST',
        'BLUESKY',
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social portal link failed: ${err}`);
  }

  const data = await res.json();
  return { url: data.url };
}

export async function connectPlatform(
  teamId: string,
  platform: string,
  redirectUrl: string
): Promise<{ url: string }> {
  const res = await fetch(`${BUNDLE_API}/social-account/connect`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      type: platform.toUpperCase(),
      teamId,
      redirectUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social connect failed: ${err}`);
  }

  const data = await res.json();
  return { url: data.url };
}

export async function listConnectedAccounts(teamId: string) {
  const res = await fetch(`${BUNDLE_API}/team/${teamId}/social-account`, {
    headers: { 'x-api-key': getApiKey() },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social list accounts failed: ${err}`);
  }

  const data = await res.json();
  const accounts = Array.isArray(data) ? data : (data.data ?? data.socialAccounts ?? []);

  return accounts.map((account: Record<string, unknown>) => ({
    id: account.id ?? account.socialAccountId,
    platform: ((account.type ?? account.platform ?? '') as string).toUpperCase(),
    username: account.username ?? account.name ?? null,
  }));
}

// ── Media Upload ──

export async function uploadMedia(
  teamId: string,
  imageUrl: string
): Promise<{ uploadId: string }> {
  // First download the image
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error('Failed to download image for upload');
  const blob = await imageRes.blob();

  const formData = new FormData();
  formData.append('file', blob, 'slide.jpg');
  formData.append('teamId', teamId);

  const res = await fetch(`${BUNDLE_API}/upload/`, {
    method: 'POST',
    headers: { 'x-api-key': getApiKey() },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social upload failed: ${err}`);
  }

  const data = await res.json();
  return { uploadId: data.id || data.uploadId || data.data?.id };
}

// ── Post Creation ──

export interface PlatformAccount {
  platform: string;
  socialAccountId: string;
}

export interface CreatePostInput {
  teamId: string;
  platformAccounts: PlatformAccount[];
  text: string;
  uploadIds?: string[];
  scheduledAt?: string;
  instagramType?: 'POST' | 'REEL' | 'STORY';
}

export async function createPost(input: CreatePostInput): Promise<{ postId: string }> {
  const data: Record<string, Record<string, unknown>> = {};

  for (const { platform, socialAccountId } of input.platformAccounts) {
    const key = platform.toUpperCase();
    const platformData: Record<string, unknown> = {
      socialAccountId,
      text: input.text,
    };

    if (input.uploadIds?.length) {
      // Instagram carousels use carouselItems format
      if (key === 'INSTAGRAM' && input.uploadIds.length > 1) {
        platformData.type = 'POST';
        platformData.carouselItems = input.uploadIds.map((id) => ({ uploadId: id }));
        platformData.autoFitImage = true;
      } else if (key === 'INSTAGRAM') {
        platformData.type = input.instagramType || 'POST';
        platformData.uploadIds = input.uploadIds;
        platformData.autoFitImage = true;
      } else {
        platformData.uploadIds = input.uploadIds;
      }
    }

    data[key] = platformData;
  }

  const postPayload = {
    teamId: input.teamId,
    title: input.text.slice(0, 100) || 'PhotoFlow Post',
    status: 'SCHEDULED',
    postDate: input.scheduledAt ?? new Date(Date.now() + 60_000).toISOString(),
    socialAccountTypes: input.platformAccounts.map((p) => p.platform.toUpperCase()),
    data,
  };

  const res = await fetch(`${BUNDLE_API}/post`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(postPayload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bundle Social create post failed: ${err}`);
  }

  const result = await res.json();
  return { postId: result.id || result.postId || result.data?.id };
}
