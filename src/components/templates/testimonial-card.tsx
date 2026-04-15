import type { TemplateData } from '@/types';

export function TestimonialCardTemplate({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: data.colorSecondary,
        fontFamily: `${body}, sans-serif`,
        padding: '60px',
      }}
    >
      <div
        className="flex flex-col"
        style={{
          width: '960px',
          height: '1230px',
          backgroundColor: '#fff',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.25), 0 20px 30px -20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Top: photo */}
        <div style={{ width: '100%', height: '560px', flexShrink: 0 }}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="Client" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#e6e0d3' }}
            >
              <span style={{ color: data.colorPrimary, opacity: 0.5, fontSize: '14px' }}>
                Upload a photo
              </span>
            </div>
          )}
        </div>

        {/* Bottom: quote */}
        <div
          className="flex flex-col flex-1"
          style={{ padding: '50px 60px', color: data.colorPrimary }}
        >
          <div
            style={{
              fontFamily: `${heading}, serif`,
              fontSize: '140px',
              lineHeight: 0.8,
              color: data.colorPrimary,
              opacity: 0.18,
              marginBottom: '-20px',
            }}
          >
            &ldquo;
          </div>

          <div
            style={{
              fontFamily: `${heading}, serif`,
              fontSize: '34px',
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
              marginTop: '24px',
              fontFamily: `${body}, sans-serif`,
              fontSize: '18px',
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
              gap: '14px',
              marginTop: '20px',
            }}
          >
            <div style={{ color: '#e8b547', fontSize: '22px', letterSpacing: '0.1em' }}>
              ★★★★★
            </div>
            <div
              style={{
                fontFamily: `${body}, sans-serif`,
                fontSize: '16px',
                color: data.colorPrimary,
                opacity: 0.7,
              }}
            >
              {data.reviewCount
                ? `${data.reviewCount}${data.reviewTagline ? ' ' + data.reviewTagline : ' reviews'}`
                : data.reviewTagline || '5-star rated'}
            </div>
          </div>

          {/* Brand name */}
          <div
            style={{
              marginTop: '26px',
              paddingTop: '22px',
              borderTop: `1px solid ${data.colorPrimary}22`,
              fontFamily: `${heading}, serif`,
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            {data.brandName || 'Brand'}
          </div>
        </div>
      </div>
    </div>
  );
}
