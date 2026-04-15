import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields:
// - customText → override giant word (otherwise first word of headline)
// - imageShape → circle/rounded/square for the small photo
// - tagline → small line below headline
export function TypographicHero({ data }: { data: TemplateData }) {
  const bgColor = data.colorSecondary ?? '#f5efe8';
  const textColor = data.colorPrimary ?? '#1a1f3a';
  const accent = data.colorAccent ?? textColor;

  const rawWord = (data.customText ?? data.headline ?? 'Hello').trim();
  const giantWord = rawWord.split(/\s+/)[0] ?? 'Hello';

  const shape = data.imageShape ?? 'rounded';
  const photoRadius =
    shape === 'circle' ? '50%' : shape === 'square' ? '0px' : shape === 'rounded' ? '12px' : '8px';

  const photoSize = Math.round(data.width * 0.16);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: `${data.fontBody}, sans-serif`,
        padding: `${Math.round(data.width * 0.04)}px`,
      }}
    >
      <BrandMark data={data} color={accent} opacity={0.85} inset={Math.round(data.width * 0.03)} />

      {/* Giant canvas word */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: '18%',
          fontFamily: `${data.fontHeading}, serif`,
          fontSize: `${Math.round(data.width * 0.28)}px`,
          lineHeight: 0.9,
          fontWeight: 700,
          fontStyle: 'italic',
          color: textColor,
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {giantWord}
      </div>

      {/* Bottom row: small photo + sub-headline */}
      <div
        className="absolute left-0 right-0 flex items-center gap-6"
        style={{
          bottom: `${Math.round(data.width * 0.04)}px`,
          paddingLeft: `${Math.round(data.width * 0.04)}px`,
          paddingRight: `${Math.round(data.width * 0.04)}px`,
        }}
      >
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            borderRadius: photoRadius,
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: accent,
          }}
        >
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: accent, opacity: 0.25 }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          {data.tagline && (
            <div
              className="uppercase"
              style={{
                fontSize: `${Math.round(data.width * 0.011)}px`,
                letterSpacing: '0.3em',
                opacity: 0.75,
                marginBottom: '6px',
              }}
            >
              {data.tagline}
            </div>
          )}
          <div
            style={{
              fontFamily: `${data.fontHeading}, serif`,
              fontSize: `${Math.round(data.width * 0.024)}px`,
              lineHeight: 1.25,
              fontWeight: 500,
              maxWidth: '85%',
            }}
          >
            {data.headline || 'Your sub-headline here'}
          </div>
          {data.bodyText && (
            <p
              style={{
                fontSize: `${Math.round(data.width * 0.014)}px`,
                lineHeight: 1.4,
                opacity: 0.75,
                marginTop: '6px',
                maxWidth: '85%',
              }}
            >
              {data.bodyText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
