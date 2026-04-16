import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';

function normalizeUrl(urlString: string): string {
  const trimmed = urlString.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function isValidPublicUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    if (!parsed.hostname.includes('.')) return false;
    const hostname = parsed.hostname.toLowerCase();
    // Block IPv6 literals
    if (hostname.startsWith('[') || hostname === '::1') return false;
    // Block private/internal networks
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) {
      return false;
    }
    // Check numeric IP ranges
    const parts = hostname.split('.').map(Number);
    if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
      if (parts[0] === 10) return false; // 10.0.0.0/8
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false; // 172.16.0.0/12
      if (parts[0] === 192 && parts[1] === 168) return false; // 192.168.0.0/16
      if (parts[0] === 169 && parts[1] === 254) return false; // 169.254.0.0/16 link-local
      if (parts[0] === 127) return false; // 127.0.0.0/8 loopback
      if (parts[0] === 0) return false; // 0.0.0.0/8
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const normalizedUrl = normalizeUrl(url);
  if (!isValidPublicUrl(normalizedUrl)) {
    return NextResponse.json({ error: 'Please provide a valid public website URL' }, { status: 400 });
  }

  try {
    const res = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Gridshot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });

    // Validate final URL after redirects to prevent SSRF via open redirect
    if (res.redirected && !isValidPublicUrl(res.url)) {
      return NextResponse.json({ error: 'Please provide a valid public website URL' }, { status: 400 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: 'Could not fetch website' }, { status: 400 });
    }

    const html = await res.text();
    const finalUrl = res.url || normalizedUrl;

    // Fetch external stylesheets so the model can actually see brand colors.
    // Most sites define palette tokens in external CSS, not inline — without
    // this, the model is guessing from class names.
    const cssHrefs: string[] = [];
    const linkRe = /<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi;
    const hrefRe = /href=["']([^"']+)["']/i;
    for (const m of html.matchAll(linkRe)) {
      const href = m[0].match(hrefRe)?.[1];
      if (!href) continue;
      try {
        const abs = new URL(href, finalUrl).toString();
        if (isValidPublicUrl(abs) && !cssHrefs.includes(abs)) cssHrefs.push(abs);
      } catch {}
      if (cssHrefs.length >= 6) break;
    }

    const cssTexts = await Promise.all(
      cssHrefs.map(async (u) => {
        try {
          const r = await fetch(u, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Gridshot/1.0)' },
            signal: AbortSignal.timeout(6000),
            redirect: 'follow',
          });
          if (!r.ok) return '';
          const t = await r.text();
          return `/* ${u} */\n${t.slice(0, 60000)}`;
        } catch {
          return '';
        }
      })
    );

    // Also pull inline <style> blocks — hero sections often inline the palette.
    const inlineStyles: string[] = [];
    for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
      inlineStyles.push(m[1]);
    }

    const combinedCss = [...inlineStyles, ...cssTexts].join('\n\n').slice(0, 120000);

    // Pre-rank colors by frequency so the model has concrete candidates to choose
    // from rather than guessing from class names.
    const colorCounts = new Map<string, number>();
    const bump = (c: string) => colorCounts.set(c, (colorCounts.get(c) ?? 0) + 1);
    for (const m of combinedCss.matchAll(/#([0-9a-fA-F]{6})\b/g)) bump('#' + m[1].toLowerCase());
    for (const m of combinedCss.matchAll(/#([0-9a-fA-F]{3})\b(?![0-9a-fA-F])/g)) {
      const s = m[1].toLowerCase();
      bump('#' + s[0] + s[0] + s[1] + s[1] + s[2] + s[2]);
    }
    for (const m of combinedCss.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g)) {
      const toHex = (n: string) => Math.min(255, parseInt(n, 10)).toString(16).padStart(2, '0');
      bump('#' + toHex(m[1]) + toHex(m[2]) + toHex(m[3]));
    }
    // Drop pure black/white noise — almost every site has them, and they rarely
    // represent the actual brand palette.
    const skip = new Set(['#000000', '#ffffff']);
    const topColors = [...colorCounts.entries()]
      .filter(([c]) => !skip.has(c))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([c, n]) => `${c} (${n}x)`)
      .join(', ');

    // Pull CSS custom properties (design tokens) — these are the single highest-
    // signal source of brand colors when present.
    const customProps: string[] = [];
    for (const m of combinedCss.matchAll(/(--[a-z0-9-]*(?:color|brand|primary|secondary|accent|bg|background|text|fg|foreground)[a-z0-9-]*)\s*:\s*([^;}\n]+)/gi)) {
      customProps.push(`${m[1]}: ${m[2].trim()}`);
      if (customProps.length >= 60) break;
    }

    const truncatedHtml = html.slice(0, 25000);
    const colorContext = `TOP COLORS BY FREQUENCY (from all CSS):\n${topColors || '(none found)'}\n\nCSS CUSTOM PROPERTIES (design tokens — highest signal):\n${customProps.join('\n') || '(none found)'}\n\nFULL CSS (inline + external stylesheets):\n${combinedCss.slice(0, 60000)}\n\nHTML:\n${truncatedHtml}`;

    const systemPrompt = `You are a brand strategist and web analyst. Analyze the provided website assets and extract a comprehensive brand profile. Return ONLY valid JSON with this exact structure:

{
  "name": "brand name or null",
  "tagline": "main tagline or null",
  "voice_description": "detailed description of brand voice and writing style based on the page copy",
  "brand_personality": "if the brand were a person, describe their personality",
  "style_keywords": ["keyword1", "keyword2", "keyword3"],
  "tone_presets": ["tone1", "tone2", "tone3"],
  "icp_description": "detailed ideal customer profile based on the services and messaging",
  "target_audience": "who the brand is targeting",
  "audience_pain_points": ["pain point 1", "pain point 2", "pain point 3"],
  "audience_desires": ["desire 1", "desire 2", "desire 3"],
  "niche": "the specific niche or industry",
  "service_area": "geographic service area if mentioned, or null",
  "price_positioning": "premium/luxury/mid-range/accessible based on design and language",
  "differentiator": "what makes this brand unique based on messaging",
  "color_primary": "#hex of primary/dark color from CSS or inline styles",
  "color_secondary": "#hex of secondary/light color",
  "color_accent": "#hex of accent color or null",
  "color_background": "#hex of background color or null",
  "color_text": "#hex of main text color or null",
  "font_heading": "heading font name from Google Fonts or font-family declarations",
  "font_body": "body font name",
  "font_accent": "accent font or null",
  "review_count": "review/testimonial count if found, or null",
  "review_tagline": "a standout testimonial quote if found, or null",
  "instagram_handle": "instagram handle if found in links, or null",
  "website_tagline": "the main hero text or headline from the website",
  "social_links": {"platform": "url"},
  "logo_url": "logo image URL if found, or null"
}

Analyze the following:
- Writing style and tone from all visible text
- Color scheme: PREFER CSS CUSTOM PROPERTIES when present (e.g. --primary, --brand-color, --accent). Otherwise use the most frequent non-neutral colors from the TOP COLORS list. Never invent hex values that don't appear in the CSS. Avoid generic #000000 / #ffffff for primary/accent — pick the brand's actual color. If truly no brand color is detectable, use null rather than guessing.
- Fonts from Google Fonts links, @font-face rules, and font-family declarations
- Target audience from service descriptions, pricing language, and positioning
- Social media links from href attributes containing instagram, facebook, twitter, tiktok, etc.
- Logo from img tags in header/nav areas
- Testimonials and reviews from quote/review sections

Use common font names if you can identify them. For colors, ONLY use hex values that actually appear in the CSS sections above.`;

    const result = await chatCompletion(systemPrompt, colorContext);

    let cleaned = result.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    const extraction = JSON.parse(cleaned);
    return NextResponse.json(extraction);
  } catch (err) {
    console.error('Brand extraction error:', err);
    return NextResponse.json({ error: 'Brand extraction failed. Please try again.' }, { status: 500 });
  }
}
