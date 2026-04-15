import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function EditorialElegant({ data }: { data: TemplateData }) {
  return (
    <div
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: data.colorSecondary }}
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

      <div className="relative z-10 flex flex-col justify-end h-full p-16">
        <div
          className="w-20 h-1 mb-6"
          style={{ backgroundColor: data.colorPrimary }}
        />

        <h2
          className="text-5xl font-bold mb-4 leading-tight"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorPrimary,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="text-xl leading-relaxed opacity-80 max-w-[600px]"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
          }}
        >
          {data.bodyText}
        </p>

        {data.reviewCount && (
          <div className="mt-8">
            <span
              className="text-sm opacity-60"
              style={{ color: data.colorPrimary }}
            >
              {data.reviewCount}
            </span>
          </div>
        )}
      </div>
      <BrandMark data={data} color={data.colorPrimary} />
    </div>
  );
}
