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

  return (
    <div
      className="relative flex flex-col items-center justify-center"
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
      <BrandMark data={data} />

      {/* Realistic polaroid — thick white card, square photo, deep drop shadow, slight rotation */}
      <div
        style={{
          transform: 'rotate(-4deg)',
          backgroundColor: '#fdfcf7',
          padding: '24px 24px 64px 24px',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.6) inset, 0 40px 80px -24px rgba(0,0,0,0.45), 0 20px 40px -12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.12)',
          marginTop: '40px',
        }}
      >
        {/* Forced 1:1 square photo with inner shadow */}
        <div
          style={{
            width: '640px',
            height: '640px',
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
              <span style={{ color: '#999', fontSize: '14px' }}>Upload a photo</span>
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
            marginTop: '24px',
            fontFamily: `${heading}, Caveat, cursive`,
            fontSize: '32px',
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
          marginTop: '70px',
          fontFamily: `${heading}, cursive`,
          fontSize: '72px',
          fontWeight: 500,
          color: data.colorPrimary,
          textAlign: 'center',
          lineHeight: 1.1,
          padding: '0 80px',
          maxWidth: '960px',
        }}
      >
        {data.headline || 'caught in the light'}
      </div>

      <div
        style={{
          marginTop: '18px',
          fontFamily: `${body}, sans-serif`,
          fontSize: '18px',
          color: data.colorPrimary,
          opacity: 0.7,
          textAlign: 'center',
          padding: '0 120px',
          maxWidth: '840px',
          lineHeight: 1.5,
        }}
      >
        {data.bodyText || 'Scribbles from the shoot.'}
      </div>
    </div>
  );
}
