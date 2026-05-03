import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

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
        <TextNode
          nodeKey="headline"
          as="h2"
          className="uppercase tracking-tight"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.065),
            fontWeight: 900,
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline}
          style={{ marginBottom: `${Math.round(data.width * 0.01)}px` }}
        />

        <TextNode
          nodeKey="body"
          as="p"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.018)),
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1.5,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText}
          style={{
            maxWidth: `${Math.round(data.width * 0.65)}px`,
            opacity: 0.7,
          }}
        />
      </div>
      <BrandMark data={data} color={data.colorSecondary} inset={brandInset} />
    </div>
  );
}
