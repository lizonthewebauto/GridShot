'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Brand } from '@/types';

interface BrandFormProps {
  brand?: Brand;
  mode: 'create' | 'edit';
}

export function BrandForm({ brand, mode }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(brand?.name || '');
  const [voiceDescription, setVoiceDescription] = useState(brand?.voice_description || '');
  const [colorPrimary, setColorPrimary] = useState(brand?.color_primary || '#4a5940');
  const [colorSecondary, setColorSecondary] = useState(brand?.color_secondary || '#f5f0e8');
  const [colorAccent, setColorAccent] = useState(brand?.color_accent || '');
  const [fontHeading, setFontHeading] = useState(brand?.font_heading || 'Playfair Display');
  const [fontBody, setFontBody] = useState(brand?.font_body || 'Lora');
  const [reviewCount, setReviewCount] = useState(brand?.review_count || '');
  const [reviewTagline, setReviewTagline] = useState(brand?.review_tagline || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      name,
      voice_description: voiceDescription,
      color_primary: colorPrimary,
      color_secondary: colorSecondary,
      color_accent: colorAccent || null,
      font_heading: fontHeading,
      font_body: fontBody,
      review_count: reviewCount || null,
      review_tagline: reviewTagline || null,
    };

    const url = mode === 'create' ? '/api/brands' : `/api/brands/${brand!.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    router.push('/brands');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">{error}</div>
      )}

      {/* Brand Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Studio / Brand Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Chrisman Studios"
        />
      </div>

      {/* Brand Voice */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Brand Voice Description
        </label>
        <textarea
          value={voiceDescription}
          onChange={(e) => setVoiceDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Elegant, poetic, documentary-style. We speak in first person plural. Our tone is warm but professional, like a trusted friend who happens to be an artist."
        />
        <p className="text-xs text-muted mt-1">
          Describe how your brand writes and speaks. The AI will use this to generate text that sounds like you.
        </p>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Colors</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Primary (text)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Secondary (background)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Accent (optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorAccent || '#000000'}
                onChange={(e) => setColorAccent(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={colorAccent}
                onChange={(e) => setColorAccent(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fonts */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Fonts</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Heading Font</label>
            <select
              value={fontHeading}
              onChange={(e) => setFontHeading(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Playfair Display">Playfair Display</option>
              <option value="Cormorant Garamond">Cormorant Garamond</option>
              <option value="Libre Baskerville">Libre Baskerville</option>
              <option value="EB Garamond">EB Garamond</option>
              <option value="Crimson Text">Crimson Text</option>
              <option value="DM Serif Display">DM Serif Display</option>
              <option value="Inter">Inter</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Body Font</label>
            <select
              value={fontBody}
              onChange={(e) => setFontBody(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Lora">Lora</option>
              <option value="Cormorant">Cormorant</option>
              <option value="Libre Baskerville">Libre Baskerville</option>
              <option value="Source Serif Pro">Source Serif Pro</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Inter">Inter</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Social Proof (shown on slides)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Review Count</label>
            <input
              type="text"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="80+ five-star reviews."
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Tagline</label>
            <input
              type="text"
              value={reviewTagline}
              onChange={(e) => setReviewTagline(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Clients for life."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {loading
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
              ? 'Create Brand'
              : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
