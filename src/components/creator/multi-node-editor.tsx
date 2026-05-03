'use client';

import type { ElementConfig } from '@/types';
import { ElementEditor } from './element-editor';
import { getTextNodes, type TextNode } from '@/lib/templates/text-nodes';

interface MultiNodeEditorProps {
  templateSlug: string;
  /** Map of nodeKey → ElementConfig overrides (current state). */
  overrides: Record<string, Partial<ElementConfig>>;
  /** Resolved text content per node key, after default+override merge. */
  texts: Record<string, string>;
  onOverrideChange: (nodeKey: string, updates: Partial<ElementConfig>) => void;
  onTextChange: (nodeKey: string, text: string) => void;
}

/**
 * Drives universal editability for any non-Editorial-Pro template.
 * Reads the per-template manifest from src/lib/templates/text-nodes.ts and
 * renders one collapsible <ElementEditor /> per declared text node.
 *
 * Editorial Pro continues to use its bespoke editor — this is for everything else.
 */
export function MultiNodeEditor({
  templateSlug,
  overrides,
  texts,
  onOverrideChange,
  onTextChange,
}: MultiNodeEditorProps) {
  const nodes = getTextNodes(templateSlug);

  if (nodes.length === 0) {
    return (
      <div className="rounded border border-dashed border-border p-4 text-sm text-muted">
        This template doesn&apos;t expose editable text nodes yet. Add an entry to
        <code className="mx-1 rounded bg-card px-1 text-xs">src/lib/templates/text-nodes.ts</code>
        to enable per-element editing.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nodes.map((node: TextNode) => {
        const config: ElementConfig = {
          visible: true,
          ...node.defaultElement,
          ...(overrides[node.key] ?? {}),
        };
        return (
          <ElementEditor
            key={node.key}
            label={node.label}
            config={config}
            onChange={(updates) => onOverrideChange(node.key, updates)}
            showText
            textValue={texts[node.key] ?? ''}
            onTextChange={(text) => onTextChange(node.key, text)}
            multiline={node.maxLength === undefined || node.maxLength > 60}
            showAlignment
            showFontSize
            showFont
            showLineHeight
            showFontWeight
            showFontStyle
            showLetterSpacing
            showColor
            defaultFont={node.defaultElement.fontFamily}
            defaultColor={node.defaultElement.color}
          />
        );
      })}
    </div>
  );
}
