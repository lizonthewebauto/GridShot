import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function SplitPortfolio({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';

  return (
    <div
      className="relative flex"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        fontFamily: `${body}, sans-serif`,
        backgroundColor: data.colorSecondary,
      }}
    >
      {/* Left: photo */}
      <div style={{ width: '540px', height: '1350px', flexShrink: 0 }}>
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Portfolio" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#bbb2a4' }}
          >
            <span style={{ color: '#fff', opacity: 0.6, fontSize: '14px' }}>Upload a photo</span>
          </div>
        )}
      </div>

      {/* Right: text */}
      <div
        className="flex flex-col justify-center"
        style={{
          width: '540px',
          height: '1350px',
          backgroundColor: data.colorPrimary,
          color: data.colorSecondary,
          padding: '80px 60px',
        }}
      >
        <div
          style={{
            fontFamily: `${body}, sans-serif`,
            fontSize: '13px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            opacity: 0.7,
            marginBottom: '24px',
          }}
        >
          Portfolio
        </div>

        <div
          style={{
            fontFamily: `${heading}, serif`,
            fontSize: '72px',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {data.headline || 'Framed With Care'}
        </div>

        <div
          style={{
            marginTop: '32px',
            fontFamily: `${body}, sans-serif`,
            fontSize: '20px',
            lineHeight: 1.6,
            opacity: 0.88,
          }}
        >
          {data.bodyText || 'A considered look at recent work.'}
        </div>

      </div>
      <BrandMark data={data} color={data.colorSecondary} />
    </div>
  );
}
