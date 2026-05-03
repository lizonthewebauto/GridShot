import type { TemplateData } from '@/types';
import { TextNode } from './_text-node';

// Flex fields this template reads:
// - colorAccent → gold border gradient base (default #c9a84c)
// - colorSecondary → cream inner background
// - colorPrimary → text + double-border color
// - customText / customText2 / customText3 → 3 stats, each "label|value" format
function parseStat(raw: string | null | undefined, fallback: [string, string]): [string, string] {
  if (!raw) return fallback;
  const parts = raw.split(/[|/]/).map((s) => s.trim());
  if (parts.length >= 2) return [parts[0], parts[1]];
  return [fallback[0], parts[0]];
}

export function BaseballCard({ data }: { data: TemplateData }) {
  const gold = data.colorAccent ?? '#c9a84c';
  const cream = data.colorSecondary ?? '#f4ead3';
  const ink = data.colorPrimary ?? '#131211';

  const stats: Array<[string, string]> = [
    parseStat(data.customText, ['EST.', '2020']),
    parseStat(data.customText2, ['ROLE', 'FOUNDER']),
    parseStat(data.customText3, ['CITY', 'NYC']),
  ];

  const framePad = Math.round(data.width * 0.025);
  const innerBorder = Math.round(data.width * 0.004);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        position: 'relative',
        width: `${data.width}px`,
        height: `${data.height}px`,
        background: `linear-gradient(135deg, ${gold} 0%, #f3d98a 50%, ${gold} 100%)`,
        fontFamily: `${data.fontBody}, sans-serif`,
        padding: `${framePad}px`,
      }}
    >
      <div
        className="relative w-full h-full flex flex-col"
        style={{
          backgroundColor: cream,
          border: `${innerBorder}px solid ${ink}`,
          outline: `${innerBorder}px solid ${ink}`,
          outlineOffset: `${Math.round(data.width * 0.008)}px`,
          padding: `${Math.round(data.width * 0.02)}px`,
          color: ink,
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: '58%',
            border: `${innerBorder}px solid ${ink}`,
          }}
        >
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: '#ddd' }} />
          )}
        </div>

        {data.brandName && (
          <TextNode
            nodeKey="brandName"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontHeading,
              fontSize: Math.round(data.width * 0.055),
              fontWeight: 700,
              color: ink,
              alignment: 'center',
              lineHeight: 1.1,
              letterSpacing: 0.04,
            }}
            overrides={data.elementOverrides}
            defaultText={data.brandName}
            style={{
              padding: `${Math.round(data.width * 0.02)}px 0 ${Math.round(data.width * 0.006)}px`,
            }}
          />
        )}

        {data.tagline && (
          <TextNode
            nodeKey="tagline"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.013)),
              color: ink,
              alignment: 'center',
              letterSpacing: 0.35,
            }}
            overrides={data.elementOverrides}
            defaultText={data.tagline}
            style={{
              marginTop: `${Math.round(data.width * 0.004)}px`,
              opacity: 0.75,
            }}
          />
        )}

        <div
          className="grid grid-cols-3 mt-auto"
          style={{
            borderTop: `${innerBorder}px solid ${ink}`,
            paddingTop: `${Math.round(data.width * 0.012)}px`,
          }}
        >
          {stats.map(([label, value], i) => (
            <div
              key={i}
              className="text-center uppercase"
              style={{
                borderLeft: i > 0 ? `1px solid ${ink}` : 'none',
                padding: `0 ${Math.round(data.width * 0.01)}px`,
              }}
            >
              <div style={{ fontSize: `${Math.round(data.width * 0.01)}px`, letterSpacing: '0.3em', opacity: 0.7 }}>
                {label}
              </div>
              <div
                style={{
                  fontFamily: `${data.fontHeading}, serif`,
                  fontSize: `${Math.max(28, Math.round(data.width * 0.024))}px`,
                  fontWeight: 700,
                  marginTop: `${Math.round(data.width * 0.004)}px`,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
