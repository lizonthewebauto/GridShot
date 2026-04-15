import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields this template reads:
// - colorPrimary → sidebar dark bg
// - colorSecondary → sidebar text / caption overlay
// - colorAccent → small heading accent in sidebar
// - tagline → caption overlay on photo
export function SidebarIndex({ data }: { data: TemplateData }) {
  const sidebarBg = data.colorPrimary ?? '#15171a';
  const sidebarText = data.colorSecondary ?? '#f0ead6';
  const accent = data.colorAccent ?? '#c9a84c';

  const sidebarW = Math.round(data.width * 0.18);

  return (
    <div
      className="relative overflow-hidden flex"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      <div
        className="relative flex flex-col justify-between"
        style={{
          width: `${sidebarW}px`,
          height: '100%',
          backgroundColor: sidebarBg,
          color: sidebarText,
          padding: `${Math.round(data.width * 0.02)}px`,
        }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: `${Math.round(data.width * 0.011)}px`,
            letterSpacing: '0.3em',
            color: accent,
            fontFamily: `monospace`,
          }}
        >
          {data.customText ?? 'Index / 01'}
        </div>

        <div style={{ flex: 1 }} />

        <div
          className="uppercase"
          style={{
            fontSize: `${Math.round(data.width * 0.01)}px`,
            letterSpacing: '0.3em',
            opacity: 0.6,
            fontFamily: `monospace`,
          }}
        >
          {data.dateText ?? ''}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: '#ccc' }} />
        )}

        {(data.tagline || data.headline) && (
          <div
            className="absolute"
            style={{
              left: `${Math.round(data.width * 0.03)}px`,
              right: `${Math.round(data.width * 0.03)}px`,
              bottom: `${Math.round(data.height * 0.06)}px`,
              color: sidebarText,
              fontFamily: `${data.fontHeading}, serif`,
              fontStyle: 'italic',
              fontSize: `${Math.round(data.width * 0.032)}px`,
              lineHeight: 1.2,
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
              maxWidth: '75%',
            }}
          >
            {data.tagline ?? data.headline}
          </div>
        )}
      </div>

      <BrandMark
        data={data}
        defaultPosition="middle-left"
        color={sidebarText}
        fontSize={Math.round(data.width * 0.012)}
        letterSpacing="0.4em"
        opacity={1}
        inset={Math.round(data.width * 0.02)}
        writingMode="vertical-rl"
        rotate={180}
      />
    </div>
  );
}
