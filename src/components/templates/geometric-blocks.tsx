import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

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
        <TextNode
          nodeKey="headline"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.035),
            fontWeight: 700,
            color: textColor,
            alignment: 'left',
            lineHeight: 1.1,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline}
          style={{
            position: 'absolute',
            top: `${Math.round(data.height * 0.04)}px`,
            left: `${Math.round(data.width * 0.04)}px`,
            maxWidth: '45%',
          }}
        />
      )}

      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.012)),
            color: '#fff',
            alignment: 'right',
            letterSpacing: 0.3,
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            position: 'absolute',
            bottom: `${Math.round(data.height * 0.03)}px`,
            right: `${Math.round(data.width * 0.04)}px`,
          }}
        />
      )}

      <BrandMark data={data} color="#fff" inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
