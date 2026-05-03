import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - imageAspect → applied as object-fit still covers the half; used as `aspectRatio` hint
//   on the photo element for any downstream consumers that need it.
// - variant === 'reverse' → flips the split (photo on the right instead of left)
export function SplitStory({ data }: { data: TemplateData }) {
  const isReversed = data.variant === 'reverse';
  const aspect = data.imageAspect ?? null;
  const pad = Math.round(data.width * 0.045);
  const brandInset = Math.round(data.width * 0.03);

  const photoPane = (
    <div
      key="photo"
      style={{ width: '50%', height: '100%', position: 'relative' }}
    >
      {data.photoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={data.photoUrl}
          alt=""
          className="w-full h-full object-cover"
          style={aspect ? { aspectRatio: aspect.replace('/', ' / ') } : undefined}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ backgroundColor: data.colorPrimary, opacity: 0.2 }}
        />
      )}
    </div>
  );

  const contentPane = (
    <div
      key="content"
      className="flex flex-col justify-center"
      style={{
        width: '50%',
        height: '100%',
        padding: `${pad}px`,
        backgroundColor: data.colorSecondary,
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: `${Math.round(data.width * 0.035)}px`,
          height: `${Math.round(data.width * 0.035)}px`,
          backgroundColor: data.colorPrimary,
          opacity: 0.15,
          marginBottom: `${Math.round(data.width * 0.03)}px`,
        }}
      />

      <TextNode
        nodeKey="headline"
        as="h2"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontSize: Math.round(data.width * 0.04),
          fontWeight: 700,
          color: data.colorPrimary,
          alignment: 'left',
          lineHeight: 1.3,
        }}
        overrides={data.elementOverrides}
        defaultText={data.headline}
        style={{ marginBottom: `${Math.round(data.width * 0.022)}px` }}
      />

      <TextNode
        nodeKey="body"
        as="p"
        defaultElement={{
          fontFamily: data.fontBody,
          fontSize: Math.max(28, Math.round(data.width * 0.018)),
          fontWeight: 400,
          color: data.colorPrimary,
          alignment: 'left',
          lineHeight: 1.5,
        }}
        overrides={data.elementOverrides}
        defaultText={data.bodyText}
        style={{
          marginBottom: `${Math.round(data.width * 0.03)}px`,
          opacity: 0.7,
        }}
      />

      {data.reviewTagline && (
        <TextNode
          nodeKey="reviewTagline"
          as="span"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.014)),
            color: data.colorPrimary,
            alignment: 'left',
          }}
          overrides={data.elementOverrides}
          defaultText={data.reviewTagline}
          style={{ opacity: 0.5 }}
        />
      )}
    </div>
  );

  return (
    <div
      className="relative overflow-hidden flex"
      style={{ width: `${data.width}px`, height: `${data.height}px` }}
    >
      {isReversed ? [contentPane, photoPane] : [photoPane, contentPane]}
      <BrandMark data={data} color={data.colorPrimary} inset={brandInset} />
    </div>
  );
}
