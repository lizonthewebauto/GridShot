import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

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

      <div
        className="absolute"
        style={{
          bottom: `${Math.round(data.height * 0.04)}px`,
          left: `${Math.round(data.width * 0.04)}px`,
          right: `${Math.round(data.width * 0.04)}px`,
          color: textColor,
          zIndex: 2,
        }}
      >
        {data.tagline && (
          <TextNode
            nodeKey="tagline"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontHeading,
              fontSize: Math.max(28, Math.round(data.width * 0.011)),
              fontWeight: 400,
              alignment: 'left',
              letterSpacing: 0.3,
            }}
            overrides={data.elementOverrides}
            defaultText={data.tagline}
            style={{
              opacity: 0.8,
              marginBottom: `${Math.round(data.width * 0.012)}px`,
            }}
          />
        )}
        <TextNode
          nodeKey="headline"
          as="h1"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.065),
            fontWeight: 700,
            alignment: 'left',
            lineHeight: 1.05,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'Your headline here'}
          style={{ marginBottom: `${Math.round(data.width * 0.015)}px` }}
        />
        {data.bodyText && (
          <TextNode
            nodeKey="body"
            as="p"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.018)),
              fontWeight: 400,
              alignment: 'left',
              lineHeight: 1.4,
            }}
            overrides={data.elementOverrides}
            defaultText={data.bodyText}
            style={{
              opacity: 0.85,
              maxWidth: '85%',
            }}
          />
        )}
      </div>

      <BrandMark data={data} color={textColor} opacity={0.85} inset={Math.round(data.width * 0.03)} />
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
