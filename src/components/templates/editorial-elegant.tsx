import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

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

        <TextNode
          nodeKey="headline"
          as="h2"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.05),
            fontWeight: 700,
            color: data.colorPrimary,
            alignment: 'left',
            lineHeight: 1.1,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline}
          style={{ marginBottom: `${Math.round(data.width * 0.015)}px` }}
        />

        <TextNode
          nodeKey="body"
          as="p"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.round(data.width * 0.02),
            color: data.colorPrimary,
            alignment: 'left',
            lineHeight: 1.5,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText}
          style={{
            maxWidth: `${Math.round(data.width * 0.56)}px`,
            opacity: 0.8,
          }}
        />

        {data.reviewCount && (
          <TextNode
            nodeKey="reviewCount"
            defaultElement={{
              fontSize: Math.max(28, Math.round(data.width * 0.014)),
              color: data.colorPrimary,
              alignment: 'left',
            }}
            overrides={data.elementOverrides}
            defaultText={data.reviewCount}
            style={{
              marginTop: `${Math.round(data.width * 0.03)}px`,
              opacity: 0.6,
            }}
          />
        )}
      </div>
      <BrandMark data={data} color={data.colorPrimary} inset={brandInset} />
    </div>
  );
}
