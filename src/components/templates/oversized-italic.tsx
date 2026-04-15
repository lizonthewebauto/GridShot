import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorSecondary → cream background
// - colorPrimary → main text color
// - colorAccent → emphasized first word color
// - tagline → small uppercase eyebrow
// - dateText + locationText → small-caps footer row
export function OversizedItalic({ data }: { data: TemplateData }) {
  const bg = data.colorSecondary ?? '#f3ecdd';
  const textColor = data.colorPrimary ?? '#1a1a1a';
  const accent = data.colorAccent ?? '#b5472e';

  const headline = data.headline || 'Wander slowly';
  const [firstWord, ...rest] = headline.split(/\s+/);
  const restText = rest.join(' ');

  const photoH = Math.round(data.height * 0.45);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        color: textColor,
      }}
    >
      {data.tagline && (
        <div
          className="absolute uppercase"
          style={{
            top: `${Math.round(data.height * 0.07)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            fontSize: `${Math.round(data.width * 0.012)}px`,
            letterSpacing: '0.4em',
            opacity: 0.75,
          }}
        >
          {data.tagline}
        </div>
      )}

      <h1
        className="absolute"
        style={{
          top: `${Math.round(data.height * 0.14)}px`,
          left: `${Math.round(data.width * 0.06)}px`,
          right: `${Math.round(data.width * 0.06)}px`,
          fontFamily: `${data.fontHeading}, serif`,
          fontStyle: 'italic',
          fontSize: `${Math.round(data.width * 0.12)}px`,
          lineHeight: 0.95,
          fontWeight: 500,
        }}
      >
        <span style={{ color: accent }}>{firstWord}</span>
        {restText && <span> {restText}</span>}
      </h1>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: `${photoH}px`, overflow: 'hidden' }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#ccc' }} />
        )}
      </div>

      {(data.dateText || data.locationText) && (
        <div
          className="absolute uppercase flex justify-between"
          style={{
            bottom: `${photoH + Math.round(data.height * 0.025)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            fontSize: `${Math.round(data.width * 0.011)}px`,
            letterSpacing: '0.3em',
            opacity: 0.7,
          }}
        >
          <span>{data.locationText ?? ''}</span>
          <span>{data.dateText ?? ''}</span>
        </div>
      )}

      <BrandMark data={data} color="#fff" opacity={0.9} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
