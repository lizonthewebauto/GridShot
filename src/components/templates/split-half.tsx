import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields:
// - imageAspect → ignored (photo is full-height left half)
// - colorPrimary → right block background
// - colorSecondary → text color on block
// - tagline → optional small line under headline
export function SplitHalf({ data }: { data: TemplateData }) {
  const blockColor = data.colorPrimary ?? '#1a1f3a';
  const textColor = data.colorSecondary ?? '#f5efe8';
  const accent = data.colorAccent ?? textColor;

  return (
    <div
      className="relative overflow-hidden flex"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {/* Left: photo */}
      <div className="relative" style={{ width: '50%', height: '100%', backgroundColor: blockColor }}>
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: blockColor, opacity: 0.6, color: textColor, fontSize: `${Math.round(data.width * 0.015)}px` }}
          >
            <span style={{ opacity: 0.4 }}>No photo</span>
          </div>
        )}
      </div>

      {/* Right: colored block with text */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: blockColor,
          color: textColor,
          padding: `${Math.round(data.width * 0.04)}px`,
        }}
      >
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontStyle: 'italic',
            fontSize: `${Math.round(data.width * 0.06)}px`,
            lineHeight: 1.08,
            fontWeight: 500,
            marginBottom: `${Math.round(data.width * 0.02)}px`,
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>

        {data.tagline && (
          <div
            className="uppercase"
            style={{
              fontFamily: `${data.fontBody}, sans-serif`,
              fontSize: `${Math.round(data.width * 0.011)}px`,
              letterSpacing: '0.28em',
              opacity: 0.75,
              marginBottom: `${Math.round(data.width * 0.025)}px`,
            }}
          >
            {data.tagline}
          </div>
        )}

        {data.bodyText && (
          <p
            style={{
              fontSize: `${Math.round(data.width * 0.017)}px`,
              lineHeight: 1.55,
              opacity: 0.88,
              maxWidth: '90%',
            }}
          >
            {data.bodyText}
          </p>
        )}

        {data.dateText && (
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.round(data.width * 0.011)}px`,
              letterSpacing: '0.25em',
              marginTop: `${Math.round(data.width * 0.03)}px`,
              color: accent,
              opacity: 0.8,
            }}
          >
            {data.dateText}
          </div>
        )}
      </div>

      <BrandMark data={data} color="#fff" opacity={0.85} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
