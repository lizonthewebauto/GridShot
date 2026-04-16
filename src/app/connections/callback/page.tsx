'use client';

import { useEffect } from 'react';

export default function ConnectionCallbackPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.opener) {
      window.opener.postMessage({ type: 'gridshot:connection-complete' }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 text-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Connecting…
      </h1>
      <p className="text-muted text-sm max-w-sm">
        This window will close automatically. If it doesn&apos;t, you can close it.
      </p>
    </div>
  );
}
