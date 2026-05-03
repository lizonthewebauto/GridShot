import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields: variant ('dark' | 'light'), headline (note title),
// dateText (meta), bodyText (paragraph), photoUrl (inline embed), brandName (footer)
export function AppleNote({ data }: { data: TemplateData }) {
  const isLight = data.variant === 'light';
  const bg = isLight ? '#fffaec' : '#1c1c1e';
  const accent = '#ffd60a';
  const titleColor = isLight ? '#1a1a1a' : accent;
  const bodyColor = isLight ? '#3a3a3a' : '#f2f2f2';
  const metaColor = isLight ? '#8a8a8a' : '#8e8e93';
  const navColor = accent;

  const pad = Math.round(data.width * 0.05);
  const fsNav = Math.max(28, Math.round(data.width * 0.017));
  const fsTitle = Math.max(28, Math.round(data.width * 0.055));
  const fsMeta = Math.max(28, Math.round(data.width * 0.014));
  const fsBody = Math.max(28, Math.round(data.width * 0.022));
  const photoH = Math.round(data.height * 0.32);
  const radius = Math.round(data.width * 0.018);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, -apple-system, 'SF Pro Text', sans-serif`,
      }}
    >
      {/* Top nav */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          top: `${pad * 0.7}px`,
          left: `${pad}px`,
          right: `${pad}px`,
          color: navColor,
          fontSize: `${fsNav}px`,
          fontWeight: 500,
        }}
      >
        <div className="flex items-center" style={{ gap: '4px' }}>
          <svg width={fsNav} height={fsNav} viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke={navColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Notes</span>
        </div>
        <svg width={fsNav * 1.3} height={fsNav * 1.3} viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="12" r="1.6" fill={navColor} />
          <circle cx="12" cy="12" r="1.6" fill={navColor} />
          <circle cx="18" cy="12" r="1.6" fill={navColor} />
        </svg>
      </div>

      {/* Content */}
      <div
        className="absolute flex flex-col"
        style={{
          top: `${pad * 2.2}px`,
          left: `${pad}px`,
          right: `${pad}px`,
          bottom: `${pad * 1.5}px`,
          gap: `${Math.round(data.width * 0.02)}px`,
        }}
      >
        <TextNode
          nodeKey="headline"
          as="h1"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: fsTitle,
            fontWeight: 800,
            color: titleColor,
            alignment: 'left',
            lineHeight: 1.1,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'A note to self'}
          style={{ margin: 0 }}
        />

        {data.dateText && (
          <TextNode
            nodeKey="date"
            defaultElement={{
              fontSize: fsMeta,
              fontWeight: 400,
              color: metaColor,
              alignment: 'left',
            }}
            overrides={data.elementOverrides}
            defaultText={data.dateText}
          />
        )}

        {(data.photoUrl || data.photos?.[0]) && (
          <div
            style={{
              width: '100%',
              height: `${photoH}px`,
              borderRadius: `${radius}px`,
              overflow: 'hidden',
              backgroundColor: isLight ? '#f0e5c0' : '#2c2c2e',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(data.photoUrl ?? data.photos?.[0]) as string}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {data.bodyText && (
          <TextNode
            nodeKey="body"
            as="p"
            defaultElement={{
              fontSize: fsBody,
              fontWeight: 400,
              color: bodyColor,
              alignment: 'left',
              lineHeight: 1.45,
            }}
            overrides={data.elementOverrides}
            defaultText={data.bodyText}
            style={{ margin: 0 }}
          />
        )}
      </div>

      <BrandMark data={data} color={metaColor} fontSize={Math.max(10, Math.round(data.width * 0.012))} inset={Math.round(data.width * 0.03)} />
    </div>
  );
}
