import type { TemplateData } from '@/types';

export function MagazineCoverTemplate({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: data.colorSecondary,
        fontFamily: `${body}, sans-serif`,
      }}
    >
      {/* Full bleed photo */}
      {data.photoUrl ? (
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
          <span style={{ color: data.colorPrimary, opacity: 0.5 }}>Upload a photo</span>
        </div>
      )}

      {/* Masthead */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-12 pt-10"
        style={{
          fontFamily: `${heading}, serif`,
          color: data.colorSecondary,
          mixBlendMode: 'difference',
        }}
      >
        <div
          style={{
            fontSize: '84px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {data.brandName || 'BRAND'}
        </div>
        <div
          style={{
            fontFamily: `${body}, sans-serif`,
            fontSize: '14px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textAlign: 'right',
            opacity: 0.9,
          }}
        >
          Issue No. 01
          <br />
          Vol. I
        </div>
      </div>

      {/* Overlapping large title */}
      <div
        className="absolute left-12 right-12"
        style={{
          top: '180px',
          fontFamily: `${heading}, serif`,
          fontSize: '140px',
          fontWeight: 900,
          lineHeight: 0.9,
          color: data.colorPrimary,
          textShadow: '0 4px 30px rgba(0,0,0,0.25)',
          letterSpacing: '-0.04em',
        }}
      >
        {data.headline || 'Your Headline'}
      </div>

      {/* Cover line */}
      <div
        className="absolute bottom-10 left-12"
        style={{
          maxWidth: '480px',
          color: '#fff',
          fontFamily: `${body}, sans-serif`,
          fontSize: '20px',
          lineHeight: 1.4,
          padding: '16px 20px',
          backgroundColor: data.colorPrimary,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            opacity: 0.7,
          }}
        >
          Feature Story
        </div>
        {data.bodyText || 'Your body text will appear here like a cover line.'}
      </div>
    </div>
  );
}
