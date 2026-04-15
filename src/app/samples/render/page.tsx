import type { ComponentType } from 'react';
import type { TemplateData } from '@/types';
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

// Per-creator fonts — deliberately varied to show typographic range
interface Creator {
  slug: string;
  brandName: string;
  colors: { primary: string; secondary: string; accent: string };
  fontHeading: string;
  fontBody: string;
  headline: string;
  bodyText: string;
  photoUrl: string;
  photos?: string[];
  tagline?: string;
}

// Canvas: 1080×1440 (3:4). Every template renders at this uniform size.
// Templates are now fully canvas-responsive so the same size works across all.
const CANVAS_W = 1080;
const CANVAS_H = 1440;

type TemplateComponent = ComponentType<{ data: TemplateData }>;

interface TemplateDef {
  slug: string;
  component: TemplateComponent;
}

const TEMPLATES: TemplateDef[] = [
  { slug: 'editorial-elegant', component: EditorialElegant },
  { slug: 'bold-showcase', component: BoldShowcase },
  { slug: 'minimal-centered', component: MinimalCentered },
  { slug: 'split-story', component: SplitStory },
  { slug: 'cinematic-overlay', component: CinematicOverlay },
  { slug: 'photo-only', component: PhotoOnly },
  { slug: 'magazine-cover', component: MagazineCover },
  { slug: 'minimal-frame', component: MinimalFrame },
  { slug: 'polaroid-stack', component: PolaroidStack },
  { slug: 'fullbleed-overlay', component: FullbleedOverlay },
  { slug: 'split-portfolio', component: SplitPortfolio },
  { slug: 'film-strip', component: FilmStrip },
  { slug: 'testimonial-card', component: TestimonialCard },
  { slug: 'cinematic-fade', component: CinematicFade },
  { slug: 'editorial-fullbleed', component: EditorialFullbleed },
  { slug: 'polaroid-realistic', component: PolaroidRealistic },
  { slug: 'triptych-strip', component: TriptychStrip },
  { slug: 'grid-2x2', component: Grid2x2 },
  { slug: 'minimal-centered-shape', component: MinimalCenteredShape },
  { slug: 'circle-gold', component: CircleGold },
  { slug: 'duotone-wash', component: DuotoneWash },
  { slug: 'split-half', component: SplitHalf },
  { slug: 'typographic-hero', component: TypographicHero },
  { slug: 'scrapbook-realistic', component: ScrapbookRealistic },
  { slug: 'newspaper', component: Newspaper },
  { slug: 'risograph', component: Risograph },
  { slug: 'luxury-gold', component: LuxuryGold },
  { slug: 'quote-card', component: QuoteCard },
  { slug: 'geometric-blocks', component: GeometricBlocks },
  { slug: 'collage-offset', component: CollageOffset },
  { slug: 'stacked-letterforms', component: StackedLetterforms },
  { slug: 'oversized-italic', component: OversizedItalic },
  { slug: 'sidebar-index', component: SidebarIndex },
  { slug: 'baseball-card', component: BaseballCard },
  { slug: 'wax-seal-invite', component: WaxSealInvite },
  { slug: 'blueprint-grid', component: BlueprintGrid },
  { slug: 'photobooth-strip', component: PhotoboothStrip },
  { slug: 'art-deco-fan', component: ArtDecoFan },
  { slug: 'boarding-pass', component: BoardingPass },
  { slug: 'memphis-zine', component: MemphisZine },
  { slug: 'apple-note', component: AppleNote },
];

const CREATORS: Creator[] = [
  {
    slug: 'wedding',
    brandName: 'Sarah Lane',
    colors: { primary: '#1a1520', secondary: '#f5efe8', accent: '#c08a4a' },
    fontHeading: 'Playfair Display',
    fontBody: 'DM Sans',
    headline: 'A LOVE STORY TOLD IN LIGHT',
    bodyText: 'Sarah and James said their vows at a sunset vineyard. We were there for every laugh, every tear, and every quiet look. You get a full wedding album plus a highlight reel for sharing.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Wedding photography in California',
  },
  {
    slug: 'portrait',
    brandName: 'Mira Studios',
    colors: { primary: '#1e1b18', secondary: '#f7f4ef', accent: '#8b6914' },
    fontHeading: 'DM Serif Display',
    fontBody: 'Inter',
    headline: 'THE CONFIDENCE SESSION',
    bodyText: 'This is a fun 90 minute portrait shoot made to help you love how you look on camera. We handle the styling, the posing, and the editing. You walk away with 40 retouched photos ready to use.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Personal brand portraits',
  },
  {
    slug: 'realestate',
    brandName: 'Apex Visuals',
    colors: { primary: '#0f1712', secondary: '#fafafa', accent: '#3a5a3a' },
    fontHeading: 'Montserrat',
    fontBody: 'Inter',
    headline: 'JUST LISTED IN WEST AUSTIN',
    bodyText: 'A modern farmhouse with 4 bedrooms, 3 bathrooms, and 2,400 square feet of living space. High ceilings, a chef kitchen, and a big backyard with old oak trees. Open house this Saturday.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Austin real estate listing',
  },
  {
    slug: 'food',
    brandName: 'Savory & Co',
    colors: { primary: '#f4ebd5', secondary: '#1f1a10', accent: '#d38a42' },
    fontHeading: 'Cormorant Garamond',
    fontBody: 'DM Sans',
    headline: 'FARM TO FRAME',
    bodyText: 'We spent a day in the kitchen with Chef Mira. Every ingredient comes from farms within 50 miles. Every plate looks as good as it tastes. Book your shoot now for your menu or website.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Restaurant food photography',
  },
  {
    slug: 'event',
    brandName: 'Flash Collective',
    colors: { primary: '#0a0a0a', secondary: '#ffffff', accent: '#e04220' },
    fontHeading: 'Oswald',
    fontBody: 'DM Sans',
    headline: 'SXSW 2026 AFTERMATH',
    bodyText: 'Three days. Fourteen stages. Four thousand photos. We were front row, backstage, and in the crowd for every big moment. Hire us for your next concert, launch, or conference.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Event and concert photography',
  },
  {
    slug: 'travel',
    brandName: 'Atlas Journal',
    colors: { primary: '#132418', secondary: '#ece8d8', accent: '#6a7a52' },
    fontHeading: 'Libre Baskerville',
    fontBody: 'DM Sans',
    headline: 'KYOTO, 5:47 AM',
    bodyText: 'The temple opens before the rest of the city wakes up. Just the monks, the mist, and the sound of raked gravel. New prints from this Japan trip are now in the shop.',
    photoUrl: '/samples/wedding-couple.jpg',
    photos: ['/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg', '/samples/wedding-couple.jpg'],
    tagline: 'Travel photography prints',
  },
];

function buildData(creator: Creator): TemplateData {
  return {
    brandName: creator.brandName,
    photoUrl: creator.photoUrl,
    headline: creator.headline,
    bodyText: creator.bodyText,
    reviewCount: '5.0',
    reviewTagline: 'from 247 happy clients',
    colorPrimary: creator.colors.primary,
    colorSecondary: creator.colors.secondary,
    colorAccent: creator.colors.accent,
    fontHeading: creator.fontHeading,
    fontBody: creator.fontBody,
    width: CANVAS_W,
    height: CANVAS_H,
    photos: creator.photos,
    tagline: creator.tagline,
    dateText: 'March 2026',
    locationText: 'California',
    customText: 'Issue 01',
    customText2: 'No. 47',
    customText3: 'Vol. III',
    brandPosition: 'bottom-left',
  };
}

// All template fonts needed for accurate rendering before puppeteer screenshots.
const RENDER_FONT_URL =
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
  ].join('&') +
  '&display=swap';

export default function SamplesRenderPage() {
  return (
    <div className="bg-neutral-900 min-h-screen p-8">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={RENDER_FONT_URL} />
      <h1 className="text-white text-3xl font-bold mb-2">Sample Slides Render</h1>
      <p className="text-neutral-400 mb-10">
        {CREATORS.length * TEMPLATES.length} slides — {CREATORS.length} creators × {TEMPLATES.length} templates @ {CANVAS_W}×{CANVAS_H}.
      </p>

      {CREATORS.map((creator) => {
        const data = buildData(creator);
        return (
          <div key={creator.slug} className="mb-16">
            <h2 className="text-white text-xl font-semibold mb-4">
              {creator.brandName} ({creator.slug})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {TEMPLATES.map((tpl) => {
                const Template = tpl.component;
                return (
                  <div
                    key={tpl.slug}
                    id={`sample-${creator.slug}-${tpl.slug}`}
                    className="flex-shrink-0 overflow-hidden"
                    style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}
                  >
                    <Template data={data} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
