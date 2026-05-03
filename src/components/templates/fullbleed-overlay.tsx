import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - tagline → small uppercase label above the headline
// - colorAccent → accent underline beneath the headline (fallback: colorPrimary)
export function FullbleedOverlay({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Inter';
  const body = data.fontBody || 'Inter';
  const accent = data.colorAccent ?? data.colorPrimary ?? '#d4b87a';
  const padX = Math.round(data.width * 0.045);
  const padBottom = Math.round(data.height * 0.06);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorPrimary,
        fontFamily: `${body}, sans-serif`,
      }}
    >
      {/* Full bleed photo */}
      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#2a2a2a' }}
        >
          <span style={{ color: '#fff', opacity: 0.4 }}>Upload a photo</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '60%',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      <BrandMark data={data} color="#fff" opacity={0.85} inset={brandInset} />

      {/* Bottom text stack */}
      <div
        className="absolute"
        style={{
          left: `${padX}px`,
          right: `${padX}px`,
          bottom: `${padBottom}px`,
          color: '#fff',
        }}
      >
        {data.tagline && (
          <TextNode
            nodeKey="tagline"
            className="uppercase"
            defaultElement={{
              fontFamily: body,
              fontSize: Math.max(28, Math.round(data.width * 0.013)),
              fontWeight: 400,
              color: accent,
              alignment: 'left',
              letterSpacing: 0.35,
            }}
            overrides={data.elementOverrides}
            defaultText={data.tagline}
            style={{
              marginBottom: `${Math.round(data.width * 0.017)}px`,
              opacity: 0.85,
            }}
          />
        )}
        <TextNode
          nodeKey="headline"
          className="uppercase"
          defaultElement={{
            fontFamily: heading,
            fontSize: Math.round(data.width * 0.089),
            fontWeight: 800,
            color: '#fff',
            alignment: 'left',
            lineHeight: 1,
            letterSpacing: -0.02,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'Your Bold Headline'}
        />
        {/* Accent underline mark */}
        <div
          style={{
            marginTop: `${Math.round(data.width * 0.018)}px`,
            height: `${Math.max(3, Math.round(data.width * 0.0037))}px`,
            width: `${Math.round(data.width * 0.089)}px`,
            backgroundColor: accent,
          }}
        />
        <TextNode
          nodeKey="body"
          defaultElement={{
            fontFamily: body,
            fontSize: Math.round(data.width * 0.02),
            fontWeight: 400,
            color: '#fff',
            alignment: 'left',
            lineHeight: 1.5,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText || 'Body text overlaid on the image.'}
          style={{
            marginTop: `${Math.round(data.width * 0.022)}px`,
            opacity: 0.92,
            maxWidth: `${Math.round(data.width * 0.76)}px`,
          }}
        />
      </div>
    </div>
  );
}
