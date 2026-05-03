import type { TemplateData } from '@/types';
import { TextNode } from './_text-node';

// Flex fields:
// - brandName → masthead (the newspaper name IS the brand)
// - customText → optional kicker above masthead (e.g. "Issue 01")
// - tagline → small uppercase subtitle under headline
// - dateText → date line in masthead area
// - bodyText → renders in 2-column layout below the photo
export function Newspaper({ data }: { data: TemplateData }) {
  const paper = data.colorSecondary ?? '#f4f0e4';
  const ink = data.colorPrimary ?? '#141311';

  const pad = Math.round(data.width * 0.04);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: paper,
        color: ink,
        fontFamily: `${data.fontBody}, serif`,
        padding: `${pad}px`,
      }}
    >
      {data.customText && (
        <TextNode
          nodeKey="kicker"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.012)),
            color: ink,
            alignment: 'center',
            letterSpacing: 0.35,
          }}
          overrides={data.elementOverrides}
          defaultText={data.customText}
          style={{
            opacity: 0.75,
            marginBottom: `${Math.round(data.width * 0.005)}px`,
          }}
        />
      )}

      <TextNode
        nodeKey="masthead"
        className="uppercase"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontSize: Math.round(data.width * 0.068),
          fontWeight: 900,
          color: ink,
          alignment: 'center',
          lineHeight: 1,
          letterSpacing: 0.04,
        }}
        overrides={data.elementOverrides}
        defaultText={data.brandName || 'THE DAILY'}
      />

      {/* Rule lines with date */}
      <div
        className="flex items-center gap-3 uppercase"
        style={{
          fontSize: `${Math.round(data.width * 0.01)}px`,
          letterSpacing: '0.25em',
          marginTop: `${Math.round(data.width * 0.01)}px`,
          marginBottom: `${Math.round(data.width * 0.015)}px`,
        }}
      >
        <div style={{ flex: 1, height: '2px', backgroundColor: ink }} />
        <TextNode
          nodeKey="date"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.round(data.width * 0.01),
            color: ink,
            alignment: 'center',
            letterSpacing: 0.25,
          }}
          overrides={data.elementOverrides}
          defaultText={data.dateText ?? 'Vol. I · Edition No. 1'}
        />
        <div style={{ flex: 1, height: '2px', backgroundColor: ink }} />
      </div>

      <TextNode
        nodeKey="headline"
        as="h1"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontSize: Math.round(data.width * 0.062),
          fontWeight: 800,
          color: ink,
          alignment: 'center',
          lineHeight: 1.02,
        }}
        overrides={data.elementOverrides}
        defaultText={data.headline || 'Today in history'}
        style={{ marginBottom: `${Math.round(data.width * 0.01)}px` }}
      />

      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.011)),
            color: ink,
            alignment: 'center',
            letterSpacing: 0.28,
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            opacity: 0.8,
            marginBottom: `${Math.round(data.width * 0.02)}px`,
          }}
        />
      )}

      {/* Photo */}
      <div
        style={{
          width: '100%',
          height: `${Math.round(data.height * 0.38)}px`,
          backgroundColor: '#d8d4c5',
          overflow: 'hidden',
          marginBottom: `${Math.round(data.width * 0.015)}px`,
          borderTop: `1px solid ${ink}`,
          borderBottom: `1px solid ${ink}`,
        }}
      >
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.05)' }}
          />
        )}
      </div>

      {data.locationText && (
        <TextNode
          nodeKey="caption"
          defaultElement={{
            fontFamily: data.fontBody,
            fontStyle: 'italic',
            fontSize: Math.max(28, Math.round(data.width * 0.011)),
            color: ink,
            alignment: 'center',
          }}
          overrides={data.elementOverrides}
          defaultText={data.locationText}
          style={{
            opacity: 0.7,
            marginBottom: `${Math.round(data.width * 0.015)}px`,
          }}
        />
      )}

      {/* 2-column body */}
      {data.bodyText && (
        <TextNode
          nodeKey="body"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.013)),
            color: ink,
            alignment: 'left',
            lineHeight: 1.5,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText}
          style={{
            columnCount: 2,
            columnGap: `${Math.round(data.width * 0.025)}px`,
            columnRule: `1px solid ${ink}`,
            textAlign: 'justify',
          }}
        />
      )}

    </div>
  );
}
