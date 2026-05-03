import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describePublishIntent,
  mapBundlePostLifecycle,
  resolveRequestedPublishLifecycle,
} from './lifecycle';

test('resolveRequestedPublishLifecycle queues immediate publishes for the fastest supported slot', () => {
  const lifecycle = resolveRequestedPublishLifecycle(null, {
    now: new Date('2026-05-01T12:00:00.000Z'),
  });

  assert.equal(lifecycle.mode, 'queue-now');
  assert.equal(lifecycle.localStatus, 'publishing');
  assert.equal(lifecycle.scheduledAt.toISOString(), '2026-05-01T12:01:00.000Z');
});

test('resolveRequestedPublishLifecycle preserves explicit schedule requests', () => {
  const lifecycle = resolveRequestedPublishLifecycle('2026-05-02T15:30:00.000Z', {
    now: new Date('2026-05-01T12:00:00.000Z'),
  });

  assert.equal(lifecycle.mode, 'schedule');
  assert.equal(lifecycle.localStatus, 'scheduled');
  assert.equal(lifecycle.scheduledAt.toISOString(), '2026-05-02T15:30:00.000Z');
});

test('describePublishIntent is honest for queue-now requests', () => {
  const message = describePublishIntent(
    {
      mode: 'queue-now',
      localStatus: 'publishing',
      scheduledAt: new Date('2026-05-01T12:01:00.000Z'),
    },
    {
      formatDate: () => 'May 1, 2026, 8:01 AM',
    },
  );

  assert.equal(message, 'Queued to publish soon.');
});

test('describePublishIntent formats scheduled publishes', () => {
  const message = describePublishIntent(
    {
      mode: 'schedule',
      localStatus: 'scheduled',
      scheduledAt: new Date('2026-05-02T15:30:00.000Z'),
    },
    {
      formatDate: () => 'May 2, 2026, 11:30 AM',
    },
  );

  assert.equal(message, 'Scheduled for May 2, 2026, 11:30 AM');
});

test('mapBundlePostLifecycle keeps queue-now posts in publishing while Bundle still says scheduled', () => {
  const mapped = mapBundlePostLifecycle(
    {
      status: 'publishing',
      published_at: null,
      error_message: null,
    },
    {
      status: 'SCHEDULED',
      postedDate: null,
      error: null,
      errors: null,
    },
  );

  assert.deepEqual(mapped, {
    status: 'publishing',
    published_at: null,
    error_message: null,
  });
});

test('mapBundlePostLifecycle marks posted posts as published', () => {
  const mapped = mapBundlePostLifecycle(
    {
      status: 'scheduled',
      published_at: null,
      error_message: null,
    },
    {
      status: 'POSTED',
      postedDate: '2026-05-01T12:05:00.000Z',
      error: null,
      errors: null,
    },
  );

  assert.deepEqual(mapped, {
    status: 'published',
    published_at: '2026-05-01T12:05:00.000Z',
    error_message: null,
  });
});

test('mapBundlePostLifecycle captures provider errors', () => {
  const mapped = mapBundlePostLifecycle(
    {
      status: 'scheduled',
      published_at: null,
      error_message: null,
    },
    {
      status: 'ERROR',
      postedDate: null,
      error: null,
      errors: {
        INSTAGRAM: 'Media upload failed',
      },
    },
  );

  assert.deepEqual(mapped, {
    status: 'failed',
    published_at: null,
    error_message: 'Media upload failed',
  });
});
