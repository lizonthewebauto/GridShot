import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function BoldShowcase({ data }: { data: TemplateData }) {
  return (
    <div
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: data.colorPrimary }}
    >
      {data.photoUrl && (
        <div className="absolute top-12 left-12 right-12 bottom-[280px] rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-16">
        <h2
          className="text-6xl font-black uppercase tracking-tight mb-3 leading-none"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorSecondary,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="text-lg leading-relaxed opacity-70 max-w-[700px]"
          style={{
            fontFamily: data.fontBody,
            color: data.colorSecondary,
          }}
        >
          {data.bodyText}
        </p>

      </div>
      <BrandMark data={data} color={data.colorSecondary} />
    </div>
  );
}
