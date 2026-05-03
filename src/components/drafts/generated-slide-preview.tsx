'use client';

import type { CSSProperties } from 'react';

import { resolveGeneratedSlideMetadata } from '@/lib/generated-content/selection';
import type { Brand, DraftPostSlide, GeneratedLayoutFamily, SlideElements } from '@/types';

interface GeneratedSlidePreviewProps {
  brand: Brand;
  slide: DraftPostSlide;
  layoutFamily: GeneratedLayoutFamily;
  footerText?: string | null;
  showSwipe?: boolean;
  width?: number;
  height?: number;
}

function getLayoutTextAlign(layoutFamily: GeneratedLayoutFamily): CSSProperties['textAlign'] {
  return layoutFamily === 'center-center' ? 'center' : 'left';
}

function justifyFromAlignment(alignment: CSSProperties['textAlign'] | undefined): CSSProperties['justifyContent'] {
  if (alignment === 'right') return 'flex-end';
  if (alignment === 'center') return 'center';
  return 'flex-start';
}

function marginFromAlignment(alignment: CSSProperties['textAlign'] | undefined) {
  return alignment === 'center' ? 'auto' : undefined;
}

function resolveFooterText(
  footer: SlideElements['footer'],
  brand: Brand,
  fallbackFooter?: string | null,
) {
  switch (footer.textSource) {
    case 'brand-name':
      return brand.name;
    case 'website':
      return brand.website_url || fallbackFooter || '';
    case 'handle':
      return brand.instagram_handle || fallbackFooter || '';
    case 'tagline':
      return brand.tagline || brand.website_tagline || fallbackFooter || '';
    case 'custom':
      return footer.text || fallbackFooter || '';
    case 'review':
    default:
      return fallbackFooter || brand.review_tagline || brand.website_tagline || brand.tagline || '';
  }
}

export function GeneratedSlidePreview({
  brand,
  slide,
  layoutFamily,
  footerText,
  showSwipe,
  width = 1080,
  height = 1350,
}: GeneratedSlidePreviewProps) {
  const layoutTextAlign = getLayoutTextAlign(layoutFamily);
  const accent = brand.color_accent || brand.color_primary || '#668899';
  const background = brand.color_secondary || brand.color_background || '#F6F5F4';
  const textColor = brand.color_text || brand.color_primary || '#111111';
  const metadata = resolveGeneratedSlideMetadata({
    layoutFamily,
    metadata: slide.metadata,
    defaultShowSwipe: Boolean(showSwipe),
  });
  const header = metadata.elements.header;
  const headline = metadata.elements.headline;
  const body = metadata.elements.body;
  const footer = metadata.elements.footer;
  const swipe = metadata.elements.swipeIndicator;
  const footerResolved = resolveFooterText(footer, brand, footerText);
  const mediaJustify = justifyFromAlignment(metadata.image.alignment);
  const headlineAlign = headline.alignment || layoutTextAlign;
  const bodyAlign = body.alignment || headlineAlign;
  const footerAlign = footer.alignment || layoutTextAlign;
  const swipeAlign = swipe.alignment || 'right';

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: background,
        color: textColor,
        display: 'grid',
        gridTemplateRows: `${Math.round(height * 0.1)}px ${Math.round(height * 0.42)}px 1fr ${Math.round(height * 0.1)}px`,
        overflow: 'hidden',
        padding: `${Math.round(width * 0.035)}px ${Math.round(width * 0.05)}px`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: justifyFromAlignment(header.alignment || 'center'),
          textTransform: 'uppercase',
          letterSpacing: `${header.letterSpacing ?? 0.12}em`,
          fontFamily: header.fontFamily || brand.font_heading,
          color: header.color || accent,
          fontSize: `${header.fontSize ?? Math.max(18, Math.round(width * 0.028))}px`,
          textAlign: header.alignment || 'center',
          fontWeight: header.fontWeight ?? 400,
          fontStyle: header.fontStyle || 'normal',
          opacity: header.visible ? 1 : 0,
        }}
      >
        {header.visible ? header.text || brand.name : ''}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: mediaJustify,
          width: '100%',
        }}
      >
        <div
          style={{
            width: `${metadata.image.widthPercent}%`,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: mediaJustify,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.photo_url || ''}
            alt=""
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              boxShadow: '0 22px 52px rgba(17,17,17,0.12)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: `${Math.round(height * 0.045)}px`,
          textAlign: headlineAlign,
        }}
      >
        <div
          style={{
            width: `${Math.round(width * 0.1)}px`,
            height: '3px',
            backgroundColor: accent,
            marginInline: marginFromAlignment(headlineAlign),
            marginBottom: `${Math.round(height * 0.018)}px`,
            opacity: headline.visible ? 1 : 0,
          }}
        />
        {headline.visible ? (
          <h2
            style={{
              margin: 0,
              maxWidth: headlineAlign === 'center' ? '76%' : '74%',
              fontFamily: headline.fontFamily || brand.font_heading,
              fontSize: `${headline.fontSize ?? Math.max(34, Math.round(width * 0.066))}px`,
              lineHeight: headline.lineHeight ?? 0.95,
              marginInline: marginFromAlignment(headlineAlign),
              fontWeight: headline.fontWeight ?? 700,
              fontStyle: headline.fontStyle || 'normal',
              letterSpacing: headline.letterSpacing ? `${headline.letterSpacing}em` : undefined,
              color: headline.color || textColor,
              textAlign: headlineAlign,
            }}
          >
            {slide.headline}
          </h2>
        ) : null}
        {body.visible ? (
          <p
            style={{
              margin: `${Math.round(height * 0.02)}px 0 0`,
              maxWidth: bodyAlign === 'center' ? '60%' : '58%',
              fontFamily: body.fontFamily || brand.font_body,
              fontSize: `${body.fontSize ?? Math.max(18, Math.round(width * 0.028))}px`,
              lineHeight: body.lineHeight ?? 1.28,
              marginInline: marginFromAlignment(bodyAlign),
              fontWeight: body.fontWeight ?? 400,
              fontStyle: body.fontStyle || 'normal',
              letterSpacing: body.letterSpacing ? `${body.letterSpacing}em` : undefined,
              color: body.color || textColor,
              textAlign: bodyAlign,
            }}
          >
            {slide.body_text}
          </p>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '18px',
          fontFamily: brand.font_body,
          fontSize: `${Math.max(12, Math.round(width * 0.015))}px`,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(17, 17, 17, 0.6)',
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: footerAlign,
            fontFamily: footer.fontFamily || brand.font_body,
            fontSize: `${footer.fontSize ?? Math.max(12, Math.round(width * 0.015))}px`,
            fontWeight: footer.fontWeight ?? 400,
            fontStyle: footer.fontStyle || 'normal',
            letterSpacing: `${footer.letterSpacing ?? 0.16}em`,
            color: footer.color || 'rgba(17, 17, 17, 0.6)',
            opacity: footer.visible ? 1 : 0,
          }}
        >
          {footer.visible ? footerResolved : ''}
        </div>
        {metadata.showSwipeArrow && swipe.visible ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: justifyFromAlignment(swipeAlign),
              gap: '10px',
              color: swipe.color || accent,
              fontWeight: swipe.fontWeight ?? 700,
              fontFamily: swipe.fontFamily || brand.font_body,
              fontSize: `${swipe.fontSize ?? Math.max(12, Math.round(width * 0.015))}px`,
              letterSpacing: `${swipe.letterSpacing ?? 0.16}em`,
              opacity: swipe.opacity ?? 1,
              flex: 1,
            }}
          >
            <span>{swipe.text || 'Swipe'}</span>
            {swipe.arrowStyle !== 'none' ? <span aria-hidden="true">→</span> : null}
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>
    </div>
  );
}
