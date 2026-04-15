import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photoUrl → full bleed background
// - brandName → bottom-left eyebrow
// - headline → large italic serif, centered
// - bodyText → optional small line under headline
// - colorSecondary → text color (typically light)
// - colorPrimary → fallback background when no photo
export function EditorialFullbleed({ data }: { data: TemplateData }) {
  const textColor = data.colorSecondary ?? '#f5efe8';
  const bgColor = data.colorPrimary ?? '#1a1a1a';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bgColor,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${bgColor}, ${textColor}22)`,
          }}
        />
      )}

      {/* Subtle darkening vignette for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      <BrandMark data={data} color={textColor} opacity={0.85} zIndex={2} inset={Math.round(data.width * 0.03)} />

      <div
        className="absolute left-0 right-0 flex flex-col items-center text-center px-10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          color: textColor,
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontStyle: 'italic',
            fontSize: `${Math.round(data.width * 0.11)}px`,
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            maxWidth: '90%',
            textShadow: '0 2px 20px rgba(0,0,0,0.35)',
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>
        {data.bodyText && (
          <p
            style={{
              marginTop: `${Math.round(data.height * 0.04)}px`,
              fontFamily: `${data.fontBody}, sans-serif`,
              fontSize: `${Math.round(data.width * 0.018)}px`,
              lineHeight: 1.5,
              maxWidth: '70%',
              opacity: 0.9,
              letterSpacing: '0.02em',
            }}
          >
            {data.bodyText}
          </p>
        )}
      </div>
    </div>
  );
}
