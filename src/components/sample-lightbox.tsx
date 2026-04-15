'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface Sample {
  src: string;
  alt: string;
  label?: string;
}

interface SampleLightboxProps {
  samples: Sample[];
  children: (sample: Sample, onClick: () => void) => React.ReactNode;
}

// Clickable sample grid with a full-size popup modal.
// Pass `samples` and a `children` render-fn that draws each tile.
export function SampleLightbox({ samples, children }: SampleLightboxProps) {
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
      {samples.map((s, idx) => (
        <span key={`${s.src}-${idx}`}>
          {children(s, () => setActiveIdx(idx))}
        </span>
      ))}

      {active && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          {samples.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors z-10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ aspectRatio: '1080 / 1440', maxHeight: '82vh' }}>
              <Image
                src={active.src}
                alt={active.alt}
                width={1080}
                height={1440}
                quality={100}
                priority
                className="h-full w-auto object-contain rounded-sm"
                style={{ maxHeight: '82vh' }}
              />
            </div>
            {active.label && (
              <div className="text-white/80 text-xs uppercase tracking-widest text-center">
                {active.label}
              </div>
            )}
          </div>

          {/* Next */}
          {samples.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors z-10"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
