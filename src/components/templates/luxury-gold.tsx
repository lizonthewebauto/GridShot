import type { TemplateData } from '@/types';
import { TextNode } from './_text-node';

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
        {/* Top: brand wordmark + est line */}
        <div style={{ textAlign: 'center', width: '100%', marginTop: `${Math.round(data.width * 0.02)}px` }}>
          <TextNode
            nodeKey="brandName"
            defaultElement={{
              fontFamily: data.fontHeading,
              fontStyle: 'italic',
              fontSize: Math.round(data.width * 0.04),
              fontWeight: 400,
              color: gold,
              alignment: 'center',
              lineHeight: 1,
            }}
            overrides={data.elementOverrides}
            defaultText={data.brandName || 'Brand Name'}
          />
          {data.dateText && (
            <TextNode
              nodeKey="date"
              className="uppercase"
              defaultElement={{
                fontSize: Math.max(28, Math.round(data.width * 0.011)),
                color: gold,
                alignment: 'center',
                letterSpacing: 0.5,
              }}
              overrides={data.elementOverrides}
              defaultText={data.dateText}
              style={{
                marginTop: `${Math.round(data.width * 0.015)}px`,
                opacity: 0.85,
              }}
            />
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
          <TextNode
            nodeKey="headline"
            as="h1"
            defaultElement={{
              fontFamily: data.fontHeading,
              fontStyle: 'italic',
              fontSize: Math.round(data.width * 0.048),
              fontWeight: 400,
              color: gold,
              alignment: 'center',
              lineHeight: 1.1,
            }}
            overrides={data.elementOverrides}
            defaultText={data.headline || 'a timeless celebration'}
            style={{ maxWidth: '85%', margin: '0 auto' }}
          />
          {data.tagline && (
            <TextNode
              nodeKey="tagline"
              className="uppercase"
              defaultElement={{
                fontSize: Math.max(28, Math.round(data.width * 0.016)),
                color: gold,
                alignment: 'center',
                letterSpacing: 0.35,
              }}
              overrides={data.elementOverrides}
              defaultText={data.tagline}
              style={{
                marginTop: `${Math.round(data.width * 0.015)}px`,
                opacity: 0.9,
              }}
            />
          )}
        </div>
      </div>

    </div>
  );
}
