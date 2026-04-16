import type { TemplateData } from '@/types';

// Flex fields:
// - brandName → masthead (the newspaper name IS the brand)
// - customText → optional kicker above masthead (e.g. "Issue 01")
// - tagline → small uppercase subtitle under headline
// - dateText → date line in masthead area
// - bodyText → renders in 2-column layout below the photo
export function Newspaper({ data }: { data: TemplateData }) {
  const paper = data.colorSecondary ?? '#f4f0e4';
  const ink = data.colorPrimary ?? '#141311';

  const pad = Math.round(data.width * 0.04);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: paper,
        color: ink,
        fontFamily: `${data.fontBody}, serif`,
        padding: `${pad}px`,
      }}
    >
      {data.customText && (
        <div
          className="uppercase"
          style={{
            fontSize: `${Math.round(data.width * 0.012)}px`,
            letterSpacing: '0.35em',
            textAlign: 'center',
            opacity: 0.75,
            marginBottom: `${Math.round(data.width * 0.005)}px`,
          }}
        >
          {data.customText}
        </div>
      )}

      {/* Masthead = brand name */}
      <div
        style={{
          fontFamily: `${data.fontHeading}, 'Playfair Display', serif`,
          fontSize: `${Math.round(data.width * 0.068)}px`,
          fontWeight: 900,
          textAlign: 'center',
          letterSpacing: '0.04em',
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        {data.brandName || 'THE DAILY'}
      </div>

      {/* Rule lines with date */}
      <div
        className="flex items-center gap-3 uppercase"
        style={{
          fontSize: `${Math.round(data.width * 0.01)}px`,
          letterSpacing: '0.25em',
          marginTop: `${Math.round(data.width * 0.01)}px`,
          marginBottom: `${Math.round(data.width * 0.015)}px`,
        }}
      >
        <div style={{ flex: 1, height: '2px', backgroundColor: ink }} />
        <div>{data.dateText ?? 'Vol. I · Edition No. 1'}</div>
        <div style={{ flex: 1, height: '2px', backgroundColor: ink }} />
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: `${data.fontHeading}, 'Playfair Display', serif`,
          fontSize: `${Math.round(data.width * 0.062)}px`,
          lineHeight: 1.02,
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: `${Math.round(data.width * 0.01)}px`,
        }}
      >
        {data.headline || 'Today in history'}
      </h1>

      {data.tagline && (
        <div
          className="uppercase"
          style={{
            fontSize: `${Math.round(data.width * 0.011)}px`,
            letterSpacing: '0.28em',
            textAlign: 'center',
            opacity: 0.8,
            marginBottom: `${Math.round(data.width * 0.02)}px`,
          }}
        >
          {data.tagline}
        </div>
      )}

      {/* Photo */}
      <div
        style={{
          width: '100%',
          height: `${Math.round(data.height * 0.38)}px`,
          backgroundColor: '#d8d4c5',
          overflow: 'hidden',
          marginBottom: `${Math.round(data.width * 0.015)}px`,
          borderTop: `1px solid ${ink}`,
          borderBottom: `1px solid ${ink}`,
        }}
      >
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.05)' }}
          />
        )}
      </div>

      {data.locationText && (
        <div
          style={{
            fontSize: `${Math.round(data.width * 0.011)}px`,
            fontStyle: 'italic',
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: `${Math.round(data.width * 0.015)}px`,
          }}
        >
          {data.locationText}
        </div>
      )}

      {/* 2-column body */}
      {data.bodyText && (
        <div
          style={{
            columnCount: 2,
            columnGap: `${Math.round(data.width * 0.025)}px`,
            columnRule: `1px solid ${ink}`,
            fontSize: `${Math.round(data.width * 0.013)}px`,
            lineHeight: 1.5,
            textAlign: 'justify',
          }}
        >
          {data.bodyText}
        </div>
      )}

    </div>
  );
}
