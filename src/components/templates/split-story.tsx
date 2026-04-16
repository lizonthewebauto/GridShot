import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

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

      <h2
        className="font-bold leading-snug"
        style={{
          fontFamily: data.fontHeading,
          color: data.colorPrimary,
          fontSize: `${Math.round(data.width * 0.04)}px`,
          marginBottom: `${Math.round(data.width * 0.022)}px`,
        }}
      >
        {data.headline}
      </h2>

      <p
        className="leading-relaxed opacity-70"
        style={{
          fontFamily: data.fontBody,
          color: data.colorPrimary,
          fontSize: `${Math.max(28, Math.round(data.width * 0.018))}px`,
          marginBottom: `${Math.round(data.width * 0.03)}px`,
        }}
      >
        {data.bodyText}
      </p>

      {data.reviewTagline && (
        <span
          className="opacity-50"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
            fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px`,
          }}
        >
          {data.reviewTagline}
        </span>
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
