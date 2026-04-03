'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Sparkles,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  FolderOpen,
  Shuffle,
  Trash2,
  Diamond,
  RefreshCw,
  Save,
  Download,
  Send,
  Clock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Type,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import type {
  Brand,
  BrandPreset,
  SlideState,
  TemplateData,
  UploadedFile,
  SlideElements,
  ElementConfig,
  SwipeArrowStyle,
  SwipeIndicatorConfig,
  FooterConfig,
  FooterTextSource,
} from '@/types';
import {
  HEADING_FONTS,
  BODY_FONTS,
  VIBE_OPTIONS,
  DEFAULT_ELEMENTS,
  SWIPE_ARROW_STYLES,
  FOOTER_TEXT_SOURCES,
  FOOTER_SOURCE_LABELS,
  ALL_FONTS,
  FONT_WEIGHT_OPTIONS,
} from '@/types';
import { getTemplate } from '@/lib/templates/registry';
import { cn } from '@/lib/utils';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
}

// Collapsible element editor for each slide element
function ElementEditor({
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
  fontSizeMax = 96,
  defaultFont,
  defaultColor,
  children,
}: {
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
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-border bg-background overflow-hidden">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <button
          onClick={() => onChange({ visible: !config.visible })}
          className={cn(
            'p-0.5 rounded transition-colors',
            config.visible ? 'text-accent' : 'text-muted'
          )}
          title={config.visible ? 'Hide element' : 'Show element'}
        >
          {config.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-1.5 text-left"
        >
          {expanded ? <ChevronDown className="w-3 h-3 text-muted" /> : <ChevronRight className="w-3 h-3 text-muted" />}
          <span className={cn('text-xs font-medium', config.visible ? 'text-foreground' : 'text-muted line-through')}>{label}</span>
        </button>
        {showFontSize && config.visible && (
          <span className="text-[10px] text-muted">{config.fontSize || fontSizeMin}px</span>
        )}
      </div>

      {expanded && config.visible && (
        <div className="px-2.5 pb-2.5 space-y-2 border-t border-border pt-2">
          {showText && onTextChange && (
            multiline ? (
              <textarea
                value={textValue || ''}
                onChange={(e) => onTextChange(e.target.value)}
                rows={2}
                className="w-full rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder={textPlaceholder}
              />
            ) : (
              <input
                type="text"
                value={textValue || ''}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder={textPlaceholder}
              />
            )
          )}

          {/* Font family selector */}
          {showFont && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Font</label>
              <select
                value={config.fontFamily || defaultFont || ''}
                onChange={(e) => onChange({ fontFamily: e.target.value || undefined })}
                className="w-full rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Default</option>
                {ALL_FONTS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                ))}
              </select>
            </div>
          )}

          {showFontSize && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={fontSizeMin}
                  max={fontSizeMax}
                  value={config.fontSize || fontSizeMin}
                  onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                  className="flex-1 h-1 accent-accent"
                />
                <input
                  type="number"
                  min={fontSizeMin}
                  max={fontSizeMax}
                  value={config.fontSize || fontSizeMin}
                  onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                  className="w-12 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {/* Line height */}
          {showLineHeight && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Line Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={80}
                  max={250}
                  value={Math.round((config.lineHeight || 1.4) * 100)}
                  onChange={(e) => onChange({ lineHeight: Number(e.target.value) / 100 })}
                  className="flex-1 h-1 accent-accent"
                />
                <input
                  type="number"
                  min={0.8}
                  max={2.5}
                  step={0.05}
                  value={config.lineHeight || 1.4}
                  onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
                  className="w-12 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {/* Font weight & style row */}
          {(showFontWeight || showFontStyle) && (
            <div className="flex gap-2">
              {showFontWeight && (
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-muted">Weight</label>
                  <select
                    value={config.fontWeight || 400}
                    onChange={(e) => onChange({ fontWeight: Number(e.target.value) })}
                    className="w-full rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {FONT_WEIGHT_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {showFontStyle && (
                <div className="space-y-1">
                  <label className="text-[10px] text-muted">Style</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onChange({ fontStyle: 'normal' })}
                      className={cn(
                        'px-2.5 py-1.5 rounded border text-xs transition-colors',
                        (config.fontStyle || 'normal') === 'normal'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted hover:text-foreground'
                      )}
                    >
                      Aa
                    </button>
                    <button
                      onClick={() => onChange({ fontStyle: 'italic' })}
                      className={cn(
                        'px-2.5 py-1.5 rounded border text-xs italic transition-colors',
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

          {/* Letter spacing */}
          {showLetterSpacing && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Letter Spacing</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={-5}
                  max={50}
                  value={Math.round((config.letterSpacing || 0) * 100)}
                  onChange={(e) => onChange({ letterSpacing: Number(e.target.value) / 100 })}
                  className="flex-1 h-1 accent-accent"
                />
                <span className="text-[10px] text-muted w-10 text-right">
                  {(config.letterSpacing || 0).toFixed(2)}em
                </span>
              </div>
            </div>
          )}

          {/* Per-element color */}
          {showColor && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.color || defaultColor || '#000000'}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="w-7 h-7 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={config.color || defaultColor || ''}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="flex-1 rounded border border-border bg-card px-2 py-1 text-[10px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Default"
                />
                {config.color && (
                  <button
                    onClick={() => onChange({ color: undefined })}
                    className="text-[10px] text-muted hover:text-foreground px-1.5 py-1 rounded border border-border"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {showAlignment && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Alignment</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => onChange({ alignment: align })}
                    className={cn(
                      'flex-1 flex items-center justify-center py-1 rounded border text-xs transition-colors',
                      config.alignment === align
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:text-foreground'
                    )}
                  >
                    {align === 'left' && <AlignLeft className="w-3 h-3" />}
                    {align === 'center' && <AlignCenter className="w-3 h-3" />}
                    {align === 'right' && <AlignRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showPosition && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted">Position</label>
              <div className="flex gap-1">
                {(['top', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => onChange({ position: pos })}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 py-1 rounded border text-xs transition-colors',
                      config.position === pos
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:text-foreground'
                    )}
                  >
                    {pos === 'top' && <ArrowUp className="w-3 h-3" />}
                    {pos === 'bottom' && <ArrowDown className="w-3 h-3" />}
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra controls passed as children */}
          {children}
        </div>
      )}
    </div>
  );
}

export function CreateModal({ open, onClose }: CreateModalProps) {
  // Step: 'config' = initial setup, 'generating' = AI working, 'editor' = full slide editor
  const [step, setStep] = useState<'config' | 'generating' | 'editor'>('config');
  const [genProgress, setGenProgress] = useState({ current: 0, total: 0 });

  // === CONFIG STEP STATE ===
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [idea, setIdea] = useState('');
  const [templateSlug, setTemplateSlug] = useState('editorial-elegant');
  const [slideCount, setSlideCount] = useState(5);
  const [fontHeading, setFontHeading] = useState('');
  const [fontBody, setFontBody] = useState('');
  const [colorPrimary, setColorPrimary] = useState('');
  const [colorSecondary, setColorSecondary] = useState('');
  const [vibe, setVibe] = useState('Authentic');

  // AI generation toggles (config step)
  const [aiGenerate, setAiGenerate] = useState(false);
  const [analyzeImages, setAnalyzeImages] = useState(false);

  // Presets
  const [presets, setPresets] = useState<BrandPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);

  // Image selection per slide (config step)
  const [slideImages, setSlideImages] = useState<(string | null)[]>([]);
  const [showConfigLibrary, setShowConfigLibrary] = useState<number | null>(null);
  const [configLibraryFiles, setConfigLibraryFiles] = useState<UploadedFile[]>([]);
  const [configLibraryLoaded, setConfigLibraryLoaded] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const configFileInputRef = useRef<HTMLInputElement>(null);
  const activeConfigSlideRef = useRef<number | null>(null);

  // === EDITOR STEP STATE ===
  const [brand, setBrand] = useState<Brand | null>(null);
  const [slides, setSlides] = useState<SlideState[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([]);
  const [elementsApplyAll, setElementsApplyAll] = useState(true); // true = all slides, false = this slide only
  const [mobileEditorTab, setMobileEditorTab] = useState<'preview' | 'controls'>('preview');
  const [aiFeedback, setAiFeedback] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const editorFileInputRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('config');
      setIdea('');
      setAiGenerate(false);
      setAnalyzeImages(false);
      setGenProgress({ current: 0, total: 0 });
      setSlideCount(5);
      setSlideImages([]);
      setVibe('Authentic');
      setTemplateSlug('editorial-elegant');
      setSlides([]);
      setActiveSlideIndex(0);
      setShowSchedule(false);
      setShowLibrary(false);
      setSelectedPresetId('');
      setAiFeedback('');
      setShowSavePreset(false);
      setPresetName('');
    }
  }, [open]);

  // Fetch brands when modal opens
  useEffect(() => {
    if (!open) return;
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          const def = data.find((b: Brand) => b.is_default) || data[0];
          setSelectedBrandId(def.id);
          setBrand(def);
          setFontHeading(def.font_heading);
          setFontBody(def.font_body);
          setColorPrimary(def.color_primary);
          setColorSecondary(def.color_secondary);
        }
      });
  }, [open]);

  // Sync brand defaults when brand changes
  useEffect(() => {
    const b = brands.find((b) => b.id === selectedBrandId);
    if (b) {
      setBrand(b);
      setFontHeading(b.font_heading);
      setFontBody(b.font_body);
      setColorPrimary(b.color_primary);
      setColorSecondary(b.color_secondary);
    }
    // Load presets for this brand
    if (selectedBrandId) {
      fetch(`/api/brand-presets?brandId=${selectedBrandId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setPresets(data);
        })
        .catch(() => setPresets([]));
    }
    setSelectedPresetId('');
  }, [selectedBrandId, brands]);

  // Keep slideImages array in sync with slideCount
  useEffect(() => {
    setSlideImages((prev) => {
      const next = [...prev];
      while (next.length < slideCount) next.push(null);
      return next.slice(0, slideCount);
    });
  }, [slideCount]);

  // === CONFIG STEP HANDLERS ===
  const loadConfigLibrary = useCallback(async () => {
    if (configLibraryLoaded) return;
    const res = await fetch('/api/uploads');
    if (res.ok) {
      const data = await res.json();
      setConfigLibraryFiles(data);
    }
    setConfigLibraryLoaded(true);
  }, [configLibraryLoaded]);

  function openConfigLibraryForSlide(index: number) {
    setShowConfigLibrary(index);
    loadConfigLibrary();
  }

  function selectFromConfigLibrary(index: number, url: string) {
    setSlideImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
    setShowConfigLibrary(null);
  }

  async function handleConfigUploadForSlide(index: number, file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploadingSlide(index);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'photos');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setSlideImages((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
      setConfigLibraryLoaded(false);
    }
    setUploadingSlide(null);
  }

  function triggerConfigFileUpload(index: number) {
    activeConfigSlideRef.current = index;
    configFileInputRef.current?.click();
  }

  function handleConfigFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && activeConfigSlideRef.current !== null) {
      handleConfigUploadForSlide(activeConfigSlideRef.current, file);
    }
    e.target.value = '';
  }

  async function handleConfigRandomPhoto(index: number) {
    let files = configLibraryFiles;
    if (!configLibraryLoaded) {
      const res = await fetch('/api/uploads');
      if (!res.ok) return;
      files = await res.json();
      setConfigLibraryFiles(files);
      setConfigLibraryLoaded(true);
    }
    if (files.length === 0) return;
    const pick = files[Math.floor(Math.random() * files.length)];
    setSlideImages((prev) => {
      const next = [...prev];
      next[index] = pick.url;
      return next;
    });
  }

  async function handleConfigRandomAll() {
    let files = configLibraryFiles;
    if (!configLibraryLoaded) {
      const res = await fetch('/api/uploads');
      if (!res.ok) return;
      files = await res.json();
      setConfigLibraryFiles(files);
      setConfigLibraryLoaded(true);
    }
    if (files.length === 0) return;
    setSlideImages(
      Array.from({ length: slideCount }).map(() =>
        files[Math.floor(Math.random() * files.length)].url
      )
    );
  }

  // Transition from config -> editor (with optional AI generation step)
  async function handleCreate() {
    const newSlides: SlideState[] = Array.from({ length: slideCount }).map((_, i) => ({
      id: generateId(),
      order: i,
      photoUrl: slideImages[i] || null,
      headline: '',
      bodyText: '',
      vibe,
      elements: structuredClone(DEFAULT_ELEMENTS),
    }));
    setSlides(newSlides);
    setActiveSlideIndex(0);

    // Auto-generate AI text if toggle is on
    if (aiGenerate && selectedBrandId) {
      setStep('generating');
      setGenProgress({ current: 0, total: newSlides.length });
      setGenerating(true);
      try {
        for (let i = 0; i < newSlides.length; i++) {
          setGenProgress({ current: i + 1, total: newSlides.length });
          const slideImageUrl = newSlides[i].photoUrl;
          const res = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandId: selectedBrandId,
              vibe,
              idea: idea || undefined,
              slideNumber: i + 1,
              totalSlides: newSlides.length,
              analyzeImage: analyzeImages && !!slideImageUrl,
              imageUrl: analyzeImages ? slideImageUrl : undefined,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setSlides((prev) =>
              prev.map((s, idx) =>
                idx === i ? { ...s, headline: data.headline, bodyText: data.body } : s
              )
            );
          }
        }
      } finally {
        setGenerating(false);
        setStep('editor');
      }
    } else {
      setStep('editor');
    }
  }

  // Apply a preset to current config
  function applyPreset(presetId: string) {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setColorPrimary(preset.color_primary);
    setColorSecondary(preset.color_secondary);
    setFontHeading(preset.font_heading);
    setFontBody(preset.font_body);
    setVibe(preset.vibe);
  }

  // Save current config as a preset
  async function handleSavePreset() {
    if (!presetName.trim() || !selectedBrandId) return;
    setSavingPreset(true);
    try {
      const res = await fetch('/api/brand-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: selectedBrandId,
          name: presetName.trim(),
          color_primary: colorPrimary,
          color_secondary: colorSecondary,
          font_heading: fontHeading,
          font_body: fontBody,
          vibe: activeSlide?.vibe || vibe,
          elements: activeSlide?.elements || DEFAULT_ELEMENTS,
        }),
      });
      if (res.ok) {
        const newPreset = await res.json();
        setPresets((prev) => [newPreset, ...prev]);
        setShowSavePreset(false);
        setPresetName('');
      }
    } finally {
      setSavingPreset(false);
    }
  }

  // Delete a preset
  async function handleDeletePreset(presetId: string) {
    await fetch(`/api/brand-presets/${presetId}`, { method: 'DELETE' });
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
    if (selectedPresetId === presetId) setSelectedPresetId('');
  }

  // === EDITOR STEP HANDLERS ===
  const activeSlide = slides[activeSlideIndex] || slides[0];
  const Template = getTemplate(templateSlug);

  function updateSlide(index: number, updates: Partial<SlideState>) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  }

  function addSlide() {
    const newSlide: SlideState = {
      id: generateId(),
      order: slides.length,
      photoUrl: null,
      headline: '',
      bodyText: '',
      vibe: activeSlide?.vibe || 'Authentic',
      elements: structuredClone(DEFAULT_ELEMENTS),
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  }

  function removeSlide(index: number) {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
    if (activeSlideIndex >= slides.length - 1) {
      setActiveSlideIndex(Math.max(0, slides.length - 2));
    }
  }

  function getTemplateData(slide: SlideState): TemplateData {
    return {
      brandName: brand?.name || 'Your Studio',
      photoUrl: slide.photoUrl,
      headline: slide.headline,
      bodyText: slide.bodyText,
      reviewCount: brand?.review_count || null,
      reviewTagline: brand?.review_tagline || null,
      colorPrimary,
      colorSecondary,
      fontHeading,
      fontBody,
      elements: slide.elements,
      websiteUrl: brand?.website_url || null,
      instagramHandle: brand?.instagram_handle || null,
      brandTagline: brand?.tagline || null,
    };
  }

  function updateElement(elementKey: keyof SlideElements, updates: Partial<ElementConfig>) {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (elementsApplyAll || i === activeSlideIndex) {
          return { ...s, elements: { ...s.elements, [elementKey]: { ...s.elements[elementKey], ...updates } } };
        }
        return s;
      })
    );
  }

  async function handleGenerate() {
    if (!selectedBrandId) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrandId,
          vibe: activeSlide.vibe,
          idea: idea || undefined,
          slideNumber: activeSlideIndex + 1,
          totalSlides: slides.length,
          feedback: aiFeedback || undefined,
          analyzeImage: analyzeImages && !!activeSlide.photoUrl,
          imageUrl: analyzeImages ? activeSlide.photoUrl : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        updateSlide(activeSlideIndex, { headline: data.headline, bodyText: data.body });
        setAiFeedback('');
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateAll() {
    if (!selectedBrandId) return;
    setGenerating(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId: selectedBrandId,
            vibe: slides[i].vibe,
            idea: idea || undefined,
            slideNumber: i + 1,
            totalSlides: slides.length,
            feedback: aiFeedback || undefined,
            analyzeImage: analyzeImages && !!slides[i].photoUrl,
            imageUrl: analyzeImages ? slides[i].photoUrl : undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          updateSlide(i, { headline: data.headline, bodyText: data.body });
        }
      }
      setAiFeedback('');
    } finally {
      setGenerating(false);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith('image/')) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'photos');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      updateSlide(activeSlideIndex, { photoUrl: url });
    }
  }

  async function loadEditorLibrary() {
    const res = await fetch('/api/uploads');
    if (res.ok) {
      const data = await res.json();
      setLibraryFiles(data);
    }
    setShowLibrary(true);
  }

  async function handleRandomPhoto() {
    const res = await fetch('/api/uploads');
    if (!res.ok) return;
    const files: UploadedFile[] = await res.json();
    if (files.length === 0) return;
    const pick = files[Math.floor(Math.random() * files.length)];
    updateSlide(activeSlideIndex, { photoUrl: pick.url });
  }

  async function handleRandomAllPhotos() {
    const res = await fetch('/api/uploads');
    if (!res.ok) return;
    const files: UploadedFile[] = await res.json();
    if (files.length === 0) return;
    setSlides((prev) =>
      prev.map((slide) => ({
        ...slide,
        photoUrl: files[Math.floor(Math.random() * files.length)].url,
      }))
    );
  }

  const handleDownloadAll = useCallback(async () => {
    setExporting(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        setActiveSlideIndex(i);
        await new Promise((r) => setTimeout(r, 200));
        if (!previewRef.current) continue;
        const dataUrl = await toJpeg(previewRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          width: 1080,
          height: 1350,
        });
        const link = document.createElement('a');
        link.download = `${brand?.name || 'slide'}-${i + 1}-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
        await new Promise((r) => setTimeout(r, 300));
      }
    } finally {
      setExporting(false);
    }
  }, [slides, brand?.name]);

  async function handleSave() {
    if (!selectedBrandId) return;
    setSaving(true);
    try {
      const carouselGroupId = generateId();
      for (const slide of slides) {
        await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId: selectedBrandId,
            templateSlug,
            photoUrl: slide.photoUrl,
            vibe: slide.vibe,
            headline: slide.headline,
            bodyText: slide.bodyText,
            slideOrder: slide.order,
            carouselGroupId,
          }),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const TEMPLATES = [
    { slug: 'editorial-elegant', name: 'Editorial Elegant', desc: 'Classic serif layout with large hero photo' },
  ];

  // =====================
  // CONFIG STEP
  // =====================
  if (step === 'config') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-3 my-2 sm:m-4">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="font-heading text-xl font-bold text-foreground">Create</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Brand Selector */}
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider">Brand</label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {brands.length === 0 && (
                <a href="/brands/new" className="text-xs text-accent hover:underline mt-1 inline-block">
                  Create a brand first
                </a>
              )}
            </div>

            {/* Idea Input + AI Toggle */}
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider">
                Content Idea
                <span className="text-muted font-normal ml-1">(optional)</span>
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={2}
                placeholder="Describe what you want to create... e.g. 'Wedding portfolio showcase with romantic vibes'"
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <div className="mt-2 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => setAiGenerate(!aiGenerate)}
                    className={cn(
                      'relative w-9 h-5 rounded-full transition-colors shrink-0',
                      aiGenerate ? 'bg-accent' : 'bg-border'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
                      aiGenerate && 'translate-x-4'
                    )} />
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-muted group-hover:text-foreground transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate text with AI when creating
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => setAnalyzeImages(!analyzeImages)}
                    className={cn(
                      'relative w-9 h-5 rounded-full transition-colors shrink-0',
                      analyzeImages ? 'bg-accent' : 'bg-border'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
                      analyzeImages && 'translate-x-4'
                    )} />
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-muted group-hover:text-foreground transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    AI analyzes images to match text to photos
                  </span>
                </label>
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider">Template</label>
              <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => setTemplateSlug(t.slug)}
                    className={cn(
                      'rounded-lg border p-4 text-left transition-all',
                      templateSlug === t.slug
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border hover:border-accent/40 hover:bg-card-hover'
                    )}
                  >
                    <div
                      className="w-full h-20 rounded-md mb-2 flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: colorSecondary || '#f5f0e8',
                        color: colorPrimary || '#4a5940',
                        fontFamily: fontHeading || 'serif',
                      }}
                    >
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{selectedBrand?.name || 'Brand'}</div>
                        <div className="w-12 h-6 bg-current/10 rounded mx-auto mb-1" />
                        <div className="font-bold text-xs uppercase">Headline</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted mt-0.5">{t.desc}</p>
                  </button>
                ))}
                <div className="rounded-lg border border-dashed border-border p-4 flex items-center justify-center text-center opacity-50">
                  <div>
                    <p className="text-sm font-medium text-muted">More templates</p>
                    <p className="text-xs text-muted mt-0.5">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Count + Vibe row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">Slides</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    onClick={() => setSlideCount((c) => Math.max(1, c - 1))}
                    className="p-2 rounded-md border border-border hover:bg-card-hover transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-foreground tabular-nums">{slideCount}</span>
                  <button
                    onClick={() => setSlideCount((c) => Math.min(10, c + 1))}
                    className="p-2 rounded-md border border-border hover:bg-card-hover transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">Vibe</label>
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {VIBE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presets */}
            {presets.length > 0 && (
              <div>
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">Preset</label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    value={selectedPresetId}
                    onChange={(e) => {
                      if (e.target.value) applyPreset(e.target.value);
                      else {
                        setSelectedPresetId('');
                        // Reset to brand defaults
                        const b = brands.find((b) => b.id === selectedBrandId);
                        if (b) {
                          setFontHeading(b.font_heading);
                          setFontBody(b.font_body);
                          setColorPrimary(b.color_primary);
                          setColorSecondary(b.color_secondary);
                        }
                      }
                    }}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Brand defaults</option>
                    {presets.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {selectedPresetId && (
                    <button
                      onClick={() => handleDeletePreset(selectedPresetId)}
                      className="p-2.5 rounded-md border border-border text-muted hover:text-danger hover:border-danger/50 transition-colors"
                      title="Delete preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Style: Fonts + Colors */}
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider">Style</label>
              <p className="text-xs text-muted mt-0.5 mb-2">Defaults from {selectedBrand?.name || 'brand'} profile</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-muted">Heading Font</label>
                  <select
                    value={fontHeading}
                    onChange={(e) => setFontHeading(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {HEADING_FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-muted">Body Font</label>
                  <select
                    value={fontBody}
                    onChange={(e) => setFontBody(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {BODY_FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-muted">Primary Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="color" value={colorPrimary} onChange={(e) => setColorPrimary(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                    <input type="text" value={colorPrimary} onChange={(e) => setColorPrimary(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-muted">Secondary Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="color" value={colorSecondary} onChange={(e) => setColorSecondary(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                    <input type="text" value={colorSecondary} onChange={(e) => setColorSecondary(e.target.value)} className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Images per Slide */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-xs font-medium text-foreground uppercase tracking-wider">Images</label>
                  <p className="text-xs text-muted mt-0.5">Add images now or in the editor.</p>
                </div>
                {slideCount > 1 && (
                  <button
                    onClick={handleConfigRandomAll}
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Randomize All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Array.from({ length: slideCount }).map((_, i) => (
                  <div key={i} className="relative">
                    <div className="text-[10px] text-muted text-center mb-1">Slide {i + 1}</div>
                    {slideImages[i] ? (
                      <div className="relative group">
                        <img src={slideImages[i]!} alt={`Slide ${i + 1}`} className="w-full aspect-[4/5] object-cover rounded-md border border-border" />
                        <button
                          onClick={() => {
                            setSlideImages((prev) => {
                              const next = [...prev];
                              next[i] = null;
                              return next;
                            });
                          }}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : uploadingSlide === i ? (
                      <div className="w-full aspect-[4/5] rounded-md border border-dashed border-border flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/5] rounded-md border border-dashed border-border flex flex-col items-center justify-center gap-1.5 hover:border-accent/50 transition-colors">
                        <button onClick={() => triggerConfigFileUpload(i)} className="p-1 rounded hover:bg-card-hover transition-colors" title="Upload">
                          <Upload className="w-3.5 h-3.5 text-muted" />
                        </button>
                        <button onClick={() => openConfigLibraryForSlide(i)} className="p-1 rounded hover:bg-card-hover transition-colors" title="From library">
                          <FolderOpen className="w-3.5 h-3.5 text-muted" />
                        </button>
                        <button onClick={() => handleConfigRandomPhoto(i)} className="p-1 rounded hover:bg-card-hover transition-colors" title="Random from library">
                          <Shuffle className="w-3.5 h-3.5 text-muted" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <input ref={configFileInputRef} type="file" accept="image/*" onChange={handleConfigFileChange} className="hidden" />
            </div>

            {/* Library picker overlay */}
            {showConfigLibrary !== null && (
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-foreground">Pick from Uploads Library (Slide {showConfigLibrary + 1})</h4>
                  <button onClick={() => setShowConfigLibrary(null)} className="text-muted hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {configLibraryFiles.length === 0 ? (
                  <p className="text-xs text-muted py-4 text-center">No uploads yet. Upload images to build your library.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                    {configLibraryFiles.map((file) => (
                      <button
                        key={file.storagePath}
                        onClick={() => selectFromConfigLibrary(showConfigLibrary, file.url)}
                        className="rounded-md overflow-hidden border border-border hover:border-accent transition-colors"
                      >
                        <img src={file.url} alt={file.name} className="w-full aspect-square object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-md text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!selectedBrandId || brands.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-accent text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // GENERATING STEP (between config and editor)
  // =====================
  if (step === 'generating') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-md m-4 p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-accent/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-accent animate-pulse" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-accent animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground">
                {analyzeImages ? 'Analyzing Photos & Generating Text' : 'Generating Text'}
              </h3>
              <p className="text-sm text-muted mt-1">
                {analyzeImages
                  ? 'AI is studying each photo and crafting text to match...'
                  : 'AI is writing headlines and body text for your slides...'}
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Slide {genProgress.current} of {genProgress.total}</span>
                <span>{Math.round((genProgress.current / genProgress.total) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${(genProgress.current / genProgress.total) * 100}%` }}
                />
              </div>
            </div>
            {genProgress.current > 0 && slides[genProgress.current - 1] && (
              <div className="w-full rounded-lg border border-border bg-background p-3 text-left">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Slide {genProgress.current} preview</p>
                <p className="text-sm font-heading font-bold text-foreground truncate">
                  {slides[genProgress.current - 1]?.headline || '...'}
                </p>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">
                  {slides[genProgress.current - 1]?.bodyText || '...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // EDITOR STEP (full-screen modal)
  // =====================
  if (!activeSlide) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Top bar */}
      <div className="bg-card/90 backdrop-blur border-b border-border px-4 py-2 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep('config')}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            title="Back to settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">{brand?.name || 'Editor'}</span>
          <span className="text-xs text-muted">{slides.length} slide{slides.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Style controls (desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded border border-border cursor-pointer" style={{ backgroundColor: colorPrimary }} title="Primary" />
            <div className="w-5 h-5 rounded border border-border cursor-pointer" style={{ backgroundColor: colorSecondary }} title="Secondary" />
          </div>
          <select
            value={fontHeading}
            onChange={(e) => setFontHeading(e.target.value)}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            {HEADING_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile tab bar for editor */}
      <div className="md:hidden flex border-b border-border bg-card shrink-0">
        <button
          onClick={() => setMobileEditorTab('preview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors',
            mobileEditorTab === 'preview' ? 'text-accent border-b-2 border-accent' : 'text-muted'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          Preview
        </button>
        <button
          onClick={() => setMobileEditorTab('controls')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors',
            mobileEditorTab === 'controls' ? 'text-accent border-b-2 border-accent' : 'text-muted'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Controls
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Slide thumbnails (desktop only) */}
        <div className="hidden md:block w-28 bg-card border-r border-border p-2 overflow-y-auto space-y-1.5 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-medium text-muted uppercase tracking-wider">Slides</span>
            <button
              onClick={addSlide}
              className="p-0.5 rounded hover:bg-card-hover transition-colors text-muted hover:text-foreground"
              title="Add slide"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(i)}
              className={cn(
                'w-full rounded border transition-all relative group',
                i === activeSlideIndex
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-border hover:border-accent/40'
              )}
            >
              <div className="w-full aspect-[4/5] rounded overflow-hidden relative">
                <div
                  style={{
                    width: '1080px',
                    height: '1350px',
                    transform: 'scale(0.075)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                >
                  <Template data={getTemplateData(slide)} />
                </div>
              </div>
              <div className="absolute bottom-0.5 left-1 text-[8px] text-muted font-medium">{i + 1}</div>
              {slides.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeSlide(i); }}
                  className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2 h-2" />
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Center: Live preview with navigation */}
        <div className={cn(
          'flex-1 bg-background/80 flex items-center justify-center p-4 md:p-8 overflow-auto relative',
          mobileEditorTab !== 'preview' && 'hidden md:flex'
        )}>
          {slides.length > 1 && (
            <button
              onClick={() => setActiveSlideIndex((activeSlideIndex - 1 + slides.length) % slides.length)}
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-white/70 hover:bg-white text-foreground shadow-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          <div
            ref={previewRef}
            className="shadow-2xl scale-[0.25] md:scale-[0.45] origin-center"
          >
            <Template data={getTemplateData(activeSlide)} />
          </div>

          {slides.length > 1 && (
            <button
              onClick={() => setActiveSlideIndex((activeSlideIndex + 1) % slides.length)}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-white/70 hover:bg-white text-foreground shadow-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* Mobile slide counter + add button */}
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/90 backdrop-blur rounded-full px-4 py-1.5 border border-border shadow-md">
            <span className="text-[11px] font-medium text-foreground">
              {activeSlideIndex + 1} / {slides.length}
            </span>
            <button onClick={addSlide} className="text-accent">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Controls for active slide */}
        <div className={cn(
          'w-full md:w-72 bg-card md:border-l border-border p-4 md:p-5 overflow-y-auto space-y-5 shrink-0',
          mobileEditorTab !== 'controls' && 'hidden md:block'
        )}>
          <div className="text-xs font-medium text-foreground uppercase tracking-wider">
            Slide {activeSlideIndex + 1} of {slides.length}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-[11px] text-muted uppercase tracking-wider">Image</label>
            {activeSlide.photoUrl ? (
              <div className="relative rounded-md overflow-hidden border border-border group">
                <img src={activeSlide.photoUrl} alt="" className="w-full h-28 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
                  <button onClick={() => editorFileInputRef.current?.click()} className="p-1.5 rounded-full bg-white/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={handleRandomPhoto} className="p-1.5 rounded-full bg-white/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" title="Random photo">
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateSlide(activeSlideIndex, { photoUrl: null })} className="p-1.5 rounded-full bg-white/80 text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => editorFileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button onClick={loadEditorLibrary} className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Library
                </button>
                <button onClick={handleRandomPhoto} className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors">
                  <Shuffle className="w-3.5 h-3.5" />
                  Random
                </button>
              </div>
            )}
            <input
              ref={editorFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          {/* Library picker */}
          {showLibrary && (
            <div className="rounded-md border border-border bg-background p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">Uploads Library</span>
                <button onClick={() => setShowLibrary(false)} className="text-muted hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {libraryFiles.length === 0 ? (
                <p className="text-xs text-muted py-3 text-center">No uploads yet</p>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                  {libraryFiles.map((file) => (
                    <button
                      key={file.storagePath}
                      onClick={() => { updateSlide(activeSlideIndex, { photoUrl: file.url }); setShowLibrary(false); }}
                      className="rounded overflow-hidden border border-border hover:border-accent transition-colors"
                    >
                      <img src={file.url} alt="" className="w-full aspect-square object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Random all slides */}
          {slides.length > 1 && (
            <button
              onClick={handleRandomAllPhotos}
              className="w-full flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Randomize All Slide Photos
            </button>
          )}

          {/* Vibe */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted uppercase tracking-wider">Vibe</label>
            <select
              value={activeSlide.vibe}
              onChange={(e) => updateSlide(activeSlideIndex, { vibe: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {VIBE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* AI Generate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-accent" />
                <span className="text-[11px] text-muted uppercase tracking-wider">AI Text</span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer group" title="AI analyzes slide photo to match text">
                <button
                  type="button"
                  onClick={() => setAnalyzeImages(!analyzeImages)}
                  className={cn(
                    'relative w-7 h-4 rounded-full transition-colors shrink-0',
                    analyzeImages ? 'bg-accent' : 'bg-border'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm',
                    analyzeImages && 'translate-x-3'
                  )} />
                </button>
                <span className="flex items-center gap-1 text-[10px] text-muted group-hover:text-foreground transition-colors">
                  <Eye className="w-3 h-3" />
                  Photo
                </span>
              </label>
            </div>
            <textarea
              value={aiFeedback}
              onChange={(e) => setAiFeedback(e.target.value)}
              rows={2}
              placeholder="Feedback for AI (e.g. 'make it more emotional' or 'focus on the couple's story')..."
              className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedBrandId}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
              >
                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                This Slide
              </button>
              <button
                onClick={handleGenerateAll}
                disabled={generating || !selectedBrandId}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-accent text-accent px-3 py-2 text-xs font-medium hover:bg-accent/5 disabled:opacity-50 transition-colors"
              >
                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                All Slides
              </button>
            </div>
          </div>

          {/* Save Preset */}
          <div className="space-y-2 pt-2 border-t border-border">
            {showSavePreset ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSavePreset(); }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreset}
                    disabled={savingPreset || !presetName.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                  >
                    {savingPreset ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                  <button
                    onClick={() => { setShowSavePreset(false); setPresetName(''); }}
                    className="px-3 py-2 rounded-md border border-border text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSavePreset(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
              >
                <Save className="w-3 h-3" />
                Save as Preset
              </button>
            )}
          </div>

          {/* Element Editors */}
          <div className="space-y-1 pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] text-muted uppercase tracking-wider">Elements</span>
              </div>
              <div className="flex items-center rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setElementsApplyAll(true)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] font-medium transition-colors',
                    elementsApplyAll
                      ? 'bg-accent text-white'
                      : 'bg-background text-muted hover:text-foreground'
                  )}
                >
                  All Slides
                </button>
                <button
                  onClick={() => setElementsApplyAll(false)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] font-medium transition-colors',
                    !elementsApplyAll
                      ? 'bg-accent text-white'
                      : 'bg-background text-muted hover:text-foreground'
                  )}
                >
                  This Slide
                </button>
              </div>
            </div>

            <ElementEditor
              label="Header"
              config={activeSlide.elements.header}
              onChange={(updates) => updateElement('header', updates)}
              showText
              textValue={activeSlide.elements.header.text || brand?.name || ''}
              onTextChange={(text) => updateElement('header', { text })}
              textPlaceholder="Brand name"
              showPosition
              showAlignment
              showFontSize
              showFont
              showFontWeight
              showFontStyle
              showLetterSpacing
              showColor
              fontSizeMin={10}
              fontSizeMax={40}
              defaultFont={fontHeading}
              defaultColor={colorPrimary}
            />

            <ElementEditor
              label="Headline"
              config={activeSlide.elements.headline}
              onChange={(updates) => updateElement('headline', updates)}
              showText
              textValue={activeSlide.headline}
              onTextChange={(text) => updateSlide(activeSlideIndex, { headline: text })}
              textPlaceholder="Your headline"
              showAlignment
              showFontSize
              showFont
              showLineHeight
              showFontWeight
              showFontStyle
              showLetterSpacing
              showColor
              fontSizeMin={24}
              fontSizeMax={96}
              defaultFont={fontHeading}
              defaultColor={colorPrimary}
            />

            <ElementEditor
              label="Body Text"
              config={activeSlide.elements.body}
              onChange={(updates) => updateElement('body', updates)}
              showText
              textValue={activeSlide.bodyText}
              onTextChange={(text) => updateSlide(activeSlideIndex, { bodyText: text })}
              textPlaceholder="Your body text"
              multiline
              showAlignment
              showFontSize
              showFont
              showLineHeight
              showFontWeight
              showFontStyle
              showLetterSpacing
              showColor
              fontSizeMin={14}
              fontSizeMax={48}
              defaultFont={fontBody}
              defaultColor={colorPrimary}
            />

            {/* Footer with text source selector */}
            <ElementEditor
              label="Footer"
              config={activeSlide.elements.footer}
              onChange={(updates) => updateElement('footer', updates)}
              showText
              textValue={activeSlide.elements.footer.text || ''}
              onTextChange={(text) => updateElement('footer', { text })}
              textPlaceholder="Footer text"
              showPosition
              showAlignment
              showFontSize
              showFont
              showFontWeight
              showFontStyle
              showLetterSpacing
              showColor
              fontSizeMin={10}
              fontSizeMax={32}
              defaultFont={fontBody}
              defaultColor={colorPrimary}
            >
              {/* Footer text source dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted">Text Source</label>
                <select
                  value={(activeSlide.elements.footer as FooterConfig).textSource || 'review'}
                  onChange={(e) => {
                    const source = e.target.value as FooterTextSource;
                    let text = '';
                    if (source === 'brand-name') text = brand?.name || '';
                    else if (source === 'website') text = brand?.website_url || '';
                    else if (source === 'handle') text = brand?.instagram_handle || '';
                    else if (source === 'tagline') text = brand?.tagline || '';
                    else if (source === 'review') text = '';
                    updateElement('footer', { textSource: source, text } as Partial<FooterConfig>);
                  }}
                  className="w-full rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {FOOTER_TEXT_SOURCES.map((src) => (
                    <option key={src} value={src}>{FOOTER_SOURCE_LABELS[src]}</option>
                  ))}
                </select>
              </div>
            </ElementEditor>

            {/* Swipe Indicator with arrow style picker and color */}
            <ElementEditor
              label="Swipe Arrow"
              config={activeSlide.elements.swipeIndicator}
              onChange={(updates) => updateElement('swipeIndicator', updates)}
              showText
              textValue={activeSlide.elements.swipeIndicator.text || 'Swipe \u2192'}
              onTextChange={(text) => updateElement('swipeIndicator', { text })}
              textPlaceholder="Swipe text (optional)"
              showPosition
              showAlignment
              showFontSize
              showFont
              showFontWeight
              showLetterSpacing
              fontSizeMin={10}
              fontSizeMax={28}
              defaultColor={colorPrimary}
            >
              {/* Arrow style grid */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted">Arrow Style</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                  {SWIPE_ARROW_STYLES.map((style) => {
                    const swipe = activeSlide.elements.swipeIndicator as SwipeIndicatorConfig;
                    const isActive = (swipe.arrowStyle || 'text') === style;
                    const previewLabels: Record<SwipeArrowStyle, string> = {
                      'text': 'Aa→',
                      'arrow-right': '→',
                      'chevron': '>',
                      'double-chevron': '>>',
                      'circle-arrow': '⊙',
                      'line-arrow': '——→',
                      'dots': '•••',
                      'hand-swipe': '👆',
                      'arrow-minimal': '→',
                      'none': '∅',
                    };
                    return (
                      <button
                        key={style}
                        onClick={() => updateElement('swipeIndicator', { arrowStyle: style } as Partial<SwipeIndicatorConfig>)}
                        className={cn(
                          'flex items-center justify-center py-1.5 rounded border text-xs transition-colors',
                          isActive
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-muted hover:text-foreground hover:border-accent/30'
                        )}
                        title={style.replace(/-/g, ' ')}
                      >
                        {previewLabels[style]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Arrow color */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted">Arrow Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).color || colorPrimary}
                    onChange={(e) => updateElement('swipeIndicator', { color: e.target.value } as Partial<SwipeIndicatorConfig>)}
                    className="w-7 h-7 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).color || colorPrimary}
                    onChange={(e) => updateElement('swipeIndicator', { color: e.target.value } as Partial<SwipeIndicatorConfig>)}
                    className="flex-1 rounded border border-border bg-card px-2 py-1 text-[10px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="#000000"
                  />
                  <button
                    onClick={() => updateElement('swipeIndicator', { color: undefined } as Partial<SwipeIndicatorConfig>)}
                    className="text-[10px] text-muted hover:text-foreground px-1.5 py-1 rounded border border-border"
                    title="Reset to primary color"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Opacity slider */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted">Opacity</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={((activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).opacity ?? 0.5) * 100}
                    onChange={(e) => updateElement('swipeIndicator', { opacity: Number(e.target.value) / 100 } as Partial<SwipeIndicatorConfig>)}
                    className="flex-1 h-1 accent-accent"
                  />
                  <span className="text-[10px] text-muted w-8 text-right">
                    {Math.round(((activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).opacity ?? 0.5) * 100)}%
                  </span>
                </div>
              </div>
            </ElementEditor>

          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-card border-t border-border px-3 md:px-6 py-2 md:py-3 flex items-center justify-between shrink-0">
        <div className="text-xs text-muted hidden sm:block">
          {slides.length} slide{slides.length !== 1 ? 's' : ''} &middot; {templateSlug.replace(/-/g, ' ')}
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md border border-border text-xs md:text-sm font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={handleDownloadAll}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md border border-border text-xs md:text-sm font-medium text-foreground hover:bg-card-hover disabled:opacity-50 transition-colors"
          >
            {exporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Download</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md border border-border text-xs md:text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </button>
            {showSchedule && (
              <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-xl p-4 w-64 z-20">
                <h4 className="text-sm font-medium text-foreground mb-3">Schedule Post</h4>
                <div className="space-y-2 mb-3">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={() => setShowSchedule(false)}
                  disabled={!scheduleDate || !scheduleTime}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Confirm Schedule
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              // TODO: Wire to posts API for immediate posting
            }}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md bg-accent text-xs md:text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
