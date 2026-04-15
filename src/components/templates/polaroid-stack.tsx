import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - tagline → handwritten caption inside the polaroid frame (no fallback to brand)
// - colorSecondary → outer paper-textured background
// - colorPrimary → secondary headline/body text color
// - brandName → rendered once, bottom-left of outer canvas
export function PolaroidStack({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Caveat';
  const body = data.fontBody || 'Inter';

  // Outer paper background
  const bg = data.colorSecondary;

  // Caption inside the polaroid — tagline only (no brand fallback)
  const caption = (data.tagline ?? '').trim() || '—';

  const minDim = Math.min(data.width, data.height);
  const photoSize = Math.round(minDim * 0.6);
  const framePadX = Math.round(photoSize * 0.0375);
  const framePadBottom = Math.round(photoSize * 0.1);
  const frameMarginTop = Math.round(data.height * 0.04);
  const captionFont = Math.round(photoSize * 0.05);
  const captionMarginTop = Math.round(photoSize * 0.0375);
  const headlineMarginTop = Math.round(data.height * 0.06);
  const headlineFont = Math.round(data.width * 0.067);
  const headlinePadX = Math.round(data.width * 0.075);
  const bodyMarginTop = Math.round(data.height * 0.018);
  const bodyFont = Math.round(data.width * 0.017);
  const bodyPadX = Math.round(data.width * 0.11);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        // Paper texture — layered fine noise + warm vignette
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.045) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.04) 0 1px, transparent 2px), radial-gradient(circle at 55% 45%, rgba(0,0,0,0.03) 0 1.5px, transparent 3px), radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.08) 100%)',
        backgroundSize: '6px 6px, 9px 9px, 14px 14px, 100% 100%',
        fontFamily: `${body}, sans-serif`,
      }}
    >
      <BrandMark data={data} inset={brandInset} />

      {/* Realistic polaroid — thick white card, square photo, deep drop shadow, slight rotation */}
      <div
        style={{
          transform: 'rotate(-4deg)',
          backgroundColor: '#fdfcf7',
          padding: `${framePadX}px ${framePadX}px ${framePadBottom}px ${framePadX}px`,
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.6) inset, 0 40px 80px -24px rgba(0,0,0,0.45), 0 20px 40px -12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.12)',
          marginTop: `${frameMarginTop}px`,
        }}
      >
        {/* Forced 1:1 square photo with inner shadow */}
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.15)',
            backgroundColor: '#1a1a1a',
          }}
        >
          {data.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.photoUrl}
              alt="Polaroid"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                aspectRatio: '1 / 1',
                display: 'block',
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#e5e1d8' }}
            >
              <span style={{ color: '#999', fontSize: `${Math.round(data.width * 0.013)}px` }}>Upload a photo</span>
            </div>
          )}
          {/* Subtle inner shadow overlay so the photo looks inset */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              boxShadow: 'inset 0 0 24px rgba(0,0,0,0.25)',
            }}
          />
        </div>

        {/* Handwritten caption inside the polaroid */}
        <div
          style={{
            textAlign: 'center',
            marginTop: `${captionMarginTop}px`,
            fontFamily: `${heading}, Caveat, cursive`,
            fontSize: `${captionFont}px`,
            color: '#2b2b2b',
            lineHeight: 1,
          }}
        >
          {caption.slice(0, 40)}
        </div>
      </div>

      {/* Outer headline below */}
      <div
        style={{
          marginTop: `${headlineMarginTop}px`,
          fontFamily: `${heading}, cursive`,
          fontSize: `${headlineFont}px`,
          fontWeight: 500,
          color: data.colorPrimary,
          textAlign: 'center',
          lineHeight: 1.1,
          padding: `0 ${headlinePadX}px`,
          maxWidth: `${Math.round(data.width * 0.9)}px`,
        }}
      >
        {data.headline || 'caught in the light'}
      </div>

      <div
        style={{
          marginTop: `${bodyMarginTop}px`,
          fontFamily: `${body}, sans-serif`,
          fontSize: `${bodyFont}px`,
          color: data.colorPrimary,
          opacity: 0.7,
          textAlign: 'center',
          padding: `0 ${bodyPadX}px`,
          maxWidth: `${Math.round(data.width * 0.78)}px`,
          lineHeight: 1.5,
        }}
      >
        {data.bodyText || 'Scribbles from the shoot.'}
      </div>
    </div>
  );
}
