import type { TemplateData } from '@/types';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - brandName → masthead (top)
// - headline → oversized cover title
// - tagline → small label above cover line (e.g. "Feature Story")
// - customText → issue/volume info (top-right)
// - customText3 → small badge/price/issue chip (top-left under masthead, optional)
// - bodyText → main cover line
// - colorPrimary → cover line block background
// - colorSecondary → masthead + fallback bg
export function MagazineCover({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';
  const accent = data.colorPrimary ?? '#1a1a1a';
  const secondary = data.colorSecondary ?? '#f5efe8';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: secondary,
        fontFamily: `${body}, sans-serif`,
      }}
    >
      {data.photoUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Top + bottom vignettes so masthead + coverlines always read */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: '30%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#c8c2b4' }}
        >
          <span style={{ color: accent, opacity: 0.4 }}>Upload a photo</span>
        </div>
      )}

      {data.customText && (
        <TextNode
          nodeKey="issue"
          className="uppercase"
          defaultElement={{
            fontFamily: body,
            fontSize: Math.max(28, Math.round(data.width * 0.014)),
            color: '#ffffff',
            alignment: 'center',
            letterSpacing: 0.4,
          }}
          overrides={data.elementOverrides}
          defaultText={data.customText}
          style={{
            position: 'absolute',
            top: `${Math.round(data.height * 0.025)}px`,
            left: 0,
            right: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            opacity: 0.85,
            zIndex: 2,
          }}
        />
      )}

      {data.brandName && (
        <TextNode
          nodeKey="masthead"
          className="uppercase"
          defaultElement={{
            fontFamily: heading,
            fontSize: Math.round(data.width * 0.11),
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#ffffff',
            alignment: 'center',
            lineHeight: 0.95,
            letterSpacing: -0.03,
          }}
          overrides={data.elementOverrides}
          defaultText={data.brandName}
          style={{
            position: 'absolute',
            top: `${Math.round(data.height * 0.07)}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: `${Math.round(data.width * 0.7)}px`,
            textShadow: '0 2px 14px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 2,
          }}
        />
      )}

      {data.headline && (
        <TextNode
          nodeKey="coverline"
          defaultElement={{
            fontFamily: heading,
            fontSize: Math.round(data.width * 0.14),
            fontWeight: 900,
            color: '#ffffff',
            alignment: 'left',
            lineHeight: 0.92,
            letterSpacing: -0.03,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline}
          style={{
            position: 'absolute',
            left: `${Math.round(data.width * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            top: `${Math.round(data.height * 0.28)}px`,
            textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)',
            zIndex: 2,
          }}
        />
      )}

      {data.customText3 && (
        <TextNode
          nodeKey="chip"
          className="uppercase"
          defaultElement={{
            fontFamily: body,
            fontSize: Math.max(28, Math.round(data.width * 0.014)),
            color: '#ffffff',
            letterSpacing: 0.3,
          }}
          overrides={data.elementOverrides}
          defaultText={data.customText3}
          style={{
            position: 'absolute',
            left: `${Math.round(data.width * 0.06)}px`,
            top: `${Math.round(data.height * 0.2)}px`,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            opacity: 0.9,
            zIndex: 2,
          }}
        />
      )}

      {(data.bodyText || data.tagline) && (
        <div
          className="absolute"
          style={{
            bottom: `${Math.round(data.height * 0.05)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            maxWidth: `${Math.round(data.width * 0.55)}px`,
            color: secondary,
            fontFamily: `${body}, sans-serif`,
            fontSize: `${Math.max(28, Math.round(data.width * 0.022))}px`,
            lineHeight: 1.4,
            padding: `${Math.round(data.width * 0.02)}px ${Math.round(data.width * 0.025)}px`,
            backgroundColor: accent,
            zIndex: 2,
          }}
        >
          {data.tagline && (
            <TextNode
              nodeKey="tagline"
              className="uppercase"
              defaultElement={{
                fontFamily: body,
                fontSize: Math.max(28, Math.round(data.width * 0.014)),
                color: secondary,
                letterSpacing: 0.3,
              }}
              overrides={data.elementOverrides}
              defaultText={data.tagline}
              style={{
                marginBottom: '8px',
                opacity: 0.75,
              }}
            />
          )}
          {data.bodyText && (
            <TextNode
              nodeKey="subhead"
              defaultElement={{
                fontFamily: body,
                fontSize: Math.max(28, Math.round(data.width * 0.022)),
                color: secondary,
                lineHeight: 1.4,
              }}
              overrides={data.elementOverrides}
              defaultText={data.bodyText}
            />
          )}
        </div>
      )}
    </div>
  );
}
