import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorPrimary → dark background
// - colorAccent → letterforms color
// - colorSecondary → text + tagline color
// - breaks headline into 3 stacked lines (first 3 words)
export function StackedLetterforms({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#0f0e0c';
  const accent = data.colorAccent ?? '#d4a24c';
  const textColor = data.colorSecondary ?? '#f1ebdf';

  const words = (data.headline || 'Make It Loud').split(/\s+/).slice(0, 3);
  while (words.length < 3) words.push('');

  const photoW = Math.round(data.width * 0.7);
  const photoH = Math.round(data.height * 0.52);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      <div
        className="absolute"
        style={{
          top: `${Math.round(data.height * 0.05)}px`,
          left: `${Math.round(data.width * 0.05)}px`,
          fontFamily: `${data.fontHeading}, serif`,
          fontSize: `${Math.round(data.width * 0.14)}px`,
          lineHeight: 0.92,
          color: accent,
          fontWeight: 700,
          fontStyle: 'italic',
          zIndex: 1,
        }}
      >
        {words.map((w, i) => (
          <div key={i} style={{ marginLeft: `${i * Math.round(data.width * 0.04)}px` }}>
            {w}
          </div>
        ))}
      </div>

      <div
        className="absolute"
        style={{
          right: 0,
          bottom: 0,
          width: `${photoW}px`,
          height: `${photoH}px`,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#222' }} />
        )}
      </div>

      {data.tagline && (
        <div
          className="absolute uppercase"
          style={{
            right: `${Math.round(data.width * 0.05)}px`,
            bottom: `${Math.round(data.height * 0.06)}px`,
            color: textColor,
            fontSize: `${Math.round(data.width * 0.012)}px`,
            letterSpacing: '0.35em',
            zIndex: 3,
            maxWidth: '35%',
            textAlign: 'right',
          }}
        >
          {data.tagline}
        </div>
      )}

      <BrandMark data={data} color={textColor} zIndex={3} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
