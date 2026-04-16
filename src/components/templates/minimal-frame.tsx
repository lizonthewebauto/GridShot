import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

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

      {/* Headline */}
      <div
        style={{
          fontFamily: `${heading}, sans-serif`,
          fontSize: `${Math.round(data.width * 0.045)}px`,
          fontWeight: 300,
          color: data.colorPrimary,
          textAlign: 'center',
          marginTop: `${Math.round(data.height * 0.06)}px`,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          maxWidth: `${Math.round(data.width * 0.78)}px`,
        }}
      >
        {data.headline || 'A quieter headline'}
      </div>

      {/* Body */}
      <div
        style={{
          fontFamily: `${body}, sans-serif`,
          fontSize: `${Math.max(28, Math.round(data.width * 0.017))}px`,
          fontWeight: 400,
          color: data.colorPrimary,
          opacity: 0.65,
          textAlign: 'center',
          marginTop: `${Math.round(data.width * 0.025)}px`,
          lineHeight: 1.6,
          maxWidth: `${Math.round(data.width * 0.6)}px`,
        }}
      >
        {data.bodyText || 'Less is more. Let the image breathe.'}
      </div>

      <BrandMark data={data} inset={brandInset} />
    </div>
  );
}
