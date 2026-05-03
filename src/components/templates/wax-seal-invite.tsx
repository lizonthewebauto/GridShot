import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields: colorAccent (gold border), colorPrimary (wax seal color),
// tagline (uppercase label), dateText (below headline), brandName (seal letter)
export function WaxSealInvite({ data }: { data: TemplateData }) {
  const gold = data.colorAccent ?? '#b8935a';
  const waxColor = data.colorPrimary ?? '#8a1e1e';
  const waxColorDark = darken(waxColor, 0.25);
  const cream = '#f5ede0';
  // Always a dark ink on the cream card — colorSecondary often ships as
  // a light paper color and would vanish on this background.
  const ink = '#2b2418';
  const sealLetter = (data.customText || data.brandName || 'G').trim().charAt(0).toUpperCase();

  const outerPad = Math.round(data.width * 0.04);
  const innerPad = Math.round(data.width * 0.015);
  const photoSize = Math.round(data.width * 0.42);
  const sealSize = Math.round(data.width * 0.13);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: cream,
        fontFamily: `${data.fontBody}, serif`,
        color: ink,
      }}
    >
      {/* Double gold border */}
      <div
        className="absolute"
        style={{ inset: `${outerPad}px`, border: `2px solid ${gold}` }}
      />
      <div
        className="absolute"
        style={{ inset: `${outerPad + innerPad}px`, border: `1px solid ${gold}` }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: `${outerPad * 2}px` }}
      >
        {data.tagline && (
          <TextNode
            nodeKey="tagline"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.014)),
              color: gold,
              alignment: 'center',
              letterSpacing: 0.4,
            }}
            overrides={data.elementOverrides}
            defaultText={data.tagline}
            style={{ marginBottom: `${Math.round(data.width * 0.025)}px` }}
          />
        )}

        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            style={{
              width: `${photoSize}px`,
              height: `${photoSize}px`,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${gold}`,
              marginBottom: `${Math.round(data.width * 0.03)}px`,
            }}
          />
        ) : (
          <div
            style={{
              width: `${photoSize}px`,
              height: `${photoSize}px`,
              borderRadius: '50%',
              backgroundColor: '#e8ddc8',
              border: `3px solid ${gold}`,
              marginBottom: `${Math.round(data.width * 0.03)}px`,
            }}
          />
        )}

        <TextNode
          nodeKey="headline"
          as="h1"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontStyle: 'italic',
            fontSize: Math.round(data.width * 0.075),
            fontWeight: 500,
            color: ink,
            alignment: 'center',
            lineHeight: 1.05,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'Forever & always'}
          style={{ margin: 0, maxWidth: '85%' }}
        />

        {data.dateText && (
          <TextNode
            nodeKey="date"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.016)),
              color: gold,
              alignment: 'center',
              letterSpacing: 0.35,
            }}
            overrides={data.elementOverrides}
            defaultText={data.dateText}
            style={{ marginTop: `${Math.round(data.width * 0.025)}px` }}
          />
        )}
      </div>

      {/* Wax seal bottom-right */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: `${outerPad * 2}px`,
          bottom: `${outerPad * 2}px`,
          width: `${sealSize}px`,
          height: `${sealSize}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${lighten(waxColor, 0.2)} 0%, ${waxColor} 45%, ${waxColorDark} 100%)`,
          boxShadow: `inset 0 -4px 10px ${waxColorDark}, 0 4px 10px rgba(0,0,0,0.35)`,
          transform: 'rotate(-12deg)',
        }}
      >
        <span
          style={{
            fontFamily: `${data.fontHeading}, serif`,
            fontStyle: 'italic',
            fontSize: `${Math.round(sealSize * 0.5)}px`,
            color: cream,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {sealLetter}
        </span>
      </div>

      <BrandMark
        data={data}
        defaultPosition="top-center"
        color={gold}
        fontSize={Math.max(28, Math.round(data.width * 0.014))}
        letterSpacing="0.4em"
        opacity={1}
        inset={Math.round(outerPad + innerPad + data.width * 0.025)}
      />
    </div>
  );
}

function darken(hex: string, amt: number): string {
  const n = hex.replace('#', '');
  if (n.length !== 6) return hex;
  const r = Math.max(0, Math.round(parseInt(n.slice(0, 2), 16) * (1 - amt)));
  const g = Math.max(0, Math.round(parseInt(n.slice(2, 4), 16) * (1 - amt)));
  const b = Math.max(0, Math.round(parseInt(n.slice(4, 6), 16) * (1 - amt)));
  return `rgb(${r}, ${g}, ${b})`;
}

function lighten(hex: string, amt: number): string {
  const n = hex.replace('#', '');
  if (n.length !== 6) return hex;
  const r = Math.min(255, Math.round(parseInt(n.slice(0, 2), 16) + 255 * amt));
  const g = Math.min(255, Math.round(parseInt(n.slice(2, 4), 16) + 255 * amt));
  const b = Math.min(255, Math.round(parseInt(n.slice(4, 6), 16) + 255 * amt));
  return `rgb(${r}, ${g}, ${b})`;
}
