'use client';

import { useState, useEffect } from 'react';
import { X, Send, Clock, RefreshCw, Check, AlertCircle } from 'lucide-react';
import type { ConnectedAccount, Platform } from '@/types';
import { PLATFORM_OPTIONS } from '@/types';
import { cn } from '@/lib/utils';

export interface PublishPayload {
  caption: string;
  platforms: Platform[];
  scheduledAt: string | null;
}

interface PublishModalProps {
  open: boolean;
  brandId: string;
  brandName: string;
  defaultCaption?: string;
  slideCount: number;
  busy: boolean;
  progress?: { step: string; current: number; total: number } | null;
  onClose: () => void;
  onPublish: (payload: PublishPayload) => Promise<void> | void;
}

export function PublishModal({
  open,
  brandId,
  brandName,
  defaultCaption,
  slideCount,
  busy,
  progress,
  onClose,
  onPublish,
}: PublishModalProps) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState(defaultCaption ?? '');
  const [selected, setSelected] = useState<Set<Platform>>(new Set());
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(null);
    setCaption(defaultCaption ?? '');
    setLoading(true);
    fetch('/api/connections')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          const forBrand = data.filter((a: ConnectedAccount) => a.brand_id === brandId);
          setAccounts(forBrand);
          // Pre-select all connected platforms
          setSelected(new Set(forBrand.map((a: ConnectedAccount) => a.platform as Platform)));
        }
      })
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, [open, brandId, defaultCaption]);

  const connectedPlatforms = new Set(accounts.map((a) => a.platform as Platform));

  function togglePlatform(p: Platform) {
    if (!connectedPlatforms.has(p)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(null);
    if (selected.size === 0) {
      setError('Pick at least one connected platform.');
      return;
    }
    let scheduledAt: string | null = null;
    if (schedule === 'later') {
      if (!date || !time) {
        setError('Pick a date and time.');
        return;
      }
      const iso = new Date(`${date}T${time}`).toISOString();
      if (Number.isNaN(new Date(iso).getTime())) {
        setError('Invalid date/time.');
        return;
      }
      scheduledAt = iso;
    }
    try {
      await onPublish({
        caption,
        platforms: Array.from(selected),
        scheduledAt,
      });
      setSuccess(scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleString()}` : 'Posted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={busy ? undefined : onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Publish {slideCount > 1 ? `carousel (${slideCount} slides)` : 'slide'}
            </h2>
            <p className="text-xs text-muted mt-0.5">As {brandName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Caption */}
          <div>
            <label className="text-sm font-semibold text-foreground">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Write a caption…"
              className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="text-sm font-semibold text-foreground">Platforms</label>
            {loading ? (
              <p className="text-xs text-muted mt-1.5">Loading connected accounts…</p>
            ) : connectedPlatforms.size === 0 ? (
              <div className="mt-1.5 rounded border border-dashed border-border p-3 text-xs text-muted">
                No accounts connected for this brand. Go to{' '}
                <a href="/connections" className="text-accent hover:underline">
                  Connections
                </a>{' '}
                to link some.
              </div>
            ) : (
              <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLATFORM_OPTIONS.map((p) => {
                  const isConnected = connectedPlatforms.has(p);
                  const isSelected = selected.has(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      disabled={!isConnected}
                      className={cn(
                        'rounded border px-3 py-2 text-xs font-medium transition-colors',
                        !isConnected && 'border-border text-muted opacity-40 cursor-not-allowed',
                        isConnected && isSelected && 'border-accent bg-accent text-white',
                        isConnected && !isSelected && 'border-border text-foreground hover:bg-card-hover'
                      )}
                      title={!isConnected ? 'Not connected' : ''}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="text-sm font-semibold text-foreground">When</label>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                onClick={() => setSchedule('now')}
                className={cn(
                  'flex-1 rounded border px-3 py-2 text-sm transition-colors',
                  schedule === 'now'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-foreground hover:bg-card-hover'
                )}
              >
                Post now
              </button>
              <button
                type="button"
                onClick={() => setSchedule('later')}
                className={cn(
                  'flex-1 rounded border px-3 py-2 text-sm transition-colors',
                  schedule === 'later'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-foreground hover:bg-card-hover'
                )}
              >
                Schedule
              </button>
            </div>
            {schedule === 'later' && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-danger/10 text-danger text-sm px-3 py-2 rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-accent/10 text-accent text-sm px-3 py-2 rounded flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          {progress && busy && (
            <div className="bg-card-hover text-foreground text-sm px-3 py-2 rounded flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{progress.step} ({progress.current}/{progress.total})</span>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 rounded border border-border text-sm text-foreground hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy || selected.size === 0}
            className="flex items-center gap-2 rounded bg-accent-warm px-4 py-2 text-sm font-medium text-white hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
          >
            {busy ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : schedule === 'later' ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {schedule === 'later' ? 'Schedule' : 'Post Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
