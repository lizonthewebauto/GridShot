'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface Sample {
  src: string;
  alt: string;
  label?: string;
  sublabel?: string;
}

interface SampleLightboxProps {
  samples: Sample[];
  // layout
  gridClassName?: string;
  showLabel?: boolean;
  showSublabel?: boolean;
  sizes?: string;
}

// Renders a grid of clickable sample tiles + a fullscreen modal when one is clicked.
// Pure data-in, renders everything itself — no render props (works in Server Component parents).
export function SampleLightbox({
  samples,
  gridClassName = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3',
  showLabel = true,
  showSublabel = false,
  sizes = '(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px',
}: SampleLightboxProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const close = useCallback(() => setActiveIdx(null), []);
  const prev = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i - 1 + samples.length) % samples.length));
  }, [samples.length]);
  const next = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i + 1) % samples.length));
  }, [samples.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIdx, close, prev, next]);

  const active = activeIdx !== null ? samples[activeIdx] : null;

  return (
    <>
      <div className={gridClassName}>
        {samples.map((s, idx) => (
          <button
            key={`${s.src}-${idx}`}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="group flex flex-col gap-2 text-left"
          >
            <div
              className="relative w-full overflow-hidden rounded-sm border border-border/50 bg-card transition-all group-hover:border-accent-warm/60 group-hover:scale-[1.02]"
              style={{ aspectRatio: '1080 / 1440' }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes={sizes}
                quality={95}
                className="object-cover"
              />
            </div>
            {showLabel && s.label && (
              <span className="text-[11px] uppercase tracking-widest text-muted text-center group-hover:text-accent-warm transition-colors">
                {s.label}
              </span>
            )}
            {showSublabel && s.sublabel && (
              <span className="text-[10px] uppercase tracking-widest text-muted text-center">
                {s.sublabel}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >×</button>

          {samples.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors z-10"
              aria-label="Previous"
            >‹</button>
          )}

          <div className="relative flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.src}
              alt={active.alt}
              width={1080}
              height={1440}
              quality={100}
              priority
              className="h-auto w-auto object-contain rounded-sm"
              style={{ maxHeight: '82vh', maxWidth: '90vw' }}
            />
            {active.label && (
              <div className="text-white/80 text-xs uppercase tracking-widest text-center">
                {active.label}
              </div>
            )}
          </div>

          {samples.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors z-10"
              aria-label="Next"
            >›</button>
          )}
        </div>
      )}
    </>
  );
}
