import type { CSSProperties } from 'react';
import type { TemplateData, BrandPosition } from '@/types';

// Shared brand mark — every template renders this ONCE, letting the user
// control where the brand name sits via data.brandPosition.
//
// Default position: bottom-left.
// Pass brandPosition: 'none' to hide entirely.
// Templates whose identity requires brand elsewhere (magazine masthead,
// newspaper nameplate, etc.) can pass a `defaultPosition` override when
// the user hasn't chosen one.

interface BrandMarkProps {
  data: TemplateData;
  defaultPosition?: BrandPosition;
  color?: string;
  inset?: number;
  fontSize?: number;
  letterSpacing?: string;
  opacity?: number;
  uppercase?: boolean;
  zIndex?: number;
  fontFamily?: string;                                // override font
  fontWeight?: CSSProperties['fontWeight'];           // 400 | 700 | 900
  fontStyle?: CSSProperties['fontStyle'];             // 'italic' etc
  writingMode?: CSSProperties['writingMode'];         // 'vertical-rl' for sidebar rails
  rotate?: number;                                    // extra rotation degrees
}

export function BrandMark({
  data,
  defaultPosition = 'bottom-left',
  color,
  inset = 32,
  fontSize = 14,
  letterSpacing = '0.3em',
  opacity = 0.8,
  uppercase = true,
  zIndex = 10,
  fontFamily,
  fontWeight,
  fontStyle,
  writingMode,
  rotate,
}: BrandMarkProps) {
  const pos: BrandPosition = data.brandPosition ?? defaultPosition;
  if (pos === 'none' || !data.brandName) return null;

  const { transform: posTransform, ...posStyle } = positionStyle(pos, inset);
  const combinedTransform = [posTransform, rotate ? `rotate(${rotate}deg)` : null]
    .filter(Boolean)
    .join(' ') || undefined;

  const style: CSSProperties = {
    position: 'absolute',
    fontFamily: fontFamily ?? `${data.fontHeading}, ${data.fontBody}, sans-serif`,
    fontSize: `${fontSize}px`,
    fontWeight,
    fontStyle,
    letterSpacing,
    textTransform: uppercase ? 'uppercase' : 'none',
    color: color ?? data.colorPrimary,
    opacity,
    zIndex,
    whiteSpace: 'nowrap',
    writingMode,
    ...posStyle,
    transform: combinedTransform,
  };

  return <div style={style}>{data.brandName}</div>;
}

function positionStyle(pos: BrandPosition, inset: number): CSSProperties {
  const i = `${inset}px`;
  switch (pos) {
    case 'top-left':      return { top: i, left: i };
    case 'top-center':    return { top: i, left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':     return { top: i, right: i };
    case 'middle-left':   return { top: '50%', left: i, transform: 'translateY(-50%)' };
    case 'middle-center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    case 'middle-right':  return { top: '50%', right: i, transform: 'translateY(-50%)' };
    case 'bottom-left':   return { bottom: i, left: i };
    case 'bottom-center': return { bottom: i, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':  return { bottom: i, right: i };
    default:              return { bottom: i, left: i };
  }
}
