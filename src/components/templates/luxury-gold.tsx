import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields:
// - colorPrimary → dark background
// - colorAccent → gold border + text color
// - dateText → est. date under brand name
// - tagline → uppercase under headline
// - imageAspect → controls photo aspect (default 4/5)
export function LuxuryGold({ data }: { data: TemplateData }) {
  const dark = data.colorPrimary ?? '#0a0a0f';
  const gold = data.colorAccent ?? '#d4af6b';
  const pad = Math.round(data.width * 0.035);
  const borderW = Math.max(1, Math.round(data.width * 0.002));

  const aspectMap: Record<string, string> = {
    '1/1': '1 / 1',
    '4/5': '4 / 5',
    '3/4': '3 / 4',
    '16/9': '16 / 9',
    '2/3': '2 / 3',
    '3/2': '3 / 2',
    '9/16': '9 / 16',
  };
  const photoAspect = data.imageAspect ? aspectMap[data.imageAspect] : '4 / 5';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: dark,
        color: gold,
        fontFamily: `${data.fontBody}, serif`,
        padding: `${pad}px`,
      }}
    >
      {/* Gold frame */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: `${pad}px`,
          left: `${pad}px`,
          right: `${pad}px`,
          bottom: `${pad}px`,
          border: `${borderW}px solid ${gold}`,
          padding: `${Math.round(data.width * 0.035)}px`,
        }}
      >
        {/* Top: est line (brand rendered separately via BrandMark) */}
        <div style={{ textAlign: 'center', width: '100%', marginTop: `${Math.round(data.width * 0.04)}px` }}>
          {data.dateText && (
            <div
              className="uppercase"
              style={{
                fontSize: `${Math.round(data.width * 0.0095)}px`,
                letterSpacing: '0.5em',
                marginTop: `${Math.round(data.width * 0.01)}px`,
                opacity: 0.85,
              }}
            >
              {data.dateText}
            </div>
          )}
          {/* Thin rule */}
          <div
            style={{
              width: `${Math.round(data.width * 0.08)}px`,
              height: '1px',
              backgroundColor: gold,
              margin: `${Math.round(data.width * 0.015)}px auto 0`,
              opacity: 0.6,
            }}
          />
        </div>

        {/* Middle: photo */}
        <div
          style={{
            marginTop: `${Math.round(data.width * 0.02)}px`,
            width: '70%',
            aspectRatio: photoAspect,
            maxHeight: '52%',
            backgroundColor: '#1a1a1f',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: '#1a1a1f' }} />
          )}
        </div>

        {/* Bottom: headline + tagline */}
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            marginTop: 'auto',
          }}
        >
          <h1
            style={{
              fontFamily: `'Cormorant Garamond', ${data.fontHeading}, serif`,
              fontStyle: 'italic',
              fontSize: `${Math.round(data.width * 0.048)}px`,
              lineHeight: 1.1,
              fontWeight: 400,
              maxWidth: '85%',
              margin: '0 auto',
            }}
          >
            {data.headline || 'a timeless celebration'}
          </h1>
          {data.tagline && (
            <div
              className="uppercase"
              style={{
                fontSize: `${Math.round(data.width * 0.01)}px`,
                letterSpacing: '0.5em',
                marginTop: `${Math.round(data.width * 0.015)}px`,
                opacity: 0.85,
              }}
            >
              {data.tagline}
            </div>
          )}
        </div>
      </div>

      <BrandMark
        data={data}
        defaultPosition="top-center"
        fontSize={Math.round(data.width * 0.035)}
        letterSpacing="0.02em"
        uppercase={false}
        opacity={1}
        color={gold}
        inset={Math.round(pad + data.width * 0.045)}
        fontFamily={`${data.fontHeading}, 'Cormorant Garamond', serif`}
        fontStyle="italic"
      />
    </div>
  );
}
