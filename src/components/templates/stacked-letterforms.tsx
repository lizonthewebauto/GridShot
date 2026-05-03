import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - colorPrimary → dark background
// - colorAccent → letterforms color
// - colorSecondary → text + tagline color
// - breaks headline into 3 stacked lines (first 3 words)
export function StackedLetterforms({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#0f0e0c';
  const accent = data.colorAccent ?? '#d4a24c';
  const textColor = data.colorSecondary ?? '#f1ebdf';

  const words = (data.headline || 'Make It Loud').split(/\s+/).slice(0, 3);
  while (words.length < 3) words.push('');

  const photoW = Math.round(data.width * 0.7);
  const photoH = Math.round(data.height * 0.52);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      <TextNode
        nodeKey="headline"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontStyle: 'italic',
          fontSize: Math.round(data.width * 0.14),
          fontWeight: 700,
          color: accent,
          alignment: 'left',
          lineHeight: 0.92,
        }}
        overrides={data.elementOverrides}
        defaultText={words.join(' ')}
        style={{
          position: 'absolute',
          top: `${Math.round(data.height * 0.05)}px`,
          left: `${Math.round(data.width * 0.05)}px`,
          zIndex: 1,
        }}
      >
        {(resolved) => {
          const lineWords = resolved.split(/\s+/).slice(0, 3);
          while (lineWords.length < 3) lineWords.push('');
          return (
            <>
              {lineWords.map((w, i) => (
                <div key={i} style={{ marginLeft: `${i * Math.round(data.width * 0.04)}px` }}>
                  {w}
                </div>
              ))}
            </>
          );
        }}
      </TextNode>

      <div
        className="absolute"
        style={{
          right: 0,
          bottom: 0,
          width: `${photoW}px`,
          height: `${photoH}px`,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: '#222' }} />
        )}
      </div>

      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.012)),
            color: textColor,
            alignment: 'right',
            letterSpacing: 0.35,
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            position: 'absolute',
            right: `${Math.round(data.width * 0.05)}px`,
            bottom: `${Math.round(data.height * 0.06)}px`,
            zIndex: 3,
            maxWidth: '35%',
          }}
        />
      )}

      <BrandMark data={data} color={textColor} zIndex={3} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
