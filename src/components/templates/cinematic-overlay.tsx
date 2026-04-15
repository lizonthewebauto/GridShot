import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorGradientFrom / colorGradientTo → gradient color stops (fallbacks: colorPrimary)
// - gradientAngle → overlay direction (default 180 = fades up from bottom)
// - colorPrimary / colorSecondary preserved for existing behavior
export function CinematicOverlay({ data }: { data: TemplateData }) {
  const fromColor = data.colorGradientFrom ?? data.colorPrimary ?? '#000000';
  const toColor = data.colorGradientTo ?? data.colorPrimary ?? '#000000';
  const angle = data.gradientAngle ?? 180;

  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
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
        <div className="absolute top-0 right-0 p-12 z-10">
          <span
            className="text-sm opacity-60"
            style={{
              fontFamily: data.fontBody,
              color: data.colorSecondary,
            }}
          >
            {data.reviewCount}
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-16 z-10">
        <h2
          className="text-6xl font-bold mb-4 leading-tight max-w-[800px]"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorSecondary,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="text-xl leading-relaxed opacity-80 max-w-[650px]"
          style={{
            fontFamily: data.fontBody,
            color: data.colorSecondary,
          }}
        >
          {data.bodyText}
        </p>
      </div>

      <BrandMark data={data} color={data.colorSecondary} opacity={0.85} />
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
