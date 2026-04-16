'use client';

import { useState, type ReactNode } from 'react';
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { ElementConfig, ElementAlignment, ElementPosition } from '@/types';
import { ALL_FONTS, FONT_WEIGHT_OPTIONS } from '@/types';
import { cn } from '@/lib/utils';

interface ElementEditorProps {
  label: string;
  config: ElementConfig;
  onChange: (updates: Partial<ElementConfig>) => void;
  showText?: boolean;
  textValue?: string;
  onTextChange?: (text: string) => void;
  textPlaceholder?: string;
  multiline?: boolean;
  showAlignment?: boolean;
  showPosition?: boolean;
  showFontSize?: boolean;
  showFont?: boolean;
  showLineHeight?: boolean;
  showFontWeight?: boolean;
  showFontStyle?: boolean;
  showLetterSpacing?: boolean;
  showColor?: boolean;
  fontSizeMin?: number;
  fontSizeMax?: number;
  defaultFont?: string;
  defaultColor?: string;
  defaultExpanded?: boolean;
  children?: ReactNode;
}

export function ElementEditor({
  label,
  config,
  onChange,
  showText,
  textValue,
  onTextChange,
  textPlaceholder,
  multiline,
  showAlignment,
  showPosition,
  showFontSize,
  showFont,
  showLineHeight,
  showFontWeight,
  showFontStyle,
  showLetterSpacing,
  showColor,
  fontSizeMin = 10,
  fontSizeMax = 120,
  defaultFont,
  defaultColor,
  defaultExpanded = false,
  children,
}: ElementEditorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-md border border-border bg-background overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          onClick={() => onChange({ visible: !config.visible })}
          className={cn(
            'p-1 rounded transition-colors',
            config.visible ? 'text-accent' : 'text-muted'
          )}
          title={config.visible ? 'Hide element' : 'Show element'}
        >
          {config.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-muted" />}
          <span className={cn('text-sm font-medium', config.visible ? 'text-foreground' : 'text-muted line-through')}>
            {label}
          </span>
        </button>
        {showFontSize && config.visible && (
          <span className="text-xs text-muted">{config.fontSize ?? fontSizeMin}px</span>
        )}
      </div>

      {expanded && config.visible && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {showText && onTextChange && (
            multiline ? (
              <textarea
                value={textValue ?? ''}
                onChange={(e) => onTextChange(e.target.value)}
                rows={3}
                className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder={textPlaceholder}
              />
            ) : (
              <input
                type="text"
                value={textValue ?? ''}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder={textPlaceholder}
              />
            )
          )}

          {showFont && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Font</label>
              <select
                value={config.fontFamily ?? defaultFont ?? ''}
                onChange={(e) => onChange({ fontFamily: e.target.value || undefined })}
                className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Default ({defaultFont || 'inherit'})</option>
                {ALL_FONTS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showFontSize && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={fontSizeMin}
                  max={fontSizeMax}
                  value={config.fontSize ?? fontSizeMin}
                  onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                  className="flex-1 h-1 accent-accent"
                />
                <input
                  type="number"
                  min={fontSizeMin}
                  max={fontSizeMax}
                  value={config.fontSize ?? fontSizeMin}
                  onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                  className="w-16 rounded border border-border bg-card px-2 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {showLineHeight && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Line Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={80}
                  max={250}
                  value={Math.round((config.lineHeight ?? 1.4) * 100)}
                  onChange={(e) => onChange({ lineHeight: Number(e.target.value) / 100 })}
                  className="flex-1 h-1 accent-accent"
                />
                <input
                  type="number"
                  min={0.8}
                  max={2.5}
                  step={0.05}
                  value={config.lineHeight ?? 1.4}
                  onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
                  className="w-16 rounded border border-border bg-card px-2 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {(showFontWeight || showFontStyle) && (
            <div className="flex gap-2">
              {showFontWeight && (
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted">Weight</label>
                  <select
                    value={config.fontWeight ?? 400}
                    onChange={(e) => onChange({ fontWeight: Number(e.target.value) })}
                    className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {FONT_WEIGHT_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {showFontStyle && (
                <div className="space-y-1">
                  <label className="text-xs text-muted">Style</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onChange({ fontStyle: 'normal' })}
                      className={cn(
                        'px-3 py-2 rounded border text-sm transition-colors',
                        (config.fontStyle ?? 'normal') === 'normal'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted hover:text-foreground'
                      )}
                    >
                      Aa
                    </button>
                    <button
                      onClick={() => onChange({ fontStyle: 'italic' })}
                      className={cn(
                        'px-3 py-2 rounded border text-sm italic transition-colors',
                        config.fontStyle === 'italic'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted hover:text-foreground'
                      )}
                    >
                      Aa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showLetterSpacing && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Letter Spacing</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={-5}
                  max={50}
                  value={Math.round((config.letterSpacing ?? 0) * 100)}
                  onChange={(e) => onChange({ letterSpacing: Number(e.target.value) / 100 })}
                  className="flex-1 h-1 accent-accent"
                />
                <span className="text-xs text-muted w-12 text-right tabular-nums">
                  {(config.letterSpacing ?? 0).toFixed(2)}em
                </span>
              </div>
            </div>
          )}

          {showColor && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.color ?? defaultColor ?? '#000000'}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={config.color ?? defaultColor ?? ''}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="flex-1 rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Default"
                />
                {config.color && (
                  <button
                    onClick={() => onChange({ color: undefined })}
                    className="text-xs text-muted hover:text-foreground px-2 py-1.5 rounded border border-border"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {showAlignment && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Alignment</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => onChange({ alignment: align as ElementAlignment })}
                    className={cn(
                      'flex-1 flex items-center justify-center py-2 rounded border text-sm transition-colors',
                      config.alignment === align
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:text-foreground'
                    )}
                  >
                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showPosition && (
            <div className="space-y-1">
              <label className="text-xs text-muted">Position</label>
              <div className="flex gap-1">
                {(['top', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => onChange({ position: pos as ElementPosition })}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 rounded border text-sm capitalize transition-colors',
                      (config.position ?? 'top') === pos
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:text-foreground'
                    )}
                  >
                    {pos === 'top' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          )}

          {children}
        </div>
      )}
    </div>
  );
}
