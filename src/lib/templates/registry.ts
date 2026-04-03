import { EditorialElegantTemplate } from '@/components/templates/editorial-elegant';

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<{ data: import('@/types').TemplateData }>> = {
  'editorial-elegant': EditorialElegantTemplate,
};

export function getTemplate(slug: string) {
  return TEMPLATE_REGISTRY[slug] || EditorialElegantTemplate;
}
