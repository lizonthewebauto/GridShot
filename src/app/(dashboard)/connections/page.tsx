'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link2, ExternalLink, RefreshCw, Check } from 'lucide-react';
import type { Brand, ConnectedAccount } from '@/types';
import { PLATFORM_OPTIONS } from '@/types';

export default function ConnectionsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          const def = data.find((b: Brand) => b.is_default) ?? data[0];
          setSelectedBrandId(def.id);
        }
      })
      .catch(() => setError('Failed to load brands'));
  }, []);

  const loadAccounts = useCallback(async () => {
    const res = await fetch('/api/connections');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setAccounts(data);
    }
  }, []);

  const syncAccounts = useCallback(async () => {
    if (!selectedBrandId) return;
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch('/api/connections/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId }),
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
  }, [selectedBrandId, loadAccounts]);

  useEffect(() => {
    if (selectedBrandId) {
      loadAccounts();
      syncAccounts();
    }
  }, [selectedBrandId, loadAccounts, syncAccounts]);

  async function handleConnect() {
    if (!selectedBrandId) return;
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch('/api/connections/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not open Bundle Social portal');
      }
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open Bundle Social portal');
    } finally {
      setConnecting(false);
    }
  }

  if (brands.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Connections
        </h1>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted">Create a brand first, then come back here to connect accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Connections
          </h1>
          <p className="text-muted text-sm mt-1">Connect social accounts via Bundle Social.</p>
        </div>
        <select
          value={selectedBrandId}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-card border border-border p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Connect Social Accounts
            </h2>
            <p className="text-sm text-muted mt-1">
              Link Instagram, Threads, X, Facebook, TikTok, LinkedIn, Bluesky, Pinterest.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={syncAccounts}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button
              onClick={handleConnect}
              disabled={connecting || !selectedBrandId}
              className="inline-flex items-center gap-2 rounded bg-accent-warm px-4 py-2 text-sm font-medium text-white hover:bg-accent-warm-hover disabled:opacity-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {connecting ? 'Opening…' : 'Connect Accounts'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PLATFORM_OPTIONS.map((platform) => {
          const connected = accounts.find(
            (a) => a.platform === platform && a.brand_id === selectedBrandId
          );
          return (
            <div
              key={platform}
              className={`rounded-lg border p-4 ${
                connected ? 'border-accent/40 bg-accent/5' : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {connected ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Link2 className="w-4 h-4 text-muted" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {platform.charAt(0) + platform.slice(1).toLowerCase()}
                </span>
              </div>
              {connected ? (
                <p className="text-xs text-accent truncate">
                  {connected.platform_username ? `@${connected.platform_username}` : 'Connected'}
                </p>
              ) : (
                <p className="text-xs text-muted">Not connected</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
