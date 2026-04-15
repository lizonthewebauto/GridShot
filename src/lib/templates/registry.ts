import { EditorialElegantTemplate } from '@/components/templates/editorial-elegant';
import { MagazineCoverTemplate } from '@/components/templates/magazine-cover';
import { MinimalFrameTemplate } from '@/components/templates/minimal-frame';
import { PolaroidStackTemplate } from '@/components/templates/polaroid-stack';
import { FullbleedOverlayTemplate } from '@/components/templates/fullbleed-overlay';
import { SplitPortfolioTemplate } from '@/components/templates/split-portfolio';
import { FilmStripTemplate } from '@/components/templates/film-strip';
import { TestimonialCardTemplate } from '@/components/templates/testimonial-card';

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<{ data: import('@/types').TemplateData }>> = {
  'editorial-elegant': EditorialElegantTemplate,
  'magazine-cover': MagazineCoverTemplate,
  'minimal-frame': MinimalFrameTemplate,
  'polaroid-stack': PolaroidStackTemplate,
  'fullbleed-overlay': FullbleedOverlayTemplate,
  'split-portfolio': SplitPortfolioTemplate,
  'film-strip': FilmStripTemplate,
  'testimonial-card': TestimonialCardTemplate,
};

export function getTemplate(slug: string) {
  return TEMPLATE_REGISTRY[slug] || EditorialElegantTemplate;
}
