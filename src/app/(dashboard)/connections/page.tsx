'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link2, ExternalLink, RefreshCw } from 'lucide-react';
import type { Brand, ConnectedAccount } from '@/types';
import { PLATFORM_OPTIONS } from '@/types';

export default function ConnectionsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          const defaultBrand = data.find((b: Brand) => b.is_default) || data[0];
          setSelectedBrandId(defaultBrand.id);
        }
      });
  }, []);

  const syncAccounts = useCallback(async () => {
    if (!selectedBrandId) return;
    setSyncing(true);
    await fetch('/api/connections/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId: selectedBrandId }),
    });
    // Reload accounts (using sync endpoint's response or re-fetch)
    setSyncing(false);
  }, [selectedBrandId]);

  useEffect(() => {
    if (selectedBrandId) syncAccounts();
  }, [selectedBrandId, syncAccounts]);

  async function handleConnect() {
    if (!selectedBrandId) return;
    setConnecting(true);

    const res = await fetch('/api/connections/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId: selectedBrandId }),
    });

    if (res.ok) {
      const { url } = await res.json();
      window.open(url, '_blank');
    }

    setConnecting(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Connections</h1>
          <p className="text-muted mt-1">Connect your social media accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBrandId || ''}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Connect Button */}
      <div className="rounded-lg bg-card border border-border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Connect Social Accounts
            </h2>
            <p className="text-sm text-muted mt-1">
              Link your Instagram, Threads, X, and more to post directly from PhotoFlow
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={syncAccounts}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button
              onClick={handleConnect}
              disabled={connecting || !selectedBrandId}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {connecting ? 'Opening...' : 'Connect Accounts'}
            </button>
          </div>
        </div>
      </div>

      {/* Connected Accounts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PLATFORM_OPTIONS.map((platform) => {
          const connected = accounts.find(
            (a) => a.platform === platform && a.brand_id === selectedBrandId
          );
          return (
            <div
              key={platform}
              className={`rounded-lg border p-4 ${
                connected
                  ? 'border-accent/30 bg-accent/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-foreground">
                  {platform.charAt(0) + platform.slice(1).toLowerCase()}
                </span>
              </div>
              {connected ? (
                <p className="text-xs text-accent">
                  @{connected.platform_username || 'Connected'}
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
