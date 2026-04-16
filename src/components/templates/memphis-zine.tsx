import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields: colorAccent + colorPrimary (pastel blocks), colorSecondary (headline color),
// tagline (small caps banner), photos[0] (offset photo)
export function MemphisZine({ data }: { data: TemplateData }) {
  const bg = '#fff6e5';
  const pink = data.colorAccent ?? '#ff7ab6';
  const teal = data.colorPrimary ?? '#48c7c4';
  const yellow = '#ffd23f';
  const ink = '#1a1a1a';
  // Headline is always dark ink on the cream bg — brand color comes through
  // the pastel shapes, not the type, so variable secondary colors don't vanish.
  const headlineColor = ink;

  const pad = Math.round(data.width * 0.05);
  const photoW = Math.round(data.width * 0.42);
  const photoH = Math.round(photoW * 1.2);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        color: ink,
      }}
    >
      {/* Big yellow circle top-right */}
      <div
        className="absolute rounded-full"
        style={{
          right: `-${Math.round(data.width * 0.08)}px`,
          top: `-${Math.round(data.width * 0.08)}px`,
          width: `${Math.round(data.width * 0.35)}px`,
          height: `${Math.round(data.width * 0.35)}px`,
          backgroundColor: yellow,
        }}
      />
      {/* Teal triangle bottom-left */}
      <div
        className="absolute"
        style={{
          left: `-${Math.round(data.width * 0.05)}px`,
          bottom: `-${Math.round(data.width * 0.05)}px`,
          width: 0,
          height: 0,
          borderLeft: `${Math.round(data.width * 0.25)}px solid transparent`,
          borderRight: `${Math.round(data.width * 0.25)}px solid transparent`,
          borderBottom: `${Math.round(data.width * 0.3)}px solid ${teal}`,
          transform: 'rotate(15deg)',
        }}
      />
      {/* Pink square */}
      <div
        className="absolute"
        style={{
          right: `${Math.round(data.width * 0.08)}px`,
          bottom: `${Math.round(data.width * 0.12)}px`,
          width: `${Math.round(data.width * 0.12)}px`,
          height: `${Math.round(data.width * 0.12)}px`,
          backgroundColor: pink,
          transform: 'rotate(18deg)',
        }}
      />
      {/* Squiggly line */}
      <svg
        className="absolute"
        style={{ left: `${pad}px`, top: `${Math.round(data.height * 0.4)}px`, opacity: 0.85 }}
        width={Math.round(data.width * 0.22)}
        height={Math.round(data.width * 0.05)}
        viewBox="0 0 200 40"
      >
        <path
          d="M 0 20 Q 25 0, 50 20 T 100 20 T 150 20 T 200 20"
          stroke={pink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {/* Black dots pattern */}
      <div
        className="absolute"
        style={{
          right: `${pad}px`,
          top: `${Math.round(data.height * 0.42)}px`,
          width: `${Math.round(data.width * 0.15)}px`,
          height: `${Math.round(data.width * 0.08)}px`,
          backgroundImage: `radial-gradient(${ink} 2px, transparent 2px)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* Photo with colored outline offset */}
      <div
        className="absolute"
        style={{
          left: `${pad}px`,
          top: `${Math.round(data.height * 0.22)}px`,
          width: `${photoW}px`,
          height: `${photoH}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            inset: 0,
            transform: 'translate(14px, 14px)',
            backgroundColor: teal,
          }}
        />
        <div
          className="absolute"
          style={{
            inset: 0,
            border: `4px solid ${ink}`,
            backgroundColor: bg,
            overflow: 'hidden',
          }}
        >
          {(data.photos?.[0] ?? data.photoUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(data.photos?.[0] ?? data.photoUrl) as string}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: yellow }} />
          )}
        </div>
      </div>

      {/* Tagline banner */}
      {data.tagline && (
        <div
          className="absolute uppercase"
          style={{
            top: `${pad}px`,
            left: `${pad}px`,
            backgroundColor: ink,
            color: yellow,
            padding: '6px 14px',
            fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
            letterSpacing: '0.25em',
            fontWeight: 800,
            transform: 'rotate(-3deg)',
          }}
        >
          {data.tagline}
        </div>
      )}

      {/* Headline */}
      <h1
        className="absolute uppercase"
        style={{
          right: `${pad}px`,
          top: `${Math.round(data.height * 0.2)}px`,
          width: `${Math.round(data.width * 0.48)}px`,
          fontFamily: `${data.fontHeading}, sans-serif`,
          fontSize: `${Math.round(data.width * 0.09)}px`,
          lineHeight: 0.95,
          fontWeight: 900,
          color: headlineColor,
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {data.headline || 'LOUD & CLEAR'}
      </h1>

      <BrandMark data={data} color={ink} opacity={1} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
