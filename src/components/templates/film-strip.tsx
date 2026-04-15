import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photos → up to 3 frame URLs. Falls back to photoUrl repeated.
// - imageAspect → aspect ratio for each frame (default '1/1')
export function FilmStrip({ data }: { data: TemplateData }) {
  const body = data.fontBody || 'JetBrains Mono';

  const sprockets = Array.from({ length: 14 });

  // Build frames array — up to 3 slots. Null entries use photoUrl fallback.
  const providedPhotos = data.photos ?? [];
  const frames: (string | null)[] = [0, 1, 2].map((i) => {
    const p = providedPhotos[i];
    if (p !== undefined) return p;
    return data.photoUrl;
  });
  const hasMultiple = providedPhotos.length > 1;
  const aspect = data.imageAspect ?? '1/1';

  const padTop = Math.round(data.height * 0.08);
  const padX = Math.round(data.width * 0.056);
  const padBottom = Math.round(data.height * 0.056);
  const stripW = Math.round(data.width * 0.89);
  const stripPadY = Math.round(data.width * 0.037);
  const sprocketInset = Math.round(data.width * 0.022);
  const sprocketW = Math.round(data.width * 0.033);
  const sprocketH = Math.round(sprocketW * 0.5);
  const sprocketTop = Math.round(data.width * 0.011);
  const photoWindowW = Math.round(data.width * 0.76);
  const photoWindowH = Math.round(photoWindowW * 0.756);
  const frameGap = Math.round(data.width * 0.0074);
  const labelFont = Math.round(data.width * 0.013);
  const bigHeadlineFont = Math.round(data.width * 0.041);
  const bodyFont = Math.round(data.width * 0.0148);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: '#0a0a0a',
        fontFamily: 'monospace',
        padding: `${padTop}px ${padX}px ${padBottom}px ${padX}px`,
      }}
    >
      {/* Top label */}
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: `${labelFont}px`,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: data.colorSecondary || '#e6c36b',
          marginBottom: `${Math.round(data.height * 0.028)}px`,
        }}
      >
        {data.customText || 'KODAK PORTRA 400'} &nbsp;•&nbsp; 35MM
      </div>

      {/* Filmstrip */}
      <div
        style={{
          width: `${stripW}px`,
          backgroundColor: '#111',
          padding: `${stripPadY}px 0`,
          position: 'relative',
        }}
      >
        {/* Top sprockets */}
        <div
          style={{
            position: 'absolute',
            top: `${sprocketTop}px`,
            left: `${sprocketInset}px`,
            right: `${sprocketInset}px`,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {sprockets.map((_, i) => (
            <div
              key={`t-${i}`}
              style={{ width: `${sprocketW}px`, height: `${sprocketH}px`, backgroundColor: '#0a0a0a' }}
            />
          ))}
        </div>

        {/* Photo window(s) — single big frame when only photoUrl; up to 3 frames when photos[] provided */}
        {hasMultiple ? (
          <div
            style={{
              width: `${photoWindowW}px`,
              height: `${photoWindowH}px`,
              margin: '0 auto',
              display: 'flex',
              gap: `${frameGap}px`,
              overflow: 'hidden',
            }}
          >
            {frames.map((src, i) => (
              <div
                key={`frame-${i}`}
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  aspectRatio: aspect.replace('/', ' / '),
                  backgroundColor: '#1e1e1e',
                }}
              >
                {src ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={src}
                    alt={`Film frame ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ color: '#666', fontSize: `${Math.round(data.width * 0.011)}px` }}>—</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: `${photoWindowW}px`,
              height: `${photoWindowH}px`,
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            {data.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.photoUrl} alt="Film frame" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: '#1e1e1e' }}
              >
                <span style={{ color: '#666', fontSize: `${labelFont}px` }}>Upload a photo</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom sprockets */}
        <div
          style={{
            position: 'absolute',
            bottom: `${sprocketTop}px`,
            left: `${sprocketInset}px`,
            right: `${sprocketInset}px`,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {sprockets.map((_, i) => (
            <div
              key={`b-${i}`}
              style={{ width: `${sprocketW}px`, height: `${sprocketH}px`, backgroundColor: '#0a0a0a' }}
            />
          ))}
        </div>
      </div>

      {/* Frame number */}
      <div
        style={{
          color: data.colorSecondary || '#e6c36b',
          fontFamily: 'monospace',
          fontSize: `${Math.round(data.width * 0.011)}px`,
          letterSpacing: '0.3em',
          marginTop: `${Math.round(data.height * 0.017)}px`,
          opacity: 0.8,
        }}
      >
        FRAME 24A &nbsp;▸&nbsp; ISO 400
      </div>

      {/* Headline */}
      <div
        style={{
          marginTop: `${Math.round(data.height * 0.04)}px`,
          fontFamily: `${body}, monospace`,
          fontSize: `${bigHeadlineFont}px`,
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
          marginTop: `${Math.round(data.height * 0.019)}px`,
          fontFamily: `${body}, monospace`,
          fontSize: `${bodyFont}px`,
          color: '#bbb',
          textAlign: 'center',
          maxWidth: `${Math.round(data.width * 0.67)}px`,
          lineHeight: 1.6,
          opacity: 0.85,
        }}
      >
        {data.bodyText || 'Grain, warmth, and the sound of a shutter.'}
      </div>

      <BrandMark
        data={data}
        defaultPosition="bottom-center"
        color={data.colorSecondary || '#e6c36b'}
        inset={brandInset}
      />
    </div>
  );
}
