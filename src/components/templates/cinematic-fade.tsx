import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorGradientFrom / colorGradientTo / gradientAngle → control the fade color
// - colorPrimary (fallback gradient end)
// - colorSecondary (text color)
// - imageAspect, imageShape → ignored (full-bleed photo)
// - tagline → optional extra line below headline
export function CinematicFade({ data }: { data: TemplateData }) {
  const fromColor = data.colorGradientFrom ?? data.colorPrimary ?? '#0a0a0f';
  const toColor = data.colorGradientTo ?? data.colorPrimary ?? '#0a0a0f';
  const angle = data.gradientAngle ?? 0; // 0 = top-to-bottom (bottom opaque)
  const textColor = data.colorSecondary ?? '#f5efe8';

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
        <img src={data.photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.82 }} />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: fromColor }} />
      )}

      {/* Gradient overlay — direction and color driven by data */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${180 - angle}deg, transparent 0%, ${hexWithAlpha(toColor, 0.3)} 45%, ${toColor} 100%)`,
        }}
      />

      <div className="absolute bottom-8 left-8 right-8" style={{ color: textColor, zIndex: 2 }}>
        {data.tagline && (
          <div
            className="uppercase mb-3"
            style={{
              fontFamily: `${data.fontHeading}, serif`,
              fontSize: '10px',
              letterSpacing: '0.3em',
              opacity: 0.8,
            }}
          >
            {data.tagline}
          </div>
        )}
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontSize: `${Math.round(data.width * 0.065)}px`,
            lineHeight: 1.05,
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          {data.headline || 'Your headline here'}
        </h1>
        {data.bodyText && (
          <p
            style={{
              fontSize: `${Math.round(data.width * 0.018)}px`,
              lineHeight: 1.4,
              opacity: 0.85,
              maxWidth: '85%',
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

// Small helper — translate hex color + alpha into rgba so gradient can be semi-transparent
function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
