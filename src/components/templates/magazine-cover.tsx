import type { TemplateData } from '@/types';

// Flex fields this template reads:
// - brandName → masthead (top)
// - headline → oversized cover title
// - tagline → small label above cover line (e.g. "Feature Story")
// - customText → issue/volume info (top-right)
// - customText2 → right-side vertical strip text (optional)
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

      {/* Issue kicker — small centered line ABOVE the masthead so the two
          never share the same horizontal band. */}
      {data.customText && (
        <div
          className="absolute"
          style={{
            top: `${Math.round(data.height * 0.025)}px`,
            left: 0,
            right: 0,
            fontFamily: `${body}, sans-serif`,
            fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            opacity: 0.85,
            zIndex: 2,
          }}
        >
          {data.customText}
        </div>
      )}

      {/* Masthead — centered, capped width so the issue line at top-right stays clear */}
      {data.brandName && (
        <div
          className="absolute uppercase"
          style={{
            top: `${Math.round(data.height * 0.07)}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: `${Math.round(data.width * 0.7)}px`,
            fontFamily: `${data.fontHeading}, 'Playfair Display', serif`,
            fontSize: `${Math.round(data.width * 0.11)}px`,
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#ffffff',
            textShadow: '0 2px 14px rgba(0,0,0,0.6)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 2,
          }}
        >
          {data.brandName}
        </div>
      )}

      {/* Oversized title */}
      {data.headline && (
        <div
          className="absolute"
          style={{
            left: `${Math.round(data.width * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            top: `${Math.round(data.height * 0.28)}px`,
            fontFamily: `${heading}, serif`,
            fontSize: `${Math.round(data.width * 0.14)}px`,
            fontWeight: 900,
            lineHeight: 0.92,
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)',
            letterSpacing: '-0.03em',
            zIndex: 2,
          }}
        >
          {data.headline}
        </div>
      )}

      {/* Optional small chip (e.g. issue #, price, season) — only when data supplies it */}
      {data.customText3 && (
        <div
          className="absolute uppercase"
          style={{
            left: `${Math.round(data.width * 0.06)}px`,
            top: `${Math.round(data.height * 0.2)}px`,
            fontFamily: `${body}, sans-serif`,
            fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
            letterSpacing: '0.3em',
            color: '#ffffff',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            opacity: 0.9,
            zIndex: 2,
          }}
        >
          {data.customText3}
        </div>
      )}

      {/* (vertical side strip removed — it collided with the oversized headline) */}

      {/* Cover line block */}
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
            <div
              style={{
                fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                opacity: 0.75,
              }}
            >
              {data.tagline}
            </div>
          )}
          {data.bodyText}
        </div>
      )}
    </div>
  );
}
