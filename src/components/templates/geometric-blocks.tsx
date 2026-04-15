import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorAccent → top-right block
// - colorPrimary → bottom-left block
// - colorSecondary → background
// - imageAspect → photo card aspect (default 1/1)
// - tagline → bottom-right uppercase caption
export function GeometricBlocks({ data }: { data: TemplateData }) {
  const bg = data.colorSecondary ?? '#efe9df';
  const block1 = data.colorAccent ?? '#d97757';
  const block2 = data.colorPrimary ?? '#264653';
  const textColor = data.colorPrimary ?? '#1a1a1a';
  const aspect = data.imageAspect ?? '1/1';

  const blockSize = Math.round(data.width * 0.38);
  const photoW = Math.round(data.width * 0.5);
  const [aw, ah] = aspect.split('/').map(Number);
  const photoH = Math.round((photoW * ah) / aw);

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
        className="absolute top-0 right-0"
        style={{ width: `${blockSize}px`, height: `${blockSize}px`, backgroundColor: block1 }}
      />
      <div
        className="absolute bottom-0 left-0"
        style={{ width: `${blockSize}px`, height: `${blockSize}px`, backgroundColor: block2 }}
      />

      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${photoW}px`,
          height: `${photoH}px`,
          backgroundColor: '#fff',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#ddd' }} />
        )}
      </div>

      {data.headline && (
        <div
          className="absolute"
          style={{
            top: `${Math.round(data.height * 0.04)}px`,
            left: `${Math.round(data.width * 0.04)}px`,
            fontFamily: `${data.fontHeading}, serif`,
            fontSize: `${Math.round(data.width * 0.035)}px`,
            color: textColor,
            maxWidth: '45%',
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {data.headline}
        </div>
      )}

      {data.tagline && (
        <div
          className="absolute uppercase text-right"
          style={{
            bottom: `${Math.round(data.height * 0.03)}px`,
            right: `${Math.round(data.width * 0.04)}px`,
            fontSize: `${Math.round(data.width * 0.012)}px`,
            letterSpacing: '0.3em',
            color: '#fff',
          }}
        >
          {data.tagline}
        </div>
      )}

      <BrandMark data={data} color="#fff" inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
