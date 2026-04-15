import Link from 'next/link';
import { Crosshair, ArrowRight, Sparkles, Image as ImageIcon, Share2, Palette } from 'lucide-react';
import { EditorialElegantTemplate } from '@/components/templates/editorial-elegant';
import { MagazineCoverTemplate } from '@/components/templates/magazine-cover';
import { MinimalFrameTemplate } from '@/components/templates/minimal-frame';
import { PolaroidStackTemplate } from '@/components/templates/polaroid-stack';
import { FullbleedOverlayTemplate } from '@/components/templates/fullbleed-overlay';
import { SplitPortfolioTemplate } from '@/components/templates/split-portfolio';
import { FilmStripTemplate } from '@/components/templates/film-strip';
import { TestimonialCardTemplate } from '@/components/templates/testimonial-card';
import type { TemplateData } from '@/types';

type TemplateComponent = React.ComponentType<{ data: TemplateData }>;

interface TemplateShowcase {
  name: string;
  Component: TemplateComponent;
  data: TemplateData;
}

const showcases: TemplateShowcase[] = [
  {
    name: 'Editorial Elegant',
    Component: EditorialElegantTemplate,
    data: {
      brandName: 'MAYA & DAVID',
      photoUrl: '/samples/wedding-couple.jpg',
      headline: 'A Tuscan Evening',
      bodyText: 'Golden hour at the vineyard, vows exchanged beneath centuries-old olive trees, and a candlelit dinner that ran long into the night.',
      reviewCount: '5.0',
      reviewTagline: 'from 180+ couples',
      colorPrimary: '#2b2a28',
      colorSecondary: '#f5efe6',
      fontHeading: 'Playfair Display',
      fontBody: 'Lora',
      elements: undefined,
      instagramHandle: '@mayaanddavid',
      brandTagline: 'Heirloom wedding stories',
    },
  },
  {
    name: 'Magazine Cover',
    Component: MagazineCoverTemplate,
    data: {
      brandName: 'STUDIO 47',
      photoUrl: '/samples/fashion-editorial.jpg',
      headline: 'Spring Issue',
      bodyText: 'Twelve pages of raw texture, soft tailoring, and the color of linen at dawn.',
      reviewCount: '04',
      reviewTagline: 'Vol. Spring 2026',
      colorPrimary: '#1a1a1a',
      colorSecondary: '#ece7df',
      fontHeading: 'DM Serif Display',
      fontBody: 'Work Sans',
      instagramHandle: '@studio47',
      brandTagline: 'Slow fashion, shot slowly',
    },
  },
  {
    name: 'Minimal Frame',
    Component: MinimalFrameTemplate,
    data: {
      brandName: 'OBJECTS',
      photoUrl: '/samples/product-still.jpg',
      headline: 'Stillness in form',
      bodyText: 'Quiet product photography for makers who care about light, shadow, and negative space.',
      reviewCount: '4.9',
      reviewTagline: 'from 62 studios',
      colorPrimary: '#3a3a38',
      colorSecondary: '#fbfaf7',
      fontHeading: 'Cormorant Garamond',
      fontBody: 'Inter',
      instagramHandle: '@objects.studio',
      brandTagline: 'Product photography, quietly',
    },
  },
  {
    name: 'Polaroid Stack',
    Component: PolaroidStackTemplate,
    data: {
      brandName: 'The Hendersons',
      photoUrl: '/samples/family-beach.jpg',
      headline: 'Summer 2026',
      bodyText: 'Three kids, one dog, and an afternoon that turned into a film roll we will not stop looking at.',
      reviewCount: '5.0',
      reviewTagline: 'from 400+ families',
      colorPrimary: '#6b4f3a',
      colorSecondary: '#fdf6ec',
      fontHeading: 'Bitter',
      fontBody: 'Karla',
      instagramHandle: '@hendersonphoto',
      brandTagline: 'Family film, unposed',
    },
  },
  {
    name: 'Fullbleed Overlay',
    Component: FullbleedOverlayTemplate,
    data: {
      brandName: 'WILD NORTH',
      photoUrl: '/samples/landscape-mountain.jpg',
      headline: 'Iceland Expedition',
      bodyText: 'Eight days chasing weather across the Highlands. Basalt, moss, and the kind of silence that changes you.',
      reviewCount: '2026',
      reviewTagline: 'Chapter 04',
      colorPrimary: '#0e1a22',
      colorSecondary: '#f1ede4',
      fontHeading: 'Montserrat',
      fontBody: 'Inter',
      instagramHandle: '@wildnorth.co',
      brandTagline: 'Expedition landscape work',
    },
  },
  {
    name: 'Split Portfolio',
    Component: SplitPortfolioTemplate,
    data: {
      brandName: 'Anya Kovac',
      photoUrl: '/samples/portrait-woman.jpg',
      headline: 'Portraits / Vol. 3',
      bodyText: 'A year of studio sessions with founders, dancers, and the occasional dog. Natural light, fabric, and a single 85mm.',
      reviewCount: '5.0',
      reviewTagline: 'from 120 sittings',
      colorPrimary: '#8a5a3b',
      colorSecondary: '#f6ede2',
      fontHeading: 'Cormorant Garamond',
      fontBody: 'DM Sans',
      instagramHandle: '@anya.kovac',
      brandTagline: 'Portraiture, studio & street',
    },
  },
  {
    name: 'Film Strip',
    Component: FilmStripTemplate,
    data: {
      brandName: 'ROLLEI 35',
      photoUrl: '/samples/portrait-man.jpg',
      headline: 'Frame 24 / 36',
      bodyText: 'Shot on Portra 400, pushed one stop. The last frame of a Tuesday afternoon nobody planned.',
      reviewCount: 'ISO 400',
      reviewTagline: 'Kodak Portra',
      colorPrimary: '#1f1d1b',
      colorSecondary: '#e8e2d4',
      fontHeading: 'Josefin Sans',
      fontBody: 'Work Sans',
      instagramHandle: '@rollei35diary',
      brandTagline: '35mm, one frame at a time',
    },
  },
  {
    name: 'Testimonial Card',
    Component: TestimonialCardTemplate,
    data: {
      brandName: 'LITTLE LIGHT STUDIO',
      photoUrl: '/samples/newborn.jpg',
      headline: 'Worth every second',
      bodyText: '"We were nervous, tired, and covered in spit-up. She made us feel calm, and the photos are everything. We will look at these forever."',
      reviewCount: '5.0',
      reviewTagline: 'from 247 families',
      colorPrimary: '#4a3b2e',
      colorSecondary: '#fbf4ea',
      fontHeading: 'Playfair Display',
      fontBody: 'Lora',
      instagramHandle: '@littlelightstudio',
      brandTagline: 'Newborn & motherhood',
    },
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-written copy',
    body: 'Drop in your photo and vibe. GridShot writes headline, body, and caption in your brand voice.',
  },
  {
    icon: ImageIcon,
    title: '1080x1350 export',
    body: 'Every slide exports at the exact size Instagram and Threads want. No cropping, no guesswork.',
  },
  {
    icon: Share2,
    title: 'Multi-platform posting',
    body: 'Publish to Instagram, Threads, X, Facebook, and Bluesky from one place.',
  },
  {
    icon: Palette,
    title: 'Save brand presets',
    body: 'Colors, fonts, logo, social proof. Lock your look once and reuse it across every shoot.',
  },
];

// Scale a 1080x1350 template down for thumbnail preview.
const SCALE = 0.25;
const THUMB_W = 1080 * SCALE;
const THUMB_H = 1350 * SCALE;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Crosshair className="w-5 h-5 text-accent" />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground uppercase">
            Gridshot
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 py-24 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <div className="inline-block relative mb-8">
            <div className="absolute -top-3 -left-4 w-5 h-5 border-t-2 border-l-2 border-accent" />
            <div className="absolute -top-3 -right-4 w-5 h-5 border-t-2 border-r-2 border-accent" />
            <div className="absolute -bottom-3 -left-4 w-5 h-5 border-b-2 border-l-2 border-accent" />
            <div className="absolute -bottom-3 -right-4 w-5 h-5 border-b-2 border-r-2 border-accent" />
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight px-6 py-2">
              Frame your brand.<br />Post everywhere.
            </h1>
          </div>
          <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
            GridShot is the social-slide creator built for photographers. Turn your shoots into scroll-stopping carousels in minutes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-base font-medium text-foreground hover:bg-border/30 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="px-8 py-20 border-t border-border bg-border/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">Templates</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              8 templates. Endless possibilities.
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Wedding, portrait, family, fashion, food, landscape. Every template adapts to your brand colors, fonts, and voice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {showcases.map(({ name, Component, data }) => (
              <div key={name} className="flex flex-col items-center">
                <div
                  className="overflow-hidden rounded-sm shadow-sm ring-1 ring-border/60 bg-white"
                  style={{ width: THUMB_W, height: THUMB_H }}
                >
                  <div
                    style={{
                      transform: `scale(${SCALE})`,
                      transformOrigin: 'top left',
                      width: 1080,
                      height: 1350,
                    }}
                  >
                    <Component data={data} />
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium text-foreground tracking-tight">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">What you get</p>
            <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight">
              Built for working photographers.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border border-border rounded-sm p-6 bg-background hover:border-accent/60 transition-colors"
              >
                <Icon className="w-5 h-5 text-accent mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-24 border-t border-border bg-border/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
            Ready to ship your next carousel?
          </h2>
          <p className="text-muted mb-8 text-lg">
            Upload a shoot, pick a template, post everywhere. Your feed will thank you.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border text-center text-xs text-muted">
        Gridshot &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
