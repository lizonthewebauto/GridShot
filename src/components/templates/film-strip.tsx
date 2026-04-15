import type { TemplateData } from '@/types';

export function FilmStripTemplate({ data }: { data: TemplateData }) {
  const body = data.fontBody || 'JetBrains Mono';

  const sprockets = Array.from({ length: 14 });

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: '#0a0a0a',
        fontFamily: 'monospace',
        padding: '90px 60px 60px 60px',
      }}
    >
      {/* Top label */}
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: data.colorSecondary || '#e6c36b',
          marginBottom: '30px',
        }}
      >
        {data.brandName || 'KODAK PORTRA 400'} &nbsp;•&nbsp; 35MM
      </div>

      {/* Filmstrip */}
      <div
        style={{
          width: '960px',
          backgroundColor: '#111',
          padding: '40px 0',
          position: 'relative',
        }}
      >
        {/* Top sprockets */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '24px',
            right: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {sprockets.map((_, i) => (
            <div
              key={`t-${i}`}
              style={{ width: '36px', height: '18px', backgroundColor: '#0a0a0a' }}
            />
          ))}
        </div>

        {/* Photo window */}
        <div style={{ width: '820px', height: '620px', margin: '0 auto', overflow: 'hidden' }}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="Film frame" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#1e1e1e' }}
            >
              <span style={{ color: '#666', fontSize: '14px' }}>Upload a photo</span>
            </div>
          )}
        </div>

        {/* Bottom sprockets */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '24px',
            right: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {sprockets.map((_, i) => (
            <div
              key={`b-${i}`}
              style={{ width: '36px', height: '18px', backgroundColor: '#0a0a0a' }}
            />
          ))}
        </div>
      </div>

      {/* Frame number */}
      <div
        style={{
          color: data.colorSecondary || '#e6c36b',
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '0.3em',
          marginTop: '18px',
          opacity: 0.8,
        }}
      >
        FRAME 24A &nbsp;▸&nbsp; ISO 400
      </div>

      {/* Headline */}
      <div
        style={{
          marginTop: '42px',
          fontFamily: `${body}, monospace`,
          fontSize: '44px',
          fontWeight: 700,
          color: '#f4f1ea',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          lineHeight: 1.15,
        }}
      >
        {data.headline || 'Shot on film'}
      </div>

      {/* Body */}
      <div
        style={{
          marginTop: '20px',
          fontFamily: `${body}, monospace`,
          fontSize: '16px',
          color: '#bbb',
          textAlign: 'center',
          maxWidth: '720px',
          lineHeight: 1.6,
          opacity: 0.85,
        }}
      >
        {data.bodyText || 'Grain, warmth, and the sound of a shutter.'}
      </div>
    </div>
  );
}
