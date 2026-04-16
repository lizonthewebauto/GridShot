import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function TestimonialCard({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';
  const pad = Math.round(data.width * 0.055);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorPrimary,
        fontFamily: `${body}, sans-serif`,
        padding: `${pad}px`,
      }}
    >
      <div
        className="flex flex-col"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: `${Math.round(data.width * 0.03)}px`,
          overflow: 'hidden',
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.25), 0 20px 30px -20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Top: photo */}
        <div style={{ width: '100%', flex: '1 1 50%', minHeight: 0 }}>
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoUrl} alt="Client" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#e6e0d3' }}
            >
              <span style={{ color: data.colorPrimary, opacity: 0.5, fontSize: `${Math.max(28, Math.round(data.width * 0.013))}px` }}>
                Upload a photo
              </span>
            </div>
          )}
        </div>

        {/* Bottom: quote */}
        <div
          className="flex flex-col"
          style={{
            flex: '1 1 50%',
            minHeight: 0,
            padding: `${Math.round(data.width * 0.046)}px ${Math.round(data.width * 0.055)}px`,
            color: '#1a1a1a',
          }}
        >
          <div
            style={{
              fontFamily: `${heading}, serif`,
              fontSize: `${Math.round(data.width * 0.13)}px`,
              lineHeight: 0.8,
              color: '#1a1a1a',
              opacity: 0.18,
              marginBottom: `${-Math.round(data.width * 0.018)}px`,
            }}
          >
            &ldquo;
          </div>

          <div
            style={{
              fontFamily: `${heading}, serif`,
              fontSize: `${Math.round(data.width * 0.032)}px`,
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: '-0.005em',
            }}
          >
            {data.bodyText || 'A kind word from someone I worked with.'}
          </div>

          {/* Headline as attribution */}
          <div
            style={{
              marginTop: `${Math.round(data.width * 0.022)}px`,
              fontFamily: `${body}, sans-serif`,
              fontSize: `${Math.max(28, Math.round(data.width * 0.017))}px`,
              fontWeight: 600,
              opacity: 0.75,
            }}
          >
            — {data.headline || 'Happy Client'}
          </div>

          <div style={{ flex: 1 }} />

          {/* Stars + review count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${Math.round(data.width * 0.013)}px`,
              marginTop: `${Math.round(data.width * 0.018)}px`,
            }}
          >
            <div style={{ color: '#e8b547', fontSize: `${Math.round(data.width * 0.02)}px`, letterSpacing: '0.1em' }}>
              ★★★★★
            </div>
            <div
              style={{
                fontFamily: `${body}, sans-serif`,
                fontSize: `${Math.max(28, Math.round(data.width * 0.015))}px`,
                color: '#1a1a1a',
                opacity: 0.7,
              }}
            >
              {data.reviewCount
                ? `${data.reviewCount}${data.reviewTagline ? ' ' + data.reviewTagline : ' reviews'}`
                : data.reviewTagline || '5-star rated'}
            </div>
          </div>

        </div>
      </div>
      <BrandMark data={data} color={data.colorSecondary ?? '#f5efe8'} inset={brandInset} />
    </div>
  );
}
