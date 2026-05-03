import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields:
// - customText → override giant word (otherwise first word of headline)
// - imageShape → circle/rounded/square for the small photo
// - tagline → small line below headline
export function TypographicHero({ data }: { data: TemplateData }) {
  const bgColor = data.colorSecondary ?? '#f5efe8';
  const textColor = data.colorPrimary ?? '#1a1f3a';
  const accent = data.colorAccent ?? textColor;

  // Grab the most striking word from the headline (falls back to customText
  // only if no headline is provided).
  const rawWord = (data.headline ?? data.customText ?? 'Hello').trim();
  const giantWord = rawWord.split(/\s+/)[0]?.replace(/[.,;:!?]+$/, '') ?? 'Hello';

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

      <TextNode
        nodeKey="giantWord"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontStyle: 'italic',
          fontSize: Math.round(data.width * 0.28),
          fontWeight: 700,
          color: textColor,
          alignment: 'center',
          lineHeight: 0.9,
          letterSpacing: -0.03,
        }}
        overrides={data.elementOverrides}
        defaultText={giantWord}
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          right: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      />

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
            <TextNode
              nodeKey="tagline"
              className="uppercase"
              defaultElement={{
                fontFamily: data.fontBody,
                fontSize: Math.max(28, Math.round(data.width * 0.011)),
                color: textColor,
                alignment: 'left',
                letterSpacing: 0.3,
              }}
              overrides={data.elementOverrides}
              defaultText={data.tagline}
              style={{ opacity: 0.75, marginBottom: '6px' }}
            />
          )}
          <TextNode
            nodeKey="subhead"
            defaultElement={{
              fontFamily: data.fontHeading,
              fontSize: Math.max(28, Math.round(data.width * 0.024)),
              fontWeight: 500,
              color: textColor,
              alignment: 'left',
              lineHeight: 1.25,
            }}
            overrides={data.elementOverrides}
            defaultText={data.headline || 'Your sub-headline here'}
            style={{ maxWidth: '85%' }}
          />
          {data.bodyText && (
            <TextNode
              nodeKey="body"
              as="p"
              defaultElement={{
                fontFamily: data.fontBody,
                fontSize: Math.max(28, Math.round(data.width * 0.014)),
                color: textColor,
                alignment: 'left',
                lineHeight: 1.4,
              }}
              overrides={data.elementOverrides}
              defaultText={data.bodyText}
              style={{ opacity: 0.75, marginTop: '6px', maxWidth: '85%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
