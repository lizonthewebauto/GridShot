import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photos → array of 4 photo urls (falls back to photoUrl x4)
// - headline → bottom section serif title
// - tagline → uppercase byline under headline
// - brandName → optional bottom-left eyebrow on outer canvas
// - colorPrimary → bottom section bg
// - colorSecondary → text color
export function Grid2x2({ data }: { data: TemplateData }) {
  const raw = data.photos && data.photos.length > 0 ? data.photos : [data.photoUrl, data.photoUrl, data.photoUrl, data.photoUrl];
  const slots: (string | null)[] = [0, 1, 2, 3].map((i) => raw[i] ?? data.photoUrl ?? null);

  const bottomHeight = Math.round(data.height * 0.25);
  const gridHeight = data.height - bottomHeight;
  const bg = data.colorPrimary ?? '#f5efe8';
  const textColor = data.colorSecondary ?? '#1a1a1a';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '4px',
          width: '100%',
          height: `${gridHeight}px`,
        }}
      >
        {slots.map((src, i) => (
          <div key={i} style={{ backgroundColor: '#ccc', overflow: 'hidden' }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${textColor}22, ${bg})`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          height: `${bottomHeight}px`,
          padding: `${Math.round(data.width * 0.035)}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: textColor,
        }}
      >
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontWeight: 600,
            fontSize: `${Math.round(data.width * 0.055)}px`,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '92%',
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>
        {data.tagline && (
          <div
            className="uppercase"
            style={{
              marginTop: `${Math.round(data.height * 0.015)}px`,
              fontSize: `${Math.round(data.width * 0.015)}px`,
              letterSpacing: '0.35em',
              opacity: 0.75,
            }}
          >
            {data.tagline}
          </div>
        )}
      </div>

      <BrandMark data={data} color={textColor} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
