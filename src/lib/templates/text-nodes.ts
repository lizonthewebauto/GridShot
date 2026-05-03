import type { ElementConfig } from '@/types';

export interface TextNode {
  /** Stable key used to read overrides from `data.elementOverrides[key]`. */
  key: string;
  /** Human-readable label shown in the editor. */
  label: string;
  /** Field on `TemplateData` that supplies the default text content. */
  contentSource?: 'headline' | 'bodyText' | 'tagline' | 'dateText' | 'locationText' | 'customText' | 'customText2' | 'customText3' | 'brandName';
  /** Default styling — used if no override is set. Must match what the template renders today. */
  defaultElement: Partial<ElementConfig>;
  /** Optional max length hint for the editor. */
  maxLength?: number;
}

export type TextNodeManifest = readonly TextNode[];

/**
 * Per-template declaration of editable text nodes.
 *
 * Each template that wants generic editor support adds an entry keyed by its
 * registry slug. The shared <TextNode /> helper merges these defaults with any
 * per-slide overrides from `data.elementOverrides[key]`.
 *
 * Editorial Pro intentionally has no entry — it uses its own `SlideElements`
 * structure and bespoke editor.
 */
export const TEXT_NODES: Record<string, TextNodeManifest> = {
  'polaroid-stack': [
    {
      key: 'caption',
      label: 'Polaroid caption',
      contentSource: 'tagline',
      defaultElement: {
        fontFamily: 'Caveat',
        fontWeight: 400,
        color: '#2b2b2b',
        alignment: 'center',
        lineHeight: 1,
      },
      maxLength: 40,
    },
    {
      key: 'headline',
      label: 'Outside headline',
      contentSource: 'headline',
      defaultElement: {
        fontFamily: 'Caveat',
        fontWeight: 500,
        alignment: 'center',
        lineHeight: 1.1,
      },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: {
        fontFamily: 'Inter',
        fontWeight: 400,
        alignment: 'center',
        lineHeight: 1.5,
      },
    },
  ],

  'magazine-cover': [
    {
      key: 'issue',
      label: 'Issue kicker',
      contentSource: 'customText',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, alignment: 'center', letterSpacing: 0.4, color: '#ffffff' },
    },
    {
      key: 'masthead',
      label: 'Masthead',
      contentSource: 'brandName',
      defaultElement: { fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', alignment: 'center', lineHeight: 0.95, letterSpacing: -0.03, color: '#ffffff' },
    },
    {
      key: 'chip',
      label: 'Chip / season',
      contentSource: 'customText3',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, letterSpacing: 0.3, color: '#ffffff' },
    },
    {
      key: 'coverline',
      label: 'Cover line',
      contentSource: 'headline',
      defaultElement: { fontFamily: 'Playfair Display', fontWeight: 900, alignment: 'left', lineHeight: 0.92, letterSpacing: -0.03, color: '#ffffff' },
    },
    {
      key: 'tagline',
      label: 'Block tagline',
      contentSource: 'tagline',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, letterSpacing: 0.3 },
    },
    {
      key: 'subhead',
      label: 'Block body',
      contentSource: 'bodyText',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.4 },
    },
  ],

  'quote-card': [
    {
      key: 'quote',
      label: 'Quote',
      contentSource: 'bodyText',
      defaultElement: { fontFamily: 'Playfair Display', fontStyle: 'italic', alignment: 'center', lineHeight: 1.35 },
    },
    {
      key: 'attribution',
      label: 'Attribution (and date)',
      contentSource: 'tagline',
      defaultElement: { fontFamily: 'Inter', fontWeight: 500, alignment: 'center', letterSpacing: 0.3 },
    },
  ],

  'bold-showcase': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 900, alignment: 'left', lineHeight: 0.95 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.4 },
    },
  ],

  'minimal-centered': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'center', lineHeight: 1.1 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.5 },
    },
  ],

  'apple-note': [
    {
      key: 'headline',
      label: 'Note title',
      contentSource: 'headline',
      defaultElement: { fontWeight: 800, alignment: 'left', lineHeight: 1.1 },
    },
    {
      key: 'date',
      label: 'Meta / date',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'left' },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.45 },
    },
  ],

  'cinematic-overlay': [
    {
      key: 'reviewCount',
      label: 'Review count',
      defaultElement: { fontWeight: 400, alignment: 'right' },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.1 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
  ],

  'cinematic-fade': [
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.05 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.4 },
    },
  ],

  'editorial-elegant': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.1 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
    {
      key: 'reviewCount',
      label: 'Review count',
      defaultElement: { fontWeight: 400, alignment: 'left' },
    },
  ],

  'editorial-fullbleed': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'center', lineHeight: 1.02, letterSpacing: -0.02 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.5, letterSpacing: 0.02 },
    },
  ],

  'fullbleed-overlay': [
    {
      key: 'tagline',
      label: 'Eyebrow',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.35 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 800, alignment: 'left', lineHeight: 1, letterSpacing: -0.02 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
  ],

  'duotone-wash': [
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 700, alignment: 'left', lineHeight: 1.05 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
  ],

  'luxury-gold': [
    {
      key: 'brandName',
      label: 'Brand wordmark',
      contentSource: 'brandName',
      defaultElement: { fontStyle: 'italic', fontWeight: 400, alignment: 'center', lineHeight: 1 },
    },
    {
      key: 'date',
      label: 'Est. date',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.5 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 400, alignment: 'center', lineHeight: 1.1 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
  ],

  'risograph': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 900, alignment: 'center', lineHeight: 0.95, letterSpacing: -0.01 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.4 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.45 },
    },
  ],

  'split-story': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.3 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
    {
      key: 'reviewTagline',
      label: 'Review tagline',
      defaultElement: { fontWeight: 400, alignment: 'left' },
    },
  ],

  'minimal-frame': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 300, alignment: 'center', lineHeight: 1.2, letterSpacing: -0.01 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.6 },
    },
  ],

  'split-half': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'left', lineHeight: 1.08 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.28 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.55 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.25 },
    },
  ],

  'typographic-hero': [
    {
      key: 'giantWord',
      label: 'Giant word',
      defaultElement: { fontStyle: 'italic', fontWeight: 700, alignment: 'center', lineHeight: 0.9, letterSpacing: -0.03 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'subhead',
      label: 'Sub-headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 500, alignment: 'left', lineHeight: 1.25 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.4 },
    },
  ],

  'circle-gold': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 600, alignment: 'center', lineHeight: 1.1, letterSpacing: -0.015 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 500, alignment: 'center', letterSpacing: 0.4 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.5 },
    },
  ],

  'minimal-centered-shape': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'center', lineHeight: 1.1, letterSpacing: -0.01 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.5 },
    },
  ],

  'testimonial-card': [
    {
      key: 'quote',
      label: 'Quote',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 500, alignment: 'left', lineHeight: 1.35, letterSpacing: -0.005 },
    },
    {
      key: 'attribution',
      label: 'Attribution',
      contentSource: 'headline',
      defaultElement: { fontWeight: 600, alignment: 'left' },
    },
    {
      key: 'reviewMeta',
      label: 'Review meta',
      defaultElement: { fontWeight: 400, alignment: 'left' },
    },
  ],

  'oversized-italic': [
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.4 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'left', lineHeight: 0.95 },
    },
    {
      key: 'meta',
      label: 'Date / location',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
  ],

  'stacked-letterforms': [
    {
      key: 'headline',
      label: 'Headline (split into 3 stacked words)',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 700, alignment: 'left', lineHeight: 0.92 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'right', letterSpacing: 0.35 },
    },
  ],

  'grid-2x2': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 600, alignment: 'center', lineHeight: 1.1, letterSpacing: -0.02 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
  ],

  'triptych-strip': [
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'center', lineHeight: 1.05, letterSpacing: -0.02 },
    },
  ],

  'film-strip': [
    {
      key: 'filmLabel',
      label: 'Film label',
      contentSource: 'customText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'center', lineHeight: 1.15, letterSpacing: 0.06 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'center', lineHeight: 1.6 },
    },
  ],

  'split-portfolio': [
    {
      key: 'kicker',
      label: 'Kicker (PORTFOLIO)',
      defaultElement: { fontWeight: 400, alignment: 'left', letterSpacing: 0.4 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.05, letterSpacing: -0.01 },
    },
    {
      key: 'body',
      label: 'Body',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.6 },
    },
  ],

  'polaroid-realistic': [
    {
      key: 'caption',
      label: 'Polaroid caption',
      contentSource: 'tagline',
      defaultElement: { fontFamily: 'Caveat', fontWeight: 400, alignment: 'center', lineHeight: 1.1 },
    },
  ],

  'scrapbook-realistic': [
    {
      key: 'headline',
      label: 'Headline (handwritten)',
      contentSource: 'headline',
      defaultElement: { fontFamily: 'Caveat', fontWeight: 400, alignment: 'left', lineHeight: 1 },
    },
    {
      key: 'caption',
      label: 'Caption (handwritten)',
      defaultElement: { fontFamily: 'Caveat', fontWeight: 400, alignment: 'right', lineHeight: 1.2 },
    },
    {
      key: 'tagline',
      label: 'Date / tagline',
      contentSource: 'tagline',
      defaultElement: { fontFamily: 'Caveat', fontWeight: 400, alignment: 'left' },
    },
  ],

  'sidebar-index': [
    {
      key: 'index',
      label: 'Index label',
      contentSource: 'customText',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'brandName',
      label: 'Brand name',
      contentSource: 'brandName',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.05 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontFamily: 'Inter', fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'caption',
      label: 'Photo caption',
      contentSource: 'tagline',
      defaultElement: { fontStyle: 'italic', fontWeight: 400, alignment: 'left', lineHeight: 1.2 },
    },
  ],

  'geometric-blocks': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'left', lineHeight: 1.1 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'right', letterSpacing: 0.3 },
    },
  ],

  'collage-offset': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'center', lineHeight: 1.05 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
  ],

  'photobooth-strip': [
    {
      key: 'headline',
      label: 'Vertical headline',
      contentSource: 'headline',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'left', letterSpacing: 0.3 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'right', letterSpacing: 0.3 },
    },
    {
      key: 'tagline',
      label: 'Vertical tagline',
      contentSource: 'tagline',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'right', letterSpacing: 0.3 },
    },
    {
      key: 'location',
      label: 'Location',
      contentSource: 'locationText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'right', letterSpacing: 0.3 },
    },
  ],

  'blueprint-grid': [
    {
      key: 'projectId',
      label: 'Project ID',
      contentSource: 'customText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'center', letterSpacing: 0.25 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'right', letterSpacing: 0.25 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontFamily: 'monospace', fontWeight: 700, alignment: 'left', lineHeight: 1.1, letterSpacing: 0.08 },
    },
    {
      key: 'spec',
      label: 'Spec line',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'center', letterSpacing: 0.25 },
    },
  ],

  'newspaper': [
    {
      key: 'kicker',
      label: 'Kicker (above masthead)',
      contentSource: 'customText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
    {
      key: 'masthead',
      label: 'Masthead (brand)',
      contentSource: 'brandName',
      defaultElement: { fontWeight: 900, alignment: 'center', lineHeight: 1, letterSpacing: 0.04 },
    },
    {
      key: 'date',
      label: 'Date / volume',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.25 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 800, alignment: 'center', lineHeight: 1.02 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.28 },
    },
    {
      key: 'caption',
      label: 'Photo caption',
      contentSource: 'locationText',
      defaultElement: { fontStyle: 'italic', fontWeight: 400, alignment: 'center' },
    },
    {
      key: 'body',
      label: 'Body (2-column)',
      contentSource: 'bodyText',
      defaultElement: { fontWeight: 400, alignment: 'left', lineHeight: 1.5 },
    },
  ],

  'baseball-card': [
    {
      key: 'brandName',
      label: 'Player name (brand)',
      contentSource: 'brandName',
      defaultElement: { fontWeight: 700, alignment: 'center', lineHeight: 1.1, letterSpacing: 0.04 },
    },
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
  ],

  'boarding-pass': [
    {
      key: 'brandName',
      label: 'Passenger name',
      contentSource: 'brandName',
      defaultElement: { fontFamily: 'monospace', fontWeight: 700, alignment: 'left', lineHeight: 1.1, letterSpacing: 0.04 },
    },
    {
      key: 'flightNo',
      label: 'Flight number',
      contentSource: 'customText3',
      defaultElement: { fontFamily: 'monospace', fontWeight: 400, alignment: 'right', letterSpacing: 0.3 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 700, alignment: 'right', letterSpacing: 0.25 },
    },
    {
      key: 'gate',
      label: 'Gate',
      contentSource: 'locationText',
      defaultElement: { fontFamily: 'monospace', fontWeight: 700, alignment: 'center', letterSpacing: 0.25 },
    },
  ],

  'art-deco-fan': [
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 700, alignment: 'center', lineHeight: 0.95, letterSpacing: 0.02 },
    },
    {
      key: 'date',
      label: 'Date / tagline',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.5 },
    },
  ],

  'wax-seal-invite': [
    {
      key: 'tagline',
      label: 'Tagline',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.4 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontStyle: 'italic', fontWeight: 500, alignment: 'center', lineHeight: 1.05 },
    },
    {
      key: 'date',
      label: 'Date',
      contentSource: 'dateText',
      defaultElement: { fontWeight: 400, alignment: 'center', letterSpacing: 0.35 },
    },
  ],

  'memphis-zine': [
    {
      key: 'tagline',
      label: 'Tagline banner',
      contentSource: 'tagline',
      defaultElement: { fontWeight: 800, alignment: 'left', letterSpacing: 0.25 },
    },
    {
      key: 'headline',
      label: 'Headline',
      contentSource: 'headline',
      defaultElement: { fontWeight: 900, alignment: 'left', lineHeight: 0.95, letterSpacing: -0.02 },
    },
  ],
};

export function getTextNodes(slug: string): TextNodeManifest {
  return TEXT_NODES[slug] ?? [];
}
