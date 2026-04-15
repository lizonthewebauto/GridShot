import type { TemplateData, ImageShape } from '@/types';
import type { CSSProperties } from 'react';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - imageShape → 'square' | 'circle' | 'arch' | 'hexagon' | 'rounded' | 'polaroid' | 'oval'
//   (default: 'circle' — preserves prior behavior)
export function MinimalCentered({ data }: { data: TemplateData }) {
  // Default to 'circle' to preserve prior behavior (prev template always used rounded-full).
  const shape: ImageShape = data.imageShape ?? 'circle';

  const { wrapperStyle, innerStyle } = getShapeStyles(shape);

  return (
    <div
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: data.colorSecondary }}
    >
      {data.photoUrl && (
        <div
          className="mb-12"
          style={{
            width: '400px',
            height: '400px',
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
        className="text-5xl font-light mb-6 leading-tight max-w-[800px]"
        style={{
          fontFamily: data.fontHeading,
          color: data.colorPrimary,
        }}
      >
        {data.headline}
      </h2>

      <div
        className="w-12 h-[2px] mb-6"
        style={{ backgroundColor: data.colorPrimary }}
      />

      <p
        className="text-xl leading-relaxed opacity-70 max-w-[600px]"
        style={{
          fontFamily: data.fontBody,
          color: data.colorPrimary,
        }}
      >
        {data.bodyText}
      </p>

      <BrandMark data={data} />
    </div>
  );
}

// Shape → wrapper (outer frame, e.g. polaroid card) + inner clip
function getShapeStyles(shape: ImageShape): {
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
      return { wrapperStyle: {}, innerStyle: { borderRadius: '20px' } };
    case 'oval':
      return { wrapperStyle: {}, innerStyle: { borderRadius: '50% / 40%' } };
    case 'polaroid':
      return {
        wrapperStyle: {
          backgroundColor: '#fdfcf7',
          padding: '16px 16px 48px 16px',
          boxShadow:
            '0 24px 48px -16px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.15)',
        },
        innerStyle: {},
      };
    default:
      return { wrapperStyle: {}, innerStyle: {} };
  }
}
