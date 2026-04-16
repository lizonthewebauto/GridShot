import type { TemplateData } from '@/types';

// Flex fields:
// - colorPrimary → sidebar dark bg
// - colorSecondary → sidebar text / caption overlay
// - colorAccent → small heading accent in sidebar
// - tagline → caption overlay on photo
export function SidebarIndex({ data }: { data: TemplateData }) {
  const sidebarBg = data.colorPrimary ?? '#15171a';
  const sidebarText = data.colorSecondary ?? '#f0ead6';
  const accent = data.colorAccent ?? '#c9a84c';

  const sidebarW = Math.round(data.width * 0.22);
  const pad = Math.round(data.width * 0.028);

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
          padding: `${pad}px`,
        }}
      >
        <div>
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.round(data.width * 0.012)}px`,
              letterSpacing: '0.3em',
              color: accent,
              fontFamily: 'monospace',
              marginBottom: `${pad}px`,
            }}
          >
            {data.customText ?? 'Index / 01'}
          </div>

          {data.brandName && (
            <div
              style={{
                fontFamily: `${data.fontHeading}, serif`,
                fontSize: `${Math.round(data.width * 0.04)}px`,
                fontWeight: 700,
                lineHeight: 1.05,
                color: sidebarText,
              }}
            >
              {data.brandName}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {data.dateText && (
          <div
            className="uppercase"
            style={{
              fontSize: `${Math.round(data.width * 0.011)}px`,
              letterSpacing: '0.3em',
              opacity: 0.7,
              fontFamily: 'monospace',
            }}
          >
            {data.dateText}
          </div>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: '#ccc' }} />
        )}

        {(data.tagline || data.headline) && (
          <>
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: '45%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: `${Math.round(data.width * 0.035)}px`,
                right: `${Math.round(data.width * 0.035)}px`,
                bottom: `${Math.round(data.height * 0.05)}px`,
                color: '#ffffff',
                fontFamily: `${data.fontHeading}, serif`,
                fontStyle: 'italic',
                fontSize: `${Math.round(data.width * 0.036)}px`,
                lineHeight: 1.2,
                textShadow: '0 2px 14px rgba(0,0,0,0.8)',
                maxWidth: '85%',
              }}
            >
              {data.tagline ?? data.headline}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
