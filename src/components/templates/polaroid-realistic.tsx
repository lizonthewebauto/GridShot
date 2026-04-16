import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photoUrl → square-cropped inside thick white polaroid frame
// - headline → handwritten-style caption on bottom border
// - brandName → small eyebrow bottom-left of canvas
// - bodyText → optional secondary caption line
// - colorPrimary → canvas background (fallback warm cream)
export function PolaroidRealistic({ data }: { data: TemplateData }) {
  const canvasBg = data.colorPrimary ?? '#eae3d2';
  const frameColor = '#fdfbf5';

  // Polaroid sizing: frame is ~65% of min dimension, inner photo square
  const minDim = Math.min(data.width, data.height);
  const frameSize = Math.round(minDim * 0.7);
  const photoSize = Math.round(frameSize * 0.86);
  const sidePadding = Math.round((frameSize - photoSize) / 2);
  const bottomPadding = Math.round(frameSize * 0.22);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: canvasBg,
        fontFamily: `${data.fontBody}, sans-serif`,
        backgroundImage:
          'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.06), transparent 60%)',
      }}
    >
      <BrandMark data={data} color={data.colorSecondary ?? '#4a3f2e'} zIndex={3} inset={Math.round(data.width * 0.03)} />

      <div
        style={{
          width: `${frameSize}px`,
          height: `${frameSize + bottomPadding - sidePadding}px`,
          backgroundColor: frameColor,
          padding: `${sidePadding}px ${sidePadding}px ${bottomPadding}px`,
          boxShadow:
            '0 20px 50px rgba(0,0,0,0.28), 0 6px 15px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.04)',
          transform: 'rotate(-3deg)',
          position: 'relative',
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            backgroundColor: '#ddd',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1), inset 0 4px 8px rgba(0,0,0,0.12)',
          }}
        >
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photoUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${data.colorSecondary ?? '#c8c0ae'}, ${canvasBg})`,
              }}
            />
          )}
        </div>

        {/* Caption on bottom border — single handwritten line; bodyText
            is intentionally ignored since a polaroid caption isn't a paragraph. */}
        <div
          style={{
            position: 'absolute',
            left: `${sidePadding}px`,
            right: `${sidePadding}px`,
            bottom: `${Math.round(bottomPadding * 0.35)}px`,
            textAlign: 'center',
            fontFamily: `'Caveat', ${data.fontHeading}, cursive`,
            fontSize: `${Math.round(frameSize * 0.08)}px`,
            color: '#2d2418',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          {data.tagline || data.headline || 'a moment'}
        </div>
      </div>
    </div>
  );
}
