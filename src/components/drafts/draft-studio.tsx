'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

import { useBrand } from '@/components/brand-context';
import type { DraftPost, GeneratedContentKind } from '@/types';

export function DraftStudio() {
  const { selectedBrand, selectedBrandId } = useBrand();
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<GeneratedContentKind>('carousel');
  const [contentCount, setContentCount] = useState(3);
  const [requestedPhotoCount, setRequestedPhotoCount] = useState(8);

  const loadDrafts = useCallback(async () => {
    if (!selectedBrandId) {
      setDrafts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/draft-posts?brandId=${encodeURIComponent(selectedBrandId)}`);
      const data = response.ok ? await response.json() : [];
      setDrafts(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load drafts');
    } finally {
      setLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  async function handleGenerate() {
    if (!selectedBrandId) return;
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/draft-posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrandId,
          kind,
          contentCount,
          requestedPhotoCount,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Could not generate drafts');
      }

      await loadDrafts();
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Could not generate drafts');
    } finally {
      setGenerating(false);
    }
  }

  if (!selectedBrand) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
        Create or select a brand first, then this workspace can generate editable drafts from its photo library.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Draft Studio
        </h1>
        <p className="mt-2 text-sm text-muted">
          Generate reviewable drafts from random uploaded photos, then edit, schedule, or publish them.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Generate drafts</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Format</label>
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as GeneratedContentKind)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="carousel">Carousel</option>
              <option value="single">Single image</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">How many pieces</label>
            <input
              type="number"
              min={1}
              max={24}
              value={contentCount}
              onChange={(event) => setContentCount(Number(event.target.value || 1))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Photos per piece</label>
            <input
              type="number"
              min={1}
              max={12}
              value={requestedPhotoCount}
              onChange={(event) => setRequestedPhotoCount(Number(event.target.value || 1))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-warm px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-warm-hover disabled:opacity-50"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? 'Generating…' : 'Generate drafts'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Saved drafts
            </h2>
            <p className="text-sm text-muted">
              {loading ? 'Loading…' : `${drafts.length} draft${drafts.length === 1 ? '' : 's'} for ${selectedBrand.name}`}
            </p>
          </div>
          <button
            onClick={() => void loadDrafts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted">
            Loading drafts…
          </div>
        ) : drafts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted">
            No drafts yet. Generate your first batch from the photo library above.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drafts.map((draft) => {
              const slideCount = draft.kind === 'single' ? 1 : draft.requested_photo_count;
              return (
                <Link
                  key={draft.id}
                  href={`/drafts/${draft.id}`}
                  className="rounded-lg border border-border bg-card p-5 transition-colors hover:bg-card-hover"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                      {draft.kind}
                    </span>
                    <span className="text-xs text-muted">{new Date(draft.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground line-clamp-3">
                    {draft.caption || 'No caption saved yet'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>{slideCount} {slideCount === 1 ? 'slide' : 'slides'}</span>
                    <span className="inline-flex items-center gap-1 text-accent">
                      Open draft <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
