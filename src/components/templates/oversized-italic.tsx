import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - colorSecondary → cream background
// - colorPrimary → main text color
// - colorAccent → emphasized first word color
// - tagline → small uppercase eyebrow
// - dateText + locationText → small-caps footer row
export function OversizedItalic({ data }: { data: TemplateData }) {
  const bg = data.colorSecondary ?? '#f3ecdd';
  const textColor = data.colorPrimary ?? '#1a1a1a';
  const accent = data.colorAccent ?? '#b5472e';

  const headline = data.headline || 'Wander slowly';

  const photoH = Math.round(data.height * 0.45);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
        color: textColor,
      }}
    >
      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.012)),
            color: textColor,
            alignment: 'left',
            letterSpacing: 0.4,
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            position: 'absolute',
            top: `${Math.round(data.height * 0.07)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            opacity: 0.75,
          }}
        />
      )}

      <TextNode
        nodeKey="headline"
        as="h1"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontStyle: 'italic',
          fontSize: Math.round(data.width * 0.12),
          fontWeight: 500,
          color: textColor,
          alignment: 'left',
          lineHeight: 0.95,
        }}
        overrides={data.elementOverrides}
        defaultText={headline}
        style={{
          position: 'absolute',
          top: `${Math.round(data.height * 0.14)}px`,
          left: `${Math.round(data.width * 0.06)}px`,
          right: `${Math.round(data.width * 0.06)}px`,
        }}
      >
        {(resolved) => {
          const [first, ...rest] = resolved.split(/\s+/);
          return (
            <>
              <span style={{ color: accent }}>{first}</span>
              {rest.length > 0 && <span> {rest.join(' ')}</span>}
            </>
          );
        }}
      </TextNode>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: `${photoH}px`, overflow: 'hidden' }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#ccc' }} />
        )}
      </div>

      {(data.dateText || data.locationText) && (
        <TextNode
          nodeKey="meta"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.011)),
            color: textColor,
            alignment: 'left',
            letterSpacing: 0.3,
          }}
          overrides={data.elementOverrides}
          defaultText={`${data.locationText ?? ''}    ${data.dateText ?? ''}`.trim()}
          style={{
            position: 'absolute',
            bottom: `${photoH + Math.round(data.height * 0.025)}px`,
            left: `${Math.round(data.width * 0.06)}px`,
            right: `${Math.round(data.width * 0.06)}px`,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 0.7,
          }}
        />
      )}

      <BrandMark data={data} color="#fff" opacity={0.9} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
