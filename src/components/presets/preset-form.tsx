'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { VIBE_OPTIONS } from '@/types';
import type { Brand, Preset } from '@/types';

interface PresetFormProps {
  mode: 'create' | 'edit';
  preset?: Preset;
}

export function PresetForm({ mode, preset }: PresetFormProps) {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(preset?.name ?? '');
  const [brandId, setBrandId] = useState(preset?.brand_id ?? '');
  const [templateSlug, setTemplateSlug] = useState(preset?.template_slug ?? 'editorial-elegant');
  const [vibe, setVibe] = useState(preset?.vibe ?? 'Authentic');
  const [headline, setHeadline] = useState(preset?.headline ?? '');
  const [bodyText, setBodyText] = useState(preset?.body_text ?? '');

  useEffect(() => {
    fetch('/api/brands')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load brands');
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBrands(data);
          if (!brandId && data.length > 0) {
            const defaultBrand = data.find((b: Brand) => b.is_default) ?? data[0];
            setBrandId(defaultBrand.id);
          }
        }
      })
      .catch(() => setError('Failed to load brands. Please refresh.'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !brandId) return;

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      brand_id: brandId,
      template_slug: templateSlug,
      vibe,
      headline: headline.trim() || null,
      body_text: bodyText.trim() || null,
    };

    const url = mode === 'edit' ? `/api/presets/${preset!.id}` : '/api/presets';
    const method = mode === 'edit' ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
      setLoading(false);
      return;
    }

    router.push('/presets');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && (
        <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Preset Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Instagram Stories - Bold"
          required
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Brand</label>
        {brands.length === 0 ? (
          <p className="text-muted text-sm">Loading brands...</p>
        ) : (
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Template</label>
        <select
          value={templateSlug}
          onChange={(e) => setTemplateSlug(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {Object.values(TEMPLATE_REGISTRY).map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Vibe</label>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVibe(v)}
              className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                vibe === v
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background border-border text-foreground hover:bg-card-hover'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Default Headline <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. Your Brand, Elevated"
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Default Body Text <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder="e.g. Premium photography for modern brands"
          rows={3}
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !name.trim() || !brandId}
          className="px-6 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'edit' ? 'Update Preset' : 'Create Preset'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/presets')}
          className="px-6 py-2 bg-background border border-border text-foreground rounded hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
