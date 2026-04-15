import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields:
// - colorGradientFrom / colorGradientTo → duotone colors (fallback colorPrimary/colorAccent)
// - gradientAngle → direction of gradient wash
// - tagline → small uppercase above headline
export function DuotoneWash({ data }: { data: TemplateData }) {
  const fromColor = data.colorGradientFrom ?? data.colorPrimary ?? '#1a1f3a';
  const toColor = data.colorGradientTo ?? data.colorAccent ?? data.colorPrimary ?? '#d94f4f';
  const angle = data.gradientAngle ?? 135;
  const textColor = data.colorSecondary ?? '#ffffff';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: fromColor,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.1)' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: fromColor }} />
      )}

      {/* Duotone gradient wash using multiply */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${fromColor} 0%, ${toColor} 100%)`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Lighten layer to lift midtones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${fromColor} 0%, ${toColor} 100%)`,
          mixBlendMode: 'screen',
          opacity: 0.25,
        }}
      />

      <div className="absolute bottom-8 left-8 right-8" style={{ color: textColor, zIndex: 2 }}>
        {data.tagline && (
          <div
            className="uppercase mb-3"
            style={{
              fontFamily: `${data.fontBody}, sans-serif`,
              fontSize: `${Math.round(data.width * 0.011)}px`,
              letterSpacing: '0.3em',
              opacity: 0.9,
            }}
          >
            {data.tagline}
          </div>
        )}
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontSize: `${Math.round(data.width * 0.072)}px`,
            lineHeight: 1.05,
            fontWeight: 700,
            fontStyle: 'italic',
            maxWidth: '90%',
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>
        {data.bodyText && (
          <p
            style={{
              fontSize: `${Math.round(data.width * 0.017)}px`,
              lineHeight: 1.5,
              opacity: 0.9,
              maxWidth: '75%',
              marginTop: '14px',
            }}
          >
            {data.bodyText}
          </p>
        )}
      </div>

      <BrandMark data={data} color={textColor} opacity={0.85} />
    </div>
  );
}
