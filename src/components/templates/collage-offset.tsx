import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - photos → array of up to 3 photo URLs (falls back to photoUrl×3)
// - imageAspect → aspect per photo (default 1/1)
// - colorSecondary → background
// - tagline → uppercase eyebrow below headline
export function CollageOffset({ data }: { data: TemplateData }) {
  const bg = data.colorSecondary ?? '#ede5d8';
  const textColor = data.colorPrimary ?? '#1c1c1c';
  const photos = (data.photos && data.photos.length > 0
    ? data.photos
    : [data.photoUrl, data.photoUrl, data.photoUrl]
  ).slice(0, 3);

  const aspect = data.imageAspect ?? '1/1';
  const [aw, ah] = aspect.split('/').map(Number);
  const photoW = Math.round(data.width * 0.32);
  const photoH = Math.round((photoW * ah) / aw);

  const rotations = [-7, 4, -3];
  const offsets = [
    { x: -0.18, y: -0.02 },
    { x: 0, y: -0.08 },
    { x: 0.18, y: 0.02 },
  ];

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
      <div className="absolute" style={{ top: '38%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {photos.map((src, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: `${photoW}px`,
              height: `${photoH}px`,
              left: `${offsets[i].x * data.width}px`,
              top: `${offsets[i].y * data.width}px`,
              transform: `translate(-50%, -50%) rotate(${rotations[i]}deg)`,
              backgroundColor: '#fff',
              padding: `${Math.round(data.width * 0.012)}px`,
              paddingBottom: `${Math.round(data.width * 0.035)}px`,
              boxShadow: '0 18px 40px rgba(0,0,0,0.22)',
              zIndex: i === 1 ? 3 : 2,
            }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: '#ccc' }} />
            )}
          </div>
        ))}
      </div>

      <div
        className="absolute text-center"
        style={{
          bottom: `${Math.round(data.height * 0.06)}px`,
          left: 0,
          right: 0,
          color: textColor,
          padding: '0 10%',
        }}
      >
        <h1
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontSize: `${Math.round(data.width * 0.058)}px`,
            lineHeight: 1.05,
            fontWeight: 700,
            marginBottom: `${Math.round(data.width * 0.014)}px`,
          }}
        >
          {data.headline || 'Moments we kept'}
        </h1>
        {data.tagline && (
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.round(data.width * 0.012)}px`,
              letterSpacing: '0.35em',
              opacity: 0.75,
            }}
          >
            {data.tagline}
          </div>
        )}
      </div>
      <BrandMark data={data} color={textColor} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
