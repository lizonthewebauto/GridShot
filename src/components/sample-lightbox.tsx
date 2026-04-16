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
  // optional progressive disclosure — when set, only the first N tiles render
  // until the user clicks the toggle. Lightbox nav always cycles through all samples.
  initialCount?: number;
  expandLabel?: string;
  collapseLabel?: string;
}

export function SampleLightbox({
  samples,
  gridClassName = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3',
  showLabel = true,
  showSublabel = false,
  sizes = '(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px',
  initialCount,
  expandLabel,
  collapseLabel = 'Show less',
}: SampleLightboxProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const canCollapse = initialCount !== undefined && samples.length > initialCount;
  const visibleSamples = canCollapse && !expanded ? samples.slice(0, initialCount) : samples;
  const hiddenCount = canCollapse ? samples.length - (initialCount ?? 0) : 0;

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
        {visibleSamples.map((s, idx) => (
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
              <span className="text-[12px] font-medium uppercase tracking-widest text-foreground/75 text-center group-hover:text-accent-warm transition-colors">
                {s.label}
              </span>
            )}
            {showSublabel && s.sublabel && (
              <span className="text-[11px] uppercase tracking-widest text-foreground/60 text-center">
                {s.sublabel}
              </span>
            )}
          </button>
        ))}
      </div>

      {canCollapse && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-sm border border-accent-warm/40 bg-accent-warm/5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-accent-warm hover:bg-accent-warm hover:text-white transition-colors"
          >
            {expanded
              ? collapseLabel
              : (expandLabel ?? `See ${hiddenCount} more`)}
            <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
          </button>
        </div>
      )}

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
