export interface ScriptElementLike {
  src: string;
  async: boolean;
  defer: boolean;
  onload: null | (() => void);
  onerror: null | (() => void);
  addEventListener: (type: 'load' | 'error', listener: () => void, options?: { once?: boolean }) => void;
  removeEventListener?: (type: 'load' | 'error', listener: () => void) => void;
}

export interface DocumentLike {
  querySelector: (selector: string) => ScriptElementLike | null;
  createElement: (tag: 'script') => ScriptElementLike;
  head: {
    appendChild: (element: ScriptElementLike) => void;
  };
}

export interface GooglePickerWindow {
  gapi?: {
    load: (library: string, callback: () => void) => void;
    client?: {
      load: (url: string) => Promise<void>;
    };
  };
  google?: unknown;
}

export interface GooglePickerLoaderOptions {
  timeoutMs?: number;
  pollIntervalMs?: number;
}

export interface GoogleTokenError {
  type?: string;
}

const GOOGLE_API_SCRIPT = 'https://apis.google.com/js/api.js';
const GOOGLE_IDENTITY_SCRIPT = 'https://accounts.google.com/gsi/client';
const GOOGLE_DRIVE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_POLL_INTERVAL_MS = 25;

function getDefaultDocument() {
  return document as unknown as DocumentLike;
}

function getDefaultWindow() {
  return window as unknown as GooglePickerWindow;
}

function toError(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

function waitForCondition(
  test: () => boolean,
  {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    errorMessage,
  }: GooglePickerLoaderOptions & { errorMessage: string },
) {
  return new Promise<void>((resolve, reject) => {
    if (test()) {
      resolve();
      return;
    }

    const intervalId = setInterval(() => {
      if (!test()) {
        return;
      }

      clearInterval(intervalId);
      clearTimeout(timeoutId);
      resolve();
    }, pollIntervalMs);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error(errorMessage));
    }, timeoutMs);
  });
}

export function loadScript(
  src: string,
  test: () => boolean,
  doc: DocumentLike = getDefaultDocument(),
  options: GooglePickerLoaderOptions = {},
) {
  if (typeof window === 'undefined' && arguments.length < 3) {
    return Promise.reject(new Error('Window is not available'));
  }

  if (test()) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = doc.querySelector(`script[src="${src}"]`);
    const script = existing ?? doc.createElement('script');
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load ${src}`));
    };

    const cleanup = () => {
      script.removeEventListener?.('error', onError);
    };

    script.addEventListener('error', onError, { once: true });

    if (!existing) {
      script.src = src;
      script.async = true;
      script.defer = true;
      doc.head.appendChild(script);
    }

    waitForCondition(test, {
      ...options,
      errorMessage: `Timed out while loading ${src}`,
    })
      .then(() => {
        cleanup();
        resolve();
      })
      .catch((error) => {
        cleanup();
        reject(error);
      });
  });
}

export async function ensureGooglePicker(
  win: GooglePickerWindow = getDefaultWindow(),
  doc: DocumentLike = getDefaultDocument(),
  options: GooglePickerLoaderOptions = {},
) {
  await Promise.all([
    loadScript(GOOGLE_API_SCRIPT, () => typeof win.gapi !== 'undefined', doc, options),
    loadScript(GOOGLE_IDENTITY_SCRIPT, () => typeof win.google !== 'undefined', doc, options),
  ]);

  if (!win.gapi?.load) {
    throw new Error('Google Drive client did not initialize.');
  }

  const { gapi } = win;
  const { timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeoutId);
      callback();
    };

    const timeoutId = setTimeout(() => {
      finish(() => reject(new Error('Timed out while starting the Google Drive picker.')));
    }, timeoutMs);

    try {
      gapi.load('client:picker', () => {
        if (!gapi.client?.load) {
          finish(() => reject(new Error('Google Drive client did not initialize.')));
          return;
        }

        void gapi.client
          .load(GOOGLE_DRIVE_DISCOVERY_DOC)
          .then(() => {
            finish(resolve);
          })
          .catch((error) => {
            finish(() => reject(toError(error, 'Could not load Google Drive.')));
          });
      });
    } catch (error) {
      finish(() => reject(toError(error, 'Could not open Google Drive.')));
    }
  });
}

export function getGoogleDriveAuthErrorMessage(error?: GoogleTokenError | null) {
  switch (error?.type) {
    case 'popup_failed_to_open':
      return 'Google blocked the sign-in popup. Allow popups for this site and try again.';
    case 'popup_closed':
      return 'Sign-in window closed. Click "Try again" to reconnect.';
    default:
      return 'Google Drive authorization failed.';
  }
}
