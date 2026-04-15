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

const FONT_HEADING = 'Space Mono';
const FONT_BODY = 'DM Sans';

type TemplateComponent = ComponentType<{ data: TemplateData }>;

interface TemplateDef {
  slug: string;
  component: TemplateComponent;
  width: number;
  height: number;
}

const TEMPLATES: TemplateDef[] = [
  { slug: 'editorial-elegant', component: EditorialElegant, width: 1080, height: 1080 },
  { slug: 'bold-showcase', component: BoldShowcase, width: 1080, height: 1080 },
  { slug: 'minimal-centered', component: MinimalCentered, width: 1080, height: 1080 },
  { slug: 'split-story', component: SplitStory, width: 1080, height: 1080 },
  { slug: 'cinematic-overlay', component: CinematicOverlay, width: 1080, height: 1080 },
  { slug: 'photo-only', component: PhotoOnly, width: 1080, height: 1080 },
  { slug: 'magazine-cover', component: MagazineCover, width: 1080, height: 1350 },
  { slug: 'minimal-frame', component: MinimalFrame, width: 1080, height: 1350 },
  { slug: 'polaroid-stack', component: PolaroidStack, width: 1080, height: 1350 },
  { slug: 'fullbleed-overlay', component: FullbleedOverlay, width: 1080, height: 1350 },
  { slug: 'split-portfolio', component: SplitPortfolio, width: 1080, height: 1350 },
  { slug: 'film-strip', component: FilmStrip, width: 1080, height: 1350 },
  { slug: 'testimonial-card', component: TestimonialCard, width: 1080, height: 1350 },
];

interface Creator {
  slug: string;
  brandName: string;
  colors: { primary: string; secondary: string; accent: string };
  headline: string;
  bodyText: string;
  photoUrl: string;
}

const CREATORS: Creator[] = [
  {
    slug: 'wedding',
    brandName: 'Sarah Lane',
    colors: { primary: '#1a1520', secondary: '#f5efe8', accent: '#d4a574' },
    headline: 'A LOVE STORY TOLD IN LIGHT',
    bodyText: 'Sarah & James celebrated their forever at a vineyard in Sonoma. Golden hour. Handwritten vows.',
    photoUrl: '/samples/wedding-couple.jpg',
  },
  {
    slug: 'portrait',
    brandName: 'Mira Studios',
    colors: { primary: '#2a2520', secondary: '#f7f4ef', accent: '#8b6914' },
    headline: 'THE CONFIDENCE SESSION',
    bodyText: 'A portrait experience designed to make you feel like the most powerful version of yourself.',
    photoUrl: '/samples/portrait-woman.jpg',
  },
  {
    slug: 'realestate',
    brandName: 'Apex Visuals',
    colors: { primary: '#1a1a1a', secondary: '#fafafa', accent: '#4a5940' },
    headline: 'JUST LISTED IN WEST AUSTIN',
    bodyText: "Modern farmhouse. 4 BR, 3 BA, 2,400 sqft. Vaulted ceilings, chef's kitchen, private backyard with mature oaks.",
    photoUrl: '/samples/realestate-interior.jpg',
  },
  {
    slug: 'food',
    brandName: 'Savory & Co',
    colors: { primary: '#f0e8d8', secondary: '#2c2418', accent: '#c17c3e' },
    headline: 'FARM TO FRAME',
    bodyText: 'Behind the scenes at Aster Kitchen with Chef Mira. Every ingredient sourced within 50 miles.',
    photoUrl: '/samples/food-flatlay.jpg',
  },
  {
    slug: 'event',
    brandName: 'Flash Collective',
    colors: { primary: '#0a0a0a', secondary: '#ffffff', accent: '#ff4d2e' },
    headline: 'SXSW 2026 AFTERMATH',
    bodyText: '72 hours. 14 stages. 4,000 frames. We embedded from load-in to last call.',
    photoUrl: '/samples/event-party.jpg',
  },
  {
    slug: 'travel',
    brandName: 'Atlas Journal',
    colors: { primary: '#1c2a1c', secondary: '#e8e4d8', accent: '#a8b896' },
    headline: 'KYOTO, 5:47 AM',
    bodyText: 'The temple opens before the city wakes. Just the monks, the mist, and the sound of raked gravel.',
    photoUrl: '/samples/travel-temple.jpg',
  },
];

function buildData(creator: Creator, tpl: TemplateDef): TemplateData {
  return {
    brandName: creator.brandName,
    photoUrl: creator.photoUrl,
    headline: creator.headline,
    bodyText: creator.bodyText,
    reviewCount: '5.0',
    reviewTagline: 'from 247 happy clients',
    colorPrimary: creator.colors.primary,
    colorSecondary: creator.colors.secondary,
    fontHeading: FONT_HEADING,
    fontBody: FONT_BODY,
    width: tpl.width,
    height: tpl.height,
  };
}

export default function SamplesRenderPage() {
  return (
    <div className="bg-neutral-900 min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-2">Sample Slides Render</h1>
      <p className="text-neutral-400 mb-10">
        78 slides — 6 creators x 13 templates.
      </p>

      {CREATORS.map((creator) => (
        <div key={creator.slug} className="mb-16">
          <h2 className="text-white text-xl font-semibold mb-4">
            {creator.brandName} ({creator.slug})
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {TEMPLATES.map((tpl) => {
              const Template = tpl.component;
              const data = buildData(creator, tpl);
              return (
                <div
                  key={tpl.slug}
                  id={`sample-${creator.slug}-${tpl.slug}`}
                  className="flex-shrink-0 overflow-hidden"
                  style={{ width: `${tpl.width}px`, height: `${tpl.height}px` }}
                >
                  <Template data={data} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
