import type { TemplateData } from '@/types';

export function MinimalFrameTemplate({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Inter';
  const body = data.fontBody || 'Inter';

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: data.colorSecondary,
        fontFamily: `${body}, sans-serif`,
        padding: '120px 80px',
      }}
    >
      {/* Brand name small top */}
      <div
        style={{
          fontFamily: `${body}, sans-serif`,
          fontSize: '13px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: data.colorPrimary,
          opacity: 0.6,
          marginBottom: '90px',
        }}
      >
        {data.brandName || 'Brand'}
      </div>

      {/* Framed photo */}
      <div
        style={{
          width: '600px',
          height: '600px',
          border: `1px solid ${data.colorPrimary}`,
          padding: '12px',
          flexShrink: 0,
        }}
      >
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#ece8df' }}
          >
            <span style={{ color: data.colorPrimary, fontSize: '14px', opacity: 0.4 }}>
              Upload a photo
            </span>
          </div>
        )}
      </div>

      {/* Headline */}
      <div
        style={{
          fontFamily: `${heading}, sans-serif`,
          fontSize: '48px',
          fontWeight: 300,
          color: data.colorPrimary,
          textAlign: 'center',
          marginTop: '80px',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          maxWidth: '800px',
        }}
      >
        {data.headline || 'A quieter headline'}
      </div>

      {/* Body */}
      <div
        style={{
          fontFamily: `${body}, sans-serif`,
          fontSize: '18px',
          fontWeight: 400,
          color: data.colorPrimary,
          opacity: 0.65,
          textAlign: 'center',
          marginTop: '28px',
          lineHeight: 1.6,
          maxWidth: '620px',
        }}
      >
        {data.bodyText || 'Less is more. Let the image breathe.'}
      </div>
    </div>
  );
}
