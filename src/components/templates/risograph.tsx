import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields:
// - colorSecondary → paper bg
// - colorPrimary → riso ink wash color
// - colorAccent → optional secondary ink for text accent
// - tagline → small uppercase under headline
export function Risograph({ data }: { data: TemplateData }) {
  const paper = data.colorSecondary ?? '#f2ecd8';
  const ink = data.colorPrimary ?? '#e8543a';
  const accent = data.colorAccent ?? ink;
  const text = '#1a1612';

  const dotSize = Math.max(2, Math.round(data.width * 0.005));
  const dotSpacing = Math.round(data.width * 0.018);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: paper,
        color: text,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {/* Halftone dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) ${dotSize}px, transparent ${dotSize + 1}px)`,
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
          pointerEvents: 'none',
        }}
      />

      {/* Photo with riso multiply */}
      <div
        className="absolute"
        style={{
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${Math.round(data.width * 0.58)}px`,
          height: `${Math.round(data.height * 0.45)}px`,
          backgroundColor: ink,
          overflow: 'hidden',
        }}
      >
        {data.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: 'grayscale(100%) contrast(1.2)',
              mixBlendMode: 'multiply',
              opacity: 0.92,
            }}
          />
        )}
        {/* Ink wash overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: ink,
            mixBlendMode: 'multiply',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
        {/* Dot texture over photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) ${dotSize}px, transparent ${dotSize + 1}px)`,
            backgroundSize: `${Math.round(dotSpacing * 0.7)}px ${Math.round(dotSpacing * 0.7)}px`,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
      </div>

      <TextNode
        nodeKey="headline"
        as="h1"
        className="uppercase"
        defaultElement={{
          fontFamily: data.fontHeading,
          fontSize: Math.round(data.width * 0.095),
          fontWeight: 900,
          color: accent,
          alignment: 'center',
          lineHeight: 0.95,
          letterSpacing: -0.01,
        }}
        overrides={data.elementOverrides}
        defaultText={data.headline || 'PRESS PLAY'}
        style={{
          position: 'absolute',
          top: `${Math.round(data.height * 0.05)}px`,
          left: 0,
          right: 0,
          padding: `0 ${Math.round(data.width * 0.04)}px`,
          fontStretch: 'condensed',
          zIndex: 2,
        }}
      />

      {data.tagline && (
        <TextNode
          nodeKey="tagline"
          className="uppercase"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.013)),
            color: text,
            alignment: 'center',
            letterSpacing: 0.4,
          }}
          overrides={data.elementOverrides}
          defaultText={data.tagline}
          style={{
            position: 'absolute',
            top: `${Math.round(data.height * 0.22)}px`,
            left: 0,
            right: 0,
            opacity: 0.7,
            zIndex: 2,
          }}
        />
      )}

      <BrandMark data={data} color={accent} opacity={0.85} inset={Math.round(data.width * 0.03)} />


      {data.bodyText && (
        <TextNode
          nodeKey="body"
          as="p"
          defaultElement={{
            fontFamily: data.fontBody,
            fontSize: Math.max(28, Math.round(data.width * 0.014)),
            color: text,
            alignment: 'center',
            lineHeight: 1.45,
          }}
          overrides={data.elementOverrides}
          defaultText={data.bodyText}
          style={{
            position: 'absolute',
            bottom: `${Math.round(data.height * 0.1)}px`,
            left: 0,
            right: 0,
            padding: `0 ${Math.round(data.width * 0.08)}px`,
            opacity: 0.78,
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
