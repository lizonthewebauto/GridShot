import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#c8c2b4' }}
        >
          <span style={{ color: accent, opacity: 0.4 }}>Upload a photo</span>
        </div>
      )}

      {/* Issue line top-right */}
      {data.customText && (
        <div
          className="absolute"
          style={{
            top: `${Math.round(data.height * 0.05)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            fontFamily: `${body}, sans-serif`,
            fontSize: `${Math.round(data.width * 0.018)}px`,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textAlign: 'right',
            color: secondary,
            mixBlendMode: 'difference',
            opacity: 0.9,
            whiteSpace: 'pre-line',
            lineHeight: 1.4,
            zIndex: 2,
          }}
        >
          {data.customText}
        </div>
      )}

      {/* Masthead — driven by BrandMark */}
      <BrandMark
        data={data}
        defaultPosition="top-center"
        fontSize={Math.round(data.width * 0.13)}
        letterSpacing="-0.03em"
        uppercase
        opacity={1}
        color={accent}
        inset={Math.round(data.height * 0.05)}
        zIndex={2}
        fontFamily={`${data.fontHeading}, 'Playfair Display', serif`}
        fontWeight={900}
        fontStyle="italic"
      />

      {/* Oversized title */}
      {data.headline && (
        <div
          className="absolute"
          style={{
            left: `${Math.round(data.width * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            top: `${Math.round(data.height * 0.28)}px`,
            fontFamily: `${heading}, serif`,
            fontSize: `${Math.round(data.width * 0.18)}px`,
            fontWeight: 900,
            lineHeight: 0.9,
            color: accent,
            textShadow: '0 4px 30px rgba(0,0,0,0.25)',
            letterSpacing: '-0.04em',
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
            fontSize: `${Math.round(data.width * 0.014)}px`,
            letterSpacing: '0.3em',
            color: secondary,
            mixBlendMode: 'difference',
            opacity: 0.9,
            zIndex: 2,
          }}
        >
          {data.customText3}
        </div>
      )}

      {/* Optional vertical side strip */}
      {data.customText2 && (
        <div
          className="absolute uppercase"
          style={{
            right: `${Math.round(data.width * 0.03)}px`,
            top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center',
            color: secondary,
            mixBlendMode: 'difference',
            fontFamily: `${body}, sans-serif`,
            fontSize: `${Math.round(data.width * 0.016)}px`,
            letterSpacing: '0.35em',
            zIndex: 2,
          }}
        >
          {data.customText2}
        </div>
      )}

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
            fontSize: `${Math.round(data.width * 0.022)}px`,
            lineHeight: 1.4,
            padding: `${Math.round(data.width * 0.02)}px ${Math.round(data.width * 0.025)}px`,
            backgroundColor: accent,
            zIndex: 2,
          }}
        >
          {data.tagline && (
            <div
              style={{
                fontSize: `${Math.round(data.width * 0.014)}px`,
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
