import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

export function SplitPortfolio({ data }: { data: TemplateData }) {
  const heading = data.fontHeading || 'Playfair Display';
  const body = data.fontBody || 'Inter';
  const padY = Math.round(data.height * 0.06);
  const padX = Math.round(data.width * 0.055);
  const brandInset = Math.round(data.width * 0.03);

  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        fontFamily: `${body}, sans-serif`,
        backgroundColor: data.colorSecondary,
      }}
    >
      {/* Left: photo */}
      <div style={{ width: '50%', height: '100%', flexShrink: 0 }}>
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="Portfolio" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#bbb2a4' }}
          >
            <span style={{ color: '#fff', opacity: 0.6, fontSize: `${Math.max(28, Math.round(data.width * 0.014))}px` }}>
              Upload a photo
            </span>
          </div>
        )}
      </div>

      {/* Right: text */}
      <div
        className="flex flex-col justify-center"
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: data.colorPrimary,
          color: data.colorSecondary,
          padding: `${padY}px ${padX}px`,
        }}
      >
        <TextNode
          nodeKey="kicker"
          className="uppercase"
          defaultElement={{
            fontFamily: body,
            fontSize: Math.max(28, Math.round(data.width * 0.013)),
            color: data.colorSecondary,
            alignment: 'left',
            letterSpacing: 0.4,
          }}
          overrides={data.elementOverrides}
          defaultText={'Portfolio'}
          style={{
            opacity: 0.7,
            marginBottom: `${Math.round(data.width * 0.022)}px`,
          }}
        />

        <TextNode
          nodeKey="headline"
          defaultElement={{
            fontFamily: heading,
            fontSize: Math.round(data.width * 0.067),
            fontWeight: 700,
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1.05,
            letterSpacing: -0.01,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'Framed With Care'}
        />

        <TextNode
          nodeKey="body"
          defaultElement={{
            fontFamily: body,
            fontSize: Math.max(28, Math.round(data.width * 0.019)),
            color: data.colorSecondary,
            alignment: 'left',
            lineHeight: 1.6,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText || 'A considered look at recent work.'}
          style={{
            marginTop: `${Math.round(data.width * 0.03)}px`,
            opacity: 0.88,
          }}
        />

      </div>
      <BrandMark data={data} color={data.colorSecondary} inset={brandInset} />
    </div>
  );
}
