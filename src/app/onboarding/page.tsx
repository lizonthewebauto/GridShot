'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getStripe } from '@/lib/stripe/client';
import {
  Globe, Sparkles, Loader2, Check, Upload, Camera,
  CreditCard, ArrowRight, ArrowLeft, X, RefreshCw,
} from 'lucide-react';
import type { BrandExtraction } from '@/types';

const STEPS = ['Brand', 'Subscribe', 'Upload'];

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);

  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Brand fields
  const [brandMethod, setBrandMethod] = useState<'extract' | 'manual' | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [tagline, setTagline] = useState('');
  const [niche, setNiche] = useState('');
  const [colorPrimary, setColorPrimary] = useState('#2d2d2d');
  const [colorSecondary, setColorSecondary] = useState('#faf8f5');
  const [colorAccent, setColorAccent] = useState('');
  const [fontHeading, setFontHeading] = useState('Playfair Display');
  const [fontBody, setFontBody] = useState('Lora');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [brandPersonality, setBrandPersonality] = useState('');
  const [styleKeywords, setStyleKeywords] = useState('');
  const [tonePresets, setTonePresets] = useState('');
  const [extractionData, setExtractionData] = useState<Partial<BrandExtraction>>({});

  // Step 2: Billing
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year');

  // Step 3: Upload
  const [uploadedPhotos, setUploadedPhotos] = useState<{ path: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // If returning from Stripe checkout success, handle step 3 + mark subscription
  const handleCheckoutReturn = useCallback(async () => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && step === 3) {
      // Update onboarding step in profile
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ onboarding_step: 3 }).eq('id', user.id);
      }
    }
  }, [searchParams, step]);

  useEffect(() => {
    handleCheckoutReturn();
  }, [handleCheckoutReturn]);

  // ----- Step 1: Brand extraction -----
  type ExtractScope = 'all' | 'identity' | 'voice' | 'colors';
  const [reExtractScope, setReExtractScope] = useState<ExtractScope | null>(null);

  async function handleExtract(scope: ExtractScope = 'all') {
    if (!websiteUrl) return;
    setExtracting(true);
    setReExtractScope(scope);
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
      const data: BrandExtraction = await res.json();
      // Fill only the fields in scope
      if (scope === 'all' || scope === 'identity') {
        if (data.name) setBrandName(data.name);
        if (data.tagline) setTagline(data.tagline);
        if (data.niche) setNiche(data.niche);
        if (data.instagram_handle) setInstagramHandle(data.instagram_handle);
      }
      if (scope === 'all' || scope === 'voice') {
        if (data.voice_description) setVoiceDescription(data.voice_description);
        if (data.brand_personality) setBrandPersonality(data.brand_personality);
        if (data.style_keywords?.length) setStyleKeywords(data.style_keywords.join(', '));
        if (data.tone_presets?.length) setTonePresets(data.tone_presets.join(', '));
      }
      if (scope === 'all' || scope === 'colors') {
        if (data.color_primary) setColorPrimary(data.color_primary);
        if (data.color_secondary) setColorSecondary(data.color_secondary);
        if (data.color_accent) setColorAccent(data.color_accent || '');
        if (data.font_heading) setFontHeading(data.font_heading);
        if (data.font_body) setFontBody(data.font_body);
      }
      setExtractionData((prev) => ({ ...prev, ...data }));
      setExtracted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setExtracting(false);
      setReExtractScope(null);
    }
  }

  async function saveBrand() {
    setLoading(true);
    setError('');
    try {
      const body = {
        name: brandName,
        website_url: websiteUrl || null,
        logo_url: extractionData.logo_url || null,
        tagline: tagline || null,
        voice_description: voiceDescription || null,
        brand_personality: brandPersonality || null,
        style_keywords: styleKeywords ? styleKeywords.split(',').map(s => s.trim()).filter(Boolean) : [],
        tone_presets: tonePresets ? tonePresets.split(',').map(s => s.trim()).filter(Boolean) : [],
        icp_description: extractionData.icp_description || null,
        target_audience: extractionData.target_audience || null,
        audience_pain_points: extractionData.audience_pain_points || [],
        audience_desires: extractionData.audience_desires || [],
        niche: niche || null,
        service_area: extractionData.service_area || null,
        price_positioning: extractionData.price_positioning || null,
        differentiator: extractionData.differentiator || null,
        color_primary: colorPrimary,
        color_secondary: colorSecondary,
        color_accent: colorAccent || null,
        color_background: extractionData.color_background || null,
        color_text: extractionData.color_text || null,
        font_heading: fontHeading,
        font_body: fontBody,
        font_accent: extractionData.font_accent || null,
        review_count: extractionData.review_count || null,
        review_tagline: extractionData.review_tagline || null,
        instagram_handle: instagramHandle || null,
        website_tagline: extractionData.website_tagline || null,
        social_links: extractionData.social_links || {},
        extracted_from_url: extracted,
      };

      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save brand');
      }

      // Update onboarding step
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ onboarding_step: 2 }).eq('id', user.id);
      }

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save brand');
    } finally {
      setLoading(false);
    }
  }

  // ----- Step 2: Stripe checkout -----
  async function handleCheckout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: billingInterval }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Checkout failed');
      }
      const { url } = await res.json();
      if (url) {
        const stripeInstance = await getStripe();
        if (stripeInstance) {
          window.location.href = url;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  }

  // ----- Step 3: Upload photos -----
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }

        const { path, url } = await res.json();
        setUploadedPhotos(prev => [...prev, { path, url }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  }

  async function completeOnboarding() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          onboarding_completed: true,
          onboarding_step: 4,
        }).eq('id', user.id);
      }
      router.push('/dashboard');
    } catch {
      setError('Failed to complete onboarding');
      setLoading(false);
    }
  }

  const monthlyPrice = 29;
  const annualPrice = 290;
  const monthlySavings = (monthlyPrice * 12) - annualPrice;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > i + 1
                      ? 'bg-accent text-white'
                      : step === i + 1
                        ? 'bg-accent-warm text-white'
                        : 'bg-border text-muted'
                  }`}
                >
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-sm ${step === i + 1 ? 'text-foreground font-medium' : 'text-muted'}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 ${step > i + 1 ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm mb-6">
              {error}
            </div>
          )}

          {/* ========== STEP 1: BRAND ========== */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1
                  className="text-3xl font-bold text-foreground mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Set Up Your Brand
                </h1>
                <p className="text-muted">
                  We'll use this to style your carousels and write copy in your voice.
                </p>
              </div>

              {/* Method selection */}
              {!brandMethod && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setBrandMethod('extract')}
                    className="bg-card border-2 border-border rounded-lg p-6 text-left hover:border-accent-warm transition-colors"
                  >
                    <Globe size={24} className="text-accent-warm mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Extract from Website</h3>
                    <p className="text-sm text-muted">
                      Enter your URL and we'll pull your colors, fonts, and voice automatically.
                    </p>
                  </button>
                  <button
                    onClick={() => setBrandMethod('manual')}
                    className="bg-card border-2 border-border rounded-lg p-6 text-left hover:border-accent-warm transition-colors"
                  >
                    <Sparkles size={24} className="text-accent-warm mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Enter Manually</h3>
                    <p className="text-sm text-muted">
                      Set up your brand name, colors, and style from scratch.
                    </p>
                  </button>
                </div>
              )}

              {/* Extract method */}
              {brandMethod === 'extract' && !extracted && (
                <section className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={20} className="text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">Your Website</h2>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      onClick={() => handleExtract('all')}
                      disabled={extracting || !websiteUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
                    >
                      {extracting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Extract
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setBrandMethod(null)}
                    className="mt-3 text-sm text-muted hover:text-foreground"
                  >
                    &larr; Back to options
                  </button>
                </section>
              )}

              {/* Brand form (shown after extract or for manual entry) */}
              {(brandMethod === 'manual' || extracted) && (
                <div className="space-y-6">
                  {/* Re-extract banner (only after auto-extraction) */}
                  {extracted && (
                    <section className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-muted shrink-0" />
                        <input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button
                          onClick={() => handleExtract('all')}
                          disabled={extracting || !websiteUrl}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors disabled:opacity-50 shrink-0"
                          title="Re-run extraction for all fields"
                        >
                          {extracting && reExtractScope === 'all' ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                          Re-extract all
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        Edit the URL or click re-extract to refill all fields. Or use per-section re-extract buttons below to refresh just one area.
                      </p>
                    </section>
                  )}

                  {/* Identity */}
                  <section className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">Brand Identity</h2>
                      {extracted && (
                        <button
                          onClick={() => handleExtract('identity')}
                          disabled={extracting || !websiteUrl}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted hover:text-foreground border border-border rounded hover:bg-background transition-colors disabled:opacity-50"
                          title="Re-extract just identity fields"
                        >
                          {extracting && reExtractScope === 'identity' ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          Re-extract
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Brand Name *</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Instagram Handle</label>
                        <input
                          type="text"
                          value={instagramHandle}
                          onChange={(e) => setInstagramHandle(e.target.value)}
                          placeholder="@yourhandle"
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Tagline</label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Niche</label>
                        <input
                          type="text"
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          placeholder="e.g., Wedding Photography"
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Voice */}
                  <section className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">Brand Voice</h2>
                      {extracted && (
                        <button
                          onClick={() => handleExtract('voice')}
                          disabled={extracting || !websiteUrl}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted hover:text-foreground border border-border rounded hover:bg-background transition-colors disabled:opacity-50"
                          title="Re-extract just voice fields"
                        >
                          {extracting && reExtractScope === 'voice' ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          Re-extract
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Voice Description</label>
                        <textarea
                          value={voiceDescription}
                          onChange={(e) => setVoiceDescription(e.target.value)}
                          rows={2}
                          placeholder="How does your brand speak? e.g., warm, professional, poetic"
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Style Keywords</label>
                          <input
                            type="text"
                            value={styleKeywords}
                            onChange={(e) => setStyleKeywords(e.target.value)}
                            placeholder="timeless, editorial, romantic"
                            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Tone</label>
                          <input
                            type="text"
                            value={tonePresets}
                            onChange={(e) => setTonePresets(e.target.value)}
                            placeholder="warm, inviting, authentic"
                            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Colors & Fonts */}
                  <section className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">Colors & Typography</h2>
                      {extracted && (
                        <button
                          onClick={() => handleExtract('colors')}
                          disabled={extracting || !websiteUrl}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted hover:text-foreground border border-border rounded hover:bg-background transition-colors disabled:opacity-50"
                          title="Re-extract just colors and fonts"
                        >
                          {extracting && reExtractScope === 'colors' ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          Re-extract
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { label: 'Primary', value: colorPrimary, setter: setColorPrimary },
                        { label: 'Secondary', value: colorSecondary, setter: setColorSecondary },
                        { label: 'Accent', value: colorAccent || '#c2570a', setter: setColorAccent },
                      ].map((color) => (
                        <div key={color.label}>
                          <label className="block text-sm font-medium text-foreground mb-1">{color.label}</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={color.value || '#000000'}
                              onChange={(e) => color.setter(e.target.value)}
                              className="w-8 h-8 rounded border border-border cursor-pointer"
                            />
                            <input
                              type="text"
                              value={color.value}
                              onChange={(e) => color.setter(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Color preview */}
                    <div className="flex gap-1 h-6 rounded overflow-hidden mb-4">
                      <div className="flex-1" style={{ backgroundColor: colorPrimary }} />
                      <div className="flex-1" style={{ backgroundColor: colorSecondary }} />
                      <div className="flex-1" style={{ backgroundColor: colorAccent || '#c2570a' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Heading Font</label>
                        <select
                          value={fontHeading}
                          onChange={(e) => setFontHeading(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                        >
                          {['Playfair Display', 'Cormorant Garamond', 'DM Serif Display', 'Inter', 'Montserrat', 'Bebas Neue', 'Poppins', 'Raleway', 'Oswald'].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Body Font</label>
                        <select
                          value={fontBody}
                          onChange={(e) => setFontBody(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                        >
                          {['Lora', 'Cormorant', 'Source Serif Pro', 'Merriweather', 'Inter', 'Open Sans', 'Roboto', 'Nunito', 'Work Sans'].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Back + Continue */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        if (extracted) { setExtracted(false); }
                        else { setBrandMethod(null); }
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-muted hover:text-foreground transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      onClick={saveBrand}
                      disabled={loading || !brandName}
                      className="flex items-center gap-2 px-6 py-3 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 2: SUBSCRIBE ========== */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1
                  className="text-3xl font-bold text-foreground mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Start Your Free Trial
                </h1>
                <p className="text-muted">
                  7 days free. Cancel anytime. Your card won't be charged until the trial ends.
                </p>
              </div>

              {/* Billing toggle */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setBillingInterval('month')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    billingInterval === 'month'
                      ? 'bg-foreground text-background'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('year')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    billingInterval === 'year'
                      ? 'bg-foreground text-background'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  Annual
                  <span className="ml-2 text-xs bg-accent-warm text-white px-2 py-0.5 rounded-full">
                    Save ${monthlySavings}/yr
                  </span>
                </button>
              </div>

              {/* Pricing card */}
              <div className="bg-card border-2 border-accent-warm rounded-lg p-8 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-1">Gridshot Pro</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    ${billingInterval === 'year' ? annualPrice : monthlyPrice}
                  </span>
                  <span className="text-muted">/{billingInterval === 'year' ? 'year' : 'month'}</span>
                </div>
                {billingInterval === 'year' && (
                  <p className="text-sm text-accent-warm mb-4">
                    That's ${(annualPrice / 12).toFixed(0)}/mo — save ${monthlySavings} vs monthly
                  </p>
                )}
                <ul className="space-y-3 mb-6">
                  {[
                    'Unlimited branded carousels',
                    'AI copywriting in your brand voice',
                    'Publish to 8 platforms',
                    'Brand extraction from website',
                    'Priority support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check size={16} className="text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecting to checkout...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Start 7-Day Free Trial
                    </>
                  )}
                </button>
                <p className="text-xs text-muted text-center mt-3">
                  Cancel anytime during trial — no charge.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  &larr; Back to brand setup
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: UPLOAD ========== */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1
                  className="text-3xl font-bold text-foreground mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Upload Your First Photos
                </h1>
                <p className="text-muted">
                  Add a few photos to get started. You can always add more later.
                </p>
              </div>

              {/* Upload area */}
              <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent-warm transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploading}
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 size={32} className="mx-auto text-accent-warm animate-spin mb-3" />
                  ) : (
                    <Upload size={32} className="mx-auto text-muted mb-3" />
                  )}
                  <p className="font-medium text-foreground mb-1">
                    {uploading ? 'Uploading...' : 'Click to upload photos'}
                  </p>
                  <p className="text-sm text-muted">JPEG, PNG, or WebP. Up to 20MB each.</p>
                </label>
              </div>

              {/* Uploaded photos grid */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uploadedPhotos.map((photo, i) => (
                    <div key={photo.path} className="relative group aspect-square rounded-lg overflow-hidden bg-card border border-border">
                      <img
                        src={photo.url}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted">
                  {uploadedPhotos.length > 0
                    ? `${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} uploaded`
                    : 'No photos yet'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={completeOnboarding}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 rounded transition-colors disabled:opacity-50 ${
                      uploadedPhotos.length > 0
                        ? 'bg-accent-warm text-white hover:bg-accent-warm-hover'
                        : 'border border-border text-foreground hover:bg-card-hover'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Finishing...
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        {uploadedPhotos.length > 0 ? 'Go to Dashboard' : 'Skip for Now'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
