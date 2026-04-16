import type { ComponentType } from 'react';
import type { TemplateData } from '@/types';
import { EditorialPro } from '@/components/templates/editorial-pro';
import { EditorialElegant } from '@/components/templates/editorial-elegant';
import { BoldShowcase } from '@/components/templates/bold-showcase';
import { MinimalCentered } from '@/components/templates/minimal-centered';
import { SplitStory } from '@/components/templates/split-story';
import { CinematicOverlay } from '@/components/templates/cinematic-overlay';
import { PhotoOnly } from '@/components/templates/photo-only';
import { MagazineCover } from '@/components/templates/magazine-cover';
import { MinimalFrame } from '@/components/templates/minimal-frame';
import { PolaroidStack } from '@/components/templates/polaroid-stack';
import { FullbleedOverlay } from '@/components/templates/fullbleed-overlay';
import { SplitPortfolio } from '@/components/templates/split-portfolio';
import { FilmStrip } from '@/components/templates/film-strip';
import { TestimonialCard } from '@/components/templates/testimonial-card';
import { CinematicFade } from '@/components/templates/cinematic-fade';
import { EditorialFullbleed } from '@/components/templates/editorial-fullbleed';
import { PolaroidRealistic } from '@/components/templates/polaroid-realistic';
import { TriptychStrip } from '@/components/templates/triptych-strip';
import { Grid2x2 } from '@/components/templates/grid-2x2';
import { MinimalCenteredShape } from '@/components/templates/minimal-centered-shape';
import { CircleGold } from '@/components/templates/circle-gold';
import { DuotoneWash } from '@/components/templates/duotone-wash';
import { SplitHalf } from '@/components/templates/split-half';
import { TypographicHero } from '@/components/templates/typographic-hero';
import { ScrapbookRealistic } from '@/components/templates/scrapbook-realistic';
import { Newspaper } from '@/components/templates/newspaper';
import { Risograph } from '@/components/templates/risograph';
import { LuxuryGold } from '@/components/templates/luxury-gold';
import { QuoteCard } from '@/components/templates/quote-card';
import { GeometricBlocks } from '@/components/templates/geometric-blocks';
import { CollageOffset } from '@/components/templates/collage-offset';
import { StackedLetterforms } from '@/components/templates/stacked-letterforms';
import { OversizedItalic } from '@/components/templates/oversized-italic';
import { SidebarIndex } from '@/components/templates/sidebar-index';
import { BaseballCard } from '@/components/templates/baseball-card';
import { WaxSealInvite } from '@/components/templates/wax-seal-invite';
import { BlueprintGrid } from '@/components/templates/blueprint-grid';
import { PhotoboothStrip } from '@/components/templates/photobooth-strip';
import { ArtDecoFan } from '@/components/templates/art-deco-fan';
import { BoardingPass } from '@/components/templates/boarding-pass';
import { MemphisZine } from '@/components/templates/memphis-zine';
import { AppleNote } from '@/components/templates/apple-note';

export type TemplateComponent = ComponentType<{ data: TemplateData }>;

export const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  'editorial-pro': EditorialPro,
  'editorial-elegant': EditorialElegant,
  'bold-showcase': BoldShowcase,
  'minimal-centered': MinimalCentered,
  'split-story': SplitStory,
  'cinematic-overlay': CinematicOverlay,
  'photo-only': PhotoOnly,
  'magazine-cover': MagazineCover,
  'minimal-frame': MinimalFrame,
  'polaroid-stack': PolaroidStack,
  'fullbleed-overlay': FullbleedOverlay,
  'split-portfolio': SplitPortfolio,
  'film-strip': FilmStrip,
  'testimonial-card': TestimonialCard,
  'cinematic-fade': CinematicFade,
  'editorial-fullbleed': EditorialFullbleed,
  'polaroid-realistic': PolaroidRealistic,
  'triptych-strip': TriptychStrip,
  'grid-2x2': Grid2x2,
  'minimal-centered-shape': MinimalCenteredShape,
  'circle-gold': CircleGold,
  'duotone-wash': DuotoneWash,
  'split-half': SplitHalf,
  'typographic-hero': TypographicHero,
  'scrapbook-realistic': ScrapbookRealistic,
  newspaper: Newspaper,
  risograph: Risograph,
  'luxury-gold': LuxuryGold,
  'quote-card': QuoteCard,
  'geometric-blocks': GeometricBlocks,
  'collage-offset': CollageOffset,
  'stacked-letterforms': StackedLetterforms,
  'oversized-italic': OversizedItalic,
  'sidebar-index': SidebarIndex,
  'baseball-card': BaseballCard,
  'wax-seal-invite': WaxSealInvite,
  'blueprint-grid': BlueprintGrid,
  'photobooth-strip': PhotoboothStrip,
  'art-deco-fan': ArtDecoFan,
  'boarding-pass': BoardingPass,
  'memphis-zine': MemphisZine,
  'apple-note': AppleNote,
};

// Fonts referenced by templates — preload via Google Fonts so previews render correctly.
export const TEMPLATE_FONT_URL =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900',
    'family=DM+Serif+Display:ital@0;1',
    'family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700',
    'family=Libre+Baskerville:ital,wght@0,400;0,700;1,400',
    'family=Bitter:ital,wght@0,300;0,400;0,700;1,400',
    'family=Montserrat:wght@100;400;700;900',
    'family=Oswald:wght@400;700',
    'family=Bebas+Neue',
    'family=Courier+Prime:ital,wght@0,400;0,700;1,400',
    'family=Inter:wght@300;400;500;700;900',
    'family=Caveat:wght@400;700',
    'family=Dancing+Script:wght@400;700',
    'family=Shadows+Into+Light',
    'family=Homemade+Apple',
    'family=Kalam:wght@300;400;700',
    'family=Indie+Flower',
    'family=Patrick+Hand',
    'family=Architects+Daughter',
    'family=Permanent+Marker',
    'family=Amatic+SC:wght@400;700',
    'family=Gochi+Hand',
    'family=Lora:wght@400;500;700',
    'family=DM+Sans:wght@400;500;700',
  ].join('&') +
  '&display=swap';
