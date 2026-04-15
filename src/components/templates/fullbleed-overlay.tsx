import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - tagline → small uppercase label above the headline
// - colorAccent → accent underline beneath the headline (fallback: colorPrimary)
export function FullbleedOverlay({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Inter';
  const body = data.fontBody || 'Inter';
  const accent = data.colorAccent ?? data.colorPrimary ?? '#d4b87a';

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

      <BrandMark data={data} color="#fff" opacity={0.85} />

      {/* Bottom text stack */}
      <div
        className="absolute left-12 right-12"
        style={{ bottom: '72px', color: '#fff' }}
      >
        {data.tagline && (
          <div
            style={{
              fontFamily: `${body}, sans-serif`,
              fontSize: '14px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '18px',
              opacity: 0.85,
              color: accent,
            }}
          >
            {data.tagline}
          </div>
        )}
        <div
          style={{
            fontFamily: `${heading}, sans-serif`,
            fontSize: '96px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {data.headline || 'Your Bold Headline'}
        </div>
        {/* Accent underline mark */}
        <div
          style={{
            marginTop: '20px',
            height: '4px',
            width: '96px',
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            marginTop: '24px',
            fontFamily: `${body}, sans-serif`,
            fontSize: '22px',
            lineHeight: 1.5,
            opacity: 0.92,
            maxWidth: '820px',
          }}
        >
          {data.bodyText || 'Body text overlaid on the image.'}
        </div>
      </div>
    </div>
  );
}
