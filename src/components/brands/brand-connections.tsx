'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link2, RefreshCw, Check, Plus, AlertCircle } from 'lucide-react';
import type { ConnectedAccount, Platform } from '@/types';
import { PLATFORM_OPTIONS } from '@/types';
import { cn } from '@/lib/utils';

interface BrandConnectionsProps {
  brandId: string;
  hasTeam: boolean;
}

function platformLabel(p: Platform): string {
  return p.charAt(0) + p.slice(1).toLowerCase();
}

export function BrandConnections({ brandId, hasTeam }: BrandConnectionsProps) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    const res = await fetch('/api/connections');
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      setAccounts(data.filter((a: ConnectedAccount) => a.brand_id === brandId));
    }
  }, [brandId]);

  const syncAccounts = useCallback(async () => {
    if (!hasTeam) return;
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch('/api/connections/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Sync failed');
      }
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }, [brandId, hasTeam, loadAccounts]);

  useEffect(() => {
    loadAccounts();
    if (hasTeam) syncAccounts();
  }, [brandId, hasTeam, loadAccounts, syncAccounts]);

  // Listen for the popup callback
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'gridshot:connection-complete') {
        syncAccounts();
        setConnectingPlatform(null);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [syncAccounts]);

  async function handleConnect(platform: Platform) {
    setConnectingPlatform(platform);
    setError(null);
    try {
      const res = await fetch('/api/connections/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, platform }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not start connection');
      }
      const { url } = await res.json();
      const w = 540;
      const h = 720;
      const left = (window.screen.width - w) / 2;
      const top = (window.screen.height - h) / 2;
      const popup = window.open(
        url,
        'gridshot-connect',
        `width=${w},height=${h},left=${left},top=${top}`
      );
      if (!popup) {
        throw new Error('Popup was blocked. Allow popups for this site and try again.');
      }
      // Fallback: if user closes the popup without callback, sync anyway
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          setConnectingPlatform(null);
          syncAccounts();
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start connection');
      setConnectingPlatform(null);
    }
  }

  if (!hasTeam) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted">
        <AlertCircle className="w-5 h-5 mb-2 text-muted" />
        This brand doesn&apos;t have a Bundle Social team yet. Save the brand once with the
        <code className="mx-1 px-1.5 py-0.5 rounded bg-background text-xs">BUNDLE_SOCIAL_API_KEY</code>
        env var configured to provision one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Social Connections
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Click a platform to connect — it opens a popup, you authenticate, the popup closes.
          </p>
        </div>
        <button
          onClick={syncAccounts}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm px-3 py-2 rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PLATFORM_OPTIONS.map((p) => {
          const platform = p as Platform;
          const account = accounts.find((a) => a.platform === platform);
          const connected = !!account;
          const connecting = connectingPlatform === platform;

          return (
            <div
              key={platform}
              className={cn(
                'rounded-lg border p-4 flex flex-col gap-2',
                connected ? 'border-accent/40 bg-accent/5' : 'border-border bg-card'
              )}
            >
              <div className="flex items-center gap-2">
                {connected ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Link2 className="w-4 h-4 text-muted" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {platformLabel(platform)}
                </span>
              </div>

              {connected ? (
                <div>
                  <p className="text-xs text-accent truncate font-medium">
                    {account.platform_username ? `@${account.platform_username}` : 'Connected'}
                  </p>
                  <button
                    onClick={() => handleConnect(platform)}
                    disabled={connecting}
                    className="mt-2 text-xs text-muted hover:text-foreground disabled:opacity-50"
                  >
                    {connecting ? 'Reconnecting…' : 'Reconnect'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform)}
                  disabled={connecting}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded bg-accent-warm/90 hover:bg-accent-warm-hover text-white text-xs font-medium px-3 py-1.5 disabled:opacity-50 transition-colors"
                >
                  {connecting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  {connecting ? 'Connecting…' : 'Connect'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
