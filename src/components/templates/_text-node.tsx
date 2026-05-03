import type { CSSProperties, ReactNode } from 'react';
import type { ElementConfig, TemplateData } from '@/types';

interface TextNodeProps {
  /** Manifest key — must match an entry under TEXT_NODES[templateSlug]. */
  nodeKey: string;
  /** Default styling — what the template would render if no override is set. */
  defaultElement: Partial<ElementConfig>;
  /** Per-slide overrides supplied via TemplateData. */
  overrides?: TemplateData['elementOverrides'];
  /** Default text content (typically derived from a TemplateData field like `data.headline`). */
  defaultText: string;
  /** Optional extra layout styles the template controls (margins, padding, max-width, etc.). */
  style?: CSSProperties;
  /** Optional element override — defaults to <div>. */
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3';
  /** Optional className for layout-only utilities. */
  className?: string;
  /** Optional children that wrap the resolved text (rare — most templates won't need this). */
  children?: (resolvedText: string) => ReactNode;
}

/**
 * Renders a single editable text node. Merges the template's design-time
 * defaults with any per-slide overrides so the user can tweak font/size/
 * weight/colour/alignment for each text block in the carousel.
 *
 * Templates use this in place of inline-styled <div> spans:
 *
 *   <TextNode
 *     nodeKey="headline"
 *     defaultElement={{ fontFamily: 'Caveat', fontSize: 88, color: '#000', alignment: 'center' }}
 *     overrides={data.elementOverrides}
 *     defaultText={data.headline || 'Default headline'}
 *     style={{ marginTop: 24, padding: '0 32px' }}
 *   />
 */
export function TextNode({
  nodeKey,
  defaultElement,
  overrides,
  defaultText,
  style,
  as: Tag = 'div',
  className,
  children,
}: TextNodeProps) {
  const override = overrides?.[nodeKey];

  if (override?.visible === false) {
    return null;
  }

  const merged: Partial<ElementConfig> = { ...defaultElement, ...(override ?? {}) };
  const resolvedText = (override?.text ?? defaultText) || '';

  const inline: CSSProperties = {
    ...style,
    fontFamily: merged.fontFamily ? `${merged.fontFamily}, sans-serif` : style?.fontFamily,
    fontSize: typeof merged.fontSize === 'number' ? `${merged.fontSize}px` : style?.fontSize,
    fontWeight: merged.fontWeight ?? style?.fontWeight,
    fontStyle: merged.fontStyle ?? style?.fontStyle,
    color: merged.color ?? style?.color,
    lineHeight: merged.lineHeight ?? style?.lineHeight,
    letterSpacing: typeof merged.letterSpacing === 'number' ? `${merged.letterSpacing}em` : style?.letterSpacing,
    textAlign: merged.alignment ?? style?.textAlign,
  };

  return (
    <Tag style={inline} className={className}>
      {children ? children(resolvedText) : resolvedText}
    </Tag>
  );
}
