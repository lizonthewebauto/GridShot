import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields: colorPrimary (dark bg), colorAccent (gold rays),
// dateText (small caps tagline), headline (stacked serif)
export function ArtDecoFan({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#1a1410';
  const gold = data.colorAccent ?? '#c9a84c';
  const ink = data.colorSecondary ?? '#f2e7c9';

  const pad = Math.round(data.width * 0.06);
  const photoW = Math.round(data.width * 0.5);
  const photoH = Math.round(photoW * 1.1);

  const rayGradient = `repeating-conic-gradient(
    from 180deg at 50% 100%,
    ${gold} 0deg,
    ${gold} 1.2deg,
    transparent 1.2deg,
    transparent 12deg
  )`;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, serif`,
        color: ink,
      }}
    >
      {/* Fan rays from top */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: '-10%',
          right: '-10%',
          height: '70%',
          background: rayGradient,
          transform: 'rotate(180deg)',
          opacity: 0.45,
        }}
      />
      {/* Subtle top arc overlay */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: `radial-gradient(ellipse at 50% 0%, ${hexWithAlpha(gold, 0.15)} 0%, transparent 70%)`,
        }}
      />

      {/* Photo */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -55%)',
          width: `${photoW}px`,
          height: `${photoH}px`,
          border: `2px solid ${gold}`,
          padding: '6px',
          backgroundColor: bg,
          boxShadow: `0 0 0 1px ${hexWithAlpha(gold, 0.4)}, 0 10px 40px rgba(0,0,0,0.5)`,
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: hexWithAlpha(gold, 0.12) }} />
        )}
      </div>

      {/* Stacked heading bottom */}
      <div
        className="absolute text-center"
        style={{
          left: `${pad}px`,
          right: `${pad}px`,
          bottom: `${pad}px`,
        }}
      >
        <h1
          style={{
            fontFamily: `${data.fontHeading}, 'Playfair Display', serif`,
            fontSize: `${Math.round(data.width * 0.075)}px`,
            lineHeight: 0.95,
            fontWeight: 700,
            margin: 0,
            color: gold,
            letterSpacing: '0.02em',
          }}
        >
          {data.headline || 'GATSBY'}
        </h1>
        {data.dateText && (
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.round(data.width * 0.013)}px`,
              letterSpacing: '0.5em',
              marginTop: `${Math.round(data.width * 0.015)}px`,
              color: ink,
              opacity: 0.85,
            }}
          >
            {data.dateText}
          </div>
        )}
      </div>

      <BrandMark data={data} color={gold} opacity={0.9} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const n = hex.replace('#', '');
  if (n.length !== 6) return hex;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
