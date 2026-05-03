import type { TemplateData } from '@/types';
import { BrandMark } from './_brand-mark';
import { TextNode } from './_text-node';

// Flex fields:
// - colorGradientFrom / colorGradientTo → duotone colors (fallback colorPrimary/colorAccent)
// - gradientAngle → direction of gradient wash
// - tagline → small uppercase above headline
export function DuotoneWash({ data }: { data: TemplateData }) {
  const fromColor = data.colorGradientFrom ?? data.colorPrimary ?? '#1a1f3a';
  const toColor = data.colorGradientTo ?? data.colorAccent ?? data.colorPrimary ?? '#d94f4f';
  const angle = data.gradientAngle ?? 135;
  const textColor = data.colorSecondary ?? '#ffffff';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundColor: fromColor,
        fontFamily: `${data.fontBody}, sans-serif`,
      }}
    >
      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.1)' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: fromColor }} />
      )}

      {/* Duotone gradient wash using multiply */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${fromColor} 0%, ${toColor} 100%)`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Lighten layer to lift midtones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${fromColor} 0%, ${toColor} 100%)`,
          mixBlendMode: 'screen',
          opacity: 0.25,
        }}
      />

      {/* Bottom backdrop plate tinted with fromColor so the text area always
          has a consistent tint (the duotone blend varies by photo). */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '42%',
          background: `linear-gradient(to top, ${hexWithAlpha(fromColor, 0.85)} 0%, ${hexWithAlpha(fromColor, 0.55)} 60%, ${hexWithAlpha(fromColor, 0)} 100%)`,
          zIndex: 1,
        }}
      />

      <div
        className="absolute"
        style={{
          bottom: `${Math.round(data.height * 0.05)}px`,
          left: `${Math.round(data.width * 0.05)}px`,
          right: `${Math.round(data.width * 0.05)}px`,
          color: textColor,
          zIndex: 2,
        }}
      >
        {data.tagline && (
          <TextNode
            nodeKey="tagline"
            className="uppercase"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.011)),
              fontWeight: 400,
              color: textColor,
              alignment: 'left',
              letterSpacing: 0.3,
            }}
            overrides={data.elementOverrides}
            defaultText={data.tagline}
            style={{
              opacity: 0.9,
              marginBottom: `${Math.round(data.width * 0.012)}px`,
            }}
          />
        )}
        <TextNode
          nodeKey="headline"
          as="h1"
          defaultElement={{
            fontFamily: data.fontHeading,
            fontSize: Math.round(data.width * 0.072),
            fontWeight: 700,
            fontStyle: 'italic',
            color: textColor,
            alignment: 'left',
            lineHeight: 1.05,
          }}
          overrides={data.elementOverrides}
          defaultText={data.headline || 'Your headline here'}
          style={{ maxWidth: '90%' }}
        />
        {data.bodyText && (
          <TextNode
            nodeKey="body"
            as="p"
            defaultElement={{
              fontFamily: data.fontBody,
              fontSize: Math.max(28, Math.round(data.width * 0.017)),
              fontWeight: 400,
              color: textColor,
              alignment: 'left',
              lineHeight: 1.5,
            }}
            overrides={data.elementOverrides}
            defaultText={data.bodyText}
            style={{
              opacity: 0.9,
              maxWidth: '75%',
              marginTop: `${Math.round(data.width * 0.014)}px`,
            }}
          />
        )}
      </div>

      <BrandMark data={data} color={textColor} opacity={0.85} inset={Math.round(data.width * 0.03)} zIndex={3} />
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const n = hex.replace('#', '');
  const normalized = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
