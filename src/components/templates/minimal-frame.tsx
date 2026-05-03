import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

export function MinimalFrame({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Inter';
  const body = data.fontBody || 'Inter';
  const padY = Math.round(data.height * 0.09);
  const padX = Math.round(data.width * 0.075);
  const photoSize = Math.round(Math.min(data.width, data.height) * 0.55);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorSecondary,
        fontFamily: `${body}, sans-serif`,
        padding: `${padY}px ${padX}px`,
      }}
    >
      {/* Framed photo */}
      <div
        style={{
          width: `${photoSize}px`,
          height: `${photoSize}px`,
          border: `1px solid ${data.colorPrimary}`,
          padding: `${Math.round(data.width * 0.012)}px`,
          flexShrink: 0,
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#ece8df' }}
          >
            <span style={{ color: data.colorPrimary, fontSize: `${Math.max(28, Math.round(data.width * 0.013))}px`, opacity: 0.4 }}>
              Upload a photo
            </span>
          </div>
        )}
      </div>

      <TextNode
        nodeKey="headline"
        defaultElement={{
          fontFamily: heading,
          fontSize: Math.round(data.width * 0.045),
          fontWeight: 300,
          color: data.colorPrimary,
          alignment: 'center',
          lineHeight: 1.2,
          letterSpacing: -0.01,
        }}
        overrides={data.elementOverrides}
        defaultText={data.headline || 'A quieter headline'}
        style={{
          marginTop: `${Math.round(data.height * 0.06)}px`,
          maxWidth: `${Math.round(data.width * 0.78)}px`,
        }}
      />

      <TextNode
        nodeKey="body"
        defaultElement={{
          fontFamily: body,
          fontSize: Math.max(28, Math.round(data.width * 0.017)),
          fontWeight: 400,
          color: data.colorPrimary,
          alignment: 'center',
          lineHeight: 1.6,
        }}
        overrides={data.elementOverrides}
        defaultText={data.bodyText || 'Less is more. Let the image breathe.'}
        style={{
          opacity: 0.65,
          marginTop: `${Math.round(data.width * 0.025)}px`,
          maxWidth: `${Math.round(data.width * 0.6)}px`,
        }}
      />

      <BrandMark data={data} inset={brandInset} />
    </div>
  );
}
