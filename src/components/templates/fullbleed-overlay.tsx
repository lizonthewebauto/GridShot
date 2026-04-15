import type { TemplateData } from '@/types';

export function FullbleedOverlayTemplate({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Inter';
  const body = data.fontBody || 'Inter';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1080px',
        height: '1350px',
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

      {/* Brand name top-right */}
      <div
        className="absolute top-10 right-12"
        style={{
          color: '#fff',
          fontFamily: `${body}, sans-serif`,
          fontSize: '16px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '10px 18px',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        {data.brandName || 'Brand'}
      </div>

      {/* Bottom text stack */}
      <div
        className="absolute left-12 right-12"
        style={{ bottom: '72px', color: '#fff' }}
      >
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
