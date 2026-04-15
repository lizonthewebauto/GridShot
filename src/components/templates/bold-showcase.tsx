import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function BoldShowcase({ data }: { data: TemplateData }) {
  const pad = Math.round(data.width * 0.045);
  const photoBottom = Math.round(data.height * 0.26);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorPrimary,
      }}
    >
      {data.photoUrl && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: `${pad}px`,
            left: `${pad}px`,
            right: `${pad}px`,
            bottom: `${photoBottom}px`,
            borderRadius: `${Math.round(data.width * 0.01)}px`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: `${Math.round(data.width * 0.055)}px` }}
      >
        <h2
          className="font-black uppercase tracking-tight leading-none"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorSecondary,
            fontSize: `${Math.round(data.width * 0.065)}px`,
            marginBottom: `${Math.round(data.width * 0.01)}px`,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="leading-relaxed opacity-70"
          style={{
            fontFamily: data.fontBody,
            color: data.colorSecondary,
            fontSize: `${Math.round(data.width * 0.018)}px`,
            maxWidth: `${Math.round(data.width * 0.65)}px`,
          }}
        >
          {data.bodyText}
        </p>

      </div>
      <BrandMark data={data} color={data.colorSecondary} inset={brandInset} />
    </div>
  );
}
