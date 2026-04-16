'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const CREATORS = [
  { slug: 'wedding', name: 'Sarah Lane (Wedding)' },
  { slug: 'portrait', name: 'Mira Studios (Portrait)' },
  { slug: 'realestate', name: 'Apex Visuals (Real Estate)' },
  { slug: 'food', name: 'Savory & Co (Food)' },
  { slug: 'event', name: 'Flash Collective (Event)' },
  { slug: 'travel', name: 'Atlas Journal (Travel)' },
  { slug: 'newborn', name: 'Juniper Studio (Newborn)' },
  { slug: 'fashion', name: 'Prima Atelier (Fashion)' },
  { slug: 'product', name: 'Form Studio (Product)' },
  { slug: 'family', name: 'Goldenhour Co (Family)' },
];

const TEMPLATES = [
  'editorial-elegant', 'bold-showcase', 'minimal-centered', 'split-story',
  'cinematic-overlay', 'photo-only', 'magazine-cover', 'minimal-frame',
  'polaroid-stack', 'fullbleed-overlay', 'split-portfolio', 'film-strip',
  'testimonial-card', 'cinematic-fade', 'editorial-fullbleed', 'polaroid-realistic',
  'triptych-strip', 'grid-2x2', 'minimal-centered-shape', 'circle-gold',
  'duotone-wash', 'split-half', 'typographic-hero', 'scrapbook-realistic',
  'newspaper', 'risograph', 'luxury-gold', 'quote-card', 'geometric-blocks',
  'collage-offset', 'stacked-letterforms', 'oversized-italic', 'sidebar-index',
  'baseball-card', 'wax-seal-invite', 'blueprint-grid', 'photobooth-strip',
  'art-deco-fan', 'boarding-pass', 'memphis-zine', 'apple-note',
];

const STORAGE_KEY = 'gridshot-sample-flags-v1';

export default function SamplesReviewPage() {
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [copyHint, setCopyHint] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFlags(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...flags]));
    } catch {}
  }, [flags]);

  const toggle = (key: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clear = () => setFlags(new Set());

  const copyList = async () => {
    const list = [...flags].sort().join('\n');
    try {
      await navigator.clipboard.writeText(list);
      setCopyHint('Copied to clipboard');
    } catch {
      setCopyHint('Copy failed — select the textarea instead');
    }
    setTimeout(() => setCopyHint(''), 2500);
  };

  const flaggedByCreator = useMemo(() => {
    const by: Record<string, number> = {};
    for (const f of flags) {
      const [creator] = f.split('/');
      by[creator] = (by[creator] ?? 0) + 1;
    }
    return by;
  }, [flags]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Sample readability review</h1>
            <p className="text-xs text-neutral-400">
              Click any sample to flag it as unreadable. {CREATORS.length * TEMPLATES.length} total.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              <span className="font-bold text-red-400">{flags.size}</span> flagged
            </span>
            <button
              onClick={copyList}
              disabled={flags.size === 0}
              className="rounded bg-red-500 hover:bg-red-600 disabled:bg-neutral-700 disabled:text-neutral-500 px-4 py-2 text-sm font-semibold transition-colors"
            >
              Copy flagged list
            </button>
            <button
              onClick={clear}
              disabled={flags.size === 0}
              className="rounded border border-neutral-700 hover:bg-neutral-800 disabled:opacity-40 px-4 py-2 text-sm font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
        {copyHint && (
          <div className="max-w-7xl mx-auto mt-2 text-xs text-green-400">{copyHint}</div>
        )}
      </div>

      {/* Grid grouped by creator */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-14">
        {CREATORS.map((creator) => (
          <section key={creator.slug} id={`creator-${creator.slug}`}>
            <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2 mb-4">
              <h2 className="text-xl font-bold">{creator.name}</h2>
              <span className="text-xs text-neutral-400">
                {flaggedByCreator[creator.slug] ?? 0} flagged · {TEMPLATES.length} templates
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {TEMPLATES.map((tpl) => {
                const key = `${creator.slug}/${tpl}`;
                const src = `/samples/sample-${creator.slug}-${tpl}.jpg`;
                const flagged = flags.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className={`group relative block text-left rounded overflow-hidden transition-all
                      ${flagged ? 'ring-4 ring-red-500 scale-[0.98]' : 'ring-1 ring-neutral-800 hover:ring-neutral-500'}`}
                  >
                    <div className="relative w-full" style={{ aspectRatio: '1080 / 1440' }}>
                      <Image
                        src={src}
                        alt={`${creator.slug} ${tpl}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover"
                      />
                      {flagged && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-start justify-end p-2">
                          <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm px-2 py-1">
                            Flagged
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-1.5 bg-neutral-950 text-[10px] uppercase tracking-widest text-neutral-400 truncate">
                      {tpl}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Fallback textarea for manual copy */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <details className="rounded border border-neutral-800 bg-neutral-950">
          <summary className="px-4 py-3 cursor-pointer text-sm text-neutral-300">
            Or copy the list manually
          </summary>
          <textarea
            readOnly
            value={[...flags].sort().join('\n')}
            className="w-full h-48 bg-black text-green-300 font-mono text-xs p-3 border-0 focus:outline-none"
            placeholder="No samples flagged yet"
          />
        </details>
      </div>
    </div>
  );
}
