export const QUEUE_NOW_DELAY_MS = 60_000;

export type LocalPostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
export type PublishMode = 'queue-now' | 'schedule';

export interface PublishLifecycle {
  mode: PublishMode;
  scheduledAt: Date;
  localStatus: Extract<LocalPostStatus, 'scheduled' | 'publishing'>;
}

export interface BundleLifecycleSnapshot {
  status?: string | null;
  postedDate?: string | null;
  error?: string | null;
  errors?: Record<string, string | null | undefined> | null;
}

export interface LocalLifecycleRecord {
  status: LocalPostStatus;
  published_at: string | null;
  error_message: string | null;
}

export function resolveRequestedPublishLifecycle(
  scheduledAtInput: string | null | undefined,
  options?: {
    now?: Date;
    queueDelayMs?: number;
  },
): PublishLifecycle {
  if (scheduledAtInput) {
    const scheduledAt = new Date(scheduledAtInput);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error('Invalid scheduledAt value');
    }

    return {
      mode: 'schedule',
      scheduledAt,
      localStatus: 'scheduled',
    };
  }

  const now = options?.now ?? new Date();
  const queueDelayMs = options?.queueDelayMs ?? QUEUE_NOW_DELAY_MS;

  return {
    mode: 'queue-now',
    scheduledAt: new Date(now.getTime() + queueDelayMs),
    localStatus: 'publishing',
  };
}

export function describePublishIntent(
  lifecycle: PublishLifecycle,
  options?: {
    formatDate?: (date: Date) => string;
  },
) {
  if (lifecycle.mode === 'queue-now') {
    return 'Queued to publish soon.';
  }

  const formatDate = options?.formatDate ?? ((date: Date) => date.toLocaleString());
  return `Scheduled for ${formatDate(lifecycle.scheduledAt)}`;
}

function firstBundleError(errors: BundleLifecycleSnapshot['errors']) {
  if (!errors) return null;
  for (const message of Object.values(errors)) {
    if (message) return message;
  }
  return null;
}

export function mapBundlePostLifecycle(
  current: LocalLifecycleRecord,
  provider: BundleLifecycleSnapshot,
): LocalLifecycleRecord {
  const providerStatus = String(provider.status ?? '').toUpperCase();

  switch (providerStatus) {
    case 'POSTED':
      return {
        status: 'published',
        published_at: provider.postedDate ?? current.published_at,
        error_message: null,
      };
    case 'ERROR':
    case 'DELETED':
      return {
        status: 'failed',
        published_at: current.published_at,
        error_message:
          provider.error ??
          firstBundleError(provider.errors) ??
          current.error_message ??
          (providerStatus === 'DELETED'
            ? 'Post was deleted in Bundle Social.'
            : 'Bundle Social reported a publishing error.'),
      };
    case 'PROCESSING':
    case 'RETRYING':
    case 'REVIEW':
      return {
        status: 'publishing',
        published_at: current.published_at,
        error_message: null,
      };
    case 'SCHEDULED':
      return {
        status: current.status === 'publishing' ? 'publishing' : 'scheduled',
        published_at: current.published_at,
        error_message: null,
      };
    case 'DRAFT':
      return {
        status: 'draft',
        published_at: current.published_at,
        error_message: null,
      };
    default:
      return current;
  }
}
