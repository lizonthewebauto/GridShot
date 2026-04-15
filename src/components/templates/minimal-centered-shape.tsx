import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photoUrl → small centered photo
// - imageShape → square | circle | arch | hexagon | rounded (honors shape)
// - headline → italic serif caption below
// - brandName → small uppercase bottom-left eyebrow
// - bodyText → optional small paragraph below caption
// - colorPrimary → canvas background
// - colorSecondary → text color
export function MinimalCenteredShape({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#f5efe8';
  const textColor = data.colorSecondary ?? '#1a1a1a';
  const shape = data.imageShape ?? 'square';

  const minDim = Math.min(data.width, data.height);
  const photoSize = Math.round(minDim * 0.4);

  const shapeStyle = getShapeStyle(shape, photoSize);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${Math.round(data.width * 0.08)}px`,
      }}
    >
      <BrandMark data={data} color={textColor} inset={Math.round(data.width * 0.03)} />

      <div
        style={{
          width: `${photoSize}px`,
          height: `${photoSize}px`,
          backgroundColor: `${textColor}15`,
          overflow: 'hidden',
          marginBottom: `${Math.round(data.height * 0.05)}px`,
          ...shapeStyle,
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${textColor}22, ${bg})`,
            }}
          />
        )}
      </div>

      <h1
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: `${Math.round(data.width * 0.055)}px`,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          maxWidth: '85%',
          margin: 0,
        }}
      >
        {data.headline || 'Your headline here'}
      </h1>

      {data.bodyText && (
        <p
          style={{
            marginTop: `${Math.round(data.height * 0.025)}px`,
            fontSize: `${Math.round(data.width * 0.018)}px`,
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: '60%',
            opacity: 0.75,
          }}
        >
          {data.bodyText}
        </p>
      )}
    </div>
  );
}

function getShapeStyle(
  shape: NonNullable<TemplateData['imageShape']>,
  size: number
): React.CSSProperties {
  switch (shape) {
    case 'circle':
    case 'oval':
      return { borderRadius: '50%' };
    case 'rounded':
      return { borderRadius: `${Math.round(size * 0.12)}px` };
    case 'arch':
      return {
        borderTopLeftRadius: `${Math.round(size * 0.5)}px`,
        borderTopRightRadius: `${Math.round(size * 0.5)}px`,
      };
    case 'hexagon':
      return {
        clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      };
    case 'polaroid':
      return {
        border: '12px solid #fff',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      };
    case 'square':
    default:
      return { borderRadius: 0 };
  }
}
