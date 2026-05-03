import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ensureGooglePicker,
  getGoogleDriveAuthErrorMessage,
  loadScript,
  type DocumentLike,
  type GooglePickerWindow,
  type ScriptElementLike,
} from './google-drive-picker';

class FakeScript implements ScriptElementLike {
  src = '';
  async = false;
  defer = false;
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  private listeners = new Map<'load' | 'error', Array<() => void>>();

  addEventListener(type: 'load' | 'error', listener: () => void) {
    const current = this.listeners.get(type) ?? [];
    current.push(listener);
    this.listeners.set(type, current);
  }

  dispatch(type: 'load' | 'error') {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }

    if (type === 'load') {
      this.onload?.();
      return;
    }

    this.onerror?.();
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function expectRejectedWithin(promise: Promise<unknown>, ms: number, message: RegExp) {
  let settled = false;
  let error: unknown;

  promise.catch((reason) => {
    settled = true;
    error = reason;
  });

  await wait(ms);

  assert.equal(settled, true, 'Expected promise to reject before timeout');
  assert.match(error instanceof Error ? error.message : String(error), message);
}

test('loadScript rejects when an existing script never initializes', async () => {
  const existing = new FakeScript();
  const doc: DocumentLike = {
    querySelector: () => existing,
    createElement: () => new FakeScript(),
    head: {
      appendChild: () => undefined,
    },
  };

  await expectRejectedWithin(
    loadScript('https://accounts.google.com/gsi/client', () => false, doc, { timeoutMs: 10 }),
    50,
    /timed out/i,
  );
});

test('ensureGooglePicker rejects when picker setup never finishes', async () => {
  const apiScript = new FakeScript();
  const gsiScript = new FakeScript();
  const doc: DocumentLike = {
    querySelector: (selector) => {
      if (selector.includes('api.js')) {
        return apiScript;
      }

      if (selector.includes('gsi/client')) {
        return gsiScript;
      }

      return null;
    },
    createElement: () => new FakeScript(),
    head: {
      appendChild: () => undefined,
    },
  };

  const win: GooglePickerWindow = {
    gapi: {
      load: () => undefined,
      client: {
        load: async () => undefined,
      },
    },
    google: {},
  };

  apiScript.dispatch('load');
  gsiScript.dispatch('load');

  await expectRejectedWithin(ensureGooglePicker(win, doc, { timeoutMs: 10 }), 50, /timed out/i);
});

test('ensureGooglePicker allows gapi.client to appear during gapi.load', async () => {
  const apiScript = new FakeScript();
  const gsiScript = new FakeScript();
  const doc: DocumentLike = {
    querySelector: (selector) => {
      if (selector.includes('api.js')) {
        return apiScript;
      }

      if (selector.includes('gsi/client')) {
        return gsiScript;
      }

      return null;
    },
    createElement: () => new FakeScript(),
    head: {
      appendChild: () => undefined,
    },
  };

  const win = {
    gapi: {
      load: (_library: string, callback: () => void) => {
        win.gapi!.client = {
          load: async () => undefined,
        };
        callback();
      },
    },
    google: {},
  } as unknown as GooglePickerWindow;

  apiScript.dispatch('load');
  gsiScript.dispatch('load');

  await assert.doesNotReject(() => ensureGooglePicker(win, doc, { timeoutMs: 10 }));
});

test('getGoogleDriveAuthErrorMessage maps popup failures to useful copy', () => {
  assert.equal(
    getGoogleDriveAuthErrorMessage({ type: 'popup_failed_to_open' }),
    'Google blocked the sign-in popup. Allow popups for this site and try again.',
  );
  assert.equal(
    getGoogleDriveAuthErrorMessage({ type: 'popup_closed' }),
    'Google sign-in was closed before it finished.',
  );
  assert.equal(
    getGoogleDriveAuthErrorMessage({ type: 'anything-else' }),
    'Google Drive authorization failed.',
  );
});
