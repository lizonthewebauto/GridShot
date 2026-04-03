import type { TemplateData } from '@/types';

export function EditorialElegantTemplate({ data }: { data: TemplateData }) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: data.colorSecondary,
        fontFamily: `${data.fontBody}, serif`,
      }}
    >
      {/* Studio Name */}
      <div
        className="text-center pt-12 pb-6"
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          color: data.colorPrimary,
          fontSize: '18px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontWeight: 400,
        }}
      >
        {data.brandName}
      </div>

      {/* Hero Photo */}
      <div className="relative mx-12" style={{ height: '600px' }}>
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt="Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#d4cfc4' }}
          >
            <span style={{ color: data.colorPrimary, fontSize: '16px', opacity: 0.6 }}>
              Upload a photo
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Headline */}
      <div
        className="mx-12 mt-10"
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          color: data.colorPrimary,
          fontSize: '64px',
          lineHeight: '1.1',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {data.headline || 'Your Headline Here'}
      </div>

      {/* Body Text */}
      <div
        className="mx-12 mt-6"
        style={{
          fontFamily: `${data.fontBody}, serif`,
          color: data.colorPrimary,
          fontSize: '24px',
          lineHeight: '1.6',
          fontStyle: 'italic',
          fontWeight: 400,
          opacity: 0.85,
        }}
      >
        {data.bodyText || 'Your body text will appear here. Describe your photography style and what makes your work special.'}
      </div>

      {/* Bottom Bar */}
      <div className="mt-auto mx-12 mb-10 flex items-end justify-between">
        <div
          style={{
            fontFamily: `${data.fontBody}, serif`,
            color: data.colorPrimary,
            fontSize: '18px',
            fontStyle: 'italic',
            opacity: 0.7,
          }}
        >
          {data.reviewCount && (
            <>
              {data.reviewCount}
              {data.reviewTagline && <> {data.reviewTagline}</>}
            </>
          )}
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            color: data.colorPrimary,
            fontSize: '16px',
            letterSpacing: '0.15em',
            opacity: 0.5,
          }}
        >
          Swipe &rarr;
        </div>
      </div>
    </div>
  );
}
