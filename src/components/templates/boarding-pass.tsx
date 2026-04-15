import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields: customText (FROM code), customText2 (TO code), customText3 (flight #),
// brandName (passenger), dateText (date), locationText (gate), photoUrl (stub photo)
export function BoardingPass({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#dcd5c4';
  const card = '#fefcf7';
  const ink = data.colorSecondary ?? '#1a1a1a';
  const accent = data.colorAccent ?? '#c25b3a';

  const fromCode = data.customText ?? 'NYC';
  const toCode = data.customText2 ?? 'PAR';
  const flightNo = data.customText3 ?? 'GS 404';
  const dateLabel = data.dateText ?? '04 APR 2026';
  const gate = data.locationText ?? 'GATE B12';

  const pad = Math.round(data.width * 0.04);
  const ticketInset = Math.round(data.width * 0.05);
  const stubW = Math.round(data.width * 0.22);
  const fsLabel = Math.round(data.width * 0.012);
  const fsCode = Math.round(data.width * 0.075);

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
          className="flex-1 flex flex-col justify-between"
          style={{ padding: `${pad}px` }}
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

          {/* FROM / TO codes */}
          <div className="flex items-center justify-between">
            <div>
              <div className="uppercase" style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', opacity: 0.6 }}>
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
              <div className="uppercase" style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.3em', opacity: 0.6 }}>
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

          {/* Details row */}
          <div
            className="flex items-end justify-end uppercase"
            style={{ fontSize: `${fsLabel}px`, letterSpacing: '0.25em', borderTop: `1px solid ${ink}`, paddingTop: `${pad * 0.4}px` }}
          >
            <div>
              <div style={{ opacity: 0.6 }}>DATE</div>
              <div style={{ fontWeight: 700, marginTop: 4, fontSize: `${Math.round(fsLabel * 1.3)}px` }}>{dateLabel}</div>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div
          style={{
            width: '1px',
            margin: `${pad * 0.5}px 0`,
            borderLeft: `2px dotted ${ink}`,
            opacity: 0.6,
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
            <div style={{ opacity: 0.6 }}>GATE</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{gate}</div>
          </div>
        </div>
      </div>

      <BrandMark
        data={data}
        defaultPosition="middle-left"
        color={ink}
        fontSize={Math.round(fsLabel * 1.3)}
        letterSpacing="0.25em"
        opacity={1}
        inset={Math.round(ticketInset + pad)}
      />
    </div>
  );
}
