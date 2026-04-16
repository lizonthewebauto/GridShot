import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorAccent → huge quote mark color
// - colorSecondary → background (cream/peach)
// - colorPrimary → body text color
// - tagline → "WHO/WHEN" attribution line (no fallback to brand)
// - brandName → rendered once, bottom-left
export function QuoteCard({ data }: { data: TemplateData }) {
  const bg = data.colorSecondary ?? '#f5e9dc';
  const accent = data.colorAccent ?? '#c97a54';
  const textColor = data.colorPrimary ?? '#2a1f18';
  const attribution = data.tagline;
  const quote = data.bodyText || 'A short testimonial lives here — let it breathe.';

  return (
    <div
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        padding: `${Math.round(data.width * 0.08)}px`,
      }}
    >
      <div
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          fontSize: `${Math.round(data.width * 0.22)}px`,
          color: accent,
          lineHeight: 0.8,
          marginBottom: `${Math.round(data.width * 0.01)}px`,
          fontWeight: 700,
        }}
      >
        &ldquo;
      </div>

      <blockquote
        style={{
          fontFamily: `${data.fontHeading}, serif`,
          fontStyle: 'italic',
          fontSize: `${Math.round(data.width * 0.038)}px`,
          lineHeight: 1.35,
          color: textColor,
          maxWidth: '78%',
          marginBottom: `${Math.round(data.width * 0.045)}px`,
        }}
      >
        {quote}
      </blockquote>

      <div
        style={{
          width: `${Math.round(data.width * 0.11)}px`,
          height: `${Math.round(data.width * 0.11)}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: accent,
          marginBottom: `${Math.round(data.width * 0.022)}px`,
          border: `3px solid ${bg}`,
          boxShadow: `0 0 0 2px ${accent}`,
        }}
      >
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {attribution && (
        <div
          className="uppercase"
          style={{
            fontFamily: `${data.fontBody}, sans-serif`,
            fontSize: `${Math.max(28, Math.round(data.width * 0.013))}px`,
            letterSpacing: '0.3em',
            color: textColor,
            opacity: 0.75,
          }}
        >
          {attribution}
          {data.dateText ? ` / ${data.dateText}` : ''}
        </div>
      )}

      <BrandMark data={data} color={textColor} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
