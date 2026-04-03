import type { TemplateData, SwipeArrowStyle, SwipeIndicatorConfig, FooterConfig, FooterTextSource } from '@/types';
import { DEFAULT_ELEMENTS } from '@/types';

function alignToText(alignment: string | undefined): string {
  return alignment || 'left';
}

// Render the swipe arrow based on selected style
function SwipeArrow({ style, size, color }: { style: SwipeArrowStyle; size: number; color: string }) {
  const s = size * 1.2; // scale SVG slightly larger than font size
  switch (style) {
    case 'arrow-right':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    case 'chevron':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      );
    case 'double-chevron':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 6 13 12 7 18" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      );
    case 'circle-arrow':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <polyline points="13 9 16 12 13 15" />
        </svg>
      );
    case 'line-arrow':
      return (
        <svg width={s * 2} height={s} viewBox="0 0 48 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="12" x2="42" y2="12" />
          <polyline points="38 8 42 12 38 16" />
        </svg>
      );
    case 'dots':
      return (
        <svg width={s * 1.5} height={s} viewBox="0 0 36 24" fill={color}>
          <circle cx="8" cy="12" r="2.5" />
          <circle cx="18" cy="12" r="2.5" />
          <circle cx="28" cy="12" r="2.5" />
        </svg>
      );
    case 'hand-swipe':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-4 0v5" />
          <path d="M14 10V4a2 2 0 0 0-4 0v7" />
          <path d="M10 10.5V7a2 2 0 0 0-4 0v9a6 6 0 0 0 6 6h2.5a5.5 5.5 0 0 0 5.5-5.5V10a2 2 0 0 0-4 0" />
          <line x1="22" y1="8" x2="18" y2="8" opacity="0.5" />
          <polyline points="20 6 22 8 20 10" opacity="0.5" />
        </svg>
      );
    case 'arrow-minimal':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="16 8 20 12 16 16" />
        </svg>
      );
    case 'none':
      return null;
    case 'text':
    default:
      return null; // text mode handled by parent
  }
}

// Resolve footer text based on source
function resolveFooterText(
  config: FooterConfig,
  data: TemplateData,
): string | null {
  const source = config.textSource || 'review';
  switch (source) {
    case 'custom':
      return config.text || null;
    case 'brand-name':
      return data.brandName;
    case 'website':
      return data.websiteUrl || config.text || null;
    case 'handle':
      return data.instagramHandle || config.text || null;
    case 'tagline':
      return data.brandTagline || config.text || null;
    case 'ai-generated':
      return config.text || null; // AI text stored in config.text after generation
    case 'review':
    default: {
      if (config.text) return config.text;
      if (data.reviewCount) {
        return data.reviewTagline ? `${data.reviewCount} ${data.reviewTagline}` : data.reviewCount;
      }
      return null;
    }
  }
}

export function EditorialElegantTemplate({ data }: { data: TemplateData }) {
  const el = data.elements || DEFAULT_ELEMENTS;

  // Determine if header is at bottom (swapped with footer area)
  const headerAtBottom = el.header.position === 'bottom';
  const footerAtTop = el.footer.position === 'top' || el.swipeIndicator.position === 'top';

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: '1080px',
        height: '1350px',
        backgroundColor: data.colorSecondary,
        fontFamily: `${data.fontBody}, serif`,
      }}
    >
      {/* Top section: header or footer depending on position */}
      {el.header.visible && !headerAtBottom && (
        <div
          className="text-center pt-12 pb-6"
          style={{
            fontFamily: `${el.header.fontFamily || data.fontHeading}, serif`,
            color: el.header.color || data.colorPrimary,
            fontSize: `${el.header.fontSize || 18}px`,
            letterSpacing: `${el.header.letterSpacing ?? 0.35}em`,
            textTransform: 'uppercase',
            fontWeight: el.header.fontWeight ?? 400,
            fontStyle: el.header.fontStyle || 'normal',
            textAlign: alignToText(el.header.alignment) as React.CSSProperties['textAlign'],
            paddingLeft: el.header.alignment !== 'center' ? '48px' : undefined,
            paddingRight: el.header.alignment !== 'center' ? '48px' : undefined,
          }}
        >
          {el.header.text || data.brandName}
        </div>
      )}

      {/* Footer elements repositioned to top */}
      {footerAtTop && (
        <div className="mx-12 pt-8 pb-4 flex items-end justify-between">
          {el.footer.visible && el.footer.position === 'top' && (() => {
            const footerText = resolveFooterText(el.footer as FooterConfig, data);
            return footerText ? (
              <div
                style={{
                  fontFamily: `${el.footer.fontFamily || data.fontBody}, serif`,
                  color: el.footer.color || data.colorPrimary,
                  fontSize: `${el.footer.fontSize || 18}px`,
                  fontStyle: el.footer.fontStyle || 'italic',
                  fontWeight: el.footer.fontWeight ?? 400,
                  letterSpacing: el.footer.letterSpacing != null ? `${el.footer.letterSpacing}em` : undefined,
                  opacity: 0.7,
                  textAlign: alignToText(el.footer.alignment) as React.CSSProperties['textAlign'],
                }}
              >
                {footerText}
              </div>
            ) : null;
          })()}
          {el.swipeIndicator.visible && el.swipeIndicator.position === 'top' && (() => {
            const swipe = el.swipeIndicator as SwipeIndicatorConfig;
            const arrowStyle = swipe.arrowStyle || 'text';
            const swipeColor = swipe.color || data.colorPrimary;
            const swipeOpacity = swipe.opacity ?? 0.5;
            return (
              <div
                style={{
                  fontFamily: swipe.fontFamily || 'monospace',
                  color: swipeColor,
                  fontSize: `${swipe.fontSize || 16}px`,
                  letterSpacing: `${swipe.letterSpacing ?? 0.15}em`,
                  fontWeight: swipe.fontWeight ?? 400,
                  opacity: swipeOpacity,
                  marginLeft: el.footer.visible && el.footer.position === 'top' ? undefined : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {arrowStyle === 'text' || arrowStyle === 'none'
                  ? (swipe.text || 'Swipe →')
                  : (
                    <>
                      {swipe.text && <span>{swipe.text}</span>}
                      <SwipeArrow style={arrowStyle} size={swipe.fontSize || 16} color={swipeColor} />
                    </>
                  )
                }
              </div>
            );
          })()}
        </div>
      )}

      {/* Hero Photo */}
      <div className="relative mx-12" style={{ height: '600px' }}>
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt="Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#d4cfc4' }}
          >
            <span style={{ color: data.colorPrimary, fontSize: '16px', opacity: 0.6 }}>
              Upload a photo
            </span>
          </div>
        )}

      </div>

      {/* Headline */}
      {el.headline.visible && (
        <div
          className="mx-12 mt-10"
          style={{
            fontFamily: `${el.headline.fontFamily || data.fontHeading}, serif`,
            color: el.headline.color || data.colorPrimary,
            fontSize: `${el.headline.fontSize || 64}px`,
            lineHeight: String(el.headline.lineHeight ?? 1.1),
            fontWeight: el.headline.fontWeight ?? 900,
            fontStyle: el.headline.fontStyle || 'normal',
            textTransform: 'uppercase',
            letterSpacing: `${el.headline.letterSpacing ?? 0.02}em`,
            textAlign: alignToText(el.headline.alignment) as React.CSSProperties['textAlign'],
          }}
        >
          {data.headline || 'Your Headline Here'}
        </div>
      )}

      {/* Body Text */}
      {el.body.visible && (
        <div
          className="mx-12 mt-6"
          style={{
            fontFamily: `${el.body.fontFamily || data.fontBody}, serif`,
            color: el.body.color || data.colorPrimary,
            fontSize: `${el.body.fontSize || 24}px`,
            lineHeight: String(el.body.lineHeight ?? 1.6),
            fontStyle: el.body.fontStyle || 'italic',
            fontWeight: el.body.fontWeight ?? 400,
            letterSpacing: el.body.letterSpacing != null ? `${el.body.letterSpacing}em` : undefined,
            opacity: 0.85,
            textAlign: alignToText(el.body.alignment) as React.CSSProperties['textAlign'],
          }}
        >
          {data.bodyText || 'Your body text will appear here. Describe your brand and what makes your work stand out.'}
        </div>
      )}

      {/* Header repositioned to bottom */}
      {el.header.visible && headerAtBottom && (
        <div
          className="mx-12 mt-6"
          style={{
            fontFamily: `${el.header.fontFamily || data.fontHeading}, serif`,
            color: el.header.color || data.colorPrimary,
            fontSize: `${el.header.fontSize || 18}px`,
            letterSpacing: `${el.header.letterSpacing ?? 0.35}em`,
            textTransform: 'uppercase',
            fontWeight: el.header.fontWeight ?? 400,
            fontStyle: el.header.fontStyle || 'normal',
            textAlign: alignToText(el.header.alignment) as React.CSSProperties['textAlign'],
          }}
        >
          {el.header.text || data.brandName}
        </div>
      )}

      {/* Bottom Bar - only if footer/swipe are at bottom position */}
      {(
        (el.footer.visible && el.footer.position !== 'top') ||
        (el.swipeIndicator.visible && el.swipeIndicator.position !== 'top')
      ) && (
        <div className="mt-auto mx-12 mb-10 flex items-end justify-between">
          {el.footer.visible && el.footer.position !== 'top' && (() => {
            const footerText = resolveFooterText(el.footer as FooterConfig, data);
            return footerText ? (
              <div
                style={{
                  fontFamily: `${el.footer.fontFamily || data.fontBody}, serif`,
                  color: el.footer.color || data.colorPrimary,
                  fontSize: `${el.footer.fontSize || 18}px`,
                  fontStyle: el.footer.fontStyle || 'italic',
                  fontWeight: el.footer.fontWeight ?? 400,
                  letterSpacing: el.footer.letterSpacing != null ? `${el.footer.letterSpacing}em` : undefined,
                  opacity: 0.7,
                  textAlign: alignToText(el.footer.alignment) as React.CSSProperties['textAlign'],
                }}
              >
                {footerText}
              </div>
            ) : null;
          })()}
          {el.swipeIndicator.visible && el.swipeIndicator.position !== 'top' && (() => {
            const swipe = el.swipeIndicator as SwipeIndicatorConfig;
            const arrowStyle = swipe.arrowStyle || 'text';
            const swipeColor = swipe.color || data.colorPrimary;
            const swipeOpacity = swipe.opacity ?? 0.5;
            return (
              <div
                style={{
                  fontFamily: swipe.fontFamily || 'monospace',
                  color: swipeColor,
                  fontSize: `${swipe.fontSize || 16}px`,
                  letterSpacing: `${swipe.letterSpacing ?? 0.15}em`,
                  fontWeight: swipe.fontWeight ?? 400,
                  opacity: swipeOpacity,
                  marginLeft: el.footer.visible && el.footer.position !== 'top' ? undefined : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {arrowStyle === 'text' || arrowStyle === 'none'
                  ? (swipe.text || 'Swipe →')
                  : (
                    <>
                      {swipe.text && <span>{swipe.text}</span>}
                      <SwipeArrow style={arrowStyle} size={swipe.fontSize || 16} color={swipeColor} />
                    </>
                  )
                }
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
