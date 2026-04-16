import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photos → array of 3 photo urls (falls back to photoUrl x3)
// - headline → italic serif, bottom section
// - brandName → uppercase bottom-left eyebrow
// - tagline → optional small eyebrow above headline
// - colorPrimary → bottom section background
// - colorSecondary → bottom section text color
export function TriptychStrip({ data }: { data: TemplateData }) {
  const raw = data.photos && data.photos.length > 0 ? data.photos : [data.photoUrl, data.photoUrl, data.photoUrl];
  const slots: (string | null)[] = [0, 1, 2].map((i) => raw[i] ?? data.photoUrl ?? null);

  const bottomHeight = Math.round(data.height * 0.4);
  const stripHeight = data.height - bottomHeight;
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
          display: 'flex',
          width: '100%',
          height: `${stripHeight}px`,
          gap: '4px',
        }}
      >
        {slots.map((src, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#ccc',
              overflow: 'hidden',
            }}
          >
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
          padding: `${Math.round(data.width * 0.05)}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: textColor,
        }}
      >
        {data.tagline && (
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
              letterSpacing: '0.35em',
              marginBottom: `${Math.round(data.height * 0.015)}px`,
              opacity: 0.7,
            }}
          >
            {data.tagline}
          </div>
        )}
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: `${Math.round(data.width * 0.075)}px`,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: '90%',
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>
      </div>

      <BrandMark data={data} color={textColor} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
