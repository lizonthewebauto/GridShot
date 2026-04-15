import type { TemplateData } from '@/types';
import { CinematicOverlay } from '@/components/templates/cinematic-overlay';
import { EditorialElegant } from '@/components/templates/editorial-elegant';
import { MinimalCentered } from '@/components/templates/minimal-centered';
import { SplitStory } from '@/components/templates/split-story';
import { BoldShowcase } from '@/components/templates/bold-showcase';

const FONT_HEADING = 'Space Mono';
const FONT_BODY = 'DM Sans';

interface Example {
  label: string;
  template: 'cinematic' | 'editorial' | 'minimal' | 'split' | 'bold';
  slides: (Pick<TemplateData, 'headline' | 'bodyText'> & { photo: string })[];
  colors: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  brandName: string;
}

const examples: Example[] = [
  {
    label: 'Wedding Photographer',
    template: 'cinematic',
    brandName: 'Sarah Lane Photo',
    colors: { bg: '#1a1520', primary: '#1a1520', secondary: '#f5efe8', accent: '#d4a574' },
    slides: [
      { headline: 'A LOVE STORY TOLD IN LIGHT', bodyText: 'Sarah & James celebrated their forever at a vineyard in Sonoma. Golden hour. Handwritten vows. The kind of love that fills a room.', photo: '/samples/wedding-couple.jpg' },
      { headline: 'THE FIRST LOOK', bodyText: 'He turned around and forgot how to breathe. She was already crying. Some moments don\'t need words. They just need someone watching.', photo: '/samples/couple-engagement.jpg' },
      { headline: 'NOW BOOKING 2026 WEDDINGS', bodyText: 'Only 12 dates remaining for the 2026 season. Intimate elopements to 300-guest celebrations. Every love story deserves to be told beautifully.', photo: '/samples/wedding-bouquet.jpg' },
    ],
  },
  {
    label: 'Portrait Photographer',
    template: 'editorial',
    brandName: 'Mira Studios',
    colors: { bg: '#f7f4ef', primary: '#2a2520', secondary: '#f7f4ef', accent: '#8b6914' },
    slides: [
      { headline: 'THE CONFIDENCE SESSION', bodyText: 'A portrait experience designed to make you feel like the most powerful version of yourself. Professional styling. Expert direction. Magazine-quality results.', photo: '/samples/portrait-woman.jpg' },
      { headline: 'YOUR STORY. YOUR FRAME.', bodyText: 'Styled. Directed. Effortless. 90 minutes of you at your absolute best. Hair and makeup included. 40+ retouched images delivered in 48 hours.', photo: '/samples/fashion-editorial.jpg' },
      { headline: 'SPRING MINI SESSIONS NOW OPEN', bodyText: '30 minutes. 15 edited images. $350. Limited to 8 spots per weekend. Book your date before they fill.', photo: '/samples/portrait-man.jpg' },
    ],
  },
  {
    label: 'Real Estate Photographer',
    template: 'minimal',
    brandName: 'Apex Visuals',
    colors: { bg: '#fafafa', primary: '#1a1a1a', secondary: '#fafafa', accent: '#4a5940' },
    slides: [
      { headline: 'JUST LISTED — 4 BR | 3 BA | 2,400 SQFT', bodyText: 'Modern farmhouse in West Austin. Vaulted ceilings. Chef\'s kitchen with Carrara marble. Private backyard with mature oaks.', photo: '/samples/realestate-interior.jpg' },
      { headline: 'LIGHT-FILLED LIVING', bodyText: '12-foot ceilings. Floor-to-ceiling windows. Southern exposure floods every room with natural light from sunrise to sunset.', photo: '/samples/realestate-living.jpg' },
      { headline: 'SCHEDULE A PRIVATE TOUR', bodyText: 'Open house Saturday 1-4pm. Or DM for a private showing any day this week. Seller is motivated.', photo: '/samples/realestate-kitchen.jpg' },
    ],
  },
  {
    label: 'Food Photographer',
    template: 'split',
    brandName: 'Savory & Co.',
    colors: { bg: '#2c2418', primary: '#f0e8d8', secondary: '#2c2418', accent: '#c17c3e' },
    slides: [
      { headline: 'FARM TO FRAME', bodyText: 'Behind the scenes at Aster Kitchen with Chef Mira. Every ingredient sourced within 50 miles. Every plate a work of art.', photo: '/samples/food-flatlay.jpg' },
      { headline: 'EVERY PLATE IS A CANVAS', bodyText: 'The autumn tasting menu, shot on location between courses. Steam rising. Sauces glistening. The kind of food photography that makes people book a reservation.', photo: '/samples/food-plating.jpg' },
      { headline: 'BOOK YOUR SHOOT', bodyText: 'Restaurant photography. Menu design. Social content packages. From Michelin-starred kitchens to neighborhood cafes. Packages starting at $800.', photo: '/samples/food-pasta.jpg' },
    ],
  },
  {
    label: 'Event Photographer',
    template: 'bold',
    brandName: 'Flash Collective',
    colors: { bg: '#0a0a0a', primary: '#0a0a0a', secondary: '#ffffff', accent: '#ff4d2e' },
    slides: [
      { headline: 'SXSW 2026', bodyText: '72 hours. 14 stages. 4,000 frames. We embedded with the festival from load-in to last call.', photo: '/samples/event-party.jpg' },
      { headline: 'THE ENERGY WAS ABSOLUTELY UNREAL', bodyText: 'When the lights hit and the crowd surged forward, we were already in position. Front row. Backstage. In the pit.', photo: '/samples/fashion-editorial.jpg' },
      { headline: 'HIRE US FOR YOUR NEXT EVENT', bodyText: 'Concerts. Conferences. Launch parties. Corporate galas. Product reveals. We shoot it all. Same-week turnaround. Full licensing included.', photo: '/samples/event-party.jpg' },
    ],
  },
  {
    label: 'Travel Photographer',
    template: 'cinematic',
    brandName: 'Atlas Journal',
    colors: { bg: '#1c2a1c', primary: '#1c2a1c', secondary: '#e8e4d8', accent: '#a8b896' },
    slides: [
      { headline: 'KYOTO, 5:47 AM', bodyText: 'The temple opens before the city wakes. Just the monks, the mist, and the sound of raked gravel.', photo: '/samples/travel-temple.jpg' },
      { headline: 'THREE GENERATIONS, SAME CORNER', bodyText: 'Same hands. Same knife. The Nishiki fish market hasn\'t changed in forty years. Grandfather taught father. Father teaches son.', photo: '/samples/travel-japan.jpg' },
      { headline: 'PRINT SHOP NOW LIVE', bodyText: 'Limited edition Japan series. 12 archival pigment prints. Hand-numbered and signed. Only 50 sets available worldwide.', photo: '/samples/travel-mountain.jpg' },
    ],
  },
];

function renderTemplate(template: Example['template'], data: TemplateData) {
  switch (template) {
    case 'cinematic':
      return <CinematicOverlay data={data} />;
    case 'editorial':
      return <EditorialElegant data={data} />;
    case 'minimal':
      return <MinimalCentered data={data} />;
    case 'split':
      return <SplitStory data={data} />;
    case 'bold':
      return <BoldShowcase data={data} />;
  }
}

export default function SamplesRenderPage() {
  return (
    <div className="bg-neutral-900 min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-2">Sample Slides Render</h1>
      <p className="text-neutral-400 mb-10">18 slides across 6 examples. Each slide is 1080x1080.</p>

      {examples.map((example, exIdx) => (
        <div key={exIdx} className="mb-16">
          <h2 className="text-white text-xl font-semibold mb-1">
            {example.label} — {example.template}
          </h2>
          <p className="text-neutral-500 text-sm mb-4">{example.brandName}</p>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {example.slides.map((slide, slideIdx) => {
              const data: TemplateData = {
                brandName: example.brandName,
                photoUrl: slide.photo,
                headline: slide.headline,
                bodyText: slide.bodyText,
                reviewCount: null,
                reviewTagline: null,
                colorPrimary: example.colors.primary,
                colorSecondary: example.colors.secondary,
                fontHeading: FONT_HEADING,
                fontBody: FONT_BODY,
                width: 1080,
                height: 1080,
              };

              return (
                <div
                  key={slideIdx}
                  id={`slide-${exIdx}-${slideIdx}`}
                  className="w-[1080px] h-[1080px] flex-shrink-0 overflow-hidden"
                >
                  {renderTemplate(example.template, data)}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
