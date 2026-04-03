'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sparkles, Loader2, Check, Target, Palette, Type, Quote, User, Zap, Plus, X } from 'lucide-react';
import type { Brand, BrandColor, BrandExtraction } from '@/types';

interface BrandFormProps {
  brand?: Brand;
  mode: 'create' | 'edit';
}

const HEADING_FONTS = [
  'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'EB Garamond',
  'Crimson Text', 'DM Serif Display', 'Inter', 'Montserrat', 'Bebas Neue',
  'Poppins', 'Raleway', 'Oswald',
];

const BODY_FONTS = [
  'Lora', 'Cormorant', 'Libre Baskerville', 'Source Serif Pro', 'Merriweather',
  'Inter', 'Open Sans', 'Roboto', 'Nunito', 'Work Sans',
];

export function BrandForm({ brand, mode }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [error, setError] = useState('');

  // Website
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url || '');

  // Identity
  const [name, setName] = useState(brand?.name || '');
  const [tagline, setTagline] = useState(brand?.tagline || '');
  const [websiteTagline, setWebsiteTagline] = useState(brand?.website_tagline || '');
  const [instagramHandle, setInstagramHandle] = useState(brand?.instagram_handle || '');

  // Voice & Personality
  const [voiceDescription, setVoiceDescription] = useState(brand?.voice_description || '');
  const [brandPersonality, setBrandPersonality] = useState(brand?.brand_personality || '');
  const [styleKeywords, setStyleKeywords] = useState<string[]>(brand?.style_keywords || []);
  const [tonePresets, setTonePresets] = useState<string[]>(brand?.tone_presets || []);

  // ICP & Audience
  const [icpDescription, setIcpDescription] = useState(brand?.icp_description || '');
  const [targetAudience, setTargetAudience] = useState(brand?.target_audience || '');
  const [audiencePainPoints, setAudiencePainPoints] = useState<string[]>(brand?.audience_pain_points || []);
  const [audienceDesires, setAudienceDesires] = useState<string[]>(brand?.audience_desires || []);
  const [niche, setNiche] = useState(brand?.niche || '');
  const [serviceArea, setServiceArea] = useState(brand?.service_area || '');
  const [pricePositioning, setPricePositioning] = useState(brand?.price_positioning || '');
  const [differentiator, setDifferentiator] = useState(brand?.differentiator || '');

  // Colors — build initial list from existing fields + brand_colors
  const [brandColors, setBrandColors] = useState<BrandColor[]>(() => {
    if (brand) {
      const colors: BrandColor[] = [
        { label: 'Primary', value: brand.color_primary || '#4a5940' },
        { label: 'Secondary', value: brand.color_secondary || '#f5f0e8' },
      ];
      if (brand.color_accent) colors.push({ label: 'Accent', value: brand.color_accent });
      if (brand.color_background) colors.push({ label: 'Background', value: brand.color_background });
      if (brand.color_text) colors.push({ label: 'Text', value: brand.color_text });
      if (brand.brand_colors?.length) {
        for (const c of brand.brand_colors) {
          if (!colors.some(existing => existing.label === c.label)) {
            colors.push(c);
          }
        }
      }
      return colors;
    }
    return [
      { label: 'Primary', value: '#4a5940' },
      { label: 'Secondary', value: '#f5f0e8' },
    ];
  });

  // Fonts
  const [fontHeading, setFontHeading] = useState(brand?.font_heading || 'Playfair Display');
  const [fontBody, setFontBody] = useState(brand?.font_body || 'Lora');
  const [fontAccent, setFontAccent] = useState(brand?.font_accent || '');

  // Social proof
  const [reviewCount, setReviewCount] = useState(brand?.review_count || '');
  const [reviewTagline, setReviewTagline] = useState(brand?.review_tagline || '');

  // Social links
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(brand?.social_links || {});

  async function handleExtract() {
    if (!websiteUrl.trim()) return;
    setExtracting(true);
    setExtracted(false);
    setError('');

    try {
      const res = await fetch('/api/brands/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Extraction failed');
      }

      const d: BrandExtraction = await res.json();

      // Fill ALL form fields from extraction
      if (d.name && !name) setName(d.name);
      if (d.tagline) setTagline(d.tagline);
      if (d.website_tagline) setWebsiteTagline(d.website_tagline);
      if (d.instagram_handle) setInstagramHandle(d.instagram_handle);
      if (d.voice_description) setVoiceDescription(d.voice_description);
      if (d.brand_personality) setBrandPersonality(d.brand_personality);
      if (d.style_keywords?.length) setStyleKeywords(d.style_keywords);
      if (d.tone_presets?.length) setTonePresets(d.tone_presets);
      if (d.icp_description) setIcpDescription(d.icp_description);
      if (d.target_audience) setTargetAudience(d.target_audience);
      if (d.audience_pain_points?.length) setAudiencePainPoints(d.audience_pain_points);
      if (d.audience_desires?.length) setAudienceDesires(d.audience_desires);
      if (d.niche) setNiche(d.niche);
      if (d.service_area) setServiceArea(d.service_area);
      if (d.price_positioning) setPricePositioning(d.price_positioning);
      if (d.differentiator) setDifferentiator(d.differentiator);
      // Build extracted colors list
      const extractedColors: BrandColor[] = [];
      if (d.color_primary) extractedColors.push({ label: 'Primary', value: d.color_primary });
      if (d.color_secondary) extractedColors.push({ label: 'Secondary', value: d.color_secondary });
      if (d.color_accent) extractedColors.push({ label: 'Accent', value: d.color_accent });
      if (d.color_background) extractedColors.push({ label: 'Background', value: d.color_background });
      if (d.color_text) extractedColors.push({ label: 'Text', value: d.color_text });
      if (extractedColors.length >= 2) setBrandColors(extractedColors);
      if (d.font_heading) setFontHeading(d.font_heading);
      if (d.font_body) setFontBody(d.font_body);
      if (d.font_accent) setFontAccent(d.font_accent);
      if (d.review_count) setReviewCount(d.review_count);
      if (d.review_tagline) setReviewTagline(d.review_tagline);
      if (d.social_links && Object.keys(d.social_links).length) setSocialLinks(d.social_links);

      setExtracted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      name,
      website_url: websiteUrl || null,
      tagline: tagline || null,
      website_tagline: websiteTagline || null,
      instagram_handle: instagramHandle || null,
      voice_description: voiceDescription || null,
      brand_personality: brandPersonality || null,
      style_keywords: styleKeywords,
      tone_presets: tonePresets,
      icp_description: icpDescription || null,
      target_audience: targetAudience || null,
      audience_pain_points: audiencePainPoints,
      audience_desires: audienceDesires,
      niche: niche || null,
      service_area: serviceArea || null,
      price_positioning: pricePositioning || null,
      differentiator: differentiator || null,
      color_primary: brandColors.find(c => c.label === 'Primary')?.value || '#4a5940',
      color_secondary: brandColors.find(c => c.label === 'Secondary')?.value || '#f5f0e8',
      color_accent: brandColors.find(c => c.label === 'Accent')?.value || null,
      color_background: brandColors.find(c => c.label === 'Background')?.value || null,
      color_text: brandColors.find(c => c.label === 'Text')?.value || null,
      brand_colors: brandColors.filter(c => !['Primary', 'Secondary', 'Accent', 'Background', 'Text'].includes(c.label)),
      font_heading: fontHeading,
      font_body: fontBody,
      font_accent: fontAccent || null,
      review_count: reviewCount || null,
      review_tagline: reviewTagline || null,
      social_links: socialLinks,
      extracted_from_url: extracted || brand?.extracted_from_url || false,
    };

    const url = mode === 'create' ? '/api/brands' : `/api/brands/${brand!.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    router.push('/brands');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">{error}</div>
      )}

      {/* ── Website Extraction ── */}
      <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Import from Website</h3>
        </div>
        <p className="text-xs text-muted mb-3">
          Paste your website and AI will extract your full brand profile: colors, fonts, voice, personality, target audience, ICP, and more.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="www.yourbrand.com"
          />
          <button
            type="button"
            onClick={handleExtract}
            disabled={extracting || !websiteUrl.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {extracting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : extracted ? (
              <><Check className="w-4 h-4" /> Extracted</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Extract Brand</>
            )}
          </button>
        </div>
        {extracted && (
          <p className="text-xs text-accent mt-2 font-medium">
            Brand profile extracted. Review everything below, tweak as needed, then save.
          </p>
        )}
      </div>

      {/* ── Identity ── */}
      <Section icon={<User className="w-4 h-4" />} title="Identity">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Studio / Brand Name" required>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className={inputClass} placeholder="Chrisman Studios" />
          </Field>
          <Field label="Instagram">
            <input type="text" value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)}
              className={inputClass} placeholder="@yourbrand" />
          </Field>
        </div>
        <Field label="Tagline">
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
            className={inputClass} placeholder="Capturing love stories worldwide" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Niche">
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
              className={inputClass} placeholder="e.g. luxury wedding photography, fitness coaching, SaaS" />
          </Field>
          <Field label="Service Area">
            <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)}
              className={inputClass} placeholder="San Francisco Bay Area + Worldwide" />
          </Field>
        </div>
        <Field label="Website Hero Text" hint="The above-the-fold headline from your site. Used as AI reference.">
          <input type="text" value={websiteTagline} onChange={(e) => setWebsiteTagline(e.target.value)}
            className={inputClass} placeholder="Your main headline" />
        </Field>
      </Section>

      {/* ── Voice & Personality ── */}
      <Section icon={<Zap className="w-4 h-4" />} title="Voice & Personality">
        <Field label="Brand Voice" hint="How does your brand write and speak? The AI uses this for all generated text.">
          <textarea value={voiceDescription} onChange={(e) => setVoiceDescription(e.target.value)} rows={3}
            className={inputClass} placeholder="Elegant, poetic, documentary-style. We speak in first person plural. Warm but professional, like a trusted friend who happens to be an artist." />
        </Field>
        <Field label="Brand Personality" hint="What archetype is your brand? What would it be like as a person?">
          <textarea value={brandPersonality} onChange={(e) => setBrandPersonality(e.target.value)} rows={2}
            className={inputClass} placeholder="Luxury editorial with a warm, approachable edge. Classic but not stuffy." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Style Keywords" hint="Comma-separated">
            <input type="text" value={styleKeywords.join(', ')} onChange={(e) => setStyleKeywords(splitComma(e.target.value))}
              className={inputClass} placeholder="editorial, elegant, timeless, intimate" />
          </Field>
          <Field label="Tone Presets" hint="Comma-separated">
            <input type="text" value={tonePresets.join(', ')} onChange={(e) => setTonePresets(splitComma(e.target.value))}
              className={inputClass} placeholder="warm, professional, poetic, aspirational" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price Positioning">
            <select value={pricePositioning} onChange={(e) => setPricePositioning(e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-Range</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Differentiator" hint="What makes you different?">
            <input type="text" value={differentiator} onChange={(e) => setDifferentiator(e.target.value)}
              className={inputClass} placeholder="Cinematic storytelling meets fine-art editorial" />
          </Field>
        </div>
      </Section>

      {/* ── ICP & Target Audience ── */}
      <Section icon={<Target className="w-4 h-4" />} title="Ideal Customer Profile">
        <Field label="Target Audience" hint="One-line summary of who you serve">
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
            className={inputClass} placeholder="Affluent couples aged 28-40 planning luxury destination weddings" />
        </Field>
        <Field label="ICP Description" hint="Detailed profile of your ideal client: demographics, psychographics, what drives them to you">
          <textarea value={icpDescription} onChange={(e) => setIcpDescription(e.target.value)} rows={3}
            className={inputClass} placeholder="Design-conscious couples who value artistry over volume. They've seen our work on editorial blogs, have a higher budget, and want their wedding to feel like a film..." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Their Pain Points" hint="What frustrations does your ideal client have? One per line.">
            <textarea value={audiencePainPoints.join('\n')} rows={3}
              onChange={(e) => setAudiencePainPoints(e.target.value.split('\n').filter(Boolean))}
              className={inputClass} placeholder={"Generic content that blends in with everyone else\nBrands that don't understand their audience\nInconsistent posting across platforms"} />
          </Field>
          <Field label="Their Desires" hint="What outcomes do they dream of? One per line.">
            <textarea value={audienceDesires.join('\n')} rows={3}
              onChange={(e) => setAudienceDesires(e.target.value.split('\n').filter(Boolean))}
              className={inputClass} placeholder={"Timeless images they'll treasure for generations\nA calm, unhurried experience\nPhotos featured in editorial publications"} />
          </Field>
        </div>
      </Section>

      {/* ── Colors ── */}
      <Section icon={<Palette className="w-4 h-4" />} title="Colors">
        {/* Color preview strip */}
        <div className="flex gap-1 h-10 rounded-md overflow-hidden border border-border">
          {brandColors.filter(c => c.value).map((c, i) => (
            <div key={i} className="flex-1 relative group" style={{ backgroundColor: c.value }}>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: isLight(c.value) ? '#000' : '#fff' }}>{c.label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {brandColors.map((color, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="w-32">
                <label className="block text-xs text-muted mb-1">Label</label>
                <input
                  type="text"
                  value={color.label}
                  onChange={(e) => {
                    const updated = [...brandColors];
                    updated[index] = { ...updated[index], label: e.target.value };
                    setBrandColors(updated);
                  }}
                  className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                  placeholder="Color name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.value || '#000000'}
                    onChange={(e) => {
                      const updated = [...brandColors];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setBrandColors(updated);
                    }}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color.value}
                    onChange={(e) => {
                      const updated = [...brandColors];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setBrandColors(updated);
                    }}
                    className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
              {brandColors.length > 2 && (
                <button
                  type="button"
                  onClick={() => setBrandColors(brandColors.filter((_, i) => i !== index))}
                  className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Remove color"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setBrandColors([...brandColors, { label: '', value: '#000000' }])}
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Color
        </button>
      </Section>

      {/* ── Typography ── */}
      <Section icon={<Type className="w-4 h-4" />} title="Typography">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Heading Font">
            <select value={fontHeading} onChange={(e) => setFontHeading(e.target.value)} className={inputClass}>
              {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Body Font">
            <select value={fontBody} onChange={(e) => setFontBody(e.target.value)} className={inputClass}>
              {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Accent Font">
            <input type="text" value={fontAccent} onChange={(e) => setFontAccent(e.target.value)}
              className={inputClass} placeholder="Optional decorative font" />
          </Field>
        </div>
      </Section>

      {/* ── Social Proof ── */}
      <Section icon={<Quote className="w-4 h-4" />} title="Social Proof">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Review Count">
            <input type="text" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)}
              className={inputClass} placeholder="80+ five-star reviews" />
          </Field>
          <Field label="Testimonial Tagline">
            <input type="text" value={reviewTagline} onChange={(e) => setReviewTagline(e.target.value)}
              className={inputClass} placeholder="Clients for life." />
          </Field>
        </div>
      </Section>

      {/* ── Social Links ── */}
      {Object.keys(socialLinks).length > 0 && (
        <Section icon={<Globe className="w-4 h-4" />} title="Social Links (extracted)">
          <div className="space-y-2">
            {Object.entries(socialLinks).map(([platform, link]) => (
              <div key={platform} className="flex items-center gap-3 text-sm">
                <span className="text-muted capitalize w-24">{platform}</span>
                <span className="text-foreground font-mono text-xs truncate">{link}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <button type="submit" disabled={loading}
          className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors">
          {loading
            ? mode === 'create' ? 'Creating...' : 'Saving...'
            : mode === 'create' ? 'Create Brand' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Helpers ──

const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent';

function splitComma(value: string): string[] {
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

function isLight(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
        {icon} {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

