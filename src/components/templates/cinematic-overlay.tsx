import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - colorGradientFrom / colorGradientTo → gradient color stops (fallbacks: colorPrimary)
// - gradientAngle → overlay direction (default 180 = fades up from bottom)
// - colorPrimary / colorSecondary preserved for existing behavior
export function CinematicOverlay({ data }: { data: TemplateData }) {
  // Gradient always darkens the BOTTOM of the photo so the headline + body
  // (which live at the bottom) stay legible regardless of what's in the image.
  const fromColor = data.colorGradientFrom ?? data.colorPrimary ?? '#000000';
  const toColor = data.colorGradientTo ?? data.colorPrimary ?? '#000000';
  const angle = data.gradientAngle ?? 0; // 0deg = to top, so fromColor sits at bottom
  const pad = Math.round(data.width * 0.045);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorPrimary ?? '#000',
      }}
    >
      {/* Full-bleed photo */}
      {data.photoUrl && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Gradient overlay — configurable via colorGradientFrom/To + gradientAngle */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${fromColor} 0%, ${hexWithAlpha(toColor, 0.8)} 30%, transparent 70%)`,
        }}
      />

      {/* Top review count (if provided) */}
      {data.reviewCount && (
        <TextNode
          nodeKey="reviewCount"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.014)),
            color: data.colorSecondary,
            alignment: 'right',
          }}
          overrides={data.elementOverrides}
          defaultText={data.reviewCount}
          style={{
            position: 'absolute',
            top: `${pad}px`,
            right: `${pad}px`,
            zIndex: 10,
            opacity: 0.6,
          }}
        />
      )}

      {/* Bottom content */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: `${Math.round(data.width * 0.055)}px` }}
      >
        <TextNode
          nodeKey="headline"
          as="h2"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.068),
            fontWeight: 700,
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1.1,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline}
          style={{
            marginBottom: `${Math.round(data.width * 0.018)}px`,
            maxWidth: `${Math.round(data.width * 0.82)}px`,
            textShadow: '0 2px 14px rgba(0,0,0,0.55)',
          }}
        />

        <TextNode
          nodeKey="body"
          as="p"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.022)),
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1.5,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText}
          style={{
            maxWidth: `${Math.round(data.width * 0.7)}px`,
            opacity: 0.95,
            textShadow: '0 1px 10px rgba(0,0,0,0.55)',
          }}
        />
      </div>

      <BrandMark data={data} color={data.colorSecondary} opacity={0.85} inset={brandInset} />
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
