import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields: photos (up to 4, fallback photoUrl×4), dateText (MM/YY labels),
// imageAspect controls photo cell proportion
export function PhotoboothStrip({ data }: { data: TemplateData }) {
  const bg = '#0a0a0a';
  const ink = '#f2f2f2';
  const frameWhite = '#ffffff';

  const photos: (string | null)[] = (() => {
    const p = data.photos ?? [];
    const out: (string | null)[] = [];
    for (let i = 0; i < 4; i++) out.push(p[i] ?? data.photoUrl ?? null);
    return out;
  })();

  const pad = Math.round(data.width * 0.05);
  const stripW = Math.round(data.width * 0.32);
  const gap = Math.round(data.width * 0.012);
  const availH = data.height - pad * 2 - gap * 3;
  const cellH = Math.round(availH / 4);
  const labelFont = Math.round(data.width * 0.013);
  const aspect = data.imageAspect ?? '1/1';

  const dateLabel = data.dateText ?? '04 / 26';

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, 'Courier Prime', monospace`,
        color: ink,
      }}
    >
      {/* Left labels column — vertical to stay clear of the strip */}
      <div
        className="absolute uppercase flex flex-col items-start"
        style={{
          left: `${pad}px`,
          top: `${pad * 2.5}px`,
          bottom: `${pad}px`,
          fontSize: `${labelFont}px`,
          letterSpacing: '0.3em',
          opacity: 0.7,
        }}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {data.headline || 'STRIP // 01'}
        </span>
      </div>

      {/* Strip */}
      <div
        className="flex flex-col"
        style={{
          width: `${stripW}px`,
          gap: `${gap}px`,
          padding: `${gap}px`,
          backgroundColor: frameWhite,
        }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              height: `${cellH}px`,
              aspectRatio: aspect,
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05) saturate(0.9)',
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#222' }} />
            )}
          </div>
        ))}
      </div>

      {/* Right labels column — top date, bottom location; tagline runs
          vertically so long brand lines don't collide with the strip. */}
      <div
        className="absolute uppercase flex flex-col items-end"
        style={{
          right: `${pad}px`,
          top: `${pad}px`,
          bottom: `${pad}px`,
          fontSize: `${labelFont}px`,
          letterSpacing: '0.3em',
          opacity: 0.7,
        }}
      >
        <span>{dateLabel}</span>
        <span
          style={{
            writingMode: 'vertical-rl',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {data.tagline || 'NO. 04'}
        </span>
        <span>{data.locationText || ''}</span>
      </div>

      <BrandMark
        data={data}
        defaultPosition="top-left"
        color={ink}
        fontSize={labelFont}
        opacity={0.7}
        inset={pad}
      />
    </div>
  );
}
