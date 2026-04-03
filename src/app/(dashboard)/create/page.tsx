'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { toJpeg } from 'html-to-image';
import { LeftPanel } from '@/components/creator/left-panel';
import { CenterPreview } from '@/components/creator/center-preview';
import { RightPanel } from '@/components/creator/right-panel';
import type { Brand, TemplateData } from '@/types';

export default function CreatePage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [vibe, setVibe] = useState('Authentic');
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [exporting, setExporting] = useState(false);

  // Fetch brands on mount
  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          const defaultBrand = data.find((b: Brand) => b.is_default) || data[0];
          setSelectedBrandId(defaultBrand.id);
        }
      });
  }, []);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const templateData: TemplateData = {
    brandName: selectedBrand?.name || 'Your Studio',
    photoUrl,
    headline,
    bodyText,
    reviewCount: selectedBrand?.review_count || null,
    reviewTagline: selectedBrand?.review_tagline || null,
    colorPrimary: selectedBrand?.color_primary || '#4a5940',
    colorSecondary: selectedBrand?.color_secondary || '#f5f0e8',
    fontHeading: selectedBrand?.font_heading || 'Playfair Display',
    fontBody: selectedBrand?.font_body || 'Lora',
  };

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);

    try {
      const dataUrl = await toJpeg(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        width: 1080,
        height: 1350,
      });

      // Trigger download
      const link = document.createElement('a');
      link.download = `${selectedBrand?.name || 'slide'}-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [selectedBrand?.name]);

  return (
    <div className="flex h-screen">
      {/* Brand Selector - top bar within creator */}
      <div className="absolute top-0 left-64 right-0 z-10 bg-card/80 backdrop-blur border-b border-border px-6 py-2 flex items-center gap-4">
        <label className="text-xs text-muted">Brand:</label>
        <select
          value={selectedBrandId || ''}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        {brands.length === 0 && (
          <a href="/brands/new" className="text-xs text-accent hover:underline">
            Create a brand first
          </a>
        )}
      </div>

      {/* Three Panel Layout */}
      <LeftPanel
        photoUrl={photoUrl}
        vibe={vibe}
        onPhotoUpload={setPhotoUrl}
        onVibeChange={setVibe}
      />

      <CenterPreview
        ref={previewRef}
        templateSlug="editorial-elegant"
        data={templateData}
      />

      <RightPanel
        brandId={selectedBrandId}
        vibe={vibe}
        headline={headline}
        bodyText={bodyText}
        onHeadlineChange={setHeadline}
        onBodyChange={setBodyText}
        onExport={handleExport}
        exporting={exporting}
      />
    </div>
  );
}
