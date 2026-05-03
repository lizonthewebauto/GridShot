'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Save,
  Send,
  Shuffle,
  Trash2,
  Upload,
} from 'lucide-react';

import { useBrand } from '@/components/brand-context';
import { ElementEditor } from '@/components/creator/element-editor';
import { PublishModal, type PublishPayload } from '@/components/creator/publish-modal';
import { GeneratedSlidePreview } from '@/components/drafts/generated-slide-preview';
import { UploadLibraryModal } from '@/components/drafts/upload-library-modal';
import { resolveGeneratedSlideMetadata } from '@/lib/generated-content/selection';
import type {
  DraftPost,
  DraftPostSlide,
  ElementAlignment,
  ElementConfig,
  FooterConfig,
  GeneratedDraftImageConfig,
  GeneratedLayoutFamily,
  GeneratedDraftSlideMetadata,
  SlideElements,
  SwipeIndicatorConfig,
  UploadedFile,
} from '@/types';
import {
  FOOTER_SOURCE_LABELS,
  FOOTER_TEXT_SOURCES,
  GENERATED_LAYOUT_FAMILIES,
  SWIPE_ARROW_STYLES,
} from '@/types';

interface DraftEditorProps {
  draftId: string;
}

export function DraftEditor({ draftId }: DraftEditorProps) {
  const router = useRouter();
  const { brands, setSelectedBrandId } = useBrand();
  const [draft, setDraft] = useState<DraftPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<'slide' | 'draft' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ step: string; current: number; total: number } | null>(null);
  const [selectedSlideForSwap, setSelectedSlideForSwap] = useState<string | null>(null);
  const previewRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadDraft = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/draft-posts/${draftId}`);
      const data = response.ok ? await response.json() : null;
      if (!response.ok || !data) {
        throw new Error(data?.error || 'Could not load draft');
      }
      setDraft(data as DraftPost);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load draft');
    } finally {
      setLoading(false);
    }
  }, [draftId]);

  useEffect(() => {
    void loadDraft();
  }, [loadDraft]);

  const brand = useMemo(
    () => brands.find((item) => item.id === draft?.brand_id) ?? null,
    [brands, draft?.brand_id],
  );

  useEffect(() => {
    if (draft?.brand_id) {
      setSelectedBrandId(draft.brand_id);
    }
  }, [draft?.brand_id, setSelectedBrandId]);

  const slides = draft?.slides ?? [];
  const activeSlide = slides[activeIndex] ?? slides[0] ?? null;
  const activeMetadata = useMemo(
    () =>
      activeSlide && draft
        ? resolveGeneratedSlideMetadata({
            layoutFamily: draft.layout_family,
            metadata: activeSlide.metadata,
            defaultShowSwipe: draft.kind === 'carousel' && activeIndex < slides.length - 1,
          })
        : null,
    [activeIndex, activeSlide, draft, slides.length],
  );

  function updateSlideLocally(slideId: string, updates: Partial<DraftPostSlide>) {
    setDraft((current) => {
      if (!current?.slides) return current;
      return {
        ...current,
        slides: current.slides.map((slide) => (slide.id === slideId ? { ...slide, ...updates } : slide)),
      };
    });
  }

  function mutateSlideMetadata(
    slideId: string,
    updater: (
      metadata: ReturnType<typeof resolveGeneratedSlideMetadata>,
      slideIndex: number,
      current: DraftPost,
    ) => GeneratedDraftSlideMetadata,
  ) {
    setDraft((current) => {
      if (!current?.slides) return current;
      const currentSlides = current.slides;
      return {
        ...current,
        slides: currentSlides.map((slide, index) => {
          if (slide.id !== slideId) return slide;
          const metadata = resolveGeneratedSlideMetadata({
            layoutFamily: current.layout_family,
            metadata: slide.metadata,
            defaultShowSwipe: current.kind === 'carousel' && index < currentSlides.length - 1,
          });
          return {
            ...slide,
            metadata: updater(metadata, index, current),
          };
        }),
      };
    });
  }

  function updateSlideElement<K extends keyof SlideElements>(
    slideId: string,
    key: K,
    updates: Partial<SlideElements[K]>,
  ) {
    mutateSlideMetadata(slideId, (metadata) => ({
      ...metadata,
      elements: {
        ...metadata.elements,
        [key]: {
          ...metadata.elements[key],
          ...updates,
        },
      },
    }));
  }

  function updateSlideImage(slideId: string, updates: Partial<GeneratedDraftImageConfig>) {
    mutateSlideMetadata(slideId, (metadata) => ({
      ...metadata,
      image: {
        ...metadata.image,
        ...updates,
      },
    }));
  }

  function reorderSlides(direction: -1 | 1) {
    setDraft((current) => {
      if (!current?.slides || !activeSlide) return current;
      const nextIndex = activeIndex + direction;
      if (nextIndex < 0 || nextIndex >= current.slides.length) return current;
      const nextSlides = [...current.slides];
      [nextSlides[activeIndex], nextSlides[nextIndex]] = [nextSlides[nextIndex], nextSlides[activeIndex]];
      const normalized = nextSlides.map((slide, index) => ({ ...slide, slide_order: index }));
      setActiveIndex(nextIndex);
      return { ...current, slides: normalized };
    });
  }

  async function handleSave() {
    if (!draft) return false;
    setSaving(true);
    setError(null);

    try {
      const draftResponse = await fetch(`/api/draft-posts/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: draft.caption,
          layout_family: draft.layout_family,
          notes: draft.notes,
          content_goal: draft.content_goal,
        }),
      });

      const draftData = await draftResponse.json().catch(() => null);
      if (!draftResponse.ok) {
        throw new Error(draftData?.error || 'Could not save draft');
      }

      for (const slide of draft.slides ?? []) {
        const slideResponse = await fetch(`/api/draft-posts/${draft.id}/slides/${slide.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headline: slide.headline,
            body_text: slide.body_text,
            photo_storage_path: slide.photo_storage_path,
            slide_order: slide.slide_order,
            metadata: slide.metadata,
          }),
        });

        const slideData = await slideResponse.json().catch(() => null);
        if (!slideResponse.ok) {
          throw new Error(slideData?.error || 'Could not save slide');
        }
      }

      await loadDraft();
      return true;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save draft');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate(scope: 'slide' | 'draft') {
    if (!draft) return;
    setRegenerating(scope);
    setError(null);
    try {
      const response = await fetch(`/api/draft-posts/${draft.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope,
          slideId: scope === 'slide' ? activeSlide?.id : null,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        throw new Error(data?.error || `Could not regenerate ${scope}`);
      }
      setDraft(data as DraftPost);
    } catch (regenerateError) {
      setError(regenerateError instanceof Error ? regenerateError.message : `Could not regenerate ${scope}`);
    } finally {
      setRegenerating(null);
    }
  }

  function handleSelectUpload(file: UploadedFile) {
    if (!selectedSlideForSwap) return;
    updateSlideLocally(selectedSlideForSwap, {
      photo_storage_path: file.storagePath,
      photo_url: file.url,
    });
    setLibraryOpen(false);
    setSelectedSlideForSwap(null);
  }

  async function exportSlides() {
    const { toJpeg } = await import('html-to-image');
    const media: string[] = [];
    const draftSlides = draft?.slides ?? [];

    for (let index = 0; index < draftSlides.length; index += 1) {
      const slide = draftSlides[index];
      const ref = previewRefs.current[slide.id];
      if (!ref) {
        throw new Error(`Preview not ready for slide ${index + 1}`);
      }

      setPublishProgress({
        step: `Rendering slide ${index + 1}`,
        current: index + 1,
        total: draftSlides.length,
      });

      media.push(
        await toJpeg(ref, {
          cacheBust: true,
          pixelRatio: 1,
          quality: 0.95,
          width: 1080,
          height: 1350,
          style: { transform: 'none' },
        }),
      );
    }

    return media;
  }

  async function handlePublish(payload: PublishPayload) {
    if (!draft) return;
    setPublishing(true);
    setPublishProgress(null);
    setError(null);

    try {
      const saved = await handleSave();
      if (!saved) {
        throw new Error('Save the draft successfully before publishing.');
      }
      const media = await exportSlides();
      setPublishProgress({
        step: 'Scheduling post',
        current: media.length,
        total: media.length,
      });

      const response = await fetch(`/api/draft-posts/${draft.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: payload.caption,
          platforms: payload.platforms,
          scheduledAt: payload.scheduledAt,
          media,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Could not publish draft');
      }

      setPublishOpen(false);
      router.push('/schedule');
      router.refresh();
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Could not publish draft');
    } finally {
      setPublishing(false);
      setPublishProgress(null);
    }
  }

  async function handleDelete() {
    if (!draft) return;
    const confirmed = window.confirm('Delete this draft?');
    if (!confirmed) return;

    const response = await fetch(`/api/draft-posts/${draft.id}`, { method: 'DELETE' });
    if (response.ok) {
      router.push('/drafts');
      router.refresh();
    }
  }

  if (loading) {
    return <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted">Loading draft…</div>;
  }

  if (!draft || !brand || !activeSlide) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted">
        {error || 'Draft not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/drafts" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to drafts
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Draft editor
          </h1>
          <p className="mt-1 text-sm text-muted">
            {draft.kind === 'single' ? 'Single-image draft' : 'Carousel draft'} for {brand.name}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => void handleRegenerate('slide')}
            disabled={regenerating !== null}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            {regenerating === 'slide' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate slide
          </button>
          <button
            onClick={() => void handleRegenerate('draft')}
            disabled={regenerating !== null}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            {regenerating === 'draft' ? <Shuffle className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
            Regenerate draft
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
          <button
            onClick={() => setPublishOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent-warm px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-warm-hover"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
          <button
            onClick={() => void handleDelete()}
            className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_380px]">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Slides</h2>
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-lg border p-2 text-left transition-colors ${
                  index === activeIndex ? 'border-accent bg-accent/5' : 'border-border hover:bg-card-hover'
                }`}
              >
                <div className="overflow-hidden rounded">
                  <GeneratedSlidePreview
                    brand={brand}
                    slide={slide}
                    layoutFamily={draft.layout_family}
                    footerText={brand.review_tagline || brand.tagline}
                    showSwipe={draft.kind === 'carousel' && index < slides.length - 1}
                    width={180}
                    height={225}
                  />
                </div>
                <p className="mt-2 truncate text-xs font-medium text-foreground">{slide.headline || `Slide ${index + 1}`}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="overflow-hidden rounded-lg bg-background">
            <GeneratedSlidePreview
              brand={brand}
              slide={activeSlide}
              layoutFamily={draft.layout_family}
              footerText={brand.review_tagline || brand.tagline}
              showSwipe={draft.kind === 'carousel' && activeIndex < slides.length - 1}
              width={540}
              height={675}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => reorderSlides(-1)}
              disabled={activeIndex === 0}
              className="rounded border border-border px-3 py-2 text-sm text-foreground hover:bg-card-hover disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted">
              Slide {activeIndex + 1} of {slides.length}
            </span>
            <button
              onClick={() => reorderSlides(1)}
              disabled={activeIndex === slides.length - 1}
              className="rounded border border-border px-3 py-2 text-sm text-foreground hover:bg-card-hover disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Edit draft</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Caption</label>
              <textarea
                value={draft.caption || ''}
                onChange={(event) => setDraft((current) => (current ? { ...current, caption: event.target.value } : current))}
                rows={5}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Content goal</label>
              <input
                value={draft.content_goal || ''}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, content_goal: event.target.value || null } : current,
                  )
                }
                placeholder="Optional strategic note for this draft"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Internal notes</label>
              <textarea
                value={draft.notes || ''}
                onChange={(event) =>
                  setDraft((current) => (current ? { ...current, notes: event.target.value || null } : current))
                }
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Layout family</label>
              <select
                value={draft.layout_family}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, layout_family: event.target.value as GeneratedLayoutFamily } : current,
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {GENERATED_LAYOUT_FAMILIES.map((layout) => (
                  <option key={layout} value={layout}>
                    {layout}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Photo</label>
              <button
                onClick={() => {
                  setSelectedSlideForSwap(activeSlide.id);
                  setLibraryOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-hover"
              >
                <Upload className="h-4 w-4" />
                Swap photo
              </button>
            </div>

            {activeMetadata ? (
              <>
                <div className="rounded-lg border border-border bg-background p-3 space-y-3">
                  <label className="block text-sm font-medium text-foreground">Image layout</label>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted">Alignment</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'center', 'right'] as ElementAlignment[]).map((alignment) => {
                        const isActive = activeMetadata.image.alignment === alignment;
                        return (
                          <button
                            key={alignment}
                            onClick={() => updateSlideImage(activeSlide.id, { alignment })}
                            className={`rounded border px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border text-foreground hover:bg-card-hover'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1">
                              {alignment === 'left' ? <ChevronLeft className="h-4 w-4" /> : null}
                              {alignment === 'center' ? <span>Center</span> : <span className="capitalize">{alignment}</span>}
                              {alignment === 'right' ? <ArrowRight className="h-4 w-4" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted">Width</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={56}
                        max={96}
                        value={activeMetadata.image.widthPercent}
                        onChange={(event) =>
                          updateSlideImage(activeSlide.id, { widthPercent: Number(event.target.value) })
                        }
                        className="flex-1 accent-accent"
                      />
                      <span className="w-12 text-right text-xs text-muted">
                        {activeMetadata.image.widthPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <ElementEditor
                    label="Header"
                    config={activeMetadata.elements.header}
                    onChange={(updates) => updateSlideElement(activeSlide.id, 'header', updates as Partial<ElementConfig>)}
                    showText
                    textValue={activeMetadata.elements.header.text ?? brand.name}
                    onTextChange={(text) => updateSlideElement(activeSlide.id, 'header', { text })}
                    textPlaceholder="Brand header"
                    showAlignment
                    showFontSize
                    showFont
                    showFontWeight
                    showFontStyle
                    showLetterSpacing
                    showColor
                    fontSizeMin={12}
                    fontSizeMax={48}
                    defaultFont={brand.font_heading}
                    defaultColor={brand.color_accent || brand.color_primary}
                  />

                  <ElementEditor
                    label="Headline"
                    config={activeMetadata.elements.headline}
                    onChange={(updates) =>
                      updateSlideElement(activeSlide.id, 'headline', updates as Partial<ElementConfig>)
                    }
                    showText
                    textValue={activeSlide.headline || ''}
                    onTextChange={(text) => updateSlideLocally(activeSlide.id, { headline: text })}
                    textPlaceholder="Slide headline"
                    multiline
                    showAlignment
                    showFontSize
                    showFont
                    showLineHeight
                    showFontWeight
                    showFontStyle
                    showLetterSpacing
                    showColor
                    fontSizeMin={28}
                    fontSizeMax={110}
                    defaultFont={brand.font_heading}
                    defaultColor={brand.color_text || brand.color_primary}
                    defaultExpanded
                  />

                  <ElementEditor
                    label="Body"
                    config={activeMetadata.elements.body}
                    onChange={(updates) => updateSlideElement(activeSlide.id, 'body', updates as Partial<ElementConfig>)}
                    showText
                    textValue={activeSlide.body_text || ''}
                    onTextChange={(text) => updateSlideLocally(activeSlide.id, { body_text: text })}
                    textPlaceholder="Slide body text"
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
                    fontSizeMax={64}
                    defaultFont={brand.font_body}
                    defaultColor={brand.color_text || brand.color_primary}
                  />

                  <ElementEditor
                    label="Footer"
                    config={activeMetadata.elements.footer}
                    onChange={(updates) => updateSlideElement(activeSlide.id, 'footer', updates as Partial<FooterConfig>)}
                    showText
                    textValue={activeMetadata.elements.footer.text ?? ''}
                    onTextChange={(text) => updateSlideElement(activeSlide.id, 'footer', { text })}
                    textPlaceholder="Footer text"
                    showAlignment
                    showFontSize
                    showFont
                    showFontWeight
                    showFontStyle
                    showLetterSpacing
                    showColor
                    fontSizeMin={10}
                    fontSizeMax={42}
                    defaultFont={brand.font_body}
                    defaultColor={brand.color_text || brand.color_primary}
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-muted">Footer source</label>
                      <select
                        value={activeMetadata.elements.footer.textSource ?? 'review'}
                        onChange={(event) =>
                          updateSlideElement(activeSlide.id, 'footer', {
                            textSource: event.target.value as FooterConfig['textSource'],
                          })
                        }
                        className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {FOOTER_TEXT_SOURCES.map((source) => (
                          <option key={source} value={source}>
                            {FOOTER_SOURCE_LABELS[source]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </ElementEditor>

                  <ElementEditor
                    label="Swipe Indicator"
                    config={activeMetadata.elements.swipeIndicator}
                    onChange={(updates) =>
                      updateSlideElement(activeSlide.id, 'swipeIndicator', updates as Partial<SwipeIndicatorConfig>)
                    }
                    showText
                    textValue={activeMetadata.elements.swipeIndicator.text ?? 'Swipe'}
                    onTextChange={(text) =>
                      updateSlideElement(activeSlide.id, 'swipeIndicator', { text })
                    }
                    textPlaceholder="Swipe text"
                    showAlignment
                    showFontSize
                    showFont
                    showFontWeight
                    showLetterSpacing
                    showColor
                    fontSizeMin={10}
                    fontSizeMax={42}
                    defaultFont={brand.font_body}
                    defaultColor={brand.color_accent || brand.color_primary}
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-muted">Arrow style</label>
                      <select
                        value={activeMetadata.elements.swipeIndicator.arrowStyle ?? 'text'}
                        onChange={(event) =>
                          updateSlideElement(activeSlide.id, 'swipeIndicator', {
                            arrowStyle: event.target.value as SwipeIndicatorConfig['arrowStyle'],
                          })
                        }
                        className="w-full rounded border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {SWIPE_ARROW_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted">Show on this slide</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => mutateSlideMetadata(activeSlide.id, (metadata) => ({ ...metadata, showSwipeArrow: true }))}
                          className={`rounded border px-3 py-2 text-sm transition-colors ${
                            activeMetadata.showSwipeArrow
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border text-foreground hover:bg-card-hover'
                          }`}
                        >
                          Show
                        </button>
                        <button
                          onClick={() => mutateSlideMetadata(activeSlide.id, (metadata) => ({ ...metadata, showSwipeArrow: false }))}
                          className={`rounded border px-3 py-2 text-sm transition-colors ${
                            !activeMetadata.showSwipeArrow
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border text-foreground hover:bg-card-hover'
                          }`}
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                  </ElementEditor>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: '-99999px', top: 0, pointerEvents: 'none' }}>
        {(draft.slides ?? []).map((slide, index) => (
          <div key={slide.id} ref={(node) => { previewRefs.current[slide.id] = node; }}>
            <GeneratedSlidePreview
              brand={brand}
              slide={slide}
              layoutFamily={draft.layout_family}
              footerText={brand.review_tagline || brand.tagline}
              showSwipe={draft.kind === 'carousel' && index < (draft.slides?.length ?? 0) - 1}
              width={1080}
              height={1350}
            />
          </div>
        ))}
      </div>

      <UploadLibraryModal
        open={libraryOpen}
        onClose={() => {
          setLibraryOpen(false);
          setSelectedSlideForSwap(null);
        }}
        onSelect={handleSelectUpload}
      />

      <PublishModal
        open={publishOpen}
        brandId={brand.id}
        brandName={brand.name}
        defaultCaption={draft.caption || ''}
        slideCount={slides.length}
        busy={publishing}
        progress={publishProgress}
        onClose={() => !publishing && setPublishOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
