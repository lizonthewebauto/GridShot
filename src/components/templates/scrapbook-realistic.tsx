import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields:
// - colorSecondary → aged paper tone
// - colorAccent → masking tape color
// - colorPrimary → handwritten text color
// - customText → override caption
// - tagline → small date-ish line
export function ScrapbookRealistic({ data }: { data: TemplateData }) {
  const paper = data.colorSecondary ?? '#f3ead6';
  const tape = data.colorAccent ?? '#e8d88c';
  const ink = data.colorPrimary ?? '#2d2a1f';
  const caption = data.customText ?? data.bodyText ?? '';

  const photoSize = Math.round(data.width * 0.5);
  const tiltDeg = -4;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: paper,
        color: ink,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {/* Paper texture via subtle layered gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(0,0,0,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(0,0,0,0.05) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)
          `,
          pointerEvents: 'none',
        }}
      />
      {/* Fiber noise */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.015) 0 1px, transparent 1px 4px)',
          pointerEvents: 'none',
        }}
      />

      <BrandMark data={data} color={ink} opacity={0.7} zIndex={5} inset={Math.round(data.width * 0.03)} />

      {/* Polaroid photo with tape */}
      <div
        className="absolute"
        style={{
          top: '18%',
          left: '50%',
          transform: `translateX(-50%) rotate(${tiltDeg}deg)`,
          width: `${photoSize}px`,
          padding: `${Math.round(photoSize * 0.04)}px`,
          paddingBottom: `${Math.round(photoSize * 0.18)}px`,
          backgroundColor: '#fdfbf4',
          boxShadow: '0 12px 28px rgba(0,0,0,0.25), 0 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Masking tape */}
        <div
          style={{
            position: 'absolute',
            top: `-${Math.round(photoSize * 0.04)}px`,
            left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            width: `${Math.round(photoSize * 0.32)}px`,
            height: `${Math.round(photoSize * 0.08)}px`,
            backgroundColor: tape,
            opacity: 0.75,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 6px)',
          }}
        />
        <div
          style={{
            width: '100%',
            height: `${Math.round(photoSize * 0.82)}px`,
            backgroundColor: '#d8d4c5',
            overflow: 'hidden',
          }}
        >
          {data.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      <TextNode
        nodeKey="headline"
        defaultElement={{
          fontFamily: 'Caveat',
          fontSize: Math.round(data.width * 0.055),
          fontWeight: 400,
          color: ink,
          alignment: 'left',
          lineHeight: 1,
        }}
        overrides={data.elementOverrides}
        defaultText={data.headline || 'little moments'}
        style={{
          position: 'absolute',
          top: `${Math.round(data.height * 0.08)}px`,
          left: `${Math.round(data.width * 0.06)}px`,
          transform: 'rotate(-3deg)',
          maxWidth: '45%',
        }}
      />

      {caption && (
        <TextNode
          nodeKey="caption"
          defaultElement={{
            fontFamily: 'Caveat',
            fontSize: Math.round(data.width * 0.028),
            fontWeight: 400,
            color: ink,
            alignment: 'right',
            lineHeight: 1.2,
          }}
          overrides={data.elementOverrides}
          defaultText={caption}
          style={{
            position: 'absolute',
            bottom: `${Math.round(data.height * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            transform: 'rotate(2deg)',
            maxWidth: '40%',
          }}
        />
      )}

      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          defaultElement={{
            fontFamily: 'Caveat',
            fontSize: Math.max(28, Math.round(data.width * 0.022)),
            fontWeight: 400,
            color: ink,
            alignment: 'left',
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            position: 'absolute',
            bottom: `${Math.round(data.height * 0.04)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            transform: 'rotate(-1deg)',
            opacity: 0.7,
          }}
        />
      )}
    </div>
  );
}
