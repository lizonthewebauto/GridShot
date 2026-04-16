import type { TemplateData } from '@/types';

// Flex fields this template reads:
// - brandName → passenger line
// - locationText → destination 3-letter code + gate footer
// - customText / customText2 → optional FROM / TO overrides (clipped to 3 chars)
// - customText3 → flight number
// - dateText → boarding date
export function BoardingPass({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#dcd5c4';
  const card = '#fefcf7';
  const ink = '#1a1a1a';
  const accent = data.colorAccent ?? '#c25b3a';

  const short = (s: string | undefined, fallback: string) =>
    s ? s.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase().padEnd(3, fallback[0]) : fallback;

  const fromCode = short(data.customText, short(data.brandName, 'GSX'));
  const toCode = short(data.customText2, short(data.locationText, 'DST'));
  const flightNo = data.customText3 && data.customText3.length <= 10 ? data.customText3 : 'GS 404';
  const dateLabel = data.dateText ?? '04 APR 2026';
  const gate = data.locationText ?? 'GATE B12';

  const pad = Math.round(data.width * 0.04);
  const ticketInset = Math.round(data.width * 0.05);
  const stubW = Math.round(data.width * 0.22);
  const fsLabel = Math.round(data.width * 0.012);
  const fsCode = Math.round(data.width * 0.09);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, 'Courier Prime', monospace`,
        color: ink,
      }}
    >
      <div
        className="relative flex"
        style={{
          width: `${data.width - ticketInset * 2}px`,
          height: `${data.height - ticketInset * 2}px`,
          backgroundColor: card,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Main ticket body */}
        <div
          className="flex-1 flex flex-col"
          style={{ padding: `${pad}px`, gap: `${pad * 0.8}px` }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between uppercase"
            style={{
              fontSize: `${fsLabel}px`,
              letterSpacing: '0.3em',
              borderBottom: `1px solid ${ink}`,
              paddingBottom: `${pad * 0.4}px`,
            }}
          >
            <span style={{ color: accent, fontWeight: 700 }}>BOARDING PASS</span>
            <span>{flightNo}</span>
          </div>

          {/* Passenger */}
          <div>
            <div
              className="uppercase"
              style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', opacity: 0.85 }}
            >
              PASSENGER
            </div>
            <div
              style={{
                fontFamily: `${data.fontHeading}, 'Courier Prime', monospace`,
                fontSize: `${Math.round(fsLabel * 2.5)}px`,
                fontWeight: 700,
                marginTop: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              {data.brandName || 'PASSENGER'}
            </div>
          </div>

          {/* FROM / TO codes */}
          <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
            <div>
              <div className="uppercase" style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', opacity: 0.85 }}>
                FROM
              </div>
              <div
                style={{
                  fontFamily: `${data.fontHeading}, 'Courier Prime', monospace`,
                  fontSize: `${fsCode}px`,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                }}
              >
                {fromCode}
              </div>
            </div>
            <div style={{ fontSize: `${Math.round(data.width * 0.04)}px`, color: accent, fontWeight: 700 }}>
              →
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="uppercase" style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', opacity: 0.85 }}>
                TO
              </div>
              <div
                style={{
                  fontFamily: `${data.fontHeading}, 'Courier Prime', monospace`,
                  fontSize: `${fsCode}px`,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                }}
              >
                {toCode}
              </div>
            </div>
          </div>

          {/* Date footer */}
          <div
            className="flex items-end justify-end uppercase"
            style={{
              fontSize: `${fsLabel}px`,
              letterSpacing: '0.25em',
              borderTop: `1px solid ${ink}`,
              paddingTop: `${pad * 0.4}px`,
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.85 }}>DATE</div>
              <div style={{ fontWeight: 700, marginTop: 4, fontSize: `${Math.round(fsLabel * 1.3)}px` }}>
                {dateLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div
          style={{
            width: '1px',
            margin: `${pad * 0.5}px 0`,
            borderLeft: `2px dotted ${ink}`,
            opacity: 0.85,
          }}
        />

        {/* Stub */}
        <div
          className="flex flex-col justify-between"
          style={{ width: `${stubW}px`, padding: `${pad}px` }}
        >
          <div
            className="uppercase text-center"
            style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', color: accent, fontWeight: 700 }}
          >
            STUB
          </div>

          <div
            style={{
              width: '100%',
              aspectRatio: '1/1',
              overflow: 'hidden',
              border: `1px solid ${ink}`,
            }}
          >
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
            )}
          </div>

          <div className="uppercase" style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.25em', textAlign: 'center' }}>
            <div style={{ opacity: 0.85 }}>GATE</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{gate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
