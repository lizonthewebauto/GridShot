'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
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
} from 'lucide-react';
import type { Brand, Preset, TemplateData, UploadedFile, Vibe } from '@/types';
import { VIBE_OPTIONS } from '@/types';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import { TEMPLATE_COMPONENTS, TEMPLATE_FONT_URL } from '@/lib/templates/components';
import { cn } from '@/lib/utils';

const CANVAS_W = 1080;
const CANVAS_H = 1440;

interface SlideCreatorProps {
  brands: Brand[];
}

export function SlideCreator({ brands }: SlideCreatorProps) {
  const defaultBrand =
    brands.find((b) => b.is_default) ?? brands[0] ?? null;

  const [brandId, setBrandId] = useState<string>(defaultBrand?.id ?? '');
  const [templateSlug, setTemplateSlug] = useState<string>('editorial-elegant');
  const [vibe, setVibe] = useState<Vibe>('Authentic');
  const [headline, setHeadline] = useState<string>('Your headline here');
  const [bodyText, setBodyText] = useState<string>(
    'A short supporting line that gives the post context, depth, and a reason to swipe.'
  );

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoStoragePath, setPhotoStoragePath] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSlideId, setSavedSlideId] = useState<string | null>(null);

  const [presets, setPresets] = useState<Preset[]>([]);

  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<UploadedFile[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);

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

  const brand = useMemo(
    () => brands.find((b) => b.id === brandId) ?? null,
    [brands, brandId]
  );

  // Reset transient state on brand swap.
  useEffect(() => {
    setError(null);
    setSavedSlideId(null);
  }, [brandId, templateSlug, vibe]);

  // Load presets once
  useEffect(() => {
    fetch('/api/presets')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPresets(data);
      })
      .catch(() => setPresets([]));
  }, []);

  const data: TemplateData = useMemo(() => {
    const fallbackPrimary = brand?.color_primary ?? '#2d2d2d';
    const fallbackSecondary = brand?.color_secondary ?? '#faf8f5';
    return {
      brandName: brand?.name ?? 'Your Brand',
      photoUrl,
      headline,
      bodyText,
      reviewCount: brand?.review_count ?? null,
      reviewTagline: brand?.review_tagline ?? null,
      colorPrimary: fallbackPrimary,
      colorSecondary: fallbackSecondary,
      colorAccent: brand?.color_accent ?? undefined,
      fontHeading: brand?.font_heading ?? 'Playfair Display',
      fontBody: brand?.font_body ?? 'Inter',
      width: CANVAS_W,
      height: CANVAS_H,
      photos: photoUrl ? [photoUrl, photoUrl, photoUrl, photoUrl] : undefined,
      tagline: brand?.tagline ?? undefined,
    };
  }, [brand, photoUrl, headline, bodyText]);

  const Template = TEMPLATE_COMPONENTS[templateSlug] ?? TEMPLATE_COMPONENTS['editorial-elegant'];

  function applyPreset(presetId: string) {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    if (preset.brand_id) setBrandId(preset.brand_id);
    if (preset.template_slug && preset.template_slug in TEMPLATE_COMPONENTS) {
      setTemplateSlug(preset.template_slug);
    }
    if ((VIBE_OPTIONS as readonly string[]).includes(preset.vibe)) {
      setVibe(preset.vibe as Vibe);
    }
    if (preset.headline) setHeadline(preset.headline);
    if (preset.body_text) setBodyText(preset.body_text);
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
      setPhotoUrl(url);
      setPhotoStoragePath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const openLibrary = useCallback(async () => {
    setShowLibrary(true);
    if (library.length > 0) return;
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/uploads');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setLibrary(data);
      }
    } finally {
      setLibraryLoading(false);
    }
  }, [library.length]);

  function pickFromLibrary(file: UploadedFile) {
    setPhotoUrl(file.url);
    setPhotoStoragePath(file.storagePath);
    setShowLibrary(false);
  }

  async function handleGenerate() {
    if (!brandId) {
      setError('Pick a brand first.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          vibe,
          context: `Template: ${templateSlug}. Current headline: "${headline}". Current body: "${bodyText}".`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'AI generation failed');
      if (data.headline) setHeadline(data.headline);
      if (data.body_text) setBodyText(data.body_text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!brandId) {
      setError('Pick a brand first.');
      return;
    }
    setSaving(true);
    setError(null);
    setSavedSlideId(null);
    try {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          template_slug: templateSlug,
          vibe,
          headline,
          body_text: bodyText,
          photo_url: photoUrl,
          photo_storage_path: photoStoragePath,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      setSavedSlideId(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    if (!previewRef.current) return;
    setExporting(true);
    setError(null);
    try {
      const { toJpeg } = await import('html-to-image');
      const dataUrl = await toJpeg(previewRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        quality: 0.95,
        width: CANVAS_W,
        height: CANVAS_H,
        style: { transform: 'none' },
      });
      const link = document.createElement('a');
      link.download = `${brand?.slug ?? 'gridshot'}-${templateSlug}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      setError('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  }

  const templates = useMemo(() => Object.values(TEMPLATE_REGISTRY), []);

  return (
    <div className="flex flex-col gap-4">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={TEMPLATE_FONT_URL} />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Slide Creator
          </h1>
          <p className="text-muted text-sm mt-1">
            Pick a template, drop in a photo, write the copy, ship it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download JPG
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !brandId}
            className="flex items-center gap-2 rounded bg-accent-warm px-4 py-2 text-sm font-medium text-white hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded">
          {error}
        </div>
      )}
      {savedSlideId && (
        <div className="bg-accent/10 text-accent text-sm px-4 py-3 rounded flex items-center gap-2">
          <Check className="w-4 h-4" />
          Saved as draft.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4">
        {/* LEFT: content panel */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-5 h-fit lg:sticky lg:top-4">
          <div>
            <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Brand
            </label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {presets.length > 0 && (
            <div>
              <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
                Preset
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) applyPreset(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
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
            <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Photo
            </label>
            <div className="mt-1.5 space-y-2">
              {photoUrl ? (
                <div className="relative rounded overflow-hidden border border-border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-full bg-white text-foreground"
                      title="Replace"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={openLibrary}
                      className="p-1.5 rounded-full bg-white text-foreground"
                      title="Library"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setPhotoUrl(null);
                        setPhotoStoragePath(null);
                      }}
                      className="p-1.5 rounded-full bg-white text-danger"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                  <button
                    onClick={openLibrary}
                    className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border p-3 text-xs text-muted hover:border-accent/50 hover:text-foreground transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    Library
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
            </div>

            {showLibrary && (
              <div className="mt-2 rounded border border-border bg-background p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">Uploads</span>
                  <button
                    onClick={() => setShowLibrary(false)}
                    className="text-muted hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {libraryLoading ? (
                  <p className="text-xs text-muted py-3 text-center">Loading…</p>
                ) : library.length === 0 ? (
                  <p className="text-xs text-muted py-3 text-center">
                    No uploads yet. Upload via the Uploads page.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                    {library.map((file) => (
                      <button
                        key={file.storagePath}
                        onClick={() => pickFromLibrary(file)}
                        className="rounded overflow-hidden border border-border hover:border-accent transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt=""
                          className="w-full aspect-square object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Vibe
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVibe(v)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded border transition-colors',
                    vibe === v
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
              <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
                Copy
              </label>
              <button
                onClick={handleGenerate}
                disabled={generating || !brandId}
                className="flex items-center gap-1 text-[11px] text-accent hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {generating ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {generating ? 'Generating…' : 'Generate with AI'}
              </button>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Headline"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Body copy"
              rows={4}
              className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
        </div>

        {/* CENTER: live preview */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-4">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider self-start">
            Preview · {templateSlug}
          </div>
          <div
            ref={previewBoxRef}
            className="bg-neutral-200 rounded overflow-hidden mx-auto w-full max-w-[480px]"
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
              <div ref={previewRef} style={{ width: CANVAS_W, height: CANVAS_H }}>
                <Template data={data} />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted">
            Final exports render at {CANVAS_W}×{CANVAS_H}.
          </p>
        </div>

        {/* RIGHT: template picker */}
        <div className="bg-card border border-border rounded-lg p-4 h-fit lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
            Templates · {templates.length}
          </div>
          <div className="grid grid-cols-2 gap-2">
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
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
                  >
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
                    <div className="text-[11px] font-medium text-foreground truncate">
                      {t.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
