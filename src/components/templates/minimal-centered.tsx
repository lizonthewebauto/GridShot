import type { TemplateData, ImageShape } from '@/types';
import type { CSSProperties } from 'react';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - imageShape → 'square' | 'circle' | 'arch' | 'hexagon' | 'rounded' | 'polaroid' | 'oval'
//   (default: 'circle' — preserves prior behavior)
export function MinimalCentered({ data }: { data: TemplateData }) {
  // Default to 'circle' to preserve prior behavior (prev template always used rounded-full).
  const shape: ImageShape = data.imageShape ?? 'circle';

  const minDim = Math.min(data.width, data.height);
  const photoSize = Math.round(minDim * 0.37);
  const { wrapperStyle, innerStyle } = getShapeStyles(shape, photoSize);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorSecondary,
        padding: `${Math.round(data.width * 0.06)}px`,
      }}
    >
      {data.photoUrl && (
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            marginBottom: `${Math.round(data.height * 0.045)}px`,
            ...wrapperStyle,
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', ...innerStyle }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photoUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <h2
        className="font-light leading-tight"
        style={{
          fontFamily: data.fontHeading,
          color: data.colorPrimary,
          fontSize: `${Math.round(data.width * 0.05)}px`,
          marginBottom: `${Math.round(data.width * 0.022)}px`,
          maxWidth: `${Math.round(data.width * 0.78)}px`,
        }}
      >
        {data.headline}
      </h2>

      <div
        style={{
          width: `${Math.round(data.width * 0.045)}px`,
          height: `${Math.max(2, Math.round(data.width * 0.002))}px`,
          backgroundColor: data.colorPrimary,
          marginBottom: `${Math.round(data.width * 0.022)}px`,
        }}
      />

      <p
        className="leading-relaxed opacity-70"
        style={{
          fontFamily: data.fontBody,
          color: data.colorPrimary,
          fontSize: `${Math.round(data.width * 0.02)}px`,
          maxWidth: `${Math.round(data.width * 0.56)}px`,
        }}
      >
        {data.bodyText}
      </p>

      <BrandMark data={data} inset={brandInset} />
    </div>
  );
}

// Shape → wrapper (outer frame, e.g. polaroid card) + inner clip
function getShapeStyles(shape: ImageShape, size: number): {
  wrapperStyle: CSSProperties;
  innerStyle: CSSProperties;
} {
  switch (shape) {
    case 'square':
      return { wrapperStyle: {}, innerStyle: {} };
    case 'circle':
      return { wrapperStyle: {}, innerStyle: { borderRadius: '50%' } };
    case 'arch':
      return {
        wrapperStyle: {},
        innerStyle: { borderRadius: '50% 50% 0 0 / 35% 35% 0 0' },
      };
    case 'hexagon':
      return {
        wrapperStyle: {},
        innerStyle: {
          clipPath:
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        },
      };
    case 'rounded':
      return { wrapperStyle: {}, innerStyle: { borderRadius: `${Math.round(size * 0.05)}px` } };
    case 'oval':
      return { wrapperStyle: {}, innerStyle: { borderRadius: '50% / 40%' } };
    case 'polaroid':
      return {
        wrapperStyle: {
          backgroundColor: '#fdfcf7',
          padding: `${Math.round(size * 0.04)}px ${Math.round(size * 0.04)}px ${Math.round(size * 0.12)}px ${Math.round(size * 0.04)}px`,
          boxShadow:
            '0 24px 48px -16px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.15)',
        },
        innerStyle: {},
      };
    default:
      return { wrapperStyle: {}, innerStyle: {} };
  }
}
