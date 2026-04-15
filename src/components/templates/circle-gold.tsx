import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photoUrl → circular photo
// - colorAccent → gold border color (fallback #d4b87a)
// - colorPrimary → canvas background
// - colorSecondary → text color
// - headline → serif heading below photo
// - tagline → uppercase small line below heading
// - brandName → optional bottom-left eyebrow
// - bodyText → optional small paragraph under tagline
export function CircleGold({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#f4ede0';
  const textColor = data.colorSecondary ?? '#2a2218';
  const gold = data.colorAccent ?? '#d4b87a';

  const minDim = Math.min(data.width, data.height);
  const photoSize = Math.round(minDim * 0.45);
  const borderWidth = Math.round(photoSize * 0.045);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${Math.round(data.width * 0.07)}px`,
      }}
    >
      <BrandMark data={data} color={gold} opacity={0.9} />

      <div
        style={{
          width: `${photoSize}px`,
          height: `${photoSize}px`,
          borderRadius: '50%',
          border: `${borderWidth}px solid ${gold}`,
          backgroundColor: `${textColor}15`,
          overflow: 'hidden',
          marginBottom: `${Math.round(data.height * 0.05)}px`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.15), inset 0 0 0 2px ${bg}`,
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
              borderRadius: '50%',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${gold}33, ${bg})`,
            }}
          />
        )}
      </div>

      <h1
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          fontWeight: 600,
          fontSize: `${Math.round(data.width * 0.055)}px`,
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          textAlign: 'center',
          maxWidth: '85%',
          margin: 0,
        }}
      >
        {data.headline || 'Your headline here'}
      </h1>

      {data.tagline && (
        <div
          className="uppercase"
          style={{
            marginTop: `${Math.round(data.height * 0.025)}px`,
            fontSize: `${Math.round(data.width * 0.016)}px`,
            letterSpacing: '0.4em',
            color: gold,
            fontWeight: 500,
          }}
        >
          {data.tagline}
        </div>
      )}

      {data.bodyText && (
        <p
          style={{
            marginTop: `${Math.round(data.height * 0.025)}px`,
            fontSize: `${Math.round(data.width * 0.018)}px`,
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: '65%',
            opacity: 0.75,
          }}
        >
          {data.bodyText}
        </p>
      )}
    </div>
  );
}
