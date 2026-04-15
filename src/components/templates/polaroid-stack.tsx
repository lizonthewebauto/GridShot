import type { TemplateData } from '@/types';

export function PolaroidStack({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Caveat';
  const body = data.fontBody || 'Inter';

  // Subtle paper texture via layered gradients
  const bg = data.colorSecondary;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.04) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.035) 0 1px, transparent 2px)',
        backgroundSize: '6px 6px, 9px 9px',
        fontFamily: `${body}, sans-serif`,
      }}
    >
      {/* Brand name */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: `${body}, sans-serif`,
          fontSize: '14px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: data.colorPrimary,
          opacity: 0.6,
        }}
      >
        {data.brandName || 'Brand'}
      </div>

      {/* Polaroid */}
      <div
        style={{
          transform: 'rotate(-3deg)',
          backgroundColor: '#fff',
          padding: '28px 28px 90px 28px',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.15)',
          marginTop: '20px',
        }}
      >
        <div style={{ width: '640px', height: '640px', overflow: 'hidden' }}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="Polaroid" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#e5e1d8' }}
            >
              <span style={{ color: '#999', fontSize: '14px' }}>Upload a photo</span>
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '28px',
            fontFamily: `${heading}, cursive`,
            fontSize: '28px',
            color: '#2b2b2b',
          }}
        >
          {data.headline ? data.headline.slice(0, 32) : 'a moment'}
        </div>
      </div>

      {/* Handwritten headline below */}
      <div
        style={{
          marginTop: '70px',
          fontFamily: `${heading}, cursive`,
          fontSize: '72px',
          fontWeight: 500,
          color: data.colorPrimary,
          textAlign: 'center',
          lineHeight: 1.1,
          padding: '0 80px',
          maxWidth: '960px',
        }}
      >
        {data.headline || 'caught in the light'}
      </div>

      <div
        style={{
          marginTop: '18px',
          fontFamily: `${body}, sans-serif`,
          fontSize: '18px',
          color: data.colorPrimary,
          opacity: 0.7,
          textAlign: 'center',
          padding: '0 120px',
          maxWidth: '840px',
          lineHeight: 1.5,
        }}
      >
        {data.bodyText || 'Scribbles from the shoot.'}
      </div>
    </div>
  );
}
