import type {
  TemplateData,
  SwipeArrowStyle,
  SwipeIndicatorConfig,
  FooterConfig,
  ElementAlignment,
} from '@/types';
import { DEFAULT_ELEMENTS } from '@/types';
import type { CSSProperties } from 'react';

// The flagship configurable template, ported from the original creator.
// Every element (header, headline, body, footer, swipe indicator) reads its
// font, size, weight, color, alignment, position, and visibility from
// `data.elements` (falls back to DEFAULT_ELEMENTS).

function alignToText(alignment: string | undefined): CSSProperties['textAlign'] {
  return (alignment as CSSProperties['textAlign']) || 'left';
}

function SwipeArrow({ style, size, color }: { style: SwipeArrowStyle; size: number; color: string }) {
  const s = size * 1.2;
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
    case 'text':
    default:
      return null;
  }
}

function resolveFooterText(config: FooterConfig, data: TemplateData): string | null {
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
      return data.brandTagline || data.tagline || config.text || null;
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

export function EditorialPro({ data }: { data: TemplateData }) {
  const el = data.elements || DEFAULT_ELEMENTS;
  const w = data.width || 1080;
  const h = data.height || 1440;
  const pad = Math.round(w * 0.044); // ~48px at 1080
  const heroHeight = Math.round(h * 0.44); // photo block height

  const headerAtBottom = el.header.position === 'bottom';
  const footerAtTop = el.footer.position === 'top' || el.swipeIndicator.position === 'top';

  function renderHeader(positionTop: boolean) {
    if (!el.header.visible) return null;
    if (positionTop && headerAtBottom) return null;
    if (!positionTop && !headerAtBottom) return null;

    const align = alignToText(el.header.alignment) as ElementAlignment;
    return (
      <div
        style={{
          fontFamily: `${el.header.fontFamily || data.fontHeading}, serif`,
          color: el.header.color || data.colorPrimary,
          fontSize: `${el.header.fontSize || 24}px`,
          letterSpacing: `${el.header.letterSpacing ?? 0.35}em`,
          textTransform: 'uppercase',
          fontWeight: el.header.fontWeight ?? 400,
          fontStyle: el.header.fontStyle || 'normal',
          textAlign: align,
          paddingTop: positionTop ? `${Math.round(h * 0.04)}px` : `${Math.round(h * 0.02)}px`,
          paddingBottom: positionTop ? `${Math.round(h * 0.022)}px` : 0,
          paddingLeft: align !== 'center' ? `${pad}px` : undefined,
          paddingRight: align !== 'center' ? `${pad}px` : undefined,
        }}
      >
        {el.header.text || data.brandName}
      </div>
    );
  }

  function renderFooterRow(positionTop: boolean) {
    const showFooter = el.footer.visible && (positionTop ? el.footer.position === 'top' : el.footer.position !== 'top');
    const showSwipe = el.swipeIndicator.visible && (positionTop ? el.swipeIndicator.position === 'top' : el.swipeIndicator.position !== 'top');
    if (!showFooter && !showSwipe) return null;

    const footerText = showFooter ? resolveFooterText(el.footer as FooterConfig, data) : null;
    const swipe = el.swipeIndicator as SwipeIndicatorConfig;
    const arrowStyle = swipe.arrowStyle || 'text';
    const swipeColor = swipe.color || data.colorPrimary;
    const swipeOpacity = swipe.opacity ?? 0.5;

    return (
      <div
        style={{
          margin: `0 ${pad}px`,
          paddingTop: positionTop ? `${Math.round(h * 0.025)}px` : 0,
          paddingBottom: positionTop ? `${Math.round(h * 0.012)}px` : `${Math.round(h * 0.04)}px`,
          marginTop: positionTop ? 0 : 'auto',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {showFooter && footerText ? (
          <div
            style={{
              fontFamily: `${el.footer.fontFamily || data.fontBody}, serif`,
              color: el.footer.color || data.colorPrimary,
              fontSize: `${el.footer.fontSize || 22}px`,
              fontStyle: el.footer.fontStyle || 'italic',
              fontWeight: el.footer.fontWeight ?? 400,
              letterSpacing: el.footer.letterSpacing != null ? `${el.footer.letterSpacing}em` : undefined,
              opacity: 0.75,
              textAlign: alignToText(el.footer.alignment),
              flex: '1 1 auto',
            }}
          >
            {footerText}
          </div>
        ) : <div />}

        {showSwipe && (
          <div
            style={{
              fontFamily: swipe.fontFamily || 'monospace',
              color: swipeColor,
              fontSize: `${swipe.fontSize || 22}px`,
              letterSpacing: `${swipe.letterSpacing ?? 0.15}em`,
              fontWeight: swipe.fontWeight ?? 400,
              opacity: swipeOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: showFooter ? undefined : 'auto',
            }}
          >
            {arrowStyle === 'text' || arrowStyle === 'none'
              ? (swipe.text || 'Swipe →')
              : (
                <>
                  {swipe.text && <span>{swipe.text}</span>}
                  <SwipeArrow style={arrowStyle} size={swipe.fontSize || 22} color={swipeColor} />
                </>
              )
            }
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        backgroundColor: data.colorSecondary,
        fontFamily: `${data.fontBody}, serif`,
        overflow: 'hidden',
      }}
    >
      {renderHeader(true)}
      {footerAtTop && renderFooterRow(true)}

      {/* Hero Photo */}
      <div className="relative" style={{ margin: `0 ${pad}px`, height: `${heroHeight}px` }}>
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#d4cfc4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: data.colorPrimary, fontSize: '20px', opacity: 0.6 }}>
              Upload a photo
            </span>
          </div>
        )}
      </div>

      {/* Headline */}
      {el.headline.visible && (
        <div
          style={{
            margin: `${Math.round(h * 0.025)}px ${pad}px 0`,
            fontFamily: `${el.headline.fontFamily || data.fontHeading}, serif`,
            color: el.headline.color || data.colorPrimary,
            fontSize: `${el.headline.fontSize || 88}px`,
            lineHeight: String(el.headline.lineHeight ?? 1.1),
            fontWeight: el.headline.fontWeight ?? 900,
            fontStyle: el.headline.fontStyle || 'normal',
            textTransform: 'uppercase',
            letterSpacing: `${el.headline.letterSpacing ?? 0.02}em`,
            textAlign: alignToText(el.headline.alignment),
          }}
        >
          {data.headline || 'Your Headline Here'}
        </div>
      )}

      {/* Body */}
      {el.body.visible && (
        <div
          style={{
            margin: `${Math.round(h * 0.018)}px ${pad}px 0`,
            fontFamily: `${el.body.fontFamily || data.fontBody}, serif`,
            color: el.body.color || data.colorPrimary,
            fontSize: `${el.body.fontSize || 32}px`,
            lineHeight: String(el.body.lineHeight ?? 1.5),
            fontStyle: el.body.fontStyle || 'italic',
            fontWeight: el.body.fontWeight ?? 400,
            letterSpacing: el.body.letterSpacing != null ? `${el.body.letterSpacing}em` : undefined,
            opacity: 0.85,
            textAlign: alignToText(el.body.alignment),
          }}
        >
          {data.bodyText || 'Your body text will appear here.'}
        </div>
      )}

      {renderHeader(false)}
      {!footerAtTop && renderFooterRow(false)}
    </div>
  );
}
