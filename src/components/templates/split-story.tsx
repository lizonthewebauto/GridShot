import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - imageAspect → applied as object-fit still covers the half; used as `aspectRatio` hint
//   on the photo element for any downstream consumers that need it.
// - variant === 'reverse' → flips the split (photo on the right instead of left)
export function SplitStory({ data }: { data: TemplateData }) {
  const isReversed = data.variant === 'reverse';
  const aspect = data.imageAspect ?? null;

  const photoPane = (
    <div className="w-1/2 h-full relative" key="photo">
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
      className="w-1/2 h-full flex flex-col justify-center px-14"
      key="content"
      style={{ backgroundColor: data.colorSecondary }}
    >
      <div
        className="w-10 h-10 rounded-full mb-8"
        style={{ backgroundColor: data.colorPrimary, opacity: 0.15 }}
      />

      <h2
        className="text-4xl font-bold mb-6 leading-snug"
        style={{
          fontFamily: data.fontHeading,
          color: data.colorPrimary,
        }}
      >
        {data.headline}
      </h2>

      <p
        className="text-lg leading-relaxed opacity-70 mb-8"
        style={{
          fontFamily: data.fontBody,
          color: data.colorPrimary,
        }}
      >
        {data.bodyText}
      </p>

      {data.reviewTagline && (
        <span
          className="text-sm opacity-50"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
          }}
        >
          {data.reviewTagline}
        </span>
      )}
    </div>
  );

  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden flex">
      {isReversed ? [contentPane, photoPane] : [photoPane, contentPane]}
      <BrandMark data={data} color={data.colorPrimary} />
    </div>
  );
}
