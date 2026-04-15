import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function EditorialElegant({ data }: { data: TemplateData }) {
  const pad = Math.round(data.width * 0.055);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: data.colorSecondary,
      }}
    >
      {data.photoUrl && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}

      <div
        className="relative z-10 flex flex-col justify-end h-full"
        style={{ padding: `${pad}px` }}
      >
        <div
          style={{
            width: `${Math.round(data.width * 0.07)}px`,
            height: `${Math.max(2, Math.round(data.width * 0.003))}px`,
            backgroundColor: data.colorPrimary,
            marginBottom: `${Math.round(data.width * 0.022)}px`,
          }}
        />

        <h2
          className="font-bold leading-tight"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorPrimary,
            fontSize: `${Math.round(data.width * 0.05)}px`,
            marginBottom: `${Math.round(data.width * 0.015)}px`,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="leading-relaxed opacity-80"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
            fontSize: `${Math.round(data.width * 0.02)}px`,
            maxWidth: `${Math.round(data.width * 0.56)}px`,
          }}
        >
          {data.bodyText}
        </p>

        {data.reviewCount && (
          <div style={{ marginTop: `${Math.round(data.width * 0.03)}px` }}>
            <span
              className="opacity-60"
              style={{ color: data.colorPrimary, fontSize: `${Math.round(data.width * 0.014)}px` }}
            >
              {data.reviewCount}
            </span>
          </div>
        )}
      </div>
      <BrandMark data={data} color={data.colorPrimary} inset={brandInset} />
    </div>
  );
}
