import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';

// Flex fields: colorPrimary (blueprint bg), colorAccent (grid lines),
// customText (project id), dateText, locationText (spec line bottom)
export function BlueprintGrid({ data }: { data: TemplateData }) {
  const bg = data.colorPrimary ?? '#1a4d6e';
  const ink = data.colorSecondary ?? '#e8f0f5';
  const line = data.colorAccent ?? hexWithAlpha(ink, 0.18);
  const projectId = data.customText ?? 'PRJ-001';
  const dateLabel = data.dateText ?? '2026';
  const spec = data.locationText ?? data.bodyText ?? '';

  const pad = Math.round(data.width * 0.05);
  const photoW = Math.round(data.width * 0.55);
  const photoH = Math.round(photoW * 0.75);
  const gridSize = Math.round(data.width * 0.04);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: bg,
        fontFamily: `${data.fontBody}, 'Courier Prime', monospace`,
        color: ink,
        backgroundImage: `
          linear-gradient(to right, ${line} 1px, transparent 1px),
          linear-gradient(to bottom, ${line} 1px, transparent 1px),
          linear-gradient(to right, ${hexWithAlpha(ink, 0.08)} 1px, transparent 1px),
          linear-gradient(to bottom, ${hexWithAlpha(ink, 0.08)} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize * 5}px ${gridSize * 5}px, ${gridSize * 5}px ${gridSize * 5}px, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
      }}
    >
      {/* Header row */}
      <div
        className="absolute flex items-center justify-between uppercase"
        style={{
          top: `${pad}px`,
          left: `${pad}px`,
          right: `${pad}px`,
          fontSize: `${Math.round(data.width * 0.013)}px`,
          letterSpacing: '0.25em',
          borderBottom: `1px solid ${hexWithAlpha(ink, 0.4)}`,
          paddingBottom: `${Math.round(pad * 0.3)}px`,
        }}
      >
        <span style={{ visibility: 'hidden' }}>{projectId}</span>
        <span>{projectId}</span>
        <span>{dateLabel}</span>
      </div>

      {/* Photo */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -58%)',
          width: `${photoW}px`,
          height: `${photoH}px`,
          border: `1px solid ${hexWithAlpha(ink, 0.7)}`,
          padding: '4px',
        }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'hue-rotate(180deg) saturate(0.5) brightness(0.85)',
              mixBlendMode: 'luminosity',
              opacity: 0.9,
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: hexWithAlpha(ink, 0.08) }} />
        )}
      </div>

      {/* Headline */}
      <h1
        className="absolute uppercase"
        style={{
          left: `${pad}px`,
          right: `${pad}px`,
          bottom: `${pad * 2.5}px`,
          fontFamily: `${data.fontHeading}, 'Courier Prime', monospace`,
          fontSize: `${Math.round(data.width * 0.045)}px`,
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          fontWeight: 700,
          margin: 0,
        }}
      >
        {data.headline || 'BLUEPRINT / 01'}
      </h1>

      {/* Spec line */}
      <div
        className="absolute flex items-center justify-between uppercase"
        style={{
          left: `${pad}px`,
          right: `${pad}px`,
          bottom: `${pad}px`,
          fontSize: `${Math.round(data.width * 0.012)}px`,
          letterSpacing: '0.25em',
          borderTop: `1px solid ${hexWithAlpha(ink, 0.4)}`,
          paddingTop: `${Math.round(pad * 0.3)}px`,
          opacity: 0.85,
        }}
      >
        <span>SPEC /</span>
        <span style={{ flex: 1, textAlign: 'center' }}>{spec || 'ISSUE 01 — ARCHIVE'}</span>
        <span>/ 2026</span>
      </div>

      <BrandMark
        data={data}
        defaultPosition="top-left"
        fontSize={10}
        letterSpacing="0.2em"
        color={data.colorAccent ?? hexWithAlpha(ink, 0.7)}
        opacity={1}
        inset={pad}
      />
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const n = hex.replace('#', '');
  if (n.length !== 6) return hex;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
