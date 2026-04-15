import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

export function PhotoOnly({ data }: { data: TemplateData }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: data.width, height: data.height, backgroundColor: data.colorPrimary }}
    >
      {data.photoUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="text-2xl opacity-30"
            style={{
              fontFamily: data.fontBody,
              color: data.colorSecondary,
            }}
          >
            No photo
          </span>
        </div>
      )}

      <BrandMark data={data} color="#fff" opacity={0.9} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
