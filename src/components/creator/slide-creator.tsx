'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type CSSProperties,
} from 'react';
import {
  Upload,
  Sparkles,
  Save,
  Download,
  FolderOpen,
  Trash2,
  X,
  RefreshCw,
  Check,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Layers,
} from 'lucide-react';
import type {
  Brand,
  Preset,
  TemplateData,
  UploadedFile,
  Vibe,
  SlideElements,
  ElementConfig,
  FooterConfig,
  SwipeIndicatorConfig,
  SwipeArrowStyle,
  FooterTextSource,
} from '@/types';
import {
  VIBE_OPTIONS,
  DEFAULT_ELEMENTS,
  SWIPE_ARROW_STYLES,
  FOOTER_TEXT_SOURCES,
  FOOTER_SOURCE_LABELS,
} from '@/types';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { TEMPLATE_COMPONENTS, TEMPLATE_FONT_URL } from '@/lib/templates/components';
import { cn } from '@/lib/utils';
import { ElementEditor } from './element-editor';

const CANVAS_W = 1080;
const CANVAS_H = 1440;
const ELEMENT_TEMPLATES = new Set(['editorial-pro']);

interface SlideState {
  id: string;
  headline: string;
  bodyText: string;
  vibe: Vibe;
  photoUrl: string | null;
  photoStoragePath: string | null;
  elements: SlideElements;
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeSlide(partial: Partial<SlideState> = {}): SlideState {
  return {
    id: genId(),
    headline: 'Your headline here',
    bodyText: 'A short supporting line that gives the post context, depth, and a reason to swipe.',
    vibe: 'Authentic',
    photoUrl: null,
    photoStoragePath: null,
    elements: structuredClone(DEFAULT_ELEMENTS),
    ...partial,
  };
}

interface SlideCreatorProps {
  brands: Brand[];
}

export function SlideCreator({ brands }: SlideCreatorProps) {
  const defaultBrand = brands.find((b) => b.is_default) ?? brands[0] ?? null;

  const [brandId, setBrandId] = useState<string>(defaultBrand?.id ?? '');
  const [templateSlug, setTemplateSlug] = useState<string>('editorial-pro');
  const [slides, setSlides] = useState<SlideState[]>([makeSlide()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [applyToAll, setApplyToAll] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);

  const [presets, setPresets] = useState<Preset[]>([]);

  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<UploadedFile[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const previewRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [previewScale, setPreviewScale] = useState(0.4);

  const brand = useMemo(
    () => brands.find((b) => b.id === brandId) ?? null,
    [brands, brandId]
  );

  const activeSlide = slides[activeIndex] ?? slides[0];
  const isElementTemplate = ELEMENT_TEMPLATES.has(templateSlug);

  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setPreviewScale(w / CANVAS_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setError(null);
    setSavedCount(0);
  }, [brandId, templateSlug, slides.length]);

  useEffect(() => {
    fetch('/api/presets')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPresets(data);
      })
      .catch(() => setPresets([]));
  }, []);

  // Clamp activeIndex if slides shrink
  useEffect(() => {
    if (activeIndex > slides.length - 1) setActiveIndex(Math.max(0, slides.length - 1));
  }, [slides.length, activeIndex]);

  function buildData(slide: SlideState): TemplateData {
    return {
      brandName: brand?.name ?? 'Your Brand',
      photoUrl: slide.photoUrl,
      headline: slide.headline,
      bodyText: slide.bodyText,
      reviewCount: brand?.review_count ?? null,
      reviewTagline: brand?.review_tagline ?? null,
      colorPrimary: brand?.color_primary ?? '#2d2d2d',
      colorSecondary: brand?.color_secondary ?? '#faf8f5',
      colorAccent: brand?.color_accent ?? undefined,
      fontHeading: brand?.font_heading ?? 'Playfair Display',
      fontBody: brand?.font_body ?? 'Inter',
      width: CANVAS_W,
      height: CANVAS_H,
      photos: slide.photoUrl ? [slide.photoUrl, slide.photoUrl, slide.photoUrl, slide.photoUrl] : undefined,
      tagline: brand?.tagline ?? undefined,
      websiteUrl: brand?.website_url ?? null,
      instagramHandle: brand?.instagram_handle ?? null,
      brandTagline: brand?.tagline ?? null,
      elements: slide.elements,
    };
  }

  const Template = TEMPLATE_COMPONENTS[templateSlug] ?? TEMPLATE_COMPONENTS['editorial-pro'];

  function updateSlide(index: number, updates: Partial<SlideState>) {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }

  function updateElement<K extends keyof SlideElements>(
    key: K,
    updates: Partial<SlideElements[K]>
  ) {
    if (applyToAll) {
      setSlides((prev) =>
        prev.map((s) => ({
          ...s,
          elements: { ...s.elements, [key]: { ...s.elements[key], ...updates } },
        }))
      );
    } else {
      setSlides((prev) =>
        prev.map((s, i) =>
          i === activeIndex
            ? { ...s, elements: { ...s.elements, [key]: { ...s.elements[key], ...updates } } }
            : s
        )
      );
    }
  }

  function addSlide() {
    setSlides((prev) => {
      const next = [...prev, makeSlide({ vibe: prev[prev.length - 1]?.vibe ?? 'Authentic', elements: structuredClone(prev[prev.length - 1]?.elements ?? DEFAULT_ELEMENTS) })];
      setActiveIndex(next.length - 1);
      return next;
    });
  }

  function removeSlide(index: number) {
    setSlides((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  function applyPreset(presetId: string) {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    if (preset.brand_id) setBrandId(preset.brand_id);
    if (preset.template_slug && preset.template_slug in TEMPLATE_COMPONENTS) {
      setTemplateSlug(preset.template_slug);
    }
    if ((VIBE_OPTIONS as readonly string[]).includes(preset.vibe)) {
      const v = preset.vibe as Vibe;
      setSlides((prev) => prev.map((s) => ({ ...s, vibe: v })));
    }
    if (preset.headline) updateSlide(activeIndex, { headline: preset.headline });
    if (preset.body_text) updateSlide(activeIndex, { bodyText: preset.body_text });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Upload failed');
      }
      const { url, path } = await res.json();
      updateSlide(activeIndex, { photoUrl: url, photoStoragePath: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const ensureLibrary = useCallback(async () => {
    if (library.length > 0 || libraryLoading) return library;
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/uploads');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLibrary(data);
          return data as UploadedFile[];
        }
      }
    } finally {
      setLibraryLoading(false);
    }
    return [] as UploadedFile[];
  }, [library, libraryLoading]);

  async function openLibrary() {
    setShowLibrary(true);
    await ensureLibrary();
  }

  function pickFromLibrary(file: UploadedFile) {
    updateSlide(activeIndex, { photoUrl: file.url, photoStoragePath: file.storagePath });
    setShowLibrary(false);
  }

  async function handleRandomPhoto(index: number) {
    const lib = await ensureLibrary();
    if (lib.length === 0) {
      setError('No uploads yet. Upload some on the Uploads page.');
      return;
    }
    const file = lib[Math.floor(Math.random() * lib.length)];
    updateSlide(index, { photoUrl: file.url, photoStoragePath: file.storagePath });
  }

  async function handleRandomAll() {
    const lib = await ensureLibrary();
    if (lib.length === 0) {
      setError('No uploads yet. Upload some on the Uploads page.');
      return;
    }
    setSlides((prev) =>
      prev.map((s) => {
        const file = lib[Math.floor(Math.random() * lib.length)];
        return { ...s, photoUrl: file.url, photoStoragePath: file.storagePath };
      })
    );
  }

  function handleShufflePhotos() {
    setSlides((prev) => {
      const photos = prev.map((s) => ({ url: s.photoUrl, path: s.photoStoragePath }));
      // Fisher-Yates
      for (let i = photos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photos[i], photos[j]] = [photos[j], photos[i]];
      }
      return prev.map((s, i) => ({ ...s, photoUrl: photos[i].url, photoStoragePath: photos[i].path }));
    });
  }

  async function handleGenerate(index: number) {
    if (!brandId) {
      setError('Pick a brand first.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const slide = slides[index];
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          vibe: slide.vibe,
          context: `Template: ${templateSlug}. Slide ${index + 1} of ${slides.length}. Current headline: "${slide.headline}". Current body: "${slide.bodyText}".`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'AI generation failed');
      const updates: Partial<SlideState> = {};
      if (data.headline) updates.headline = data.headline;
      if (data.body_text) updates.bodyText = data.body_text;
      updateSlide(index, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateAll() {
    for (let i = 0; i < slides.length; i++) {
      await handleGenerate(i);
    }
  }

  async function handleSaveAll() {
    if (!brandId) {
      setError('Pick a brand first.');
      return;
    }
    setSaving(true);
    setError(null);
    setSavedCount(0);
    const carouselGroupId =
      slides.length > 1 && typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : null;
    try {
      let count = 0;
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const res = await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand_id: brandId,
            template_slug: templateSlug,
            vibe: slide.vibe,
            headline: slide.headline,
            body_text: slide.bodyText,
            photo_url: slide.photoUrl,
            photo_storage_path: slide.photoStoragePath,
            slide_order: i,
            carousel_group_id: carouselGroupId,
            metadata: { elements: slide.elements },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Save failed on slide ${i + 1}`);
        count++;
        setSavedCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadAll() {
    setExporting(true);
    setError(null);
    try {
      const { toJpeg } = await import('html-to-image');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const ref = previewRefs.current[slide.id];
        if (!ref) continue;
        const dataUrl = await toJpeg(ref, {
          cacheBust: true,
          pixelRatio: 1,
          quality: 0.95,
          width: CANVAS_W,
          height: CANVAS_H,
          style: { transform: 'none' },
        });
        const link = document.createElement('a');
        link.download = `${brand?.slug ?? 'gridshot'}-${templateSlug}-${i + 1}.jpg`;
        link.href = dataUrl;
        link.click();
        // small pause so browser doesn't drop downloads
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch (err) {
      console.error(err);
      setError('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  }

  const templates = useMemo(() => Object.values(TEMPLATE_REGISTRY), []);
  const data = buildData(activeSlide);

  return (
    <div className="flex flex-col gap-6">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={TEMPLATE_FONT_URL} />

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Slide Creator
          </h1>
          <p className="text-muted text-base mt-1">
            Design a single slide or a full carousel. Edit every element, shuffle photos, ship it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAll}
            disabled={exporting}
            className="flex items-center gap-2 rounded border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download {slides.length > 1 ? `${slides.length} JPGs` : 'JPG'}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving || !brandId}
            className="flex items-center gap-2 rounded bg-accent-warm px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save {slides.length > 1 ? 'Carousel' : 'Draft'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded">
          {error}
        </div>
      )}
      {savedCount > 0 && !saving && (
        <div className="bg-accent/10 text-accent text-sm px-4 py-3 rounded flex items-center gap-2">
          <Check className="w-4 h-4" />
          Saved {savedCount} of {slides.length} slide{slides.length !== 1 ? 's' : ''}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_360px] gap-4">
        {/* LEFT — global setup */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-5 h-fit lg:sticky lg:top-4">
          <div>
            <label className="text-sm font-semibold text-foreground">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {brand && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: brand.color_primary }} title="Primary" />
                <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: brand.color_secondary }} title="Secondary" />
                {brand.color_accent && (
                  <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor: brand.color_accent }} title="Accent" />
                )}
                <span className="text-xs text-muted truncate">{brand.font_heading} / {brand.font_body}</span>
              </div>
            )}
          </div>

          {presets.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-foreground">Preset</label>
              <select
                onChange={(e) => {
                  if (e.target.value) applyPreset(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Apply a preset…</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-foreground">Vibe</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => updateSlide(activeIndex, { vibe: v })}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded border transition-colors',
                    activeSlide.vibe === v
                      ? 'bg-accent text-white border-accent'
                      : 'border-border text-foreground hover:bg-card-hover'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-foreground">Templates</label>
              <span className="text-xs text-muted">{templates.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto">
              {templates.map((t) => {
                const Tpl = TEMPLATE_COMPONENTS[t.slug];
                const isActive = templateSlug === t.slug;
                return (
                  <button
                    key={t.slug}
                    onClick={() => setTemplateSlug(t.slug)}
                    className={cn(
                      'rounded border overflow-hidden text-left transition-all bg-neutral-200',
                      isActive
                        ? 'border-accent ring-2 ring-accent'
                        : 'border-border hover:border-accent/40'
                    )}
                  >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
                      <div
                        style={{
                          width: `${CANVAS_W}px`,
                          height: `${CANVAS_H}px`,
                          transform: 'scale(0.13)',
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                        }}
                      >
                        {Tpl ? <Tpl data={data} /> : null}
                      </div>
                    </div>
                    <div className="px-2 py-1.5 bg-card">
                      <div className="text-xs font-medium text-foreground truncate">{t.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER — preview + thumbnails */}
        <div className="flex flex-col gap-3">
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                Slide {activeIndex + 1} of {slides.length}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveIndex((i) => (i - 1 + slides.length) % slides.length)}
                  disabled={slides.length < 2}
                  className="p-2 rounded border border-border hover:bg-card-hover transition-colors disabled:opacity-40"
                  title="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveIndex((i) => (i + 1) % slides.length)}
                  disabled={slides.length < 2}
                  className="p-2 rounded border border-border hover:bg-card-hover transition-colors disabled:opacity-40"
                  title="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={previewBoxRef}
              className="bg-neutral-200 rounded overflow-hidden mx-auto w-full max-w-[520px]"
              style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
            >
              <div
                style={{
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <Template data={data} />
              </div>
            </div>
            <p className="text-xs text-muted">
              Final exports render at {CANVAS_W}×{CANVAS_H}.
            </p>
          </div>

          {/* Slide thumbnails strip */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="w-4 h-4" />
                Carousel
              </div>
              <div className="flex items-center gap-2">
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={handleShufflePhotos}
                      className="flex items-center gap-1 text-xs text-muted hover:text-foreground px-2 py-1 rounded border border-border"
                      title="Shuffle photo placements across slides"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      Shuffle photos
                    </button>
                    <button
                      onClick={handleRandomAll}
                      className="flex items-center gap-1 text-xs text-muted hover:text-foreground px-2 py-1 rounded border border-border"
                      title="Pick a random photo for every slide"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Random all
                    </button>
                  </>
                )}
                <button
                  onClick={addSlide}
                  className="flex items-center gap-1 text-xs text-foreground hover:text-accent px-2 py-1 rounded border border-border"
                  title="Add slide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add slide
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {slides.map((slide, i) => {
                const isActive = i === activeIndex;
                const slideData = buildData(slide);
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'shrink-0 rounded border bg-neutral-200 overflow-hidden relative group transition-all',
                      isActive
                        ? 'border-accent ring-2 ring-accent'
                        : 'border-border hover:border-accent/40'
                    )}
                    style={{ width: '90px' }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ width: '90px', aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
                    >
                      <div
                        style={{
                          width: `${CANVAS_W}px`,
                          height: `${CANVAS_H}px`,
                          transform: 'scale(0.0833)',
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                        }}
                      >
                        <Template data={slideData} />
                      </div>
                    </div>
                    <div className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white bg-black/40 px-1 rounded">
                      {i + 1}
                    </div>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSlide(i); }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </button>
                );
              })}
              <button
                onClick={addSlide}
                className="shrink-0 rounded border border-dashed border-border bg-background flex items-center justify-center text-muted hover:text-accent hover:border-accent/50 transition-colors"
                style={{ width: '90px', aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
                title="Add slide"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — per-slide controls */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4 h-fit lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">
              Editing slide {activeIndex + 1}
            </div>
            {isElementTemplate && slides.length > 1 && (
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <button
                  type="button"
                  onClick={() => setApplyToAll(!applyToAll)}
                  className={cn(
                    'relative w-9 h-5 rounded-full transition-colors',
                    applyToAll ? 'bg-accent' : 'bg-border'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
                      applyToAll && 'translate-x-4'
                    )}
                  />
                </button>
                <span className="text-muted">Apply to all slides</span>
              </label>
            )}
          </div>

          {/* Image controls */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted">Photo</label>
            {activeSlide.photoUrl ? (
              <div className="relative rounded overflow-hidden border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeSlide.photoUrl} alt="" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full bg-white text-foreground" title="Replace">
                    <Upload className="w-4 h-4" />
                  </button>
                  <button onClick={openLibrary} className="p-2 rounded-full bg-white text-foreground" title="Library">
                    <FolderOpen className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRandomPhoto(activeIndex)} className="p-2 rounded-full bg-white text-foreground" title="Random photo">
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateSlide(activeIndex, { photoUrl: null, photoStoragePath: null })}
                    className="p-2 rounded-full bg-white text-danger"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </button>
                <button
                  onClick={openLibrary}
                  className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Library
                </button>
                <button
                  onClick={() => handleRandomPhoto(activeIndex)}
                  className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Random
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {showLibrary && (
              <div className="rounded border border-border bg-background p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Uploads</span>
                  <button onClick={() => setShowLibrary(false)} className="text-muted hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {libraryLoading ? (
                  <p className="text-sm text-muted py-3 text-center">Loading…</p>
                ) : library.length === 0 ? (
                  <p className="text-sm text-muted py-3 text-center">
                    No uploads yet. Upload via the Uploads page.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto">
                    {library.map((file) => (
                      <button
                        key={file.storagePath}
                        onClick={() => pickFromLibrary(file)}
                        className="rounded overflow-hidden border border-border hover:border-accent transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={file.url} alt="" className="w-full aspect-square object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI generate */}
          <div className="space-y-2 pt-3 border-t border-border">
            <label className="text-xs uppercase tracking-wider text-muted">AI Copy</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerate(activeIndex)}
                disabled={generating || !brandId}
                className="flex-1 flex items-center justify-center gap-1.5 rounded bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                This Slide
              </button>
              {slides.length > 1 && (
                <button
                  onClick={handleGenerateAll}
                  disabled={generating || !brandId}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded border border-accent text-accent px-3 py-2 text-sm font-medium hover:bg-accent/5 disabled:opacity-50 transition-colors"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  All Slides
                </button>
              )}
            </div>
          </div>

          {/* ELEMENT EDITORS — only when template supports them */}
          {isElementTemplate ? (
            <div className="space-y-2 pt-3 border-t border-border">
              <label className="text-xs uppercase tracking-wider text-muted">Elements</label>

              <ElementEditor
                label="Header (Brand Name)"
                config={activeSlide.elements.header}
                onChange={(updates) => updateElement('header', updates as Partial<ElementConfig>)}
                showText
                textValue={activeSlide.elements.header.text ?? brand?.name ?? ''}
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
                fontSizeMin={12}
                fontSizeMax={48}
                defaultFont={brand?.font_heading}
                defaultColor={brand?.color_primary}
              />

              <ElementEditor
                label="Headline"
                config={activeSlide.elements.headline}
                onChange={(updates) => updateElement('headline', updates as Partial<ElementConfig>)}
                showText
                textValue={activeSlide.headline}
                onTextChange={(text) => updateSlide(activeIndex, { headline: text })}
                textPlaceholder="Your headline"
                showAlignment
                showFontSize
                showFont
                showLineHeight
                showFontWeight
                showFontStyle
                showLetterSpacing
                showColor
                fontSizeMin={32}
                fontSizeMax={140}
                defaultFont={brand?.font_heading}
                defaultColor={brand?.color_primary}
                defaultExpanded
              />

              <ElementEditor
                label="Body"
                config={activeSlide.elements.body}
                onChange={(updates) => updateElement('body', updates as Partial<ElementConfig>)}
                showText
                textValue={activeSlide.bodyText}
                onTextChange={(text) => updateSlide(activeIndex, { bodyText: text })}
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
                fontSizeMin={16}
                fontSizeMax={64}
                defaultFont={brand?.font_body}
                defaultColor={brand?.color_primary}
              />

              <ElementEditor
                label="Footer"
                config={activeSlide.elements.footer}
                onChange={(updates) => updateElement('footer', updates as Partial<ElementConfig>)}
                showText
                textValue={activeSlide.elements.footer.text ?? ''}
                onTextChange={(text) => updateElement('footer', { text } as Partial<FooterConfig>)}
                textPlaceholder="Footer text"
                showPosition
                showAlignment
                showFontSize
                showFont
                showFontWeight
                showFontStyle
                showLetterSpacing
                showColor
                fontSizeMin={12}
                fontSizeMax={42}
                defaultFont={brand?.font_body}
                defaultColor={brand?.color_primary}
              >
                <div className="space-y-1">
                  <label className="text-xs text-muted">Text Source</label>
                  <select
                    value={(activeSlide.elements.footer as FooterConfig).textSource ?? 'review'}
                    onChange={(e) => {
                      const source = e.target.value as FooterTextSource;
                      let text = (activeSlide.elements.footer as FooterConfig).text ?? '';
                      if (source === 'brand-name') text = brand?.name ?? '';
                      else if (source === 'website') text = brand?.website_url ?? '';
                      else if (source === 'handle') text = brand?.instagram_handle ?? '';
                      else if (source === 'tagline') text = brand?.tagline ?? '';
                      else if (source === 'review') text = '';
                      updateElement('footer', { textSource: source, text } as Partial<FooterConfig>);
                    }}
                    className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {FOOTER_TEXT_SOURCES.map((src) => (
                      <option key={src} value={src}>{FOOTER_SOURCE_LABELS[src]}</option>
                    ))}
                  </select>
                </div>
              </ElementEditor>

              <ElementEditor
                label="Swipe Indicator"
                config={activeSlide.elements.swipeIndicator}
                onChange={(updates) => updateElement('swipeIndicator', updates as Partial<ElementConfig>)}
                showText
                textValue={activeSlide.elements.swipeIndicator.text ?? 'Swipe →'}
                onTextChange={(text) => updateElement('swipeIndicator', { text } as Partial<SwipeIndicatorConfig>)}
                textPlaceholder="Swipe text (optional)"
                showPosition
                showAlignment
                showFontSize
                showFont
                showFontWeight
                showLetterSpacing
                showColor
                fontSizeMin={12}
                fontSizeMax={42}
                defaultColor={brand?.color_primary}
              >
                <div className="space-y-1">
                  <label className="text-xs text-muted">Arrow Style</label>
                  <div className="grid grid-cols-5 gap-1">
                    {SWIPE_ARROW_STYLES.map((style) => {
                      const swipe = activeSlide.elements.swipeIndicator as SwipeIndicatorConfig;
                      const isActive = (swipe.arrowStyle ?? 'text') === style;
                      const labels: Record<SwipeArrowStyle, string> = {
                        'text': 'Aa→',
                        'arrow-right': '→',
                        'chevron': '›',
                        'double-chevron': '››',
                        'circle-arrow': '⊙→',
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
                            'flex items-center justify-center py-2 rounded border text-sm transition-colors',
                            isActive
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border text-muted hover:text-foreground hover:border-accent/30'
                          )}
                          title={style.replace(/-/g, ' ')}
                        >
                          {labels[style]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={((activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).opacity ?? 0.5) * 100}
                      onChange={(e) =>
                        updateElement('swipeIndicator', { opacity: Number(e.target.value) / 100 } as Partial<SwipeIndicatorConfig>)
                      }
                      className="flex-1 h-1 accent-accent"
                    />
                    <span className="text-xs text-muted w-10 text-right tabular-nums">
                      {Math.round(((activeSlide.elements.swipeIndicator as SwipeIndicatorConfig).opacity ?? 0.5) * 100)}%
                    </span>
                  </div>
                </div>
              </ElementEditor>
            </div>
          ) : (
            <div className="space-y-3 pt-3 border-t border-border">
              <label className="text-xs uppercase tracking-wider text-muted">Copy</label>
              <input
                type="text"
                value={activeSlide.headline}
                onChange={(e) => updateSlide(activeIndex, { headline: e.target.value })}
                placeholder="Headline"
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <textarea
                value={activeSlide.bodyText}
                onChange={(e) => updateSlide(activeIndex, { bodyText: e.target.value })}
                placeholder="Body copy"
                rows={4}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <p className="text-xs text-muted">
                This template uses a fixed layout. Switch to <strong>Editorial Pro</strong> to edit every element directly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden full-resolution renderers used by Download All */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0,
        } as CSSProperties}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            ref={(node) => { previewRefs.current[slide.id] = node; }}
            style={{ width: CANVAS_W, height: CANVAS_H }}
          >
            <Template data={buildData(slide)} />
          </div>
        ))}
      </div>
    </div>
  );
}
